// Validation utilities

/**
 * Validate email
 * @param {string} email
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password (tối thiểu 6 ký tự)
 * @param {string} password
 * @returns {boolean}
 */
export const isValidPassword = (password) => {
  return password && password.length >= 6;
};

/**
 * Validate phone number (Vietnam format)
 * @param {string} phone
 * @returns {boolean}
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^(0|\+84)[0-9]{9,10}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Validate required field
 * @param {any} value
 * @returns {boolean}
 */
export const isRequired = (value) => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};

/**
 * Validate number
 * @param {any} value
 * @returns {boolean}
 */
export const isNumber = (value) => {
  return !isNaN(value) && !isNaN(parseFloat(value));
};

/**
 * Validate positive number
 * @param {any} value
 * @returns {boolean}
 */
export const isPositiveNumber = (value) => {
  return isNumber(value) && parseFloat(value) > 0;
};

/**
 * Validate image file
 * @param {File} file
 * @returns {boolean}
 */
export const isValidImageFile = (file) => {
  if (!file) return false;
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  return validTypes.includes(file.type) && file.size <= maxSize;
};

