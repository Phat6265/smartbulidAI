// SmartBuild Constants

// API Endpoints - backend MERN sử dụng prefix /api
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

// AI Service Endpoint
export const AI_SERVICE_URL = process.env.REACT_APP_AI_SERVICE_URL || 'http://localhost:8000/api';

// User Roles
export const USER_ROLES = {
  CUSTOMER: 'customer',
  ADMIN: 'admin'
};

// Quotation Status
export const QUOTATION_STATUS = {
  PENDING: 'pending',
  QUOTED: 'quoted',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected'
};

// Material Categories - Phân cấp 3 tầng: Category -> Subcategory -> Detail Classification
// Note: Icons are imported in components that use them
export const MATERIAL_CATEGORIES = [
  { 
    id: 'iron', 
    name: 'Sắt', 
    iconPath: 'steel-removebg-preview.png',
    subcategories: [
      {
        id: 'sat-xay-dung',
        name: 'Sắt xây dựng',
        details: ['sat-cay', 'sat-cuon', 'sat-tam', 'sat-ong', 'sat-hop']
      },
      {
        id: 'sat-gia-cong',
        name: 'Sắt gia công',
        details: ['sat-tron-tron', 'sat-gan', 'sat-chu-v', 'sat-chu-u', 'sat-chu-i', 'sat-chu-h']
      },
      {
        id: 'sat-trang-tri',
        name: 'Sắt trang trí',
        details: ['sat-tron-tron', 'sat-gan', 'sat-chu-v', 'sat-chu-u', 'sat-chu-i', 'sat-chu-h']
      }
    ]
  },
  { 
    id: 'steel', 
    name: 'Thép', 
    iconPath: 'steel-removebg-preview.png',
    subcategories: [
      {
        id: 'thep-xay-dung',
        name: 'Thép xây dựng',
        // Thép xây dựng: chỉ bao gồm các dạng thép phổ biến cho cốt thép
        // Không bao gồm "thép hình" (đã được tách riêng cho nhóm Thép kết cấu)
        details: ['thep-cay', 'thep-cuon', 'thep-tam', 'thep-ong']
      },
      {
        id: 'thep-ket-cau',
        name: 'Thép kết cấu',
        details: ['thep-hinh', 'thep-ong', 'thep-chu-i', 'thep-chu-h', 'thep-chu-u', 'thep-chu-v']
      },
      {
        id: 'thep-cong-nghiep',
        name: 'Thép công nghiệp',
        details: ['thep-tam', 'thep-ong', 'thep-hop-vuong', 'thep-hop-chu-nhat']
      },
      {
        id: 'thep-tieu-chuan',
        name: 'Tiêu chuẩn',
        details: ['cb240', 'cb300', 'cb400', 'cb500']
      }
    ]
  },
  { 
    id: 'sand-stone', 
    name: 'Cát – đá', 
    iconPath: 'sand-removebg-preview.png',
    subcategories: [
      {
        id: 'vat-lieu-nen-mong',
        name: 'Vật liệu nền móng',
        details: ['cat-san-lap', 'da-1x2', 'da-2x4', 'da-4x6']
      },
      {
        id: 'vat-lieu-be-tong',
        name: 'Vật liệu bê tông',
        details: ['cat-be-tong', 'cat-tho', 'da-1x2', 'da-2x4', 'da-4x6', 'da-mi-sang', 'da-mi-bui']
      },
      {
        id: 'vat-lieu-hoan-thien',
        name: 'Vật liệu hoàn thiện',
        details: ['cat-xay', 'cat-to', 'cat-min', 'cat-trung']
      }
    ]
  },
  { 
    id: 'cement', 
    name: 'Xi măng', 
    iconPath: 'cement-removebg-preview.png',
    subcategories: [
      {
        id: 'xi-mang-xay',
        name: 'Xi măng xây',
        details: ['pcb30', 'pcb40', 'pcb50']
      },
      {
        id: 'xi-mang-to',
        name: 'Xi măng tô',
        details: ['pcb30', 'pcb40']
      },
      {
        id: 'xi-mang-be-tong',
        name: 'Xi măng bê tông',
        details: ['pcb40', 'pcb50']
      },
      {
        id: 'dong-goi',
        name: 'Đóng gói',
        details: ['bao-25kg', 'bao-40kg', 'bao-50kg']
      },
      {
        id: 'thuong-hieu',
        name: 'Thương hiệu',
        details: ['ha-tien', 'nghi-son', 'chinfon', 'bim-son', 'insee']
      }
    ]
  },
  { 
    id: 'pipe', 
    name: 'Ống nước', 
    iconPath: 'water-tap-removebg-preview.png',
    subcategories: [
      {
        id: 'ong-cap-nuoc',
        name: 'Ống cấp nước',
        details: [
          // Hình dạng
          'ong-thang', 'co-90', 'co-45', 'te', 'noi-thang', 'giam', 'dau-bit', 'dau-ren', 'van', 'khoen-dai-treo'
        ]
      },
      {
        id: 'ong-thoat-nuoc',
        name: 'Ống thoát nước',
        details: [
          // Vật liệu
          'ong-thoat-nuoc-pvc',
          // Hình dạng
          'ong-thang', 'co-90', 'te', 'chu-y', 'cua-tham', 'pheu-thoat-san', 'nap-thong-hoi'
        ]
      },
      {
        id: 'ong-thong-hoi',
        name: 'Ống thông hơi',
        details: ['ong-thang', 'co', 'chup-thong-hoi']
      }
    ]
  },
  { 
    id: 'brick', 
    name: 'Gạch', 
    iconPath: 'wall-removebg-preview.png',
    subcategories: [
      {
        id: 'gach-xay',
        name: 'Gạch xây',
        details: ['gach-dat-nung', 'gach-block', 'gach-khong-nung', 'gach-be-tong-khi']
      },
      {
        id: 'gach-lat',
        name: 'Gạch lát',
        details: [
          // Vật liệu
          'gach-ceramic', 'gach-granite', 'gach-porcelain', 'gach-mosaic',
          // Kích thước
          'gach-30x30', 'gach-40x40', 'gach-60x60', 'gach-30x60'
        ]
      },
      {
        id: 'gach-op',
        name: 'Gạch ốp',
        details: [
          // Vật liệu
          'gach-ceramic', 'gach-granite', 'gach-porcelain', 'gach-mosaic',
          // Kích thước
          'gach-30x30', 'gach-40x40', 'gach-60x60', 'gach-30x60'
        ]
      },
      {
        id: 'gach-trang-tri',
        name: 'Gạch trang trí',
        details: ['gach-mosaic', 'gach-ceramic', 'gach-granite']
      }
    ]
  }
];

