const express = require('express');
const userController = require('../controllers/user.controller');
const { authMiddleware, requireRole } = require('../middlewares/auth.middleware');
// ===== MODIFIED START (AVATAR UPLOAD FEATURE) =====
const { uploadAvatarMiddleware } = require('../middlewares/upload.middleware');
// ===== MODIFIED END (AVATAR UPLOAD FEATURE) =====

const router = express.Router();

// ===== MODIFIED START (CUSTOMER PROFILE FEATURE) =====
// Customer/User quản lý hồ sơ của chính mình (phải đặt trước /:id để "profile" không bị coi là id)
router.get('/profile', authMiddleware, userController.getProfile);
router.put('/profile', authMiddleware, userController.updateProfile);
// ===== MODIFIED START (AVATAR UPLOAD FEATURE) =====
router.put('/profile/avatar', authMiddleware, uploadAvatarMiddleware, userController.updateAvatar);
// ===== MODIFIED END (AVATAR UPLOAD FEATURE) =====
router.delete('/profile', authMiddleware, userController.deleteAccount);
// ===== MODIFIED END (CUSTOMER PROFILE FEATURE) =====

// ===== MODIFIED START (ADMIN USER CRUD FEATURE) =====
// Admin quản lý user
router.get('/', authMiddleware, requireRole('admin'), userController.getUsers);
router.post('/', authMiddleware, requireRole('admin'), userController.createUser);
router.get('/:id', authMiddleware, requireRole('admin'), userController.getUserById);
router.put('/:id', authMiddleware, requireRole('admin'), userController.updateUser);
router.delete('/:id', authMiddleware, requireRole('admin'), userController.deleteUser);
// ===== MODIFIED END (ADMIN USER CRUD FEATURE) =====

module.exports = router;

