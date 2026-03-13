const express = require('express');
const quotationController = require('../controllers/quotation.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

const router = express.Router();

// Khách/không đăng nhập vẫn có thể gửi yêu cầu báo giá
router.post('/', quotationController.createQuotation);

// Admin hoặc client (tùy logic sau này) – tạm thời yêu cầu đăng nhập
router.get('/', authMiddleware, quotationController.getQuotations);
router.get('/:id', authMiddleware, quotationController.getQuotationById);
router.put('/:id', authMiddleware, quotationController.updateQuotation);
router.put('/:id/accept', authMiddleware, quotationController.acceptQuotation);
router.put('/:id/reject', authMiddleware, quotationController.rejectQuotation);

module.exports = router;

