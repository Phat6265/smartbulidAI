// ===== NEW FILE CREATED FOR SYSTEM SETTINGS FEATURE =====
const SystemSetting = require('../models/SystemSetting');
const asyncHandler = require('../middlewares/asyncHandler');

const getSingleton = async () => {
  let doc = await SystemSetting.findOne().lean();
  if (!doc) {
    doc = await SystemSetting.create({});
    doc = doc.toObject();
  }
  return doc;
};

// GET /api/settings
exports.getSettings = asyncHandler(async (req, res) => {
  const doc = await getSingleton();
  res.json(doc);
});

// PUT /api/settings/site
exports.updateSiteSettings = asyncHandler(async (req, res) => {
  const { siteName, siteDescription, supportEmail, supportPhone } = req.body;
  const update = {};
  if (siteName !== undefined) update.siteName = String(siteName).trim();
  if (siteDescription !== undefined) update.siteDescription = String(siteDescription).trim();
  if (supportEmail !== undefined) update.supportEmail = String(supportEmail).trim();
  if (supportPhone !== undefined) update.supportPhone = String(supportPhone).trim();
  const doc = await SystemSetting.findOneAndUpdate({}, { $set: update }, { new: true, upsert: true }).lean();
  res.json(doc);
});

// PUT /api/settings/shipping
exports.updateShippingSettings = asyncHandler(async (req, res) => {
  const { shippingFee, freeShippingThreshold } = req.body;
  const update = {};
  if (shippingFee !== undefined) update.shippingFee = Number(shippingFee) >= 0 ? Number(shippingFee) : 0;
  if (freeShippingThreshold !== undefined) update.freeShippingThreshold = Number(freeShippingThreshold) >= 0 ? Number(freeShippingThreshold) : 0;
  const doc = await SystemSetting.findOneAndUpdate({}, { $set: update }, { new: true, upsert: true }).lean();
  res.json(doc);
});

// PUT /api/settings/company
exports.updateCompanySettings = asyncHandler(async (req, res) => {
  const { companyName, companyAddress, companyHotline } = req.body;
  const update = {};
  if (companyName !== undefined) update.companyName = String(companyName).trim();
  if (companyAddress !== undefined) update.companyAddress = String(companyAddress).trim();
  if (companyHotline !== undefined) update.companyHotline = String(companyHotline).trim();
  const doc = await SystemSetting.findOneAndUpdate({}, { $set: update }, { new: true, upsert: true }).lean();
  res.json(doc);
});
