const mongoose = require('mongoose');

const technicalSpecsSchema = new mongoose.Schema({}, { strict: false, _id: false });

const materialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true }, // brick, steel, cement, ...
    subcategory: { type: String, required: true }, // e.g. gach-dat-nung, thep-cay
    technicalSpecs: technicalSpecsSchema,
    priceReference: { type: Number, required: true },
    images: [{ type: String }],
    unit: { type: String },
    description: { type: String },
    imagePath: { type: String },
    materialType: { type: String }, // for badges (PVC, PPR, ...)
    status: { type: String, default: 'active' },
    stockQuantity: { type: Number, default: 0, min: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Material', materialSchema);

