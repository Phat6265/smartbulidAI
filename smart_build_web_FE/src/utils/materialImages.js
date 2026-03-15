// Material Images Mapping - Sắt category
// Using static imports with individual imports to avoid webpack initialization issues

// Import images individually
let satCayD10Jpeg, satCayD12, satCayD14, satChuH150, satChuI100, satChuU80, satChuV50x50;
let satCuonD6, satCuonD8, satGanD12, satHop20x40, satTam3mm, satTronTronD10;

// Lazy load images to avoid initialization order issues
try {
  satCayD10Jpeg = require('../assets/category/sat/Sắt cây D10.jpeg');
  if (satCayD10Jpeg && satCayD10Jpeg.default) satCayD10Jpeg = satCayD10Jpeg.default;
} catch (e) {
  console.warn('Failed to load Sắt cây D10.jpeg', e);
}

try {
  satCayD12 = require('../assets/category/sat/Sắt cây D12.jpg');
  if (satCayD12 && satCayD12.default) satCayD12 = satCayD12.default;
} catch (e) {
  console.warn('Failed to load Sắt cây D12.jpg', e);
}

try {
  satCayD14 = require('../assets/category/sat/Sắt cây D14.jpg');
  if (satCayD14 && satCayD14.default) satCayD14 = satCayD14.default;
} catch (e) {
  console.warn('Failed to load Sắt cây D14.jpg', e);
}

try {
  satChuH150 = require('../assets/category/sat/Sắt chữ H 150.jpg');
  if (satChuH150 && satChuH150.default) satChuH150 = satChuH150.default;
} catch (e) {
  console.warn('Failed to load Sắt chữ H 150.jpg', e);
}

try {
  satChuI100 = require('../assets/category/sat/Sắt chữ I 100.jpg');
  if (satChuI100 && satChuI100.default) satChuI100 = satChuI100.default;
} catch (e) {
  console.warn('Failed to load Sắt chữ I 100.jpg', e);
}

try {
  satChuU80 = require('../assets/category/sat/Sắt chữ U 80.jpg');
  if (satChuU80 && satChuU80.default) satChuU80 = satChuU80.default;
} catch (e) {
  console.warn('Failed to load Sắt chữ U 80.jpg', e);
}

try {
  satChuV50x50 = require('../assets/category/sat/Sắt chữ V 50x50.jpg');
  if (satChuV50x50 && satChuV50x50.default) satChuV50x50 = satChuV50x50.default;
} catch (e) {
  console.warn('Failed to load Sắt chữ V 50x50.jpg', e);
}

try {
  satCuonD6 = require('../assets/category/sat/Sắt cuộn D6.jpg');
  if (satCuonD6 && satCuonD6.default) satCuonD6 = satCuonD6.default;
} catch (e) {
  console.warn('Failed to load Sắt cuộn D6.jpg', e);
}

try {
  satCuonD8 = require('../assets/category/sat/Sắt cuộn D8.jpg');
  if (satCuonD8 && satCuonD8.default) satCuonD8 = satCuonD8.default;
} catch (e) {
  console.warn('Failed to load Sắt cuộn D8.jpg', e);
}

try {
  satGanD12 = require('../assets/category/sat/Sắt gân D12.jpg');
  if (satGanD12 && satGanD12.default) satGanD12 = satGanD12.default;
} catch (e) {
  console.warn('Failed to load Sắt gân D12.jpg', e);
}

try {
  satHop20x40 = require('../assets/category/sat/Sắt hộp 20x40.jpg');
  if (satHop20x40 && satHop20x40.default) satHop20x40 = satHop20x40.default;
} catch (e) {
  console.warn('Failed to load Sắt hộp 20x40.jpg', e);
}

try {
  satTam3mm = require('../assets/category/sat/Sắt tấm 3mm.jpg');
  if (satTam3mm && satTam3mm.default) satTam3mm = satTam3mm.default;
} catch (e) {
  console.warn('Failed to load Sắt tấm 3mm.jpg', e);
}

try {
  satTronTronD10 = require('../assets/category/sat/Sắt tròn trơn D10.jpg');
  if (satTronTronD10 && satTronTronD10.default) satTronTronD10 = satTronTronD10.default;
} catch (e) {
  console.warn('Failed to load Sắt tròn trơn D10.jpg', e);
}

/**
 * Normalize material name for matching
 * @param {string} name - Material name
 * @returns {string} - Normalized name (lowercase, no accents)
 */
function normalizeName(name) {
  if (!name) return '';
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .trim();
}

/**
 * Get material image for Sắt category
 * @param {Object} material - Material object with name, category, subcategory
 * @returns {string|null} - Image path or null if not found
 */
