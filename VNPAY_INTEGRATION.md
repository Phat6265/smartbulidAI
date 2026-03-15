# Hướng dẫn tích hợp VNPay

## Tổng quan
Đã tích hợp VNPay vào dự án SmartBuildAI với môi trường test (sandbox).

## Cấu hình

### Backend
File cấu hình: `smartbuildAI_BE/src/config/vnpay.config.js`

Thông tin cấu hình hiện tại:
- **Terminal ID (vnp_TmnCode):** GYCCD29V
- **Secret Key (vnp_HashSecret):** AXS3PFQ5VPBC6DTQH6J3SVGGUJ7VUDLV
- **Payment URL:** https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
- **API URL:** https://sandbox.vnpayment.vn/merchant_webapi/api/transaction

### Environment Variables
Thêm vào file `.env` của backend:
```env
VNPAY_RETURN_URL=http://localhost:5000/api/payment/vnpay/return
FRONTEND_URL=http://localhost:3000
```

## Cài đặt Dependencies

### Backend
Chạy lệnh sau trong thư mục `smartbuildAI_BE`:
```bash
npm install moment qs
```

## Luồng thanh toán

1. **Người dùng đặt hàng:**
   - Vào trang Checkout
   - Điền thông tin giao hàng
   - Click "Tiếp tục thanh toán"

2. **Tạo đơn hàng và URL thanh toán:**
   - Backend tạo đơn hàng với status `pending_payment`
   - Backend tạo URL thanh toán VNPay
   - Frontend redirect đến trang thanh toán VNPay

3. **Thanh toán trên VNPay:**
   - Người dùng thanh toán bằng thẻ (môi trường test)
   - VNPay xử lý thanh toán

4. **Callback từ VNPay:**
   - VNPay redirect về `/api/payment/vnpay/return`
   - Backend xác thực checksum và cập nhật trạng thái đơn hàng
   - Backend redirect về frontend `/payment-success` với thông tin kết quả

5. **IPN (Instant Payment Notification):**
   - VNPay gọi `/api/payment/vnpay/ipn` để xác nhận thanh toán
   - Backend cập nhật trạng thái đơn hàng

## API Endpoints

### POST `/api/payment/vnpay/create_payment_url`
Tạo URL thanh toán VNPay.

**Request:**
```json
{
  "orderId": "order_id",
  "amount": 100000,
  "bankCode": "NCB", // Optional
  "language": "vn" // Optional
}
```

**Response:**
```json
{
  "paymentUrl": "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?...",
  "txnRef": "12345678"
}
```

### GET `/api/payment/vnpay/return`
Endpoint callback từ VNPay sau khi thanh toán. Tự động redirect về frontend.

### GET `/api/payment/vnpay/ipn`
IPN endpoint để VNPay xác nhận thanh toán. Cần public URL để VNPay có thể gọi.

## Cập nhật Order Model

Order model đã được cập nhật với các field:
- `vnp_TxnRef`: Mã giao dịch VNPay
- `vnp_TransactionNo`: Mã giao dịch tại VNPay
- `vnp_ResponseCode`: Mã phản hồi từ VNPay
- `paymentMethod`: Phương thức thanh toán (mặc định: 'vnpay')
- `paymentDate`: Ngày thanh toán

## Frontend

### Trang Payment Success
Đã tạo trang `/payment-success` để hiển thị kết quả thanh toán:
- Thành công: Hiển thị thông tin đơn hàng và nút xem đơn hàng
- Thất bại: Hiển thị thông báo lỗi và nút thử lại

### Checkout Page
Đã cập nhật trang Checkout để:
- Tạo đơn hàng
- Gọi API tạo payment URL
- Redirect đến VNPay

## Lưu ý quan trọng

1. **Môi trường Test:**
   - Hiện tại đang sử dụng môi trường sandbox của VNPay
   - Khi chuyển sang production, cần cập nhật:
     - `vnp_Url`: https://www.vnpayment.vn/paymentv2/vpcpay.html
     - `vnp_Api`: https://www.vnpayment.vn/merchant_webapi/api/transaction
     - Terminal ID và Secret Key từ VNPay production

2. **IPN URL:**
   - IPN endpoint cần phải là public URL
   - Cần cấu hình trong VNPay Merchant Admin để VNPay có thể gọi
   - Có thể sử dụng ngrok hoặc deploy để test IPN

3. **Return URL:**
   - Return URL phải trỏ về backend endpoint
   - Backend sẽ xử lý và redirect về frontend

4. **Security:**
   - Không commit Secret Key vào git
   - Sử dụng environment variables cho production

## Testing

1. **Test thanh toán thành công:**
   - Sử dụng thẻ test từ VNPay
   - Hoặc sử dụng tài khoản test trong sandbox

2. **Test thanh toán thất bại:**
   - Nhập thông tin thẻ sai
   - Hoặc hủy thanh toán

3. **Kiểm tra IPN:**
   - Cần public URL để VNPay gọi
   - Có thể sử dụng ngrok để test local

## Troubleshooting

1. **Lỗi checksum:**
   - Kiểm tra Secret Key có đúng không
   - Kiểm tra cách sort và encode parameters

2. **Không redirect về frontend:**
   - Kiểm tra FRONTEND_URL trong config
   - Kiểm tra CORS settings

3. **Order không được cập nhật:**
   - Kiểm tra IPN endpoint có public không
   - Kiểm tra logs để xem IPN có được gọi không
