const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const BlacklistedToken = require('../models/BlacklistedToken');
const asyncHandler = require('../middlewares/asyncHandler');
const { generateOTP, hashOTP, verifyOTP, getOTPExpireDate } = require('../utils/otpGenerator');
const { sendOTPEmail, sendResetPasswordOTPEmail } = require('../utils/emailService');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_smartbuild_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const MAX_OTP_VERIFY_ATTEMPTS = 5;
const MAX_OTP_RESEND_PER_MINUTE = 3;

const signToken = (user) =>
  jwt.sign({ sub: user._id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

// ===== MODIFIED START (OTP AUTH FEATURE) =====
// POST /api/auth/register - Tạo user + gửi OTP (không trả token)
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) {
    // Nếu tài khoản đã tồn tại và đã xác minh email => không cho đăng ký lại
    if (existing.isEmailVerified || existing.isEmailVerified === undefined) {
      return res.status(400).json({ message: 'Email đã được sử dụng' });
    }

    // Tài khoản tồn tại nhưng CHƯA xác minh email -> gửi lại OTP mới
    const otpPlainExisting = generateOTP();
    const otpHashExisting = hashOTP(otpPlainExisting);
    const otpExpireExisting = getOTPExpireDate();

    existing.otpHash = otpHashExisting;
    existing.otpExpire = otpExpireExisting;
    existing.otpAttempts = 0;
    existing.otpLastSentAt = new Date();
    await existing.save();

    await sendOTPEmail(existing.email, otpPlainExisting);

    return res.status(200).json({
      message: 'Email đã tồn tại nhưng chưa xác minh. Mã OTP mới đã được gửi lại.',
      email: existing.email
    });
  }
  const passwordHash = await bcrypt.hash(password || '123456', 10);
  const otpPlain = generateOTP();
  const otpHash = hashOTP(otpPlain);
  const otpExpire = getOTPExpireDate();

  const user = await User.create({
    name,
    email,
    passwordHash,
    role: 'customer',
    otpHash,
    otpExpire,
    otpAttempts: 0,
    otpLastSentAt: new Date(),
    isEmailVerified: false
  });

  await sendOTPEmail(user.email, otpPlain);

  res.status(201).json({
    message: 'Đăng ký thành công. Vui lòng kiểm tra email để lấy mã OTP xác minh.',
    email: user.email
  });
});

// POST /api/auth/verify-otp - Xác minh OTP, trả user + token
exports.verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ message: 'Email và mã OTP là bắt buộc' });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: 'Không tìm thấy tài khoản' });
  }
  if (user.isEmailVerified) {
    const token = signToken(user);
    return res.json({
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
      token
    });
  }

  if (user.otpAttempts >= MAX_OTP_VERIFY_ATTEMPTS) {
    return res.status(429).json({ message: 'Too many OTP attempts' });
  }
  if (!user.otpHash || !user.otpExpire) {
    return res.status(400).json({ message: 'Mã OTP không còn hiệu lực. Vui lòng gửi lại mã.' });
  }
  if (new Date() > user.otpExpire) {
    return res.status(400).json({ message: 'Mã OTP đã hết hạn. Vui lòng gửi lại mã.' });
  }

  const valid = verifyOTP(otp, user.otpHash);
  if (!valid) {
    await User.findByIdAndUpdate(user._id, { $inc: { otpAttempts: 1 } });
    return res.status(400).json({ message: 'Mã OTP không đúng' });
  }

  await User.findByIdAndUpdate(user._id, {
    isEmailVerified: true,
    otpHash: null,
    otpExpire: null,
    otpAttempts: 0,
    otpLastSentAt: null
  });

  const updatedUser = await User.findById(user._id).lean();
  const token = signToken(updatedUser);
  res.json({
    user: { _id: updatedUser._id, name: updatedUser.name, email: updatedUser.email, role: updatedUser.role },
    token
  });
});

