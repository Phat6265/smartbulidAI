// Authentication Service - dùng backend MERN thật (/api/auth/...)
import apiClient from './apiClient';
import { STORAGE_KEYS } from '../utils/constants';

/**
 * Login
 * @param {Object} credentials - { email, password }
 * @returns {Promise}
 */
export const login = async (credentials) => {
  try {
    const response = await apiClient.post('/auth/login', credentials);

    // Store token and user info
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
    localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(response.user));

    return response;
  } catch (error) {
    throw error;
  }
};

// ===== MODIFIED START (OTP AUTH FEATURE) =====
/**
 * Register - tạo tài khoản và gửi OTP (không trả token)
 * @param {Object} userData - { name, email, password }
 * @returns {Promise} - { message, email }
 */
export const register = async (userData) => {
  try {
    const response = await apiClient.post('/auth/register', userData);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Verify OTP - xác minh mã OTP, trả user + token
 * @param {Object} payload - { email, otp }
 * @returns {Promise}
 */
export const verifyOtp = async (payload) => {
  try {
    const response = await apiClient.post('/auth/verify-otp', payload);
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
    localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(response.user));
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Resend OTP - gửi lại mã OTP
 * @param {string} email
 * @returns {Promise}
 */
export const resendOtp = async (email) => {
  try {
    const response = await apiClient.post('/auth/resend-otp', { email });
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Logout - gọi API blacklist token rồi xóa localStorage
 */
export const logout = async () => {
  try {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      await apiClient.post('/auth/logout');
    }
  } catch (e) {
    // Vẫn xóa local dù API lỗi (vd token hết hạn)
  } finally {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_INFO);
  }
};
// ===== MODIFIED END (OTP AUTH FEATURE) =====

/**
 * Get current user info
 * @returns {Promise}
 */
export const getCurrentUser = async () => {
  try {
    const response = await apiClient.get('/auth/me');
    return { data: response };
  } catch (error) {
    throw error;
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  return !!token;
};

/**
 * Get stored user info
 * @returns {Object|null}
 */
export const getStoredUserInfo = () => {
  const userInfo = localStorage.getItem(STORAGE_KEYS.USER_INFO);
  return userInfo ? JSON.parse(userInfo) : null;
};
