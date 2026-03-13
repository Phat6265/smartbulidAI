const Quotation = require('../models/Quotation');
const asyncHandler = require('../middlewares/asyncHandler');

// POST /api/quotations
exports.createQuotation = asyncHandler(async (req, res) => {
  const payload = req.body;
  const totalPrice =
    payload.totalPrice ||
    (payload.items || []).reduce((sum, item) => sum + (item.quantity * (item.price || 0)), 0);
  const quotation = await Quotation.create({
    ...payload,
    totalPrice,
    status: payload.status || 'pending'
  });
  res.status(201).json(quotation);
});

// GET /api/quotations
exports.getQuotations = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  const quotations = await Quotation.find(filter).lean();
  res.json(quotations);
});

// GET /api/quotations/:id
exports.getQuotationById = asyncHandler(async (req, res) => {
  const quotation = await Quotation.findById(req.params.id).lean();
  if (!quotation) {
    return res.status(404).json({ message: 'Quotation not found' });
  }
  res.json(quotation);
});

// PUT /api/quotations/:id
exports.updateQuotation = asyncHandler(async (req, res) => {
  const updated = await Quotation.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updated) {
    return res.status(404).json({ message: 'Quotation not found' });
  }
  res.json(updated);
});

// PUT /api/quotations/:id/accept
exports.acceptQuotation = asyncHandler(async (req, res) => {
  const updated = await Quotation.findByIdAndUpdate(
    req.params.id,
    { status: 'accepted' },
    { new: true }
  );
  if (!updated) {
    return res.status(404).json({ message: 'Quotation not found' });
  }
  res.json(updated);
});

// PUT /api/quotations/:id/reject
exports.rejectQuotation = asyncHandler(async (req, res) => {
  const updated = await Quotation.findByIdAndUpdate(
    req.params.id,
    { status: 'rejected' },
    { new: true }
  );
  if (!updated) {
    return res.status(404).json({ message: 'Quotation not found' });
  }
  res.json(updated);
});

