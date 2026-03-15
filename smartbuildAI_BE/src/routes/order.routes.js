const express = require('express');
const orderController = require('../controllers/order.controller');
const { authMiddleware, requireRoles } = require('../middlewares/auth.middleware');

const router = express.Router();

// Nhóm chức năng: Đơn hàng

// [Customer] Tạo đơn hàng mới (khách đã đăng nhập)
router.post('/', authMiddleware, orderController.createOrder);

// [Staff/Admin] Quản lý đơn hàng:
// - Staff: xem đơn hàng và cập nhật trạng thái giao hàng
// - Admin: theo dõi và xử lý đơn hàng

// Xem danh sách đơn hàng
router.get('/', authMiddleware, requireRoles(['staff', 'admin']), orderController.getOrders);

// Xem chi tiết đơn hàng
router.get('/:id', authMiddleware, requireRoles(['staff', 'admin']), orderController.getOrderById);

// Cập nhật đơn hàng (bao gồm trạng thái giao hàng)
router.put('/:id', authMiddleware, requireRoles(['staff', 'admin']), orderController.updateOrder);

module.exports = router;

