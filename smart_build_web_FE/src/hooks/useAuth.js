// useAuth Hook
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/auth.store';
import * as authService from '../services/auth.service';
import { ROUTES } from '../utils/constants';

export const useAuth = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, login, logout, setUser, updateUser } = useAuthStore();

  const handleLogout = () => {
    authService.logout();
    logout();
    navigate(ROUTES.HOME);
  };

  useEffect(() => {
    // Check if user is authenticated on mount
    if (isAuthenticated && !user) {
      // Try to get user info from API
      authService.getCurrentUser()
        .then((response) => {
          setUser(response.data || response);
        })
        .catch((error) => {
          // Token might be invalid, logout silently
          console.warn('Failed to get current user:', error);
          logout();
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      login(response.user, response.token);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const handleRegister = async (userData) => {
    try {
      const response = await authService.register(userData);
      login(response.user, response.token);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const refreshUser = async () => {
    try {
      const response = await authService.getCurrentUser();
      const userData = response.data || response;
      updateUser(userData);
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  return {
    user,
    isAuthenticated,
    isAdmin: isAdmin(),
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    refreshUser
  };
};

