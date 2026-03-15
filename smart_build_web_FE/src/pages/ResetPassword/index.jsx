// ===== NEW FILE CREATED FOR PASSWORD RESET FEATURE =====
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';
import { isValidPassword } from '../../utils/validators';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import logo from '../../assets/icon/logo.png';
import * as authService from '../../services/auth.service';
import './ResetPassword.css';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const stateEmail = location.state?.email || sessionStorage.getItem('smartbuild_reset_email');
    if (stateEmail) setEmail(stateEmail);
    else navigate(ROUTES.FORGOT_PASSWORD);
  }, [location.state, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage('');
    const otpTrim = otp.trim();
    if (!email) {
      setErrors({ submit: 'Vui lòng quay lại bước quên mật khẩu và nhập email.' });
      return;
    }
    if (!otpTrim || otpTrim.length !== 6 || !/^\d+$/.test(otpTrim)) {
      setErrors({ otp: 'Mã OTP phải là 6 chữ số' });
      return;
    }
    if (!isValidPassword(newPassword)) {
      setErrors({ newPassword: 'Mật khẩu mới phải có ít nhất 6 ký tự' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrors({ confirmPassword: 'Mật khẩu xác nhận không khớp' });
      return;
    }
    setLoading(true);
    try {
      await authService.resetPassword({ email, otp: otpTrim, newPassword });
      setMessage('Đặt lại mật khẩu thành công. Đang chuyển đến trang đăng nhập...');
      sessionStorage.removeItem('smartbuild_reset_email');
      setTimeout(() => navigate(ROUTES.LOGIN), 2000);
    } catch (error) {
      setErrors({ submit: error?.message || 'Đặt lại mật khẩu thất bại. Vui lòng thử lại.' });
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="reset-password-page">
        <div className="reset-password-container">
          <p>Đang chuyển hướng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-password-page">
      <div className="reset-password-container">
        <div className="reset-password-logo">
          <img src={logo} alt="SmartBuild Logo" />
        </div>
        <h1 className="reset-password-title">Đặt lại mật khẩu</h1>
        <p className="reset-password-subtitle">
          Nhập mã OTP đã gửi tới <strong>{email}</strong> và mật khẩu mới.
        </p>
        <form onSubmit={handleSubmit} className="reset-password-form">
          <Input
            label="Mã OTP"
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="000000"
            value={otp}
            onChange={(e) => {
              setOtp(e.target.value.replace(/\D/g, ''));
              setErrors((prev) => ({ ...prev, otp: '' }));
            }}
            error={errors.otp}
            fullWidth
          />
          <Input
            label="Mật khẩu mới"
            type="password"
            name="newPassword"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              setErrors((prev) => ({ ...prev, newPassword: '' }));
            }}
            error={errors.newPassword}
            required
            fullWidth
          />
          <Input
            label="Xác nhận mật khẩu"
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setErrors((prev) => ({ ...prev, confirmPassword: '' }));
            }}
            error={errors.confirmPassword}
            required
            fullWidth
          />
          {errors.submit && <p className="reset-password-error">{errors.submit}</p>}
          {message && <p className="reset-password-success">{message}</p>}
          <Button type="submit" variant="primary" size="large" fullWidth loading={loading}>
            Đặt lại mật khẩu
          </Button>
        </form>
        <p className="reset-password-footer">
          <Link to={ROUTES.FORGOT_PASSWORD}>Gửi lại mã OTP</Link> · <Link to={ROUTES.LOGIN}>Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
