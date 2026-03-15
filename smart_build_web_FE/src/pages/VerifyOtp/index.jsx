// ===== NEW FILE CREATED FOR OTP AUTH FEATURE =====
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../utils/constants';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import logo from '../../assets/icon/logo.png';
import './VerifyOtp.css';

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOtp, resendOtp } = useAuth();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const stateEmail = location.state?.email || sessionStorage.getItem('smartbuild_verify_email');
    if (stateEmail) {
      setEmail(stateEmail);
    } else {
      navigate(ROUTES.REGISTER);
    }
  }, [location.state, navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage('');
    const otpTrim = otp.trim();
    if (!otpTrim || otpTrim.length !== 6 || !/^\d+$/.test(otpTrim)) {
      setErrors({ otp: 'Mã OTP phải là 6 chữ số' });
      return;
    }

    setLoading(true);
    try {
      const response = await verifyOtp(email, otpTrim);
      sessionStorage.removeItem('smartbuild_verify_email');
      const role = response?.user?.role;
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate(ROUTES.HOME);
      }
    } catch (error) {
      const errorMessage = error?.message || (typeof error === 'string' ? error : 'Xác minh thất bại');
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setErrors({});
    setMessage('');
    setResendLoading(true);
    try {
      await resendOtp(email);
      setMessage('Mã OTP mới đã được gửi đến email của bạn.');
    } catch (error) {
      const errorMessage = error?.message || (typeof error === 'string' ? error : 'Gửi lại mã thất bại');
      setErrors({ submit: errorMessage });
    } finally {
      setResendLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="verify-otp-page">
        <div className="verify-otp-container">
          <p>Đang chuyển hướng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="verify-otp-page">
      <div className="verify-otp-container">
        <div className="verify-otp-logo">
          <img src={logo} alt="SmartBuild Logo" />
        </div>
        <h1 className="verify-otp-title">Xác minh email</h1>
        <p className="verify-otp-subtitle">
          Chúng tôi đã gửi mã OTP 6 số đến <strong>{email}</strong>. Vui lòng nhập mã bên dưới.
        </p>
        <form onSubmit={handleVerify} className="verify-otp-form">
          <Input
            label="Mã OTP"
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="000000"
            value={otp}
            onChange={(e) => {
              const v = e.target.value.replace(/\D/g, '');
              setOtp(v);
              setErrors((prev) => ({ ...prev, otp: '' }));
            }}
            error={errors.otp}
            fullWidth
          />
          {errors.submit && <p className="verify-otp-error">{errors.submit}</p>}
          {message && <p className="verify-otp-success">{message}</p>}
          <Button type="submit" variant="primary" size="large" fullWidth loading={loading}>
            Xác minh
          </Button>
          <button
            type="button"
            className="verify-otp-resend"
            onClick={handleResend}
            disabled={resendLoading}
          >
            {resendLoading ? 'Đang gửi...' : 'Gửi lại mã OTP'}
          </button>
        </form>
        <p className="verify-otp-footer">
          <Link to={ROUTES.LOGIN}>Quay lại đăng nhập</Link>
        </p>
      </div>
    </div>
  );
};

export default VerifyOtp;
