const express = require('express');
const authController = require('../controllers/auth.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

const router = express.Router();

// ===== MODIFIED START (OTP AUTH FEATURE) =====
router.post('/register', authController.register);
router.post('/verify-otp', authController.verifyOtp);
router.post('/resend-otp', authController.resendOtp);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
// ===== MODIFIED END (OTP AUTH FEATURE) =====
// ===== MODIFIED START (FORGOT PASSWORD FEATURE) =====
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/change-password', authMiddleware, authController.changePassword);
// ===== MODIFIED END (FORGOT PASSWORD FEATURE) =====
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;

