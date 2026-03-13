# SmartBuild - Motion Design System

## 1. Nguyên tắc chung về Motion

### Triết lý chuyển động
- **Chắc chắn > Mượt mà**: Chuyển động phải tạo cảm giác vững vàng, như vật liệu xây dựng
- **Rõ ràng > Ấn tượng**: Mỗi animation đều có mục đích UX cụ thể
- **Chậm vừa**: Không vội vàng, không chậm chạp - tốc độ vừa phải
- **Tinh tế**: Không làm người dùng chú ý đến animation, mà chú ý đến nội dung

### Quy tắc vàng
1. Animation phải có lý do (feedback, trạng thái, định hướng)
2. Không animation vì mục đích "đẹp"
3. Người dùng không nên nhận ra có animation, chỉ cảm thấy mượt mà
4. Tốc độ phù hợp với người dùng không rành công nghệ

---

## 2. Motion Guideline theo Component

### 2.1 Button

#### Trạng thái: Hover
- **Transform**: `translateY(-2px)` (nâng nhẹ lên)
- **Duration**: `200ms`
- **Easing**: `ease-out`
- **Box-shadow**: Tăng độ sâu từ `0 2px 4px` → `0 4px 8px`
- **Không dùng**: Scale, rotate, glow effect

#### Trạng thái: Active (Click)
- **Transform**: `translateY(0)` (ấn xuống)
- **Duration**: `100ms`
- **Easing**: `ease-in`
- **Visual feedback**: Giảm opacity nhẹ `0.95`

#### Trạng thái: Loading
- **Spinner**: Xoay chậm, không có pulse effect
- **Duration**: `1s` (1 vòng)
- **Easing**: `linear`
- **Opacity**: Button giảm opacity `0.7`, không disable hoàn toàn

#### Trạng thái: Disabled
- **Opacity**: `0.5`
- **Cursor**: `not-allowed`
- **Không có animation** khi hover vào disabled button

**Code mẫu:**
```css
.button {
  transition: transform 200ms ease-out, 
              box-shadow 200ms ease-out,
              opacity 200ms ease-out;
}

.button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.button:active:not(:disabled) {
  transform: translateY(0);
  opacity: 0.95;
}
```

---

### 2.2 Card sản phẩm (Material Card)

#### Hover state
- **Transform**: `translateY(-4px)` (nâng lên nhẹ)
- **Duration**: `300ms`
- **Easing**: `ease-out`
- **Box-shadow**: Tăng từ `0 2px 8px` → `0 8px 16px`
- **Image**: Không zoom, không fade

#### Click vào card
- **Transform**: `scale(0.98)` (ấn nhẹ)
- **Duration**: `150ms`
- **Easing**: `ease-in-out`

#### Load card vào viewport
- **Animation**: Fade in từ dưới lên
- **Transform**: `translateY(20px)` → `translateY(0)`
- **Opacity**: `0` → `1`
- **Duration**: `400ms`
- **Easing**: `ease-out`
- **Stagger**: Mỗi card delay `50ms` so với card trước

**Không dùng:**
- Flip card
- 3D rotate
- Bounce effect
- Glow/shine effect

**Code mẫu:**
```css
.material-card {
  transition: transform 300ms ease-out,
              box-shadow 300ms ease-out;
}

.material-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
}

.material-card:active {
  transform: scale(0.98);
}

/* Lazy load animation */
.material-card-enter {
  opacity: 0;
  transform: translateY(20px);
}

.material-card-enter-active {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 400ms ease-out, transform 400ms ease-out;
}
```

---

### 2.3 Table báo giá

#### Row hover
- **Background**: Chuyển màu nền nhẹ
- **Duration**: `200ms`
- **Easing**: `ease-out`
- **Transform**: Không dùng

#### Row click/select
- **Border-left**: Tăng độ dày từ `0` → `3px` (màu secondary)
- **Duration**: `200ms`
- **Background**: Highlight nhẹ

#### Sort column header
- **Icon**: Xoay `0deg` → `180deg` khi sort
- **Duration**: `300ms`
- **Easing**: `ease-in-out`

#### Load table data
- **Rows**: Fade in từ trái sang
- **Transform**: `translateX(-10px)` → `translateX(0)`
- **Opacity**: `0` → `1`
- **Duration**: `300ms`
- **Stagger**: Mỗi row delay `30ms`

