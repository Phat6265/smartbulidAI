// ===== NEW FILE CREATED FOR PASSWORD RESET FEATURE =====
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';
import { isValidEmail } from '../../utils/validators';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import logo from '../../assets/icon/logo.png';
import * as authService from '../../services/auth.service';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage('');
    if (!isValidEmail(email)) {
      setErrors({ email: 'Email không hợp lệ' });
      return;
    }
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setMessage('OTP đã được gửi tới email của bạn. Vui lòng kiểm tra và chuyển sang bước đặt lại mật khẩu.');
      sessionStorage.setItem('smartbuild_reset_email', email);
      setTimeout(() => navigate(ROUTES.RESET_PASSWORD, { state: { email } }), 1500);
    } catch (error) {
      setErrors({ submit: error?.message || 'Có lỗi xảy ra. Vui lòng thử lại.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        <div className="forgot-password-logo">
          <img src={logo} alt="SmartBuild Logo" />
        </div>
        <h1 className="forgot-password-title">Quên mật khẩu</h1>
        <p className="forgot-password-subtitle">
          Nhập email đăng ký để nhận mã OTP đặt lại mật khẩu.
        </p>
        <form onSubmit={handleSubmit} className="forgot-password-form">
          <Input
            label="Email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((prev) => ({ ...prev, email: '' }));
              setMessage('');
            }}
            error={errors.email}
            required
            fullWidth
          />
          {errors.submit && <p className="forgot-password-error">{errors.submit}</p>}
          {message && <p className="forgot-password-success">{message}</p>}
          <Button type="submit" variant="primary" size="large" fullWidth loading={loading}>
            Gửi mã OTP
          </Button>
        </form>
        <p className="forgot-password-footer">
          <Link to={ROUTES.LOGIN}>Quay lại đăng nhập</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
