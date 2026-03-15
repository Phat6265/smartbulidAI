const Faq = require('../models/Faq');
const SitePolicy = require('../models/SitePolicy');
const asyncHandler = require('../middlewares/asyncHandler');

// ===== FAQ =====

// GET /api/info/faqs
// Guest: xem danh sách câu hỏi thường gặp
exports.getFaqs = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.category) {
    filter.category = req.query.category;
  }
  const faqs = await Faq.find(filter).lean();
  res.json(faqs);
});

// GET /api/info/faqs/:id
exports.getFaqById = asyncHandler(async (req, res) => {
  const faq = await Faq.findById(req.params.id).lean();
  if (!faq) {
    return res.status(404).json({ message: 'FAQ not found' });
  }
  res.json(faq);
});

// POST /api/info/faqs
exports.createFaq = asyncHandler(async (req, res) => {
  const created = await Faq.create(req.body);
  res.status(201).json(created);
});

// PUT /api/info/faqs/:id
exports.updateFaq = asyncHandler(async (req, res) => {
  const updated = await Faq.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updated) {
    return res.status(404).json({ message: 'FAQ not found' });
  }
  res.json(updated);
});

// DELETE /api/info/faqs/:id
exports.deleteFaq = asyncHandler(async (req, res) => {
  const deleted = await Faq.findByIdAndDelete(req.params.id);
  if (!deleted) {
    return res.status(404).json({ message: 'FAQ not found' });
  }
  res.status(204).end();
});

// ===== Site policies =====

// Helper lấy policy theo key
const getPolicyByKey = async (key) => {
  let policy = await SitePolicy.findOne({ key }).lean();
  if (!policy) {
    // Nếu chưa có thì tạo bản ghi mặc định để dễ chỉnh sửa sau
    policy = await SitePolicy.create({
      key,
      title:
        key === 'privacyPolicy'
          ? 'Chính sách bảo mật'
          : key === 'termsOfService'
          ? 'Điều khoản dịch vụ'
          : 'Chính sách giao hàng',
      content: ''
    });
    policy = policy.toObject();
  }
  return policy;
};

// GET /api/info/privacy-policy
exports.getPrivacyPolicy = asyncHandler(async (req, res) => {
  const policy = await getPolicyByKey('privacyPolicy');
  res.json(policy);
});

// GET /api/info/terms-of-service
exports.getTermsOfService = asyncHandler(async (req, res) => {
  const policy = await getPolicyByKey('termsOfService');
  res.json(policy);
});

// GET /api/info/shipping-policy
exports.getShippingPolicy = asyncHandler(async (req, res) => {
  const policy = await getPolicyByKey('shippingPolicy');
  res.json(policy);
});

// PUT /api/info/privacy-policy
exports.updatePrivacyPolicy = asyncHandler(async (req, res) => {
  const updated = await SitePolicy.findOneAndUpdate(
    { key: 'privacyPolicy' },
    req.body,
    { new: true, upsert: true }
  );
  res.json(updated);
});

// PUT /api/info/terms-of-service
exports.updateTermsOfService = asyncHandler(async (req, res) => {
  const updated = await SitePolicy.findOneAndUpdate(
    { key: 'termsOfService' },
    req.body,
    { new: true, upsert: true }
  );
  res.json(updated);
});

// PUT /api/info/shipping-policy
exports.updateShippingPolicy = asyncHandler(async (req, res) => {
  const updated = await SitePolicy.findOneAndUpdate(
    { key: 'shippingPolicy' },
    req.body,
    { new: true, upsert: true }
  );
  res.json(updated);
});

