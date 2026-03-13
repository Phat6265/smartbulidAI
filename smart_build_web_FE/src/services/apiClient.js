// API Client - Axios configuration
import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '../utils/constants';

// Sử dụng backend MERN thật, không còn json-server
const BASE_URL = API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (axiosError) => {
    if (axiosError.response) {
      // Server responded with error
      const { status, data } = axiosError.response;
      
      if (status === 401) {
        // Unauthorized - Clear token and redirect to login
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_INFO);
        window.location.href = '/login';
      }
      
      const apiError = new Error(data?.message || 'Có lỗi xảy ra');
      apiError.status = status;
      apiError.data = data;
      return Promise.reject(apiError);
    } else if (axiosError.request) {
      // Request made but no response
      const networkError = new Error('Không thể kết nối đến server. Vui lòng kiểm tra backend MERN đang chạy.');
      networkError.status = 0;
      return Promise.reject(networkError);
    } else {
      // Error setting up request
      const requestError = new Error(axiosError.message || 'Có lỗi xảy ra');
      requestError.status = 0;
      return Promise.reject(requestError);
    }
  }
);

export default apiClient;

