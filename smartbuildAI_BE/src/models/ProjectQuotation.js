const mongoose = require('mongoose');

const templateMaterialSchema = new mongoose.Schema(
  {
    name: String,
    quantityPerM2: Number,
    unit: String,
    price: Number
  },
  { _id: false }
);

const projectQuotationTemplateSchema = new mongoose.Schema(
  {
    projectType: { type: String, required: true, unique: true }, // e.g. 'nha-cap-4'
    baseArea: { type: Number, required: true },
    materials: [templateMaterialSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model('ProjectQuotationTemplate', projectQuotationTemplateSchema);

