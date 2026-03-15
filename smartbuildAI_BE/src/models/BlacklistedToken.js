// ===== NEW FILE CREATED FOR OTP AUTH FEATURE =====
const mongoose = require('mongoose');

const blacklistedTokenSchema = new mongoose.Schema(
  {
    token: { type: String, required: true, unique: true, index: true },
    expiresAt: { type: Date, required: true, index: true }
  },
  { timestamps: true }
);

// TTL index: MongoDB tự xóa document khi expiresAt qua
blacklistedTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('BlacklistedToken', blacklistedTokenSchema);
