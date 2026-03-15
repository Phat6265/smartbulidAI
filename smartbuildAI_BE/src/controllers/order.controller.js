const Order = require('../models/Order');
const asyncHandler = require('../middlewares/asyncHandler');

// POST /api/orders
exports.createOrder = asyncHandler(async (req, res) => {
  const payload = req.body;
  const totalAmount =
    payload.totalAmount ||
    (payload.items || []).reduce((sum, item) => sum + (item.quantity * item.price), 0);
  
  // Tính số tiền cọc và số tiền còn lại nếu chưa có
  const depositAmount = payload.depositAmount || totalAmount * 0.5; // 50% deposit
  const remainingAmount = payload.remainingAmount || (totalAmount - depositAmount);
  
  // Ensure customerId is a string
  const customerId = String(payload.customerId || '');
  console.log('Creating order with customerId:', customerId);
  
  const order = await Order.create({
    ...payload,
    customerId, // Use normalized customerId
    totalAmount,
    depositAmount,
    remainingAmount,
    status: payload.status || 'pending_payment'
  });
  
  console.log('Order created:', { _id: order._id, customerId: order.customerId, status: order.status });
  res.status(201).json(order);
});

// GET /api/orders
// Query: page (default 1), limit (default 10), customerId?, fromDate?, toDate?
// Staff/Admin: có thể xem tất cả đơn hàng hoặc filter theo customerId
// Customer: chỉ có thể xem đơn hàng của chính họ (customerId phải khớp với user.id)
exports.getOrders = asyncHandler(async (req, res) => {
  const filter = {};
  const userRole = req.user?.role;
  const userId = String(req.user?.id || '');
  const requestedCustomerId = req.query.customerId ? String(req.query.customerId) : null;
  
  // Nếu không phải staff/admin, chỉ cho phép xem đơn hàng của chính họ
  if (userRole !== 'staff' && userRole !== 'admin') {
    // Customer chỉ có thể xem đơn hàng của chính họ
    const customerId = requestedCustomerId || userId;
    
    // Kiểm tra customerId có khớp với user.id không
    if (userId && customerId && customerId !== userId) {
      console.log('Customer trying to view other customer orders:', { userId, requestedCustomerId: customerId });
      return res.status(403).json({ message: 'Bạn chỉ có thể xem đơn hàng của chính mình' });
    }
    
    filter.customerId = customerId;
    console.log('Customer viewing their own orders, customerId:', filter.customerId, 'userId:', userId);
  } else if (requestedCustomerId) {
    // Staff/Admin có thể filter theo customerId bất kỳ
    filter.customerId = requestedCustomerId;
    console.log('Staff/Admin filtering orders by customerId:', filter.customerId);
  }
  // Filter by status if provided
  if (req.query.status && req.query.status !== 'all') {
    filter.status = req.query.status;
    console.log('Filtering by status:', filter.status);
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
  
  console.log(`Found ${orders.length} orders for filter:`, filter);
  console.log('Orders:', orders.map(o => ({ id: o._id, customerId: o.customerId, status: o.status })));
  
  res.json({
    orders,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1
  });
});

// GET /api/orders/:id
// Customer: chỉ xem được đơn hàng của chính họ
// Staff/Admin: xem được tất cả đơn hàng
exports.getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).lean();
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  
  // Nếu là customer, kiểm tra đơn hàng có thuộc về họ không
  const userRole = req.user?.role;
  const userId = req.user?.id;
  if ((userRole === 'customer' || !userRole) && userId) {
    if (String(order.customerId) !== String(userId)) {
      return res.status(403).json({ message: 'Bạn chỉ có thể xem đơn hàng của chính mình' });
    }
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

