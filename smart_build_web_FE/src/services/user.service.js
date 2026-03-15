// ===== NEW FILE CREATED FOR CUSTOMER PROFILE FEATURE =====
import axios from 'axios';
import apiClient from './apiClient';
import { API_BASE_URL, STORAGE_KEYS } from '../utils/constants';

/**
 * Lấy thông tin hồ sơ của user đang đăng nhập
 * @returns {Promise} - { _id, name, email, phone, address, avatarUrl, dateOfBirth, role }
 */
export const getProfile = async () => {
  const response = await apiClient.get('/users/profile');
  return response;
};

/**
 * Cập nhật hồ sơ (name, phone, address, dateOfBirth)
 * @param {Object} data - { name, phone, address, dateOfBirth }
 * @returns {Promise} - updated user
 */
export const updateProfile = async (data) => {
  const response = await apiClient.put('/users/profile', data);
  return response;
};

/**
 * Cập nhật avatar URL (chỉ dùng khi nhập URL thủ công, không upload file)
 * @param {string} avatarUrl
 * @returns {Promise} - updated user
 */
export const updateAvatar = async (avatarUrl) => {
  const response = await apiClient.put('/users/profile/avatar', { avatarUrl });
  return response;
};

// ===== MODIFIED START (AVATAR UPLOAD FEATURE) =====
/**
 * Upload file avatar lên server (multer + Cloudinary)
 * @param {File} file - File ảnh (JPEG, PNG, WebP, max 2MB)
 * @returns {Promise} - { avatarUrl, ...user }
 */
export const uploadAvatar = async (file) => {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  const baseURL = API_BASE_URL || 'http://localhost:5000/api';
  const formData = new FormData();
  formData.append('avatar', file);
  const response = await axios.put(`${baseURL}/users/profile/avatar`, formData, {
    headers: {
      Authorization: token ? `Bearer ${token}` : ''
      // Content-Type để axios tự set multipart/form-data với boundary
    },
    timeout: 30000
  });
  return response.data;
};
// ===== MODIFIED END (AVATAR UPLOAD FEATURE) =====

/**
 * Xóa tài khoản của chính mình
 * @returns {Promise} - 204
 */
export const deleteAccount = async () => {
  await apiClient.delete('/users/profile');
};