**Không dùng:**
- Shake khi có lỗi
- Pulse effect
- Slide toàn bộ table

**Code mẫu:**
```css
.table-row {
  transition: background-color 200ms ease-out;
}

.table-row:hover {
  background-color: var(--color-bg-secondary);
}

.table-row-selected {
  border-left: 3px solid var(--color-secondary);
  background-color: rgba(212, 163, 115, 0.1);
}

.table-header-sort-icon {
  transition: transform 300ms ease-in-out;
}

.table-header-sort-icon.active {
  transform: rotate(180deg);
}
```

---

### 2.4 Form nhập liệu

#### Input focus
- **Border**: Tăng độ dày từ `1px` → `2px`
- **Border color**: Chuyển sang màu secondary
- **Duration**: `200ms`
- **Easing**: `ease-out`
- **Box-shadow**: Thêm `0 0 0 3px rgba(212, 163, 115, 0.1)` (focus ring)

#### Input error
- **Border color**: Chuyển sang màu error
- **Shake**: Không dùng shake
- **Icon error**: Fade in từ opacity `0` → `1`
- **Duration**: `200ms`

#### Input success
- **Border color**: Chuyển sang màu success (xanh nhẹ)
- **Icon check**: Scale in từ `0.8` → `1`
- **Duration**: `200ms`

#### Label khi focus
- **Transform**: Không di chuyển label
- **Color**: Chuyển sang màu secondary
- **Duration**: `200ms`

**Không dùng:**
- Label floating animation
- Input shake khi error
- Glow effect

**Code mẫu:**
```css
.form-input {
  transition: border-color 200ms ease-out,
              border-width 200ms ease-out,
              box-shadow 200ms ease-out;
}

.form-input:focus {
  border-width: 2px;
  border-color: var(--color-secondary);
  box-shadow: 0 0 0 3px rgba(212, 163, 115, 0.1);
  outline: none;
}

.form-input-error {
  border-color: var(--color-error);
}

.form-error-icon {
  opacity: 0;
  transition: opacity 200ms ease-out;
}

.form-input-error + .form-error-icon {
  opacity: 1;
}
```

---

### 2.5 Stepper báo giá công trình

#### Chuyển step
- **Current step**: Fade out `opacity: 1` → `0.3`
- **Next step**: Fade in từ `opacity: 0` → `1`
- **Transform**: `translateX(20px)` → `translateX(0)` (từ phải sang)
- **Duration**: `400ms`
- **Easing**: `ease-out`

#### Step indicator
- **Active step**: Scale từ `1` → `1.1`
- **Completed step**: Check icon fade in
- **Duration**: `300ms`

#### Form trong step
- **Inputs**: Stagger fade in (delay `50ms` mỗi input)
- **Buttons**: Fade in cùng lúc với form

#### Validation error
- **Error message**: Slide down từ trên
- **Transform**: `translateY(-10px)` → `translateY(0)`
- **Opacity**: `0` → `1`
- **Duration**: `300ms`

**Không dùng:**
- Step indicator bounce
- 3D flip giữa các step
- Progress bar animation quá nhanh

**Code mẫu:**
```css
.step-content {
  transition: opacity 400ms ease-out,
              transform 400ms ease-out;
}

.step-content-exit {
  opacity: 0.3;
}

.step-content-enter {
  opacity: 0;
  transform: translateX(20px);
}

.step-content-enter-active {
  opacity: 1;
  transform: translateX(0);
}

.step-indicator-active {
  transform: scale(1.1);
  transition: transform 300ms ease-out;
}
```

---

### 2.6 Page Transition (Chuyển trang)

#### Route change
- **Fade**: `opacity: 1` → `0.7` → `1`
- **Duration**: `200ms` (out) + `200ms` (in)
- **Easing**: `ease-in-out`
- **Transform**: Không dùng slide toàn trang

#### Load page mới
- **Content**: Fade in từ `opacity: 0` → `1`
- **Transform**: `translateY(10px)` → `translateY(0)`
- **Duration**: `300ms`
- **Easing**: `ease-out`

**Không dùng:**
- Slide toàn trang
- 3D flip
- Zoom in/out

