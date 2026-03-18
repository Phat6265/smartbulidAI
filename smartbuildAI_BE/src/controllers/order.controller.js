const Order = require('../models/Order');
const Material = require('../models/Material');
const asyncHandler = require('../middlewares/asyncHandler');

// POST /api/orders
exports.createOrder = asyncHandler(async (req, res) => {
  const payload = req.body;
  const totalAmount =
    payload.totalAmount ||
    (payload.items || []).reduce((sum, item) => sum + (item.quantity * item.price), 0);
  
  // Tổng tiền đã thu (paidAmount) và tiền còn lại (remainingAmount) theo nghiệp vụ sàn
  const initialStatus = payload.status || 'pending_payment';
  const paidAmountInput = payload.paidAmount != null ? Number(payload.paidAmount) : null;
  const depositAmountInput = payload.depositAmount != null ? Number(payload.depositAmount) : null;

  // Quy ước nghiệp vụ:
  // - pending_payment: chưa thu gì => depositAmount = 0, paidAmount = 0, remainingAmount = totalAmount
  // - paid_deposit: đã thu tiền cọc => depositAmount/paidAmount = depositAmountInput, remainingAmount = totalAmount - paidAmount
  let paidAmount = 0;
  let depositAmount = 0;

  if (initialStatus === 'paid_deposit') {
    const v = depositAmountInput != null ? depositAmountInput : (paidAmountInput != null ? paidAmountInput : totalAmount * 0.5);
    paidAmount = Number.isNaN(v) ? 0 : v;
    depositAmount = paidAmount;
  }

  const remainingAmount = Math.max(totalAmount - paidAmount, 0);
  
  // Ensure customerId is a string
  const customerId = String(payload.customerId || '');
  console.log('Creating order with customerId:', customerId);
  
  const order = await Order.create({
    ...payload,
    customerId, // Use normalized customerId
    totalAmount,
    paidAmount,
    depositAmount,
    remainingAmount,
    status: initialStatus
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

// PUT /api/orders/:id
exports.updateOrder = asyncHandler(async (req, res) => {
  const orderId = req.params.id;
  const current = await Order.findById(orderId).lean();
  if (!current) {
    return res.status(404).json({ message: 'Order not found' });
  }

  const nextStatus = req.body?.status;
  const currentStatus = current.status;

  // Validate trạng thái theo nghiệp vụ
  if (nextStatus && nextStatus !== currentStatus) {
    // Trạng thái kết thúc: không cho cập nhật tiếp
    if (['completed', 'cancelled', 'refunded'].includes(currentStatus)) {
      return res.status(400).json({ message: 'Không thể cập nhật trạng thái khi đơn hàng đã kết thúc' });
    }

    // Không cho hủy đơn nếu đã giao / đã hoàn thành (giữ lại message rõ ràng)
    if ((currentStatus === 'delivered' || currentStatus === 'completed') && nextStatus === 'cancelled') {
      return res.status(400).json({ message: 'Không thể hủy đơn hàng sau khi đã giao' });
    }

    // Transition matrix gần giống sàn TMĐT (Shopee/TikTok):
    // - Không hủy sau khi đã giao/hoàn thành
    // - "Hoàn hàng" có thể xảy ra khi đang giao hoặc đã giao (khách từ chối nhận)
    // - Hoàn tiền chỉ sau khi đã hoàn hàng
    const allowedTransitions = {
      pending_payment: ['paid_deposit', 'cancelled'],
      paid_deposit: ['shipped', 'cancelled'],
      shipped: ['delivered', 'returned'],
      delivered: ['completed', 'returned'],
      returned: ['refunded']
    };

    const allowed = allowedTransitions[currentStatus];
    if (Array.isArray(allowed) && !allowed.includes(nextStatus)) {
      return res.status(400).json({ message: `Không thể chuyển trạng thái từ "${currentStatus}" sang "${nextStatus}"` });
    }
  }

  // Nếu hoàn tiền, tự set refundDate (và refundAmount mặc định) nếu chưa có
  if (nextStatus === 'refunded') {
    const refundAmount =
      req.body?.refundAmount != null
        ? Number(req.body.refundAmount)
        : Number(current.depositAmount || 0);
    if (Number.isNaN(refundAmount) || refundAmount < 0) {
      return res.status(400).json({ message: 'Số tiền hoàn không hợp lệ' });
    }
    if (refundAmount > Number(current.totalAmount || 0)) {
      return res.status(400).json({ message: 'Số tiền hoàn không được lớn hơn tổng đơn' });
    }
    req.body.refundAmount = refundAmount;
    req.body.refundDate = new Date();
    if (!req.body.refundReason) {
      req.body.refundReason = 'Khách không nhận hàng';
    }
  }

  // Nếu đã đặt cọc: cập nhật số tiền đã thu và số tiền còn lại
  if (nextStatus === 'paid_deposit') {
    const depositAmount = req.body?.depositAmount != null
      ? Number(req.body.depositAmount)
      : Number(current.depositAmount || 0);
    if (Number.isNaN(depositAmount) || depositAmount < 0) {
      return res.status(400).json({ message: 'Số tiền đặt cọc không hợp lệ' });
    }
    if (depositAmount > Number(current.totalAmount || 0)) {
      return res.status(400).json({ message: 'Số tiền đặt cọc không được lớn hơn tổng đơn' });
    }
    req.body.depositAmount = depositAmount;
    req.body.paidAmount = depositAmount;
    req.body.remainingAmount = Math.max(Number(current.totalAmount || 0) - depositAmount, 0);
  }

  // Nếu hoàn thành: chỉ cho phép khi đã thu đủ (paidAmount = totalAmount) và remainingAmount = 0
  if (nextStatus === 'completed') {
    const total = Number(current.totalAmount || 0);
    const paidAmount =
      req.body?.paidAmount != null
        ? Number(req.body.paidAmount)
        : Number(current.paidAmount || 0);
    if (Number.isNaN(paidAmount) || paidAmount < total) {
      return res.status(400).json({ message: 'Chưa thu đủ tiền, không thể chuyển sang hoàn thành' });
    }
    req.body.paidAmount = total;
    req.body.remainingAmount = 0;
  }

  // Nếu hủy: không còn nghĩa vụ thanh toán
  if (nextStatus === 'cancelled') {
    req.body.remainingAmount = 0;
  }

  const updated = await Order.findByIdAndUpdate(orderId, req.body, { new: true });
  res.json(updated);
});

// POST /api/orders/:id/process-after-deposit
// Kiểm tra hàng sau khi đã đặt cọc:
// - Nếu đủ hàng => chuyển sang 'shipped'
// - Nếu không đủ hàng => chuyển sang 'cancelled'
exports.processAfterDeposit = asyncHandler(async (req, res) => {
  const orderId = req.params.id;
  const order = await Order.findById(orderId).lean();
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  if (order.status !== 'paid_deposit') {
    return res.status(400).json({ message: 'Chỉ có thể xử lý sau đặt cọc khi đơn đang ở trạng thái đã đặt cọc' });
  }

  // Chỉ xử lý khi đã đặt cọc (paid_deposit). Nếu trạng thái khác thì vẫn cho chạy,
  const items = Array.isArray(order.items) ? order.items : [];

  let hasAllItems = true;

  // Nếu item có materialId thì kiểm tra tồn kho/trạng thái material
  for (const item of items) {
    if (!item?.materialId) continue; // không có materialId thì bỏ qua kiểm tra

    const material = await Material.findById(item.materialId).lean();
    if (!material) {
      hasAllItems = false;
      break;
    }

    // Nếu material bị disable thì coi như hết hàng
    if (material.status && material.status !== 'active') {
      hasAllItems = false;
      break;
    }

    // Nếu có field stock thì kiểm tra số lượng
    const stock =
      (typeof material.stock === 'number' && material.stock >= 0)
        ? material.stock
        : (typeof material.technicalSpecs?.stock === 'number' && material.technicalSpecs.stock >= 0)
          ? material.technicalSpecs.stock
          : null;
    if (stock != null && (item.quantity || 0) > stock) {
      hasAllItems = false;
      break;
    }
  }

  const nextStatus = hasAllItems ? 'shipped' : 'cancelled';
  const updated = await Order.findByIdAndUpdate(
    orderId,
    { status: nextStatus },
    { new: true }
  );

  res.json(updated);
});

