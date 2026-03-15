// ===== NEW FILE CREATED FOR SYSTEM SETTINGS FEATURE =====
const mongoose = require('mongoose');

const systemSettingSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: '' },
    siteDescription: { type: String, default: '' },
    supportEmail: { type: String, default: '' },
    supportPhone: { type: String, default: '' },
    shippingFee: { type: Number, default: 0 },
    freeShippingThreshold: { type: Number, default: 0 },
    companyName: { type: String, default: '' },
    companyAddress: { type: String, default: '' },
    companyHotline: { type: String, default: '' }
  },
  { timestamps: true }
);

systemSettingSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('SystemSetting', systemSettingSchema);
