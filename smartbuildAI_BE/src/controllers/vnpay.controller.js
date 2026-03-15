const crypto = require('crypto');
const querystring = require('qs');
const moment = require('moment');
const vnpayConfig = require('../config/vnpay.config');
const Order = require('../models/Order');
const asyncHandler = require('../middlewares/asyncHandler');

// Helper function to sort object
function sortObject(obj) {
  // Convert to plain object if needed (req.query might be a special object)
  const plainObj = obj && typeof obj === 'object' ? { ...obj } : {};
  let sorted = {};
  let str = [];
  let key;
  for (key in plainObj) {
    if (Object.prototype.hasOwnProperty.call(plainObj, key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(plainObj[str[key]]).replace(/%20/g, '+');
  }
  return sorted;
}

// POST /api/payment/vnpay/create_payment_url
// Tạo URL thanh toán VNPay
exports.createPaymentUrl = asyncHandler(async (req, res) => {
  process.env.TZ = 'Asia/Ho_Chi_Minh';
  
  const { orderId, amount, bankCode, language } = req.body;
  
  if (!orderId || !amount) {
    return res.status(400).json({ message: 'OrderId and amount are required' });
  }

  // Verify order exists
  const order = await Order.findById(orderId);
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  const date = new Date();
  const createDate = moment(date).format('YYYYMMDDHHmmss');
  
  const ipAddr = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  const tmnCode = vnpayConfig.vnp_TmnCode;
  const secretKey = vnpayConfig.vnp_HashSecret;
  let vnpUrl = vnpayConfig.vnp_Url;
  const returnUrl = vnpayConfig.vnp_ReturnUrl;
  
  // Use orderId as transaction reference, but format it properly
  // VNPay requires max 8 characters for TxnRef, so we use last 8 chars of orderId or generate new
  const orderIdStr = orderId.toString();
  const vnp_TxnRef = orderIdStr.length <= 8 ? orderIdStr : orderIdStr.slice(-8) || moment(date).format('DDHHmmss');
  const locale = language || 'vn';
  const currCode = 'VND';
  
  let vnp_Params = {};
  vnp_Params['vnp_Version'] = vnpayConfig.vnp_Version;
  vnp_Params['vnp_Command'] = vnpayConfig.vnp_Command;
  vnp_Params['vnp_TmnCode'] = tmnCode;
  vnp_Params['vnp_Locale'] = locale;
  vnp_Params['vnp_CurrCode'] = currCode;
  vnp_Params['vnp_TxnRef'] = vnp_TxnRef;
  vnp_Params['vnp_OrderInfo'] = `Thanh toan don hang ${orderId}`;
  vnp_Params['vnp_OrderType'] = 'other';
  vnp_Params['vnp_Amount'] = amount * 100; // VNPay requires amount in cents
  vnp_Params['vnp_ReturnUrl'] = returnUrl;
  vnp_Params['vnp_IpAddr'] = ipAddr;
  vnp_Params['vnp_CreateDate'] = createDate;
  
  if (bankCode && bankCode !== '') {
    vnp_Params['vnp_BankCode'] = bankCode;
  }

  vnp_Params = sortObject(vnp_Params);

  const signData = querystring.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac('sha512', secretKey);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
  vnp_Params['vnp_SecureHash'] = signed;
  
  vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

  // Update order with transaction reference
  order.vnp_TxnRef = vnp_TxnRef;
  await order.save();

  res.json({ paymentUrl: vnpUrl, txnRef: vnp_TxnRef });
});

// GET /api/payment/vnpay/return
// Xử lý callback từ VNPay sau khi thanh toán
exports.vnpayReturn = asyncHandler(async (req, res) => {
  // Convert req.query to plain object to avoid hasOwnProperty issues
  let vnp_Params = { ...req.query };
  const secureHash = vnp_Params['vnp_SecureHash'];

  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];

  vnp_Params = sortObject(vnp_Params);

  const secretKey = vnpayConfig.vnp_HashSecret;
  const signData = querystring.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac('sha512', secretKey);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

  const responseCode = vnp_Params['vnp_ResponseCode'];
  const txnRef = vnp_Params['vnp_TxnRef'];
  const transactionNo = vnp_Params['vnp_TransactionNo'];
  const amount = vnp_Params['vnp_Amount'] / 100; // Convert back from cents

  if (secureHash === signed) {
    // Find order by transaction reference or orderId
    // Note: You may need to adjust this based on how you store vnp_TxnRef
    let order = await Order.findOne({ vnp_TxnRef: txnRef });
    
    // If not found by vnp_TxnRef, try to find by orderId (last 8 chars might be orderId)
    if (!order) {
      try {
        order = await Order.findById(txnRef);
      } catch (e) {
        // txnRef might not be a valid ObjectId
      }
    }
    
    // If still not found, try to find by matching orderId in vnp_OrderInfo
    if (!order && vnp_Params['vnp_OrderInfo']) {
      const orderInfo = decodeURIComponent(vnp_Params['vnp_OrderInfo']);
      const orderIdMatch = orderInfo.match(/don hang (\w+)/i);
      if (orderIdMatch && orderIdMatch[1]) {
        try {
          order = await Order.findById(orderIdMatch[1]);
        } catch (e) {
          console.error('Error finding order by ID from OrderInfo:', e);
        }
      }
    }
    
    console.log('VNPay return - Order found:', order ? { _id: order._id, customerId: order.customerId, status: order.status } : 'NOT FOUND');
    
    if (order) {
      if (responseCode === '00') {
        // Payment successful
        order.status = 'paid_deposit';
        order.vnp_ResponseCode = responseCode;
        order.vnp_TransactionNo = transactionNo;
        order.paymentDate = new Date();
        await order.save();
        console.log('Order updated after payment:', { _id: order._id, customerId: order.customerId, status: order.status });
        
        // Redirect to success page with order info
        return res.redirect(`${vnpayConfig.vnp_FrontendUrl}/payment-success?success=true&orderId=${order._id}&txnRef=${txnRef}`);
      } else {
        // Payment failed
        order.vnp_ResponseCode = responseCode;
        await order.save();
        return res.redirect(`${vnpayConfig.vnp_FrontendUrl}/payment-success?success=false&code=${responseCode}&message=Thanh toán thất bại`);
      }
    } else {
      console.error('Order not found for txnRef:', txnRef);
      return res.redirect(`${vnpayConfig.vnp_FrontendUrl}/payment-success?success=false&message=Không tìm thấy đơn hàng`);
    }
  } else {
    console.error('Checksum failed for VNPay return');
    return res.redirect(`${vnpayConfig.vnp_FrontendUrl}/payment-success?success=false&message=Checksum failed`);
  }
});

// GET /api/payment/vnpay/ipn
// IPN (Instant Payment Notification) - VNPay sẽ gọi endpoint này để xác nhận thanh toán
exports.vnpayIpn = asyncHandler(async (req, res) => {
  // Convert req.query to plain object to avoid hasOwnProperty issues
  let vnp_Params = { ...req.query };
  const secureHash = vnp_Params['vnp_SecureHash'];
  
  const orderId = vnp_Params['vnp_TxnRef'];
  const rspCode = vnp_Params['vnp_ResponseCode'];
  const transactionNo = vnp_Params['vnp_TransactionNo'];
  const amount = vnp_Params['vnp_Amount'] / 100;

  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];

  vnp_Params = sortObject(vnp_Params);
  const secretKey = vnpayConfig.vnp_HashSecret;
  const signData = querystring.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac('sha512', secretKey);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
  
  // Find order
  let order = await Order.findOne({ vnp_TxnRef: orderId });
  if (!order) {
    order = await Order.findById(orderId);
  }
  
  if (!order) {
    return res.status(200).json({ RspCode: '01', Message: 'Order not found' });
  }

  // Check amount - so sánh với depositAmount (50% tổng giá trị đơn hàng)
  const expectedDepositAmount = order.depositAmount || order.totalAmount * 0.5;
  const checkAmount = Math.abs(expectedDepositAmount - amount) < 0.01; // Cho phép sai số 0.01 VND
  if (!checkAmount) {
    return res.status(200).json({ RspCode: '04', Message: 'Amount invalid' });
  }

  if (secureHash === signed) {
    if (order.status === 'pending_payment') {
      if (rspCode === '00') {
        // Payment successful
        order.status = 'paid_deposit';
        order.vnp_ResponseCode = rspCode;
        order.vnp_TransactionNo = transactionNo;
        order.paymentDate = new Date();
        await order.save();
        return res.status(200).json({ RspCode: '00', Message: 'Success' });
      } else {
        // Payment failed
        order.vnp_ResponseCode = rspCode;
        await order.save();
        return res.status(200).json({ RspCode: '00', Message: 'Success' });
      }
    } else {
      return res.status(200).json({ RspCode: '02', Message: 'This order has been updated to the payment status' });
    }
  } else {
    return res.status(200).json({ RspCode: '97', Message: 'Checksum failed' });
  }
});
