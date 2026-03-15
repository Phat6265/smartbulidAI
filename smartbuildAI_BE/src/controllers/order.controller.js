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
exports.getOrders = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.customerId) {
    filter.customerId = req.query.customerId;
  }
  const orders = await Order.find(filter).lean();
  res.json(orders);
});

// GET /api/orders/:id
exports.getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).lean();
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  res.json(order);
});

// PUT /api/orders/:id
exports.updateOrder = asyncHandler(async (req, res) => {
  const updated = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updated) {
    return res.status(404).json({ message: 'Order not found' });
  }
  res.json(updated);
});