**Code mẫu (React Transition):**
```jsx
<Transition
  timeout={200}
  classNames="page"
>
  <Routes>
    {/* routes */}
  </Routes>
</Transition>

/* CSS */
.page-enter {
  opacity: 0;
  transform: translateY(10px);
}

.page-enter-active {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 300ms ease-out, transform 300ms ease-out;
}

.page-exit {
  opacity: 1;
}

.page-exit-active {
  opacity: 0.7;
  transition: opacity 200ms ease-in;
}
```

---

### 2.7 Loading States

#### Skeleton loader
- **Shimmer**: Gradient di chuyển từ trái sang phải
- **Duration**: `1.5s`
- **Easing**: `linear`
- **Opacity**: `0.3` → `0.6` → `0.3`

#### Spinner
- **Rotation**: Xoay đều
- **Duration**: `1s` (1 vòng)
- **Easing**: `linear`
- **Size**: Không thay đổi size khi xoay

#### Progress bar
- **Width**: Tăng từ `0%` → `100%`
- **Duration**: Theo thời gian thực tế
- **Easing**: `ease-out`
- **Không dùng**: Bounce, pulse

**Code mẫu:**
```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-bg-secondary) 0%,
    rgba(255, 255, 255, 0.4) 50%,
    var(--color-bg-secondary) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s linear infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
```

---

## 3. Easing & Duration

### Easing Functions

| Mục đích | Easing | Khi nào dùng |
|----------|--------|--------------|
| Hover, Focus | `ease-out` | Tương tác người dùng |
| Click, Active | `ease-in` | Phản hồi tức thì |
| Chuyển trang, Load | `ease-in-out` | Chuyển đổi mượt mà |
| Loading, Spinner | `linear` | Chuyển động đều |

### Duration Guidelines

| Loại animation | Duration | Lý do |
|---------------|----------|-------|
| Hover | `200ms` | Phản hồi nhanh, không chậm |
| Click | `100-150ms` | Phản hồi tức thì |
| Focus | `200ms` | Đủ để nhận biết |
| Page transition | `300-400ms` | Mượt mà, không quá nhanh |
| Load content | `400ms` | Đủ để nhận biết có thay đổi |
| Stagger delay | `30-50ms` | Tạo hiệu ứng tuần tự nhẹ |

**Quy tắc:**
- Animation < 200ms: Quá nhanh, khó nhận biết
- Animation > 500ms: Quá chậm, gây khó chịu
- Sweet spot: `200-400ms` cho hầu hết trường hợp

---

## 4. Triển khai

### 4.1 CSS Transitions (Ưu tiên)

**Dùng cho:**
- Hover states
- Focus states
- Simple state changes

**Ưu điểm:**
- Performance tốt
- Không cần thư viện
- Dễ maintain

**Ví dụ:**
```css
.component {
  transition: property duration easing;
}
```

### 4.2 CSS Animations

**Dùng cho:**
- Loading spinners
- Skeleton loaders
- Continuous animations

**Ví dụ:**
```css
@keyframes animation-name {
  from { /* ... */ }
  to { /* ... */ }
}
```

### 4.3 React Transition Group

**Dùng cho:**
- Page transitions
- Component mount/unmount
- Stepper transitions

**Cài đặt:**
```bash
npm install react-transition-group
```

**Ví dụ:**
```jsx
import { CSSTransition } from 'react-transition-group';

<CSSTransition
  in={isVisible}
  timeout={300}
  classNames="fade"
>
  <div>Content</div>
</CSSTransition>
```

### 4.4 Framer Motion (Tùy chọn)

**Dùng cho:**
- Complex animations
- Gesture-based interactions
- Advanced page transitions

**Khi nào dùng:**
- Cần animation phức tạp
- Cần gesture (drag, swipe)
- Team có kinh nghiệm với Framer Motion

**Khi KHÔNG nên dùng:**
- Animation đơn giản (dùng CSS)
- Bundle size là vấn đề
- Team chưa quen với Framer Motion

**Ví dụ:**
```jsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, ease: "easeOut" }}
>
  Content
</motion.div>
```

### 4.5 Intersection Observer (Lazy load animation)

**Dùng cho:**
- Card fade in khi scroll
- Section animations
- Lazy load content

