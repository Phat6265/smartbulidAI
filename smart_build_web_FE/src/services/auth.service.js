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

/**
 * Register
 * @param {Object} userData - { name, email, password }
 * @returns {Promise}
 */
export const register = async (userData) => {
  try {
    const response = await apiClient.post('/auth/register', userData);

    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
    localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(response.user));

    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Logout
 */
export const logout = () => {
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER_INFO);
};

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

