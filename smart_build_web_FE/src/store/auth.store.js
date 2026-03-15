// Auth Store - Zustand
import { create } from 'zustand';
import * as authService from '../services/auth.service';

const getStoredUserInfo = authService.getStoredUserInfo;
const isAuthenticated = authService.isAuthenticated;

const useAuthStore = create((set) => ({
  user: getStoredUserInfo(),
  isAuthenticated: isAuthenticated(),
  token: localStorage.getItem('smartbuild_auth_token'),

  // Actions
  setUser: (user) => set({ user, isAuthenticated: true }),
  setToken: (token) => {
    localStorage.setItem('smartbuild_auth_token', token);
    set({ token, isAuthenticated: true });
  },
  login: (user, token) => {
    localStorage.setItem('smartbuild_auth_token', token);
    localStorage.setItem('smartbuild_user_info', JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },
  // ===== MODIFIED START (OTP AUTH FEATURE) =====
  verifyOtp: (user, token) => {
    localStorage.setItem('smartbuild_auth_token', token);
    localStorage.setItem('smartbuild_user_info', JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },
  // ===== MODIFIED END (OTP AUTH FEATURE) =====
  logout: () => {
    localStorage.removeItem('smartbuild_auth_token');
    localStorage.removeItem('smartbuild_user_info');
    set({ user: null, token: null, isAuthenticated: false });
  },
  updateUser: (userData) => {
    set((state) => {
      const updatedUser = { ...state.user, ...userData };
      localStorage.setItem('smartbuild_user_info', JSON.stringify(updatedUser));
      return { user: updatedUser };
    });
  },
  // ===== MODIFIED START (FORGOT PASSWORD FEATURE) =====
  forgotPassword: async (email) => authService.forgotPassword(email),
  resetPassword: async (payload) => authService.resetPassword(payload),
  changePassword: async (payload) => authService.changePassword(payload)
  // ===== MODIFIED END (FORGOT PASSWORD FEATURE) =====
}));

export default useAuthStore;