// Subcategory names mapping - Chuẩn hóa theo docmenu.md
export const SUBCATEGORY_NAMES = {
  // Sắt - Phân loại theo dạng/hình
  'sat-cay': 'Sắt cây',
  'sat-cuon': 'Sắt cuộn',
  'sat-tam': 'Sắt tấm',
  'sat-ong': 'Sắt ống',
  'sat-hop': 'Sắt hộp',
  // Sắt - Phân loại chi tiết
  'sat-tron-tron': 'Sắt tròn trơn',
  'sat-gan': 'Sắt gân',
  'sat-chu-v': 'Sắt chữ V',
  'sat-chu-u': 'Sắt chữ U',
  'sat-chu-i': 'Sắt chữ I',
  'sat-chu-h': 'Sắt chữ H',
  // Thép - Phân loại theo dạng
  'thep-cay': 'Thép cây',
  'thep-cuon': 'Thép cuộn',
  'thep-tam': 'Thép tấm',
  'thep-hinh': 'Thép hình',
  'thep-ong': 'Thép ống',
  // Thép - Phân loại chi tiết
  'thep-tron-tron': 'Thép tròn trơn',
  'thep-gan': 'Thép gân',
  'thep-hop-vuong': 'Thép hộp vuông',
  'thep-hop-chu-nhat': 'Thép hộp chữ nhật',
  'thep-ong-tron': 'Thép ống tròn',
  'thep-chu-i': 'Thép chữ I',
  'thep-chu-h': 'Thép chữ H',
  'thep-chu-u': 'Thép chữ U',
  'thep-chu-v': 'Thép chữ V',
  // Thép - Tiêu chuẩn
  'cb240': 'CB240',
  'cb300': 'CB300',
  'cb400': 'CB400',
  'cb500': 'CB500',
  // Cát - Phân loại theo công dụng
  'cat-xay': 'Cát xây',
  'cat-to': 'Cát tô',
  'cat-be-tong': 'Cát bê tông',
  'cat-san-lap': 'Cát san lấp',
  // Cát - Phân loại theo hạt
  'cat-min': 'Cát mịn',
  'cat-trung': 'Cát trung',
  'cat-tho': 'Cát thô',
  // Đá - Phân loại theo kích thước
  'da-1x2': 'Đá 1x2',
  'da-2x4': 'Đá 2x4',
  'da-4x6': 'Đá 4x6',
  'da-mi-sang': 'Đá mi sàng',
  'da-mi-bui': 'Đá mi bụi',
  // Xi măng - Phân loại theo mác
  'pcb30': 'PCB30',
  'pcb40': 'PCB40',
  'pcb50': 'PCB50',
  // Xi măng - Phân loại theo đóng gói
  'bao-25kg': 'Bao 25kg',
  'bao-40kg': 'Bao 40kg',
  'bao-50kg': 'Bao 50kg',
  // Xi măng - Thương hiệu
  'ha-tien': 'Hà Tiên',
  'nghi-son': 'Nghi Sơn',
  'chinfon': 'Chinfon',
  'bim-son': 'Bỉm Sơn',
  'insee': 'INSEE',
  // Ống nước - Ống cấp nước (vật liệu)
  'ong-cap-nuoc-pvc': 'Ống cấp nước PVC',
  'ong-cap-nuoc-ppr': 'Ống cấp nước PPR',
  'ong-cap-nuoc-pex': 'Ống cấp nước PEX',
  'ong-cap-nuoc-hdpe': 'Ống cấp nước HDPE',
  // Ống nước - Ống cấp nước (hình dạng)
  'ong-thang': 'Ống thẳng',
  'co-90': 'Co 90°',
  'co-45': 'Co 45°',
  'te': 'Tê',
  'noi-thang': 'Nối thẳng',
  'giam': 'Giảm',
  'dau-bit': 'Đầu bịt',
  'dau-ren': 'Đầu ren',
  'van': 'Van',
  'khoen-dai-treo': 'Khoen / đai treo',
  // Ống nước - Ống thoát nước
  'ong-thoat-nuoc-pvc': 'Ống thoát nước PVC',
  'chu-y': 'Chữ Y',
  'cua-tham': 'Cửa thăm',
  'pheu-thoat-san': 'Phễu thoát sàn',
  'nap-thong-hoi': 'Nắp thông hơi',
  // Ống nước - Ống thông hơi
  'ong-thong-hoi': 'Ống thông hơi',
  'co': 'Co',
  'chup-thong-hoi': 'Chụp thông hơi',
  // Gạch - Gạch xây
  'gach-dat-nung': 'Gạch đất nung',
  'gach-block': 'Gạch block',
  'gach-khong-nung': 'Gạch không nung',
  'gach-be-tong-khi': 'Gạch bê tông khí',
  // Gạch - Gạch lát/ốp (vật liệu)
  'gach-ceramic': 'Gạch ceramic',
  'gach-granite': 'Gạch granite',
  'gach-porcelain': 'Gạch porcelain',
  'gach-mosaic': 'Gạch mosaic',
  // Gạch - Gạch lát/ốp (kích thước)
  'gach-30x30': '30x30',
  'gach-40x40': '40x40',
  'gach-60x60': '60x60',
  'gach-30x60': '30x60'
};

