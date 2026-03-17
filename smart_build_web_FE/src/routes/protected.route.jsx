// Protected Route Component
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../utils/constants';

const ProtectedRoute = ({ children, requireAdmin = false, requireAuth = false, requireRoles = null }) => {
  const { isAuthenticated, isAdmin, user } = useAuth();

  // If route requires authentication and user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // If route requires specific roles
  if (Array.isArray(requireRoles) && requireRoles.length) {
    const role = user?.role;
    if (!role || !requireRoles.includes(role)) {
      return <Navigate to={ROUTES.HOME} replace />;
    }
  }

  // If route requires admin and user is not admin
  if (requireAdmin && !isAdmin) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return children;
};

export default ProtectedRoute;

