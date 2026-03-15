// Login Page
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../utils/constants';
import { isValidEmail, isValidPassword } from '../../utils/validators';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import logo from '../../assets/icon/logo.png';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  // ===== MODIFIED START (FORGOT PASSWORD FEATURE) =====
  // Inline "Quên mật khẩu" form đã chuyển sang trang riêng /forgot-password
  // ===== MODIFIED END (FORGOT PASSWORD FEATURE) =====

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!isValidEmail(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    if (!isValidPassword(formData.password)) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await login(formData);
      const role = response?.user?.role;
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/home');
      }
    } catch (error) {
      // ===== MODIFIED START (OTP AUTH FEATURE) =====
      const errorMessage = error?.message || (typeof error === 'string' ? error : 'Đăng nhập thất bại');
      setErrors({ submit: errorMessage });
      // ===== MODIFIED END (OTP AUTH FEATURE) =====
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-logo">
          <img src={logo} alt="SmartBuild Logo" />
        </div>
        <h1 className="login-title">Đăng nhập</h1>
        <form onSubmit={handleSubmit} className="login-form">
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
            fullWidth
          />
          <Input
            label="Mật khẩu"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
            fullWidth
          />
          {errors.submit && <p className="login-error">{errors.submit}</p>}
          <Button type="submit" variant="primary" size="large" fullWidth loading={loading}>
            Đăng nhập
          </Button>
        </form>
        {/* ===== MODIFIED START (FORGOT PASSWORD FEATURE) ===== */}
        <Link to={ROUTES.FORGOT_PASSWORD} className="login-forgot-btn">
          Quên mật khẩu?
        </Link>
        {/* ===== MODIFIED END (FORGOT PASSWORD FEATURE) ===== */}
        <p className="login-footer">
          Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

