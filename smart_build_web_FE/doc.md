I.TÀI LIỆU THIẾT KẾ HỆ THỐNG (SYSTEM DESIGN
DOCUMENT)
1. Thông tin chung
• 
• 
• 
• 
Tên hệ thống: SmartBuild – Website bán vật liệu xây dựng tích hợp AI hỗ trợ nhận diện vật liệu
Mục tiêu: Xây dựng nền tảng thương mại điện tử bán vật liệu xây dựng thông dụng, hỗ trợ bán
theo báo giá, tích hợp AI nhận diện vật liệu từ hình ảnh như một tính năng mở rộng.
Đối tượng sử dụng: Khách hàng cá nhân, nhà thầu nhỏ, nhân viên kinh doanh vật liệu xây
dựng, quản trị hệ thống.
Phạm vi: Web application (có thể mở rộng mobile).
2. Tổng quan hệ thống
2.1 Mô tả tổng thể
SmartBuild là một hệ thống web cho phép người dùng: - Duyệt và tìm kiếm các vật liệu xây dựng thông
dụng - Tạo yêu cầu báo giá theo số lượng và địa điểm giao hàng - Quản lý đơn hàng và báo giá - Sử
dụng AI để nhận diện vật liệu từ hình ảnh nhằm hỗ trợ chọn đúng sản phẩm
AI không phải lõi nghiệp vụ, mà là tính năng hỗ trợ giúp tăng trải nghiệm người dùng.
2.2 Kiến trúc tổng thể (High-level Architecture)
• 
• 
• 
• 
Frontend (Client)
Backend (API Server)
Database
AI Recognition Service (tách biệt)
Hệ thống được thiết kế theo mô hình Service-based Architecture để dễ mở rộng.
3. Kiến trúc chi tiết
3.1 Frontend (FE)
Công nghệ: - ReactJS - HTML5 / CSS3 - REST API (JSON)
Chức năng chính: - Trang chủ, danh mục vật liệu - Tìm kiếm, lọc sản phẩm - Trang chi tiết vật liệu - Tạo
yêu cầu báo giá - Theo dõi trạng thái báo giá - Đăng nhập / đăng ký - Chức năng AI: upload/chụp ảnh
vật liệu
Trách nhiệm: - Giao diện người dùng - Kiểm tra dữ liệu đầu vào cơ bản - Gửi yêu cầu API
1
3.2 Backend (BE)
Công nghệ: - Node.js - Express.js
Chức năng chính: - Xác thực và phân quyền - Quản lý vật liệu xây dựng - Quản lý báo giá - Quản lý đơn
hàng - Kết nối AI Service
Kiến trúc Backend: - Controller Layer - Service Layer - Repository/Data Access Layer
3.3 Database
Công nghệ: MongoDB
Lý do lựa chọn: - Dữ liệu linh hoạt - Dễ mở rộng thuộc tính vật liệu - Phù hợp với Node.js
3.4 AI Recognition Service
Vai trò: - Nhận hình ảnh vật liệu - Phân loại vật liệu (image classification) - Trả về loại vật liệu và độ tin
cậy
Công nghệ đề xuất: - Python - TensorFlow / PyTorch - CNN + Transfer Learning (MobileNet, ResNet)
AI được triển khai như một service độc lập, backend gọi qua HTTP API.
4. Thiết kế nghiệp vụ
4.1 Nghiệp vụ bán vật liệu xây dựng
• 
• 
• 
Giá không cố định
Bán theo báo giá
Phụ thuộc số lượng, địa điểm, thời gian
4.2 Nghiệp vụ báo giá
Luồng nghiệp vụ: 1. Khách chọn vật liệu (thủ công hoặc qua AI) 2. Nhập số lượng và địa điểm 3. Gửi
yêu cầu báo giá 4. Nhân viên xử lý và phản hồi báo giá 5. Khách xác nhận hoặc từ chối
5. Thiết kế dữ liệu (Database Design)
5.1 User
{
"_id": "ObjectId",
"name": "string",
"email": "string",
2
"password": "string",
"role": "customer | admin",
"createdAt": "date"
}
5.2 Material
{
}
"_id": "ObjectId",
"name": "string",
"category": "string",
"technicalSpecs": {
"size": "string",
"material": "string",
"standard": "string"
},
"priceReference": "number",
"images": ["string"],
"status": "active"
5.3 Quotation
{
}
"_id": "ObjectId",
"customerId": "ObjectId",
"items": [
{
"materialId": "ObjectId",
"quantity": "number",
"unit": "string"
}
],
"location": "string",
"totalPrice": "number",
"status": "pending | quoted | accepted | rejected",
"createdAt": "date"
6. Thiết kế API
6.1 AI Recognition
• 
• 
• 
POST
/api/ai/recognize
Input: Image
Output: materialType, confidence
3
6.2 Material API
• 
• 
GET
/api/materials
GET
/api/materials/:id
6.3 Quotation API
• 
• 
• 
POST
/api/quotations
GET
/api/quotations/:id
PUT
/api/quotations/:id
7. Luồng hoạt động tổng thể
1. 
2. 
3. 
4. 
5. 
6. 
7. 
Người dùng truy cập web
Tìm hoặc chụp ảnh vật liệu
AI gợi ý loại vật liệu
Người dùng tạo yêu cầu báo giá
Backend xử lý
Admin phản hồi báo giá
Người dùng xác nhận
8. Bảo mật & phân quyền
• 
• 
• 
JWT Authentication
Role-based Access Control
Kiểm soát API theo quyền
9. Khả năng mở rộng
• 
• 
• 
• 
Mobile App (React Native)
Gợi ý vật liệu thay thế bằng AI
Phân tích giá và nhu cầu
Kết nối nhiều nhà cung cấp
10. Thiết kế chi tiết hệ thống AI nhận diện vật liệu
10.1 Mục tiêu AI
Hệ thống AI có nhiệm vụ nhận diện loại vật liệu xây dựng từ hình ảnh đầu vào nhằm hỗ trợ người
dùng lựa chọn đúng sản phẩm trong hệ thống bán hàng. AI đóng vai trò hỗ trợ quyết định, không thay
thế con người.
10.2 Bài toán AI
• 
Loại bài toán: Image Classification
4
• 
• 
Đầu vào: Ảnh vật liệu xây dựng (JPEG/PNG)
Đầu ra: Nhãn vật liệu + độ tin cậy (confidence score)
10.3 Phạm vi nhận diện (demo)
AI tập trung vào các nhóm vật liệu phổ biến: - Gạch (gạch men, gạch block) - Xi măng - Thép xây dựng 
Cát / đá - Ống nhựa (PVC)
10.4 Kiến trúc AI Service
• 
• 
• 
Ngôn ngữ: Python
Framework ML: TensorFlow hoặc PyTorch
Framework API: FastAPI
AI được triển khai như một microservice độc lập, backend Node.js giao tiếp qua REST API.
10.5 Pipeline xử lý AI (Inference)
1. 
2. 
3. 
4. 
Backend gửi ảnh vật liệu đến AI Service
AI Service tiền xử lý ảnh (resize, normalize)
Model CNN dự đoán nhãn
Trả kết quả về backend
10.6 Dữ liệu training
10.6.1 Nguồn dữ liệu
• 
• 
• 
Dataset open-source (Kaggle)
Ảnh từ nhà cung cấp vật liệu
Ảnh tự thu thập
10.6.2 Quy mô dữ liệu (đề án)
• 
• 
200–1000 ảnh / mỗi loại vật liệu
Tổng 5–6 nhóm vật liệu
10.7 Tiền xử lý dữ liệu
• 
• 
• 
Resize ảnh (224x224)
Chuẩn hóa pixel (0–1)
Data Augmentation (xoay, lật, thay đổi độ sáng)
10.8 Kỹ thuật huấn luyện (Training)
• 
• 
Transfer Learning
Base model: MobileNetV2 / ResNet50
10.9 Đánh giá mô hình
• 
• 
• 
Accuracy
Confusion Matrix
Confidence Threshold (>70%)
5
10.10 Triển khai (Deployment)
• 
• 
• 
Export model
Load model trong AI Service
Chạy FastAPI server
10.11 Cải tiến và học liên tục
• 
• 
Lưu ảnh người dùng (có kiểm duyệt)
Retraining định kỳ
10.12 Giới hạn AI
• 
• 
Không đảm bảo 100% chính xác
AI chỉ mang tính hỗ trợ
11. Chức năng gợi ý vật liệu & báo giá theo cấp độ công trình
11.1 Mục tiêu chức năng
Hỗ trợ người dùng không có kiến thức chuyên môn xây dựng có thể: - Hình dung được cần mua
những vật liệu gì - Ước lượng số lượng - Ước tính tổng chi phí xây dựng
Chức năng này đặc biệt phù hợp với nhà cấp 4, nhà phố nhỏ, công trình dân dụng.
11.2 Khái niệm “cấp độ công trình”
Hệ thống định nghĩa sẵn các mẫu công trình phổ biến: - Nhà cấp 4 - Nhà 1 tầng - Nhà 2 tầng - Nhà trọ /
phòng cho thuê
Mỗi cấp độ công trình tương ứng với một bộ định mức vật liệu mẫu.
11.3 Dữ liệu định mức vật liệu (Rule-based)
Ví dụ: Nhà cấp 4 – diện tích 80m² - Xi măng: 120 bao - Cát xây: 18 m³ - Đá 1x2: 12 m³ - Thép: 1.2 tấn 
Gạch xây: 9.000 viên
Các định mức này được xây dựng dựa trên: - Tài liệu xây dựng phổ thông - Kinh nghiệm thực tế - Tham
khảo nhà thầu
11.4 Luồng hoạt động gợi ý báo giá
1. 
2. 
3. 
4. 
5. 
Người dùng chọn loại công trình (ví dụ: nhà cấp 4)
Nhập diện tích, số phòng, mức hoàn thiện
Hệ thống tính toán định mức vật liệu
Mapping sang sản phẩm trong hệ thống
Sinh bảng báo giá chi tiết
6
11.5 Báo giá chi tiết
Bảng báo giá gồm: - Danh sách vật liệu - Đơn vị tính - Số lượng ước tính - Đơn giá tham khảo - Thành
tiền từng hạng mục - Tổng chi phí dự kiến
11.6 Vai trò của AI trong chức năng này
• 
• 
• 
• 
AI không trực tiếp tính toán định mức
AI hỗ trợ:
Gợi ý vật liệu phù hợp
So sánh phương án tiết kiệm chi phí
11.7 Lợi ích mang lại
• 
• 
• 
Người dùng dễ hình dung tài chính
Giảm rủi ro thiếu vật liệu
Tăng khả năng chốt báo giá
12. Kết luận
Thiết kế AI trong hệ thống SmartBuild tuân thủ chuẩn kỹ thuật, học thuật và thực tế triển khai. Việc tách
AI thành service độc lập giúp hệ thống linh hoạt, dễ bảo trì và mở rộng, đồng thời đảm bảo AI chỉ đóng
vai trò hỗ trợ nghiệp vụ bán vật liệu xây dựng.

