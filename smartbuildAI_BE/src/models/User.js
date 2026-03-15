const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    // Thêm role 'staff' nhưng giữ default là 'customer' để không ảnh hưởng đăng ký hiện tại
    role: { type: String, enum: ['customer', 'staff', 'admin'], default: 'customer' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);