**Ví dụ:**
```jsx
const [isVisible, setIsVisible] = useState(false);
const ref = useRef();

useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
      }
    },
    { threshold: 0.1 }
  );

  if (ref.current) {
    observer.observe(ref.current);
  }

  return () => observer.disconnect();
}, []);

<div ref={ref} className={isVisible ? 'fade-in' : ''}>
  Content
</div>
```

---

## 5. Những gì KHÔNG nên dùng

### ❌ Hiệu ứng không phù hợp

1. **Bounce effects**
   - Lý do: Quá vui tươi, không phù hợp ngành xây dựng
   - Thay thế: Fade in mượt mà

2. **3D transforms (rotateX, rotateY, rotateZ)**
   - Lý do: Quá công nghệ, không thực tế
   - Thay thế: 2D translateY, translateX

3. **Glow / Shine effects**
   - Lý do: Quá "AI hóa", không phù hợp
   - Thay thế: Box-shadow tăng độ sâu

4. **Pulse animations**
   - Lý do: Gây xao nhãng
   - Thay thế: Static state hoặc fade

5. **Shake khi error**
   - Lý do: Quá aggressive
   - Thay thế: Border color change, error icon fade in

6. **Zoom in/out quá mức**
   - Lý do: Gây chóng mặt
   - Thay thế: Scale nhẹ (0.98 - 1.02)

7. **Slide toàn trang**
   - Lý do: Quá dramatic
   - Thay thế: Fade transition

8. **Parallax scrolling**
   - Lý do: Không cần thiết, gây xao nhãng
   - Thay thế: Static scroll

9. **Particle effects**
   - Lý do: Quá "game-like"
   - Thay thế: Không dùng

10. **Morphing shapes**
    - Lý do: Quá phức tạp, không có mục đích
    - Thay thế: Static shapes

### ✅ Những gì NÊN dùng

1. **Fade in/out** - Mượt mà, tự nhiên
2. **TranslateY nhẹ** - Tạo độ sâu, không quá mức
3. **Box-shadow tăng** - Tạo cảm giác nâng lên
4. **Color transitions** - Phản hồi trạng thái rõ ràng
5. **Scale nhẹ (0.95 - 1.05)** - Feedback click
6. **Stagger animations** - Tạo cảm giác tuần tự, có tổ chức

---

## 6. Checklist triển khai

### Phase 1: Core Interactions
- [ ] Button hover/active states
- [ ] Input focus states
- [ ] Card hover states
- [ ] Basic page transitions

### Phase 2: Enhanced UX
- [ ] Loading states (skeleton, spinner)
- [ ] Form validation animations
- [ ] Table row interactions
- [ ] Stepper transitions

### Phase 3: Polish
- [ ] Lazy load card animations
- [ ] Stagger effects
- [ ] Error state animations
- [ ] Success feedback animations

### Testing
- [ ] Test trên mobile (performance)
- [ ] Test với `prefers-reduced-motion`
- [ ] Test với slow 3G
- [ ] Test với screen reader

---

## 7. Accessibility

### Respect `prefers-reduced-motion`

**Bắt buộc:** Luôn kiểm tra user preference

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Lý do:**
- Một số người dùng nhạy cảm với motion
- Có thể gây chóng mặt, buồn nôn
- Tôn trọng user preference là best practice

---

## 8. Performance

### Best Practices

1. **Dùng `transform` và `opacity`**
   - GPU-accelerated
   - Không trigger reflow/repaint

2. **Tránh animate:**
   - `width`, `height`
   - `top`, `left`
   - `margin`, `padding`

3. **Dùng `will-change` cẩn thận**
   - Chỉ dùng khi thực sự cần
   - Remove sau khi animation xong

4. **Debounce scroll animations**
   - Không animate mỗi scroll event
   - Dùng `requestAnimationFrame`

---

## Kết luận

Motion design trong SmartBuild phục vụ một mục đích: **Làm cho trải nghiệm mượt mà hơn, không phải để gây ấn tượng**.

Mọi animation đều phải:
- ✅ Có lý do rõ ràng
- ✅ Phù hợp với phong cách xây dựng
- ✅ Không gây xao nhãng
- ✅ Performance tốt
- ✅ Accessible

**Nhớ:** Người dùng không nên nhận ra có animation, chỉ cảm thấy mọi thứ "mượt mà hơn".

