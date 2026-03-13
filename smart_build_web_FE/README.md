# SmartBuild - Website Bán Vật Liệu Xây Dựng

Website bán vật liệu xây dựng tích hợp AI hỗ trợ nhận diện vật liệu.

## Tính năng

- 🏗️ Duyệt và tìm kiếm vật liệu xây dựng
- 💰 Tạo yêu cầu báo giá theo số lượng và địa điểm
- 📊 Báo giá theo cấp độ công trình (Nhà cấp 4, Nhà 1-2 tầng)
- 🤖 AI nhận diện vật liệu từ hình ảnh
- 👤 Quản lý đơn hàng và báo giá
- 🔐 Xác thực và phân quyền (Customer/Admin)
- ⚡ Lazy Loading cho performance tốt hơn
- 📱 Responsive design cho mọi thiết bị

## Công nghệ

- **Frontend**: React 19, React Router, Zustand
- **Styling**: CSS Modules với Design System
- **HTTP Client**: Axios
- **Icons**: React Icons
- **Lazy Loading**: React.lazy + react-lazy-load-image-component
- **Responsive**: react-responsive
- **Mock Server**: json-server

## Cài đặt

1. Clone repository:
```bash
git clone <repository-url>
cd smart_build_app
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Chạy json-server (trong terminal riêng):
```bash
npm run server
```
Server sẽ chạy tại `http://localhost:5000`

4. Chạy ứng dụng (trong terminal khác):
```bash
npm start
```

Ứng dụng sẽ chạy tại [http://localhost:3000](http://localhost:3000)

## Cấu trúc dự án

```
src/
├── assets/          # Styles, images, icons
├── components/      # UI components
│   ├── common/      # Button, Input, Modal, Table, LazyImage
│   ├── layout/      # Header, Footer
│   └── ai/          # AI components
├── pages/          # Page components (lazy loaded)
├── services/       # API services
├── store/          # Zustand stores
├── hooks/          # Custom hooks (useAuth, useResponsive, etc.)
├── utils/          # Utilities
└── routes/         # Route configuration

db.json             # JSON Server database
```

## Scripts

- `npm start` - Chạy development server (port 3000)
- `npm run server` - Chạy json-server (port 5000)
- `npm run build` - Build cho production
- `npm test` - Chạy tests

## Dữ liệu mẫu

Dữ liệu mẫu được lưu trong `db.json` và được phục vụ bởi json-server. Các endpoints:

- `GET /materials` - Lấy danh sách vật liệu
- `GET /materials/:id` - Lấy chi tiết vật liệu
- `GET /quotations` - Lấy danh sách báo giá
- `GET /projectQuotations/:type` - Lấy template báo giá công trình

## Design System

Màu sắc chính:
- Primary: #5A3E2B (Nâu đậm)
- Secondary: #D4A373 (Vàng đất)
- Background: #FAF9F7 (Trắng ngà)
- Text: #3A2A1E (Nâu sẫm)

## Responsive Breakpoints

- Mobile: < 768px
- Tablet: 769px - 1024px
- Desktop: > 1025px
- Large Desktop: > 1440px

## License

MIT
