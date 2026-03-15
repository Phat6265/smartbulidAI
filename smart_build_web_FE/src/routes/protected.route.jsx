// Protected Route Component
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../utils/constants';

const ProtectedRoute = ({ children, requireAdmin = false, requireAuth = false }) => {
  const { isAuthenticated, isAdmin, isStaffOrAdmin } = useAuth();

  // If route requires authentication and user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // If route requires admin: allow both staff and admin (Staff = quản lý đơn hàng, Admin = full quyền)
  if (requireAdmin && !isStaffOrAdmin) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return children;
};

export default ProtectedRoute;

