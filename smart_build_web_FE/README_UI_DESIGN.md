# SmartBuild - Hướng Dẫn Thiết Kế UI

> Tài liệu này giúp AI tools hiểu được thiết kế và kiến trúc UI của SmartBuild

## 🎨 Màu Sắc Chủ Đạo

### Bảng Màu Chính
- **Màu Primary**: `#5A3E2B` (Nâu đậm) - Dùng cho Header, Footer, tiêu đề
- **Màu Secondary**: `#D4A373` (Vàng đất) - Dùng cho nút bấm chính, giá, highlight
- **Màu Accent**: `#C18F59` (Vàng cát đậm) - Dùng cho icon nhấn, hover states
- **Nền chính**: `#F5F1EB` (Beige nhạt) - Nền toàn site
- **Text chính**: `#3A2A1E` (Nâu sẫm)
- **Text phụ**: `#6B5E53` (Xám nâu)

### Cách Sử Dụng
- **Client Side**: Header/Footer nâu đậm, nền beige, nút vàng đất
- **Admin Side**: Giống Client nhưng có sidebar menu với active state nâu

## 📐 Kiến Trúc Layout

### Client Layout
```
TopBar → Header → Content → Footer
```
- TopBar: Thông báo trên cùng
- Header: Logo + Navigation + Cart + User Menu
- Footer: Links và thông tin liên hệ

### Admin Layout
```
AdminHeader → [Sidebar | Content] → AdminFooter
```
- AdminHeader: Logo + User + Logout
- Sidebar: Menu điều hướng (sticky)
- Content: Nội dung admin (Outlet)

## 🧩 Component System

### Common Components
- **Button**: primary, secondary, outline, text variants
- **Input**: Có label, error state, helper text
- **Table**: Header nền beige, rows có hover effect
- **Modal**: Overlay với content area
- **Card**: Nền trắng, border, shadow, hover lift effect

### Layout Components
- **Header**: Navigation với mobile menu
- **Footer**: Grid layout với links
- **AdminHeader**: Đơn giản, chỉ logo và logout
- **AdminSidebar**: Menu vertical với active state

## 📱 Responsive

- **Mobile** (< 768px): 1 cột, hamburger menu
- **Tablet** (769-1024px): 2 cột
- **Desktop** (> 1024px): 3-4 cột, full navigation

## ✨ Animation

- **Hover**: translateY(-2px), tăng shadow
- **Fade In**: opacity 0 → 1
- **Staggered**: Cards xuất hiện lần lượt với delay
- **Duration**: 200-300ms cho transitions

## 📁 Cấu Trúc

```
src/
├── assets/styles/     # colors.css, typography.css, global.css
├── components/        # common/, layout/, ai/
├── pages/            # Home/, Admin/, Materials/, ...
└── ...
```

## 🔑 Quy Tắc Quan Trọng

1. **Luôn dùng CSS Variables** - Không hardcode màu
2. **Tái sử dụng components** - Dùng Button, Input có sẵn
3. **Tuân theo naming** - PascalCase cho components
4. **Responsive first** - Mobile trước, desktop sau
5. **Animation tinh tế** - Không quá nổi bật

---

**Xem chi tiết**: `UI_ARCHITECTURE_DOCUMENTATION.md`
