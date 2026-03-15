// ===== NEW FILE CREATED FOR OTP AUTH FEATURE =====
const crypto = require('crypto');

const OTP_LENGTH = 6;
const OTP_EXPIRE_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Generate 6-digit numeric OTP
 * @returns {string} - 6 digit string (e.g. "123456")
 */
function generateOTP() {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  return otp;
}

/**
 * Hash OTP with SHA256 (do not store plain OTP)
 * @param {string} otp - Plain OTP string
 * @returns {string} - SHA256 hex hash
 */
function hashOTP(otp) {
  return crypto.createHash('sha256').update(otp).digest('hex');
}

/**
 * Verify user input against stored hash
 * @param {string} userInput - User-entered OTP
 * @param {string} storedHash - Stored otpHash in DB
 * @returns {boolean}
 */
function verifyOTP(userInput, storedHash) {
  if (!userInput || !storedHash) return false;
  const inputHash = hashOTP(userInput.trim());
  return inputHash === storedHash;
}

/**
 * Get OTP expiry date (now + 5 minutes)
 * @returns {Date}
 */
function getOTPExpireDate() {
  return new Date(Date.now() + OTP_EXPIRE_MS);
}

module.exports = {
  generateOTP,
  hashOTP,
  verifyOTP,
  getOTPExpireDate,
  OTP_EXPIRE_MS
};
