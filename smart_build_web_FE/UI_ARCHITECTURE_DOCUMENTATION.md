# SmartBuild - Tài Liệu Kiến Trúc UI & Design System

> **Mục đích**: Tài liệu này được thiết kế để AI tools (như Antigravity, Cursor) có thể đọc và hiểu được kiến trúc UI, phong cách thiết kế, màu sắc chủ đạo, và cấu trúc của dự án SmartBuild.

---

## 📋 Mục Lục

1. [Tổng Quan Dự Án](#tổng-quan-dự-án)
2. [Hệ Thống Màu Sắc](#hệ-thống-màu-sắc)
3. [Hệ Thống Typography](#hệ-thống-typography)
4. [Kiến Trúc Layout](#kiến-trúc-layout)
5. [Component Architecture](#component-architecture)
6. [Design Patterns](#design-patterns)
7. [Responsive Design](#responsive-design)
8. [Animation Guidelines](#animation-guidelines)
9. [Cấu Trúc File](#cấu-trúc-file)

---

## 🎯 Tổng Quan Dự Án

### Thông Tin Cơ Bản
- **Tên dự án**: SmartBuild
- **Mô tả**: Website bán vật liệu xây dựng tích hợp AI nhận diện vật liệu
- **Framework**: React 19
- **Styling**: CSS với CSS Variables (Design System)
- **State Management**: Zustand
- **Routing**: React Router v6

### Hai Phần Chính của Ứng Dụng

#### 1. **Client Side** (Phía Người Dùng)
- Trang chủ với banner carousel
- Danh mục vật liệu xây dựng
- Báo giá công trình
- AI nhận diện vật liệu
- Giỏ hàng và thanh toán
- Quản lý báo giá cá nhân

#### 2. **Admin Side** (Quản Trị)
- Dashboard với thống kê
- Quản lý vật liệu
- Quản lý đơn hàng
- Quản lý báo giá
- Quản lý người dùng
- Báo cáo doanh thu
- Cài đặt hệ thống

---

## 🎨 Hệ Thống Màu Sắc

### Màu Chủ Đạo (Primary Colors)

Dự án sử dụng bảng màu **nâu đất (earth tones)** phù hợp với ngành xây dựng:

```css
/* Màu chính (Primary) */
--color-primary: #5A3E2B;        /* Nâu đậm - Header, footer, tiêu đề chính */

/* Màu phụ (Secondary) */
--color-secondary: #D4A373;      /* Vàng đất - Nút hành động chính (CTA), giá, báo giá, highlight */

/* Màu nhấn (Accent) */
--color-accent: #C18F59;         /* Vàng cát đậm - Icon nhấn, trạng thái hover */
```

### Màu Nền (Background Colors)

```css
/* Nền chính */
--color-bg-primary: #F5F1EB;     /* Beige nhạt - Nền chính toàn site */
--color-bg-secondary: #F5F1EB;   /* Beige nhạt - Nền section, card phụ */
```

### Màu Chữ (Text Colors)

```css
/* Text chính */
--color-text-primary: #3A2A1E;   /* Nâu sẫm - Text chính */
--color-text-secondary: #6B5E53; /* Xám nâu - Text phụ, mô tả */
```

### Màu Trạng Thái (Status Colors)

```css
--color-success: #28a745;        /* Xanh lá - Thành công */
--color-warning: #ffc107;        /* Vàng - Cảnh báo */
--color-error: #dc3545;          /* Đỏ - Lỗi */
--color-info: #17a2b8;           /* Xanh dương - Thông tin */
```

### Màu Border

```css
--color-border: #E0D5C4;         /* Border chính */
--color-border-light: #F5F0E8;   /* Border nhạt */
```

### Quy Tắc Sử Dụng Màu

#### Client Side:
- **Header/Footer**: `--color-primary` (#5A3E2B) - nền nâu đậm, chữ trắng
- **Buttons Primary**: `--color-secondary` (#D4A373) - vàng đất
- **Background**: `--color-bg-primary` (#F5F1EB) - beige nhạt
- **Cards**: Nền trắng (#FFFFFF) với border `--color-border`
- **Hover states**: `--color-accent` (#C18F59) hoặc `--color-secondary`

#### Admin Side:
- **Header**: Giống Client (`--color-primary`)
- **Sidebar**: Nền `--color-bg-secondary` với border
- **Content Area**: Nền trắng trong card với border
- **Active Menu**: `#8D6E63` (nâu primary) với chữ trắng
- **Tables**: Header `--color-bg-secondary`, rows hover `--color-bg-secondary`

---

## 📝 Hệ Thống Typography

### Font Family

```css
--font-primary: 'Inter', 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

**Font chính**: Inter (Google Fonts)
**Font dự phòng**: Roboto, system fonts

### Font Sizes

```css
--font-size-xs: 0.75rem;    /* 12px */
--font-size-sm: 0.875rem;   /* 14px */
--font-size-base: 1rem;     /* 16px */
--font-size-lg: 1.125rem;   /* 18px */
--font-size-xl: 1.25rem;    /* 20px */
--font-size-2xl: 1.5rem;    /* 24px */
--font-size-3xl: 1.875rem;  /* 30px */
--font-size-4xl: 2.25rem;   /* 36px */
```

### Font Weights

```css
--font-weight-regular: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

### Line Heights

```css
--line-height-tight: 1.25;
--line-height-normal: 1.5;
--line-height-relaxed: 1.75;
```

### Typography Hierarchy

- **H1**: `font-size-4xl`, `font-weight-bold` - Tiêu đề chính trang
- **H2**: `font-size-3xl`, `font-weight-semibold` - Tiêu đề section
- **H3**: `font-size-2xl`, `font-weight-semibold` - Tiêu đề phụ
- **Body**: `font-size-base`, `font-weight-regular` - Nội dung chính
- **Small**: `font-size-sm` - Text phụ, mô tả

---

## 🏗️ Kiến Trúc Layout

### Layout Switcher Logic

Ứng dụng tự động chuyển đổi layout dựa trên route:

```javascript
// Nếu path bắt đầu với /admin hoặc user là admin
if (isAdminPath || (isAuthenticated && isAdmin)) {
  // Hiển thị Admin Layout
  <AdminHeader />
  <AdminContent />
  <AdminFooter />
} else {
  // Hiển thị Client Layout
  <TopBar />
  <Header />
  <ClientContent />
  <Footer />
}
```

### Client Layout Structure

```
┌─────────────────────────────────┐
│         TopBar                  │  (Thông báo, hotline)
├─────────────────────────────────┤
│         Header                  │  (Logo, Navigation, User Menu)
├─────────────────────────────────┤
│                                 │
│         Main Content            │  (Pages: Home, Materials, etc.)
│                                 │
├─────────────────────────────────┤
│         Footer                  │  (Links, Contact Info)
└─────────────────────────────────┘
```

**Components**:
- `TopBar`: Thanh thông báo trên cùng
- `Header`: Navigation chính với logo, menu, cart, user menu
- `Footer`: Footer với links và thông tin liên hệ

### Admin Layout Structure

```
┌─────────────────────────────────┐
│      AdminHeader                │  (Logo, User, Logout)
├──────────┬──────────────────────┤
│          │                      │
│ Sidebar  │   Admin Content      │
│ (Menu)   │   (Outlet)           │
│          │                      │
│          │                      │
├──────────┴──────────────────────┤
│      AdminFooter                │
└─────────────────────────────────┘
```

**Components**:
- `AdminHeader`: Header đơn giản với logo và logout
- `AdminSidebar`: Menu điều hướng bên trái (sticky)
- `AdminContent`: Nội dung admin (sử dụng `<Outlet />` từ React Router)
- `AdminFooter`: Footer admin

### Container & Spacing

```css
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.section {
  padding: 3rem 0;
}
```

---

## 🧩 Component Architecture

### Component Categories

#### 1. **Common Components** (`src/components/common/`)
Các component tái sử dụng:

- **Button**: Nút bấm với variants (primary, secondary, outline, text)
- **Input**: Input field với validation và error states
- **Modal**: Modal dialog với overlay
- **Table**: Bảng dữ liệu với sorting và pagination
- **LazyImage**: Image với lazy loading
- **PageTransition**: Transition giữa các trang

#### 2. **Layout Components** (`src/components/layout/`)
Component layout:

- **TopBar**: Thanh thông báo trên cùng
- **Header**: Header chính với navigation
- **Footer**: Footer chính
- **AdminHeader**: Header admin
- **AdminFooter**: Footer admin

#### 3. **AI Components** (`src/components/ai/`)
Component liên quan đến AI:

- **PhoneCamera**: Camera để chụp ảnh
- **ImageUploader**: Upload ảnh để nhận diện
- **ConfidenceBar**: Hiển thị độ tin cậy của AI

### Component Patterns

#### Button Component

**Variants**:
- `primary`: Nền `#8B5A2B`, chữ trắng
- `secondary`: Nền `--color-bg-secondary`, border
- `outline`: Nền trong suốt, border trắng
- `outline-brown`: Nền trong suốt, border nâu
- `text`: Chỉ text, không border

**Sizes**:
- `small`: `0.5rem 1rem`, `font-size-sm`
- `medium`: `0.75rem 1.5rem`, `font-size-base`
- `large`: `1rem 2rem`, `font-size-lg`

**States**:
- Hover: `translateY(-2px)`, tăng box-shadow
- Active: `translateY(0)`, opacity `0.95`
- Loading: Spinner với opacity `0.7`
- Disabled: Opacity `0.6`, cursor `not-allowed`

#### Input Component

**Features**:
- Label với required indicator
- Error state với error message
- Helper text
- Focus state với border highlight

**Styling**:
- Border: `1px solid var(--color-border)`
- Focus: Border `2px`, màu `--color-secondary`, box-shadow
- Error: Border màu `--color-error`

#### Table Component

**Structure**:
- Header: Nền `--color-bg-secondary`
- Rows: Hover effect với `--color-bg-secondary`
- Border: `1px solid var(--color-border)`
- Animation: Fade in từ trái với delay

---

## 🎨 Design Patterns

### Card Pattern

Cards được sử dụng rộng rãi trong Client Side:

```css
.card {
  background-color: #FFFFFF;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  transition: transform 300ms ease-out,
              box-shadow 300ms ease-out,
              border-color 300ms ease-out;
}

.card:hover {
  border-color: var(--color-secondary);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.16);
  transform: translateY(-4px);
}
```

### Grid Pattern

Responsive grid cho danh sách items:

```css
.responsive-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
}
```

### Section Pattern

Sections với spacing nhất quán:

```css
.section {
  padding: 4rem 0;
}

.section--highlight {
  background-color: var(--color-bg-secondary);
}
```

### Border Radius

- **Small**: `4px` - Inputs, buttons nhỏ
- **Medium**: `8px` - Cards, buttons
- **Large**: `12px` - Containers lớn
- **Extra Large**: `16px` - Special cards (AI card)

### Box Shadow

- **Small**: `0 2px 4px rgba(0, 0, 0, 0.1)` - Header, footer
- **Medium**: `0 4px 12px rgba(0, 0, 0, 0.12)` - Cards
- **Large**: `0 8px 24px rgba(0, 0, 0, 0.16)` - Cards hover
- **Special**: `0 4px 16px rgba(139, 90, 43, 0.08)` - AI card với màu nâu

---

## 📱 Responsive Design

### Breakpoints

```css
/* Mobile */
@media (max-width: 768px) { }

/* Tablet */
@media (min-width: 769px) and (max-width: 1024px) { }

/* Desktop */
@media (min-width: 1025px) { }
```

### Responsive Patterns

#### Mobile (< 768px)
- Header: Hamburger menu thay cho navigation
- Grid: 1 cột
- Padding: Giảm padding sections
- Font sizes: Giảm kích thước font
- Cards: Full width

#### Tablet (769px - 1024px)
- Grid: 2 cột
- Navigation: Compact với font nhỏ hơn
- Cards: 2 cột

#### Desktop (> 1024px)
- Grid: 3-4 cột
- Full navigation
- Max width container: 1200px

### Utility Classes

```css
.hide-mobile { }      /* Ẩn trên mobile */
.hide-tablet { }     /* Ẩn trên tablet */
.hide-desktop { }     /* Ẩn trên desktop */
```

---

## ✨ Animation Guidelines

### Animation Principles

1. **Chắc chắn > Mượt mà**: Animation phải tạo cảm giác vững vàng
2. **Rõ ràng > Ấn tượng**: Mỗi animation có mục đích UX cụ thể
3. **Chậm vừa**: Tốc độ vừa phải, không vội vàng
4. **Tinh tế**: Không làm người dùng chú ý đến animation

### Common Animations

#### Fade In
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

#### Fade In Up
```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

#### Fade In Down
```css
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

#### Slide Down
```css
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

#### Spin (Loading)
```css
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

### Animation Timing

- **Fast**: `200ms` - Hover states, quick feedback
- **Medium**: `300ms` - Card hover, transitions
- **Slow**: `500ms` - Page transitions, carousel

### Easing Functions

- **ease-out**: Hầu hết các transitions
- **ease-in**: Active states
- **linear**: Loading spinners

### Staggered Animations

Cards và list items sử dụng staggered animation:

```css
.card:nth-child(1) { animation-delay: 0ms; }
.card:nth-child(2) { animation-delay: 100ms; }
.card:nth-child(3) { animation-delay: 200ms; }
```

---

## 📁 Cấu Trúc File

### Directory Structure

```
src/
├── assets/
│   ├── styles/
│   │   ├── colors.css          # Color system
│   │   ├── typography.css       # Typography system
│   │   └── global.css          # Global styles
│   ├── img/                     # Images
│   └── icon/                    # Icons
│
├── components/
│   ├── common/                  # Reusable components
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Modal/
│   │   ├── Table/
│   │   └── ...
│   ├── layout/                  # Layout components
│   │   ├── Header/
│   │   ├── Footer/
│   │   ├── AdminHeader/
│   │   └── ...
│   └── ai/                      # AI components
│
├── pages/
│   ├── Home/                    # Client pages
│   ├── Materials/
│   ├── Admin/                   # Admin pages
│   │   ├── Dashboard.jsx
│   │   ├── MaterialsAdmin.jsx
│   │   └── ...
│   └── ...
│
├── services/                    # API services
├── store/                       # Zustand stores
├── hooks/                       # Custom hooks
├── utils/                       # Utilities
└── routes/                      # Route configuration
```

### File Naming Conventions

- **Components**: PascalCase (e.g., `Button.jsx`, `Header.jsx`)
- **CSS Files**: Component name + `.css` (e.g., `Button.css`, `Header.css`)
- **Pages**: PascalCase folder với `index.jsx`
- **Services**: camelCase + `.service.js` (e.g., `auth.service.js`)
- **Stores**: camelCase + `.store.js` (e.g., `cart.store.js`)

---

## 🔑 Key Design Decisions

### 1. Color Scheme Rationale
- **Nâu đất**: Phù hợp với ngành xây dựng, tạo cảm giác chắc chắn, tin cậy
- **Beige nhạt**: Nền sáng, dễ đọc, không gây mỏi mắt
- **Vàng đất**: Màu nhấn ấm áp, thu hút sự chú ý cho CTA

### 2. Typography Choice
- **Inter**: Font hiện đại, dễ đọc, professional
- **Roboto**: Fallback tốt, phổ biến

### 3. Layout Separation
- **Client/Admin tách biệt**: Dễ maintain, UX rõ ràng
- **Sidebar cho Admin**: Navigation rõ ràng, không chiếm nhiều không gian

### 4. Component Reusability
- **Common components**: Tái sử dụng cao, consistent
- **CSS Variables**: Dễ customize, maintain

### 5. Responsive First
- **Mobile-first approach**: Ưu tiên mobile
- **Progressive enhancement**: Thêm features cho desktop

---

## 📚 Resources & References

### CSS Variables Location
- `src/assets/styles/colors.css` - Tất cả màu sắc
- `src/assets/styles/typography.css` - Typography system
- `src/assets/styles/global.css` - Global styles và utilities

### Component Examples
- Button: `src/components/common/Button/`
- Input: `src/components/common/Input/`
- Table: `src/components/common/Table/`

### Page Examples
- Client Home: `src/pages/Home/`
- Admin Dashboard: `src/pages/Admin/Dashboard.jsx`

### Motion Guidelines
- Chi tiết: `MOTION_GUIDELINE.md`

---

## 🎯 Guidelines cho AI Tools

Khi làm việc với codebase này, AI tools nên:

1. **Luôn sử dụng CSS Variables** thay vì hardcode màu sắc
2. **Tuân theo naming conventions** đã có
3. **Sử dụng existing components** thay vì tạo mới khi có thể
4. **Áp dụng animation guidelines** từ MOTION_GUIDELINE.md
5. **Giữ consistency** với design system hiện tại
6. **Test responsive** trên mobile, tablet, desktop
7. **Follow layout patterns** đã được thiết lập

---

**Tài liệu này được cập nhật lần cuối**: Khi có thay đổi lớn về design system hoặc architecture.
