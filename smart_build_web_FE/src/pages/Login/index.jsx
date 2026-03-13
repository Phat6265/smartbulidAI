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
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState('');

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
      const errorMessage = error?.message || (typeof error === 'string' ? error : 'Đăng nhập thất bại');
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!isValidEmail(forgotEmail)) {
      setForgotMessage('Email không hợp lệ');
      return;
    }

    setForgotLoading(true);
    try {
      // TODO: Gọi API gửi email đặt lại mật khẩu
      console.log('Sending password reset email to:', forgotEmail);
      setForgotMessage('Email đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra email của bạn.');
      setTimeout(() => {
        setShowForgotPassword(false);
        setForgotEmail('');
        setForgotMessage('');
      }, 3000);
    } catch (error) {
      setForgotMessage('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-logo">
          <img src={logo} alt="SmartBuild Logo" />
        </div>
        <h1 className="login-title">Đăng nhập</h1>
        
        {!showForgotPassword ? (
          <>
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
            <button 
              type="button"
              className="login-forgot-btn"
              onClick={() => setShowForgotPassword(true)}
            >
              Quên mật khẩu?
            </button>
            <p className="login-footer">
              Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
            </p>
          </>
        ) : (
          <>
            <form onSubmit={handleForgotPassword} className="login-form">
              <p className="login-forgot-text">
                Nhập email của bạn để nhận liên kết đặt lại mật khẩu
              </p>
              <Input
                label="Email"
                type="email"
                value={forgotEmail}
                onChange={(e) => {
                  setForgotEmail(e.target.value);
                  setForgotMessage('');
                }}
                required
                fullWidth
              />
              {forgotMessage && (
                <p className={forgotMessage.includes('lỗi') ? 'login-error' : 'login-success'}>
                  {forgotMessage}
                </p>
              )}
              <div className="login-forgot-buttons">
                <Button 
                  type="button"
                  variant="outline-brown"
                  size="large"
                  fullWidth
                  onClick={() => {
                    setShowForgotPassword(false);
                    setForgotEmail('');
                    setForgotMessage('');
                  }}
                >
                  Quay lại
                </Button>
                <Button 
                  type="submit"
                  variant="primary"
                  size="large"
                  fullWidth
                  loading={forgotLoading}
                >
                  Gửi Email
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;

