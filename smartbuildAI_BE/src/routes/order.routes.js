const express = require('express');
const orderController = require('../controllers/order.controller');
const { authMiddleware, requireRoles } = require('../middlewares/auth.middleware');

const router = express.Router();

// Khách hàng tạo đơn: yêu cầu đăng nhập
router.post('/', authMiddleware, orderController.createOrder);

// [Customer] Xem đơn hàng của chính mình
// [Staff/Admin] Quản lý đơn hàng:
// - Staff: xem đơn hàng và cập nhật trạng thái giao hàng
// - Admin: theo dõi và xử lý đơn hàng

// Xem danh sách đơn hàng
// Customer: chỉ xem được đơn hàng của chính họ (khi có customerId query)
// Staff/Admin: xem được tất cả đơn hàng
router.get('/', authMiddleware, orderController.getOrders);

// Xem chi tiết đơn hàng
// Customer: chỉ xem được đơn hàng của chính họ
// Staff/Admin: xem được tất cả đơn hàng
router.get('/:id', authMiddleware, orderController.getOrderById);

// Cập nhật đơn hàng (bao gồm trạng thái giao hàng)
router.put('/:id', authMiddleware, requireRoles(['staff', 'admin']), orderController.updateOrder);

module.exports = router;

