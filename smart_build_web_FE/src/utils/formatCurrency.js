// Format currency utility

/**
 * Format số tiền thành định dạng VNĐ
 * @param {number} amount - Số tiền cần format
 * @param {boolean} showSymbol - Hiển thị ký hiệu VNĐ
 * @returns {string} - Chuỗi đã format
 */
export const formatCurrency = (amount, showSymbol = true) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return showSymbol ? '0 ₫' : '0';
  }

  const formatted = new Intl.NumberFormat('vi-VN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);

  return showSymbol ? `${formatted} ₫` : formatted;
};

/**
 * Format số với dấu phẩy
 * @param {number} number - Số cần format
 * @returns {string}
 */
export const formatNumber = (number) => {
  if (number === null || number === undefined || isNaN(number)) {
    return '0';
  }
  return new Intl.NumberFormat('vi-VN').format(number);
};

