// Register Page
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { isValidEmail, isValidPassword, isRequired } from '../../utils/validators';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import logo from '../../assets/icon/logo.png';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!isRequired(formData.name)) {
      newErrors.name = 'Tên không được để trống';
    }
    if (!isValidEmail(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    if (!isValidPassword(formData.password)) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu không khớp';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      // ===== MODIFIED START (OTP AUTH FEATURE) =====
      sessionStorage.setItem('smartbuild_verify_email', formData.email);
      navigate('/verify-otp', { state: { email: formData.email } });
      // ===== MODIFIED END (OTP AUTH FEATURE) =====
    } catch (error) {
      const errorMessage = error?.message || (typeof error === 'string' ? error : 'Đăng ký thất bại');
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-logo">
          <img src={logo} alt="SmartBuild Logo" />
        </div>
        <h1 className="register-title">Đăng ký</h1>
        <form onSubmit={handleSubmit} className="register-form">
          <Input
            label="Họ và tên"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
            fullWidth
          />
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
          <Input
            label="Xác nhận mật khẩu"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            required
            fullWidth
          />
          {errors.submit && <p className="register-error">{errors.submit}</p>}
          <Button type="submit" variant="primary" size="large" fullWidth loading={loading}>
            Đăng ký
          </Button>
        </form>
        <p className="register-footer">
          Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

