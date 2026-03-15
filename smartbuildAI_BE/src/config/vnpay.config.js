// VNPay Configuration
module.exports = {
  vnp_TmnCode: 'GYCCD29V',
  vnp_HashSecret: 'AXS3PFQ5VPBC6DTQH6J3SVGGUJ7VUDLV',
  vnp_Url: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
  vnp_Api: 'https://sandbox.vnpayment.vn/merchant_webapi/api/transaction',
  vnp_ReturnUrl: process.env.VNPAY_RETURN_URL || 'http://localhost:5000/api/payment/vnpay/return',
  vnp_FrontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  vnp_Command: 'pay',
  vnp_CurrCode: 'VND',
  vnp_Version: '2.1.0',
  vnp_Locale: 'vn'
};
