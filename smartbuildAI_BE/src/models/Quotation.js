const mongoose = require('mongoose');

const quotationItemSchema = new mongoose.Schema(
  {
    materialId: { type: String },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String }
  },
  { _id: false }
);

const quotationSchema = new mongoose.Schema(
  {
    customerId: { type: String, required: true },
    customerName: { type: String },
    items: { type: [quotationItemSchema], required: true },
    location: { type: String },
    totalPrice: { type: Number, required: true },
    source: { type: String, enum: ['materials', 'project'], default: 'materials' },
    project: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'quoted', 'accepted'],
      default: 'pending'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Quotation', quotationSchema);

