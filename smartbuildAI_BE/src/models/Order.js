const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    materialId: { type: String },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    unit: { type: String }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    customerId: { type: String, required: true },
    customerName: { type: String },
    items: { type: [orderItemSchema], required: true },
    shippingAddress: { type: String, required: true },
    phone: { type: String, required: true },
    note: { type: String },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending_payment', 'paid_deposit', 'shipped', 'delivered', 'completed', 'cancelled'],
      default: 'pending_payment'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);

