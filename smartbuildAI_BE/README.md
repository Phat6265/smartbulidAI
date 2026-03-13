SmartBuildAI Backend (MERN) - Setup
===================================

1. Cài đặt & chạy backend
-------------------------

- Cài dependency:

```bash
cd smartbuildAI_BE
npm install
```

- Tạo file `.env` trong thư mục `smartbuildAI_BE` với nội dung tối thiểu:

```bash
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smartbuildai
```

- Chạy server ở chế độ dev:

```bash
npm run dev
```

2. Khởi tạo MongoDB cho toàn bộ dự án
------------------------------------

### Cách 1: Dùng script seedFromDbJson (khuyên dùng)

Script này đọc toàn bộ dữ liệu hiện có trong FE `db.json` và đổ sang MongoDB cho backend:

```bash
cd smartbuildAI_BE
npm run dev # (nếu muốn bật server sau khi seed)

# Trong một terminal khác:
node src/utils/seedFromDbJson.js
```

Script sẽ:
- Xóa sạch dữ liệu cũ trong các collection: `materials`, `users`, `quotations`, `orders`, `projectquotationtemplates`
- Đọc `smart_build_web_FE/db.json`
- Map dữ liệu sang schema Mongo tương ứng

> Lưu ý: mật khẩu người dùng trong `db.json` là demo nên trong script đang đặt `passwordHash` dummy.  
> Bạn nên tạo hoặc chỉnh sửa admin thủ công sau khi seed (ví dụ dùng `mongosh`).

### Cách 2: Tạo DB & dữ liệu mẫu thủ công

Giả sử bạn dùng MongoDB local và đã cài `mongosh`:

```bash
mongosh
```

Trong shell:

```javascript
use smartbuildai;

// Tạo các collection chính
db.createCollection("materials");
db.createCollection("orders");
db.createCollection("quotations");
db.createCollection("users");
db.createCollection("projectquotationtemplates");

// Tạo user admin demo
db.users.insertOne({
  name: "Admin Tổng",
  email: "admin@smartbuild.vn",
  passwordHash: "$2a$10$hQnq1pC0DemoHashDemoHashDemoHas", // thay bằng hash thật nếu cần
  role: "admin",
  createdAt: new Date(),
  updatedAt: new Date()
});
```

Bạn có thể viết script seed dữ liệu từ `db.json` FE sang MongoDB bằng Node.js sau khi backend ổn định nếu cần đồng bộ toàn bộ mock data.

3. Kết nối FE với BE MERN
-------------------------

Ở FE (`smart_build_web_FE/src/env.js` hoặc nơi cấu hình API base URL), đặt:

```js
export const API_BASE_URL = 'http://localhost:5000/api';
```

Các service hiện tại (`material.service.js`, `order.service.js`, `quotation.service.js`, `admin.user.service.js`, `projectQuotation.service.js`) đã dùng đường dẫn như `/materials`, `/orders`, `/quotations`, `/users`, `/projectQuotations` nên sẽ làm việc với backend mới theo prefix `/api`.
