const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    // ===== MODIFIED START (OTP AUTH FEATURE) =====
    otpHash: { type: String, default: null },
    otpExpire: { type: Date, default: null },
    otpAttempts: { type: Number, default: 0 },
    otpLastSentAt: { type: Date, default: null },
    isEmailVerified: { type: Boolean, default: false },
    // ===== MODIFIED END (OTP AUTH FEATURE) =====
    // ===== MODIFIED START (CUSTOMER PROFILE FEATURE) =====
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    avatarUrl: { type: String, default: '' },
    dateOfBirth: { type: Date, default: null }
    // ===== MODIFIED END (CUSTOMER PROFILE FEATURE) =====
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);

