const Order = require('../models/Order');
const asyncHandler = require('../middlewares/asyncHandler');

// POST /api/orders
exports.createOrder = asyncHandler(async (req, res) => {
  const payload = req.body;
  const totalAmount =
    payload.totalAmount ||
    (payload.items || []).reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const order = await Order.create({
    ...payload,
    totalAmount,
    status: payload.status || 'pending_payment'
  });
  res.status(201).json(order);
});

// GET /api/orders
// Query: page (default 1), limit (default 10), customerId?, fromDate?, toDate?
exports.getOrders = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.customerId) {
    filter.customerId = req.query.customerId;
  }
  if (req.query.fromDate || req.query.toDate) {
    filter.createdAt = {};
    if (req.query.fromDate) {
      filter.createdAt.$gte = new Date(req.query.fromDate);
    }
    if (req.query.toDate) {
      const to = new Date(req.query.toDate);
      to.setHours(23, 59, 59, 999);
      filter.createdAt.$lte = to;
    }
  }
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Order.countDocuments(filter)
  ]);
  res.json({
    orders,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1
  });
});

// GET /api/orders/:id
exports.getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).lean();
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  res.json(order);
});

// Trạng thái Staff được phép cập nhật (duyệt đơn + trạng thái giao hàng, không hủy đơn)
const STAFF_ALLOWED_STATUSES = ['approved', 'paid_deposit', 'shipped', 'delivered', 'completed'];

// PUT /api/orders/:id
// Staff: chỉ được cập nhật trạng thái giao hàng (paid_deposit, shipped, delivered, completed)
// Admin: theo dõi và xử lý đơn hàng (cập nhật mọi field, kể cả cancelled)
exports.updateOrder = asyncHandler(async (req, res) => {
  const orderId = req.params.id;
  const order = await Order.findById(orderId);
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  const isStaff = req.user && req.user.role === 'staff';

  if (isStaff) {
    // Staff: chỉ được gửi { status } và status phải thuộc trạng thái giao hàng
    const { status } = req.body;
    if (typeof status !== 'string' || !STAFF_ALLOWED_STATUSES.includes(status)) {
      return res.status(403).json({
        message: 'Staff chỉ được cập nhật trạng thái giao hàng: đặt cọc, đã giao, đã giao xong. Không được hủy đơn.'
      });
    }
    order.status = status;
    await order.save();
    return res.json(order);
  }

  // Admin: cập nhật đầy đủ (xử lý đơn hàng)
  const updated = await Order.findByIdAndUpdate(orderId, req.body, { new: true });
  res.json(updated);
});

