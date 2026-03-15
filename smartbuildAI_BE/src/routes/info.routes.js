const express = require('express');
const infoController = require('../controllers/info.controller');
const { authMiddleware, requireRole } = require('../middlewares/auth.middleware');

const router = express.Router();

// Nhóm chức năng: Thông tin website
// Guest: xem, Admin: quản trị nội dung

// ===== FAQ =====

// Public: xem FAQ
router.get('/faqs', infoController.getFaqs);
router.get('/faqs/:id', infoController.getFaqById);

// Admin: CRUD FAQ
router.post('/faqs', authMiddleware, requireRole('admin'), infoController.createFaq);
router.put('/faqs/:id', authMiddleware, requireRole('admin'), infoController.updateFaq);
router.delete('/faqs/:id', authMiddleware, requireRole('admin'), infoController.deleteFaq);

// ===== Policies =====

// Public: xem các chính sách
router.get('/privacy-policy', infoController.getPrivacyPolicy);
router.get('/terms-of-service', infoController.getTermsOfService);
router.get('/shipping-policy', infoController.getShippingPolicy);

// Admin: cập nhật nội dung chính sách
router.put(
  '/privacy-policy',
  authMiddleware,
  requireRole('admin'),
  infoController.updatePrivacyPolicy
);
router.put(
  '/terms-of-service',
  authMiddleware,
  requireRole('admin'),
  infoController.updateTermsOfService
);
router.put(
  '/shipping-policy',
  authMiddleware,
  requireRole('admin'),
  infoController.updateShippingPolicy
);

module.exports = router;