// POST /api/auth/resend-otp - Gửi lại OTP (max 3/phút)
exports.resendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email là bắt buộc' });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: 'Không tìm thấy tài khoản' });
  }
  if (user.isEmailVerified) {
    return res.status(400).json({ message: 'Email đã được xác minh. Không cần gửi lại OTP.' });
  }

  // Rate limit: tối đa 3 lần / phút => cho phép gửi lại sau mỗi 20 giây
  const lastSent = user.otpLastSentAt;
  const minIntervalMs = (60 / MAX_OTP_RESEND_PER_MINUTE) * 1000;
  if (lastSent && (Date.now() - new Date(lastSent).getTime()) < minIntervalMs) {
    return res.status(429).json({ message: 'Too many OTP attempts' });
  }

  const otpPlain = generateOTP();
  const otpHash = hashOTP(otpPlain);
  const otpExpire = getOTPExpireDate();

  await User.findByIdAndUpdate(user._id, {
    otpHash,
    otpExpire,
    otpAttempts: 0,
    otpLastSentAt: new Date()
  });

  await sendOTPEmail(user.email, otpPlain);

  res.json({ message: 'Mã OTP mới đã được gửi đến email của bạn.' });
});

// POST /api/auth/logout - Blacklist token
exports.logout = asyncHandler(async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.decode(token);
    const expiresAt = decoded && decoded.exp ? new Date(decoded.exp * 1000) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await BlacklistedToken.create({ token, expiresAt });
  } catch (e) {
    return res.status(401).json({ message: 'Token không hợp lệ' });
  }
  res.json({ message: 'Đăng xuất thành công' });
});
// ===== MODIFIED END (OTP AUTH FEATURE) =====

// POST /api/auth/login
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
  }
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
  }
  // ===== MODIFIED START (OTP AUTH FEATURE) =====
  if (user.isEmailVerified === false) {
    return res.status(403).json({ message: 'Vui lòng xác minh email trước khi đăng nhập' });
  }
  // ===== MODIFIED END (OTP AUTH FEATURE) =====
  const token = signToken(user);
  res.json({
    user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    token
  });
});

// GET /api/auth/me
exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-passwordHash -otpHash').lean();
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  res.json(user);
});

// ===== MODIFIED START (FORGOT PASSWORD FEATURE) =====
// POST /api/auth/forgot-password - Gửi OTP đặt lại mật khẩu
exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email là bắt buộc' });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: 'Không tìm thấy tài khoản với email này' });
  }
  const otpPlain = generateOTP();
  const otpHash = hashOTP(otpPlain);
  const otpExpire = getOTPExpireDate();
  await User.findByIdAndUpdate(user._id, {
    otpHash,
    otpExpire,
    otpAttempts: 0,
    otpLastSentAt: new Date()
  });
  await sendResetPasswordOTPEmail(user.email, otpPlain);
  res.json({ message: 'OTP đã được gửi tới email của bạn' });
});

// POST /api/auth/reset-password - Đặt lại mật khẩu bằng OTP
exports.resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.status(400).json({ message: 'Email, mã OTP và mật khẩu mới là bắt buộc' });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: 'Không tìm thấy tài khoản' });
  }
  if (!user.otpHash || !user.otpExpire) {
    return res.status(400).json({ message: 'Mã OTP không còn hiệu lực. Vui lòng yêu cầu gửi lại.' });
  }
  if (new Date() > user.otpExpire) {
    return res.status(400).json({ message: 'Mã OTP đã hết hạn. Vui lòng yêu cầu gửi lại.' });
  }
  const valid = verifyOTP(otp, user.otpHash);
  if (!valid) {
    return res.status(400).json({ message: 'Mã OTP không đúng' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'Mật khẩu mới phải có ít nhất 6 ký tự' });
  }
  const passwordHash = await bcrypt.hash(newPassword, 10);
  await User.findByIdAndUpdate(user._id, {
    passwordHash,
    otpHash: null,
    otpExpire: null,
    otpAttempts: 0,
    otpLastSentAt: null
  });
  res.json({ message: 'Password reset successful' });
});

// POST /api/auth/change-password - Đổi mật khẩu khi đã đăng nhập (JWT required)
exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Mật khẩu hiện tại và mật khẩu mới là bắt buộc' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'Mật khẩu mới phải có ít nhất 6 ký tự' });
  }
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ message: 'Mật khẩu hiện tại không đúng' });
  }
  const passwordHash = await bcrypt.hash(newPassword, 10);
  await User.findByIdAndUpdate(user._id, { passwordHash });
  res.json({ message: 'Password changed successfully' });
});
// ===== MODIFIED END (FORGOT PASSWORD FEATURE) =====