// Project Types (Cấp độ công trình)
export const PROJECT_TYPES = [
  {
    id: 'nha-cap-4',
    name: 'Nhà cấp 4',
    description: 'Phù hợp cho nhà ở dân dụng nhỏ',
    imagePath: 'nha-cap-4.jpg'
  },
  {
    id: 'nha-1-tang',
    name: 'Nhà 1 tầng',
    description: 'Nhà phố, biệt thự 1 tầng',
    imagePath: 'nha-1-tang.jpg'
  },
  {
    id: 'nha-2-tang',
    name: 'Nhà 2 tầng',
    description: 'Nhà phố, biệt thự 2 tầng',
    imagePath: 'nha-2-tang.jpg'
  },
  {
    id: 'nha-tro',
    name: 'Nhà trọ / Phòng cho thuê',
    description: 'Công trình cho thuê',
    imagePath: 'nha-tro.jpg'
  }
];

// Completion Levels (Mức hoàn thiện)
export const COMPLETION_LEVELS = [
  { id: 'tho', name: 'Thô', value: 1.0 },
  { id: 'ban-hoan-thien', name: 'Bán hoàn thiện', value: 1.2 },
  { id: 'hoan-thien', name: 'Hoàn thiện', value: 1.5 }
];

// Material Units
export const MATERIAL_UNITS = [
  'bao',
  'm³',
  'tấn',
  'viên',
  'kg',
  'm',
  'm²'
];

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'smartbuild_auth_token',
  USER_INFO: 'smartbuild_user_info'
};

// Routes
export const ROUTES = {
  HOME: '/',
  MATERIALS: '/materials',
  MATERIAL_DETAIL: '/materials/:id',
  QUOTATION: '/quotation',
  PROJECT_QUOTATION: '/project-quotation',
  AI_RECOGNITION: '/ai-recognition',
  ADMIN: '/admin',
  LOGIN: '/login',
  REGISTER: '/register',
  VERIFY_OTP: '/verify-otp', // ===== MODIFIED (OTP AUTH FEATURE) =====
  PROFILE: '/profile',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDERS: '/orders'
};

// AI Recognition - Material Types
export const AI_MATERIAL_TYPES = [
  'gach',
  'xi-mang',
  'thep',
  'cat-da',
  'ong-nhua'
];

// Confidence Threshold
export const AI_CONFIDENCE_THRESHOLD = 0.7;

// Material Type Badge Colors - Màu sắc cho badge loại vật liệu
export const MATERIAL_TYPE_BADGES = {
  'PVC': { 
    label: 'PVC', 
    color: '#4CAF50', 
    bgColor: '#E8F5E9',
    textColor: '#2E7D32'
  },
  'PPR': { 
    label: 'PPR', 
    color: '#2196F3', 
    bgColor: '#E3F2FD',
    textColor: '#1565C0'
  },
  'PEX': { 
    label: 'PEX', 
    color: '#FF9800', 
    bgColor: '#FFF3E0',
    textColor: '#E65100'
  },
  'HDPE': { 
    label: 'HDPE', 
    color: '#9C27B0', 
    bgColor: '#F3E5F5',
    textColor: '#6A1B9A'
  }
};
