const mongoose = require('mongoose');

const sitePolicySchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      enum: ['privacyPolicy', 'termsOfService', 'shippingPolicy']
    },
    title: { type: String, required: true },
    content: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('SitePolicy', sitePolicySchema);