export function getMaterialImage(material) {
  // Chỉ áp dụng cho category Sắt (iron)
  if (material.category !== 'iron') {
    return null;
  }
  
  const normalizedName = normalizeName(material.name);
  
  // Mapping tên vật liệu với hình ảnh
  const imageMap = {
    // Sắt cây
    'sắt cây d10': satCayD10Jpeg,
    'sat cay d10': satCayD10Jpeg,
    'sắt cây d12': satCayD12,
    'sat cay d12': satCayD12,
    'sắt cây d14': satCayD14,
    'sat cay d14': satCayD14,
    
    // Sắt cuộn
    'sắt cuộn d6': satCuonD6,
    'sat cuon d6': satCuonD6,
    'sắt cuộn d8': satCuonD8,
    'sat cuon d8': satCuonD8,
    
    // Sắt tấm
    'sắt tấm 3mm': satTam3mm,
    'sat tam 3mm': satTam3mm,
    'sắt tấm 5mm': satTam3mm, // Dùng ảnh 3mm cho 5mm
    'sat tam 5mm': satTam3mm,
    'sắt tấm': satTam3mm,
    'sat tam': satTam3mm,
    
    // Sắt ống (dùng ảnh tương tự)
    'sắt ống d21.3': satTronTronD10, // Dùng ảnh tròn trơn cho ống
    'sat ong d21.3': satTronTronD10,
    'sắt ống d27': satTronTronD10,
    'sat ong d27': satTronTronD10,
    'sắt ống': satTronTronD10,
    'sat ong': satTronTronD10,
    
    // Sắt hộp
    'sắt hộp 20x40': satHop20x40,
    'sat hop 20x40': satHop20x40,
    'sắt hộp 30x60': satHop20x40, // Dùng ảnh 20x40 cho 30x60
    'sat hop 30x60': satHop20x40,
    'sắt hộp': satHop20x40,
    'sat hop': satHop20x40,
    
    // Sắt tròn trơn
    'sắt tròn trơn d10': satTronTronD10,
    'sat tron tron d10': satTronTronD10,
    'sắt tròn trơn': satTronTronD10,
    'sat tron tron': satTronTronD10,
    
    // Sắt gân
    'sắt gân d10': satGanD12, // Dùng ảnh D12 cho D10
    'sat gan d10': satGanD12,
    'sắt gân d12': satGanD12,
    'sat gan d12': satGanD12,
    'sắt gân': satGanD12,
    'sat gan': satGanD12,
    
    // Sắt chữ V
    'sắt chữ v 50x50': satChuV50x50,
    'sat chu v 50x50': satChuV50x50,
    'sắt chữ v': satChuV50x50,
    'sat chu v': satChuV50x50,
    
    // Sắt chữ U
    'sắt chữ u 50x50': satChuU80, // Dùng ảnh U 80 cho U 50x50
    'sat chu u 50x50': satChuU80,
    'sắt chữ u 80': satChuU80,
    'sat chu u 80': satChuU80,
    'sắt chữ u': satChuU80,
    'sat chu u': satChuU80,
    
    // Sắt chữ I
    'sắt chữ i 100': satChuI100,
    'sat chu i 100': satChuI100,
    'sắt chữ i': satChuI100,
    'sat chu i': satChuI100,
    
    // Sắt chữ H
    'sắt chữ h 100': satChuH150, // Dùng ảnh H 150 cho H 100
    'sat chu h 100': satChuH150,
    'sắt chữ h 150': satChuH150,
    'sat chu h 150': satChuH150,
    'sắt chữ h': satChuH150,
    'sat chu h': satChuH150,
  };
  
  // Tìm ảnh theo tên vật liệu
  const image = imageMap[normalizedName];
  if (image) {
    return image;
  }
  
  // Nếu không tìm thấy theo tên đầy đủ, thử tìm theo subcategory
  const subcategory = material.subcategory || '';
  const normalizedSubcategory = normalizeName(subcategory);
  
  // Map subcategory với ảnh mặc định
  const subcategoryImageMap = {
    'sat-cay': satCayD10Jpeg,
    'sat-cuon': satCuonD6,
    'sat-tam': satTam3mm,
    'sat-ong': satTronTronD10, // Dùng ảnh tròn trơn cho ống
    'sat-hop': satHop20x40,
    'sat-tron-tron': satTronTronD10,
    'sat-gan': satGanD12,
    'sat-chu-v': satChuV50x50,
    'sat-chu-u': satChuU80,
    'sat-chu-i': satChuI100,
    'sat-chu-h': satChuH150,
  };
  
  const subcategoryImage = subcategoryImageMap[normalizedSubcategory];
  if (subcategoryImage) {
    return subcategoryImage;
  }
  
  return null;
}
