// Routes Configuration with Lazy Loading
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import ProtectedRoute from './protected.route';
import { ROUTES } from '../utils/constants';

// Lazy load pages for better performance
const GuestHome = lazy(() => import('../pages/GuestHome'));
const Home = lazy(() => import('../pages/Home'));
const Materials = lazy(() => import('../pages/Materials'));
const MaterialDetail = lazy(() => import('../pages/MaterialDetail'));
const Quotation = lazy(() => import('../pages/Quotation'));
const ProjectQuotation = lazy(() => import('../pages/ProjectQuotation'));
const AIRecognition = lazy(() => import('../pages/AIRecognition'));
const Admin = lazy(() => import('../pages/Admin'));
const AdminDashboard = lazy(() => import('../pages/Admin/Dashboard'));
const AdminMaterials = lazy(() => import('../pages/Admin/MaterialsAdmin'));
const AdminUsers = lazy(() => import('../pages/Admin/UsersAdmin'));
const AdminOrders = lazy(() => import('../pages/Admin/OrdersAdmin'));
const AdminQuotations = lazy(() => import('../pages/Admin/QuotationsAdmin'));
const AdminSettings = lazy(() => import('../pages/Admin/Settings'));
const AdminRevenueReport = lazy(() => import('../pages/Admin/RevenueReport'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
// ===== MODIFIED START (OTP AUTH FEATURE) =====
const VerifyOtp = lazy(() => import('../pages/VerifyOtp'));
// ===== MODIFIED END (OTP AUTH FEATURE) =====
const Cart = lazy(() => import('../pages/Cart'));
const Checkout = lazy(() => import('../pages/Checkout'));
const PaymentSuccess = lazy(() => import('../pages/PaymentSuccess'));
const Profile = lazy(() => import('../pages/Profile'));
const OrderDetail = lazy(() => import('../pages/OrderDetail'));
const About = lazy(() => import('../pages/About'));
const Contact = lazy(() => import('../pages/Contact'));
const FAQ = lazy(() => import('../pages/FAQ'));
const Privacy = lazy(() => import('../pages/Privacy'));
const Terms = lazy(() => import('../pages/Terms'));
const Shipping = lazy(() => import('../pages/Shipping'));

// Loading component with motion
const LoadingFallback = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: '50vh',
    flexDirection: 'column',
    gap: '1rem',
    opacity: 0,
    animation: 'fadeIn 300ms ease-out forwards'
  }}>
    <div className="spinner" style={{
      width: '40px',
      height: '40px',
      border: '3px solid #EFE6D8',
      borderTopColor: '#D4A373',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }}></div>
    <p>Đang tải...</p>
  </div>
);

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Explicit Home and Guest Routes - Always show the same page regardless of auth */}
        <Route path="/home" element={<Home />} />
        <Route path="/guest" element={<GuestHome />} />
        
        {/* Dynamic Home Route - Routes based on auth status */}
        <Route 
          path={ROUTES.HOME} 
          element={isAuthenticated ? <Home /> : <GuestHome />} 
        />

        {/* Public Routes - Available to all users (authenticated and guests) */}
        <Route path="/materials" element={<Materials />} />
        <Route path="/ai-recognition" element={<AIRecognition />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* ===== MODIFIED START (OTP AUTH FEATURE) ===== */}
        <Route path="/verify-otp" element={<VerifyOtp />} />
        {/* ===== MODIFIED END (OTP AUTH FEATURE) ===== */}
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/shipping" element={<Shipping />} />

        {/* Protected Routes - Require Authentication */}
        <Route
          path="/materials/:id"
          element={
            <ProtectedRoute requireAuth>
              <MaterialDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/project-quotation"
          element={
            <ProtectedRoute requireAuth>
              <ProjectQuotation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quotation"
          element={
            <ProtectedRoute requireAuth>
              <Quotation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute requireAuth>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute requireAuth>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment-success"
          element={<PaymentSuccess />}
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute requireAuth>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders/:id"
          element={
            <ProtectedRoute requireAuth>
              <OrderDetail />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute requireAdmin>
              <Admin />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="materials" element={<AdminMaterials />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="quotations" element={<AdminQuotations />} />
          <Route path="revenue-report" element={<AdminRevenueReport />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Default redirect */}
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
