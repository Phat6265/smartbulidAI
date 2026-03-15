const express = require('express');
const vnpayController = require('../controllers/vnpay.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

const router = express.Router();

// VNPay payment routes
router.post('/vnpay/create_payment_url', authMiddleware, vnpayController.createPaymentUrl);
router.get('/vnpay/return', vnpayController.vnpayReturn);
router.get('/vnpay/ipn', vnpayController.vnpayIpn);

module.exports = router;
