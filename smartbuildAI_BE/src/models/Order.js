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
    paidAmount: { type: Number, default: 0 }, // Số tiền đã thu
    depositAmount: { type: Number }, // Số tiền cọc (50% tổng giá trị đơn hàng)
    remainingAmount: { type: Number }, // Số tiền còn lại
    status: {
      type: String,
      enum: ['pending_payment', 'paid_deposit', 'shipped', 'delivered', 'returned', 'completed', 'cancelled', 'refunded'],
      default: 'pending_payment'
    },
    refundAmount: { type: Number }, // Số tiền hoàn lại nếu khách không nhận hàng
    refundReason: { type: String }, // Lý do hoàn tiền
    refundDate: { type: Date }, // Ngày hoàn tiền
    // VNPay payment information
    vnp_TxnRef: { type: String }, // Mã giao dịch VNPay
    vnp_TransactionNo: { type: String }, // Mã giao dịch tại VNPay
    vnp_ResponseCode: { type: String }, // Mã phản hồi từ VNPay
    paymentMethod: { type: String, default: 'vnpay' }, // Phương thức thanh toán
    paymentDate: { type: Date } // Ngày thanh toán
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);

