const express = require('express');
const materialController = require('../controllers/material.controller');
const { authMiddleware, requireRole } = require('../middlewares/auth.middleware');

const router = express.Router();

// Public: GET materials
router.get('/', materialController.getMaterials);
router.get('/:id', materialController.getMaterialById);

// Admin: CRUD
router.post('/', authMiddleware, requireRole('admin'), materialController.createMaterial);
router.put('/:id', authMiddleware, requireRole('admin'), materialController.updateMaterial);
router.delete('/:id', authMiddleware, requireRole('admin'), materialController.deleteMaterial);

module.exports = router;

