const express = require('express');
const userController = require('../controllers/user.controller');
const { authMiddleware, requireRole } = require('../middlewares/auth.middleware');

const router = express.Router();

// Admin quản lý user
router.get('/', authMiddleware, requireRole('admin'), userController.getUsers);
router.post('/', authMiddleware, requireRole('admin'), userController.createUser);
router.put('/:id', authMiddleware, requireRole('admin'), userController.updateUser);
router.delete('/:id', authMiddleware, requireRole('admin'), userController.deleteUser);

module.exports = router;

