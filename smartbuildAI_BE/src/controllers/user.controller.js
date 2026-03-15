const bcrypt = require('bcryptjs');
const User = require('../models/User');
const asyncHandler = require('../middlewares/asyncHandler');
// ===== MODIFIED START (AVATAR UPLOAD FEATURE) =====
const { uploadFromBuffer } = require('../utils/cloudinary');
// ===== MODIFIED END (AVATAR UPLOAD FEATURE) =====

// ===== MODIFIED START (CUSTOMER PROFILE FEATURE) =====
// GET /api/users/profile - Lấy hồ sơ của chính mình (JWT)
exports.getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
    .select('-passwordHash -otpHash -otpExpire -otpAttempts -otpLastSentAt')
    .lean();
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(user);
});

// PUT /api/users/profile - Cập nhật hồ sơ (name, phone, address, dateOfBirth, avatarUrl; không cho sửa email, role)
exports.updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, address, dateOfBirth, avatarUrl } = req.body;
  const update = {};
  if (name !== undefined) update.name = String(name).trim() || '';
  if (phone !== undefined) update.phone = String(phone).trim();
  if (address !== undefined) update.address = String(address).trim();
  if (dateOfBirth !== undefined) {
    update.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : null;
  }
  // ===== MODIFIED START (AVATAR UPLOAD FEATURE) =====
  if (avatarUrl !== undefined) update.avatarUrl = String(avatarUrl).trim();
  // ===== MODIFIED END (AVATAR UPLOAD FEATURE) =====
  const user = await User.findByIdAndUpdate(req.user.id, update, {
    new: true
  })
    .select('-passwordHash -otpHash')
    .lean();
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(user);
});

// PUT /api/users/profile/avatar - Cập nhật avatar (upload file lên Cloudinary)
exports.updateAvatar = asyncHandler(async (req, res) => {
  // ===== MODIFIED START (AVATAR UPLOAD FEATURE) =====
  if (!req.file || !req.file.buffer) {
    return res.status(400).json({ message: 'Vui lòng chọn ảnh avatar (JPEG, PNG hoặc WebP, tối đa 2MB)' });
  }
  const { secure_url } = await uploadFromBuffer(req.file.buffer, 'avatars');
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { avatarUrl: secure_url },
    { new: true }
  )
    .select('-passwordHash -otpHash')
    .lean();
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(user);
  // ===== MODIFIED END (AVATAR UPLOAD FEATURE) =====
});

// DELETE /api/users/profile - Xóa tài khoản của chính mình
exports.deleteAccount = asyncHandler(async (req, res) => {
  const deleted = await User.findByIdAndDelete(req.user.id);
  if (!deleted) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.status(204).end();
});
// ===== MODIFIED END (CUSTOMER PROFILE FEATURE) =====

// ===== MODIFIED START (ADMIN USER CRUD FEATURE) =====
// GET /api/users - Danh sách user (chỉ trả các field cần thiết)
exports.getUsers = asyncHandler(async (req, res) => {
  const users = await User.find()
    .select('name email role phone address createdAt')
    .lean();
  res.json(users);
});

// GET /api/users/:id - Chi tiết một user
exports.getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select('-passwordHash -otpHash -otpExpire -otpAttempts -otpLastSentAt')
    .lean();
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(user);
});

// POST /api/users (admin create) - Giữ nguyên logic: validate, unique email, bcrypt, role default customer
exports.createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ message: 'Email đã được sử dụng' });
  }
  const passwordHash = await bcrypt.hash(password || '123456', 10);
  const user = await User.create({
    name,
    email,
    passwordHash,
    role: role || 'customer'
  });
  const plain = user.toObject();
  delete plain.passwordHash;
  res.status(201).json(plain);
});

// PUT /api/users/:id - Chỉ cho phép cập nhật name, role, phone, address, dateOfBirth (không update password tại API này)
exports.updateUser = asyncHandler(async (req, res) => {
  const { name, role, phone, address, dateOfBirth } = req.body;
  const update = {};
  if (name !== undefined) update.name = String(name).trim() || '';
  if (role !== undefined) update.role = role === 'admin' ? 'admin' : 'customer';
  if (phone !== undefined) update.phone = String(phone).trim();
  if (address !== undefined) update.address = String(address).trim();
  if (dateOfBirth !== undefined) {
    update.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : null;
  }
  const user = await User.findByIdAndUpdate(req.params.id, update, {
    new: true
  }).select('-passwordHash -otpHash');
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(user);
});

// DELETE /api/users/:id - Admin không được xóa chính mình
exports.deleteUser = asyncHandler(async (req, res) => {
  if (req.params.id === req.user.id) {
    return res.status(403).json({ message: 'Bạn không thể xóa chính mình' });
  }
  const deleted = await User.findByIdAndDelete(req.params.id);
  if (!deleted) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.status(204).end();
});
// ===== MODIFIED END (ADMIN USER CRUD FEATURE) =====