II.TÀI LIỆU THIẾT KẾ UI/UX (UI DESIGN DOCUMENT)
1. Mục tiêu thiết kế UI
1.1 Định hướng tổng thể

Thiết kế thực dụng – rõ ràng – quen thuộc với người dùng ngành xây dựng

Tránh cảm giác “AI hóa quá mức” (không chatbot tràn lan, không popup AI gây nhiễu)

AI chỉ xuất hiện như tính năng hỗ trợ, có icon và ngữ cảnh rõ ràng

Ưu tiên trải nghiệm cho người không rành công nghệ

1.2 Nguyên tắc thiết kế

Rõ ràng > đẹp

Ít màu, tương phản tốt

Mỗi chức năng = 1 khu vực rõ ràng

Icon luôn đi kèm text

2. Nhận diện giao diện (Design System)
2.1 Định hướng phong cách màu sắc

Phong cách màu sắc của SmartBuild lấy cảm hứng từ ngành xây dựng – vật liệu thô – công trình thực tế, sử dụng các tông:

Nâu (đất, gỗ, bê tông)

Trắng (rõ ràng, dễ đọc)

Vàng đất / vàng cát (cát, đá, ánh nắng công trình)

Mục tiêu:

Tạo cảm giác chắc chắn – tin cậy – gần gũi

