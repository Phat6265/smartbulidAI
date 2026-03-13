const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../middlewares/asyncHandler');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_smartbuild_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const signToken = (user) =>
  jwt.sign({ sub: user._id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

// POST /api/auth/register
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ message: 'Email đã được sử dụng' });
  }
  const passwordHash = await bcrypt.hash(password || '123456', 10);
  const user = await User.create({
    name,
    email,
    passwordHash,
    role: 'customer'
  });
  const token = signToken(user);
  res.status(201).json({
    user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    token
  });
});

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
  const token = signToken(user);
  res.json({
    user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    token
  });
});

// GET /api/auth/me
exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-passwordHash').lean();
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  res.json(user);
});

