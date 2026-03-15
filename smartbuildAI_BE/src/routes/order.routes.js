const express = require('express');
const orderController = require('../controllers/order.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

const router = express.Router();

// Khách hàng tạo đơn: yêu cầu đăng nhập
router.post('/', authMiddleware, orderController.createOrder);

// Khách hàng xem đơn của mình (?customerId=...), admin có thể xem tất cả
router.get('/', authMiddleware, orderController.getOrders);
router.get('/:id', authMiddleware, orderController.getOrderById);
router.put('/:id', authMiddleware, orderController.updateOrder);

module.exports = router;