Không quá công nghệ, không AI hoá

2.2 Bảng màu đề xuất (Color Palette)
Màu chính (Primary)

Nâu đậm: #5A3E2B

Header, footer, tiêu đề chính

Tạo cảm giác vững chắc

Màu phụ (Secondary)

Vàng đất: #D4A373

Nút hành động chính (CTA)

Giá, báo giá, highlight

Màu nền (Background)

Trắng ngà: #FAF9F7

Nền chính toàn site

Cát nhạt: #EFE6D8

Nền section, card phụ

Màu nhấn (Accent)

Vàng cát đậm: #C18F59

Icon nhấn

Trạng thái hover

Màu chữ (Text)

Nâu sẫm: #3A2A1E

Text chính

Xám nâu: #6B5E53

Text phụ, mô tả

2.3 Nguyên tắc sử dụng màu

Nền sáng (trắng / cát) chiếm ~70%

Nâu dùng cho cấu trúc (header, footer)

Vàng đất chỉ dùng cho hành động quan trọng

Tránh dùng quá nhiều màu vàng cùng lúc

2.4 Typography

Font chính: Inter / Roboto

Heading: Semi-bold / Bold

Body text: Regular

Màu chữ mặc định: nâu sẫm (#3A2A1E)

2.5 Iconography

Icon dạng outline hoặc solid đơn giản

Màu icon mặc định: nâu sẫm

Icon AI (camera, gợi ý) dùng vàng đất nhẹ

3. Layout tổng thể hệ thống
3.1 Header (Toàn hệ thống)

Logo SmartBuild (trái)

Menu chính:

Trang chủ

Vật liệu xây dựng

Báo giá công trình

Nhận diện vật liệu (icon camera nhỏ)

Tài khoản / Đăng nhập

3.2 Footer

Thông tin công ty

Chính sách

Liên hệ

4. Trang Trang chủ (Home Page)
4.1 Mục tiêu

Giới thiệu rõ hệ thống bán vật liệu

AI là điểm cộng, không phải trung tâm

4.2 Bố cục

Banner:

Tiêu đề: "Vật liệu xây dựng – Báo giá minh bạch"

CTA: Xem vật liệu | Yêu cầu báo giá

Danh mục vật liệu (Grid + icon):

Gạch

Xi măng

Cát – đá

Thép

Ống nước

Khối AI (nhỏ, không nổi trội):

Icon camera

Text: "Không biết tên vật liệu? Thử chụp ảnh"

Khối báo giá công trình:

Card: Nhà cấp 4

Card: Nhà 1 tầng

Card: Nhà 2 tầng

5. Trang danh mục vật liệu
5.1 Bố cục

Sidebar filter (trái):

Loại vật liệu

Khoảng giá (tham khảo)

Grid sản phẩm (phải)

5.2 Card sản phẩm

Ảnh vật liệu

Tên

Giá tham khảo

Button: Xem chi tiết

6. Trang chi tiết vật liệu
6.1 Thông tin chính

Ảnh lớn

Tên vật liệu

Thông số kỹ thuật

Giá tham khảo

6.2 Hành động

Button: Thêm vào báo giá

Button phụ: So sánh

7. Trang nhận diện vật liệu (AI Feature)
7.1 Nguyên tắc

Không gọi là "AI"

Đặt tên: "Nhận diện vật liệu"

7.2 Bố cục

Khu upload / chụp ảnh

Icon camera lớn

Text hướng dẫn ngắn

7.3 Kết quả

Gợi ý vật liệu

Độ tin cậy (progress bar)

Button: Xem sản phẩm phù hợp

8. Trang báo giá theo cấp độ công trình
8.1 Bước 1 – Chọn loại công trình

Card layout:

Nhà cấp 4

Nhà 1 tầng

Nhà 2 tầng

8.2 Bước 2 – Nhập thông tin

Diện tích (input)

Số phòng

Mức hoàn thiện (radio)

8.3 Bước 3 – Kết quả báo giá

Table chi tiết vật liệu:

Tên

Số lượng

Đơn vị

Giá

Tổng chi phí

9. Trang quản lý báo giá (User)

Danh sách báo giá

Trạng thái:

Đang xử lý

Đã báo giá

Đã chấp nhận

10. Trang Admin (Tóm tắt)
10.1 Dashboard

Tổng số báo giá

Đơn hàng

10.2 Quản lý báo giá

Table

Action: chỉnh giá, gửi báo giá

11. Responsive Design

Desktop: layout chính

Tablet: 2 cột

Mobile: 1 cột

12. Cấu trúc Frontend (FE) chuẩn cho dự án SmartBuild
12.1 Mục tiêu thiết kế cấu trúc FE

Dễ mở rộng khi thêm tính năng (AI, báo giá công trình)

Dễ bảo trì, đọc hiểu cho dev khác

Phù hợp dự án trung bình – lớn

Tách bạch rõ UI, logic, data

Cấu trúc này được thiết kế theo kinh nghiệm Frontend Developer nhiều năm, phù hợp ReactJS.

12.2 Công nghệ FE đề xuất

ReactJS

React Router

Axios

CSS Modules hoặc TailwindCSS

Zustand / Redux Toolkit (quản lý state)

12.3 Cấu trúc thư mục FE tổng thể
src/
├── assets/
│   ├── icons/
│   ├── images/
│   └── styles/
│       ├── colors.css
│       ├── typography.css
│       └── global.css
│
├── components/
│   ├── common/
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Modal/
│   │   └── Table/
│   ├── layout/
│   │   ├── Header/
│   │   ├── Footer/
│   │   └── Sidebar/
│   └── ai/
│       ├── ImageUploader/
│       └── ConfidenceBar/
│
├── pages/
│   ├── Home/
│   ├── Materials/
│   ├── MaterialDetail/
│   ├── Quotation/
│   ├── ProjectQuotation/
│   ├── AIRecognition/
│   └── Admin/
│
├── services/
│   ├── apiClient.js
│   ├── material.service.js
│   ├── quotation.service.js
│   └── ai.service.js
│
├── store/
│   ├── auth.store.js
│   ├── quotation.store.js
│   └── material.store.js
│
├── hooks/
│   ├── useAuth.js
│   ├── useFetch.js
│   └── useDebounce.js
│
├── utils/
│   ├── formatCurrency.js
│   ├── validators.js
│   └── constants.js
│
├── routes/
│   ├── index.jsx
│   └── protected.route.jsx
│
├── App.jsx
├── main.jsx
└── env.js
12.4 Giải thích các tầng quan trọng
components/

Chứa UI component tái sử dụng

Không gọi API trực tiếp

Không xử lý business logic

pages/

Mỗi page tương ứng 1 route

Kết hợp component + logic

services/

Giao tiếp backend

Tách riêng từng domain (material, quotation, AI)

store/

Quản lý state toàn cục

Không chứa UI

hooks/

Custom hooks tái sử dụng logic

12.5 Nguyên tắc FE quan trọng

Page không gọi API trực tiếp → qua service

Component nhỏ, dễ test

Màu sắc & style dùng biến chung

AI chỉ là module riêng

12.6 Ví dụ flow FE: Báo giá nhà cấp 4

Page ProjectQuotation

Lấy input người dùng

Gọi quotation.service

Store lưu kết quả

Render bảng báo giá

12.7 Lợi ích cấu trúc này

Dễ thêm mobile (React Native)

Dễ thay AI service

Dễ mở rộng tính năng

Phù hợp làm đồ án & sản phẩm thật

13. Kết luận

Cấu trúc Frontend của SmartBuild được thiết kế theo tiêu chuẩn thực tế, giúp dự án phát triển bền vững, dễ mở rộng và phù hợp với đội ngũ FE chuyên nghiệp.