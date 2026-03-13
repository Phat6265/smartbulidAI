const bcrypt = require('bcryptjs');
const User = require('../models/User');
const asyncHandler = require('../middlewares/asyncHandler');

// GET /api/users
exports.getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-passwordHash').lean();
  res.json(users);
});

// POST /api/users (admin create)
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

// PUT /api/users/:id
exports.updateUser = asyncHandler(async (req, res) => {
  const update = { ...req.body };
  if (update.password) {
    update.passwordHash = await bcrypt.hash(update.password, 10);
    delete update.password;
  }
  const user = await User.findByIdAndUpdate(req.params.id, update, {
    new: true
  }).select('-passwordHash');
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(user);
});

// DELETE /api/users/:id
exports.deleteUser = asyncHandler(async (req, res) => {
  const deleted = await User.findByIdAndDelete(req.params.id);
  if (!deleted) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.status(204).end();
});

