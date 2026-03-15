// ===== NEW FILE CREATED FOR PASSWORD RESET FEATURE =====
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';
import { isValidPassword } from '../../utils/validators';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import useAuthStore from '../../store/auth.store';
import './ChangePassword.css';

const ChangePassword = () => {
  const navigate = useNavigate();
  const { changePassword } = useAuthStore();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage('');
    if (!currentPassword) {
      setErrors({ currentPassword: 'Vui lòng nhập mật khẩu hiện tại' });
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
    if (currentPassword === newPassword) {
      setErrors({ newPassword: 'Mật khẩu mới phải khác mật khẩu hiện tại' });
      return;
    }
    setLoading(true);
    try {
      await changePassword({ currentPassword, newPassword });
      setMessage('Đổi mật khẩu thành công.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => navigate(ROUTES.PROFILE), 1500);
    } catch (error) {
      setErrors({ submit: error?.message || 'Đổi mật khẩu thất bại. Vui lòng thử lại.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-password-page">
      <div className="container">
        <h1 className="change-password-title">Đổi mật khẩu</h1>
        <div className="change-password-card">
          <p className="change-password-subtitle">
            Nhập mật khẩu hiện tại và mật khẩu mới để thay đổi.
          </p>
          <form onSubmit={handleSubmit} className="change-password-form">
            <Input
              label="Mật khẩu hiện tại"
              type="password"
              name="currentPassword"
              value={currentPassword}
              onChange={(e) => {
                setCurrentPassword(e.target.value);
                setErrors((prev) => ({ ...prev, currentPassword: '' }));
              }}
              error={errors.currentPassword}
              required
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
              label="Xác nhận mật khẩu mới"
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
            {errors.submit && <p className="change-password-error">{errors.submit}</p>}
            {message && <p className="change-password-success">{message}</p>}
            <div className="change-password-actions">
              <Button type="submit" variant="primary" size="large" loading={loading}>
                Đổi mật khẩu
              </Button>
              <Link to={ROUTES.PROFILE}>
                <Button type="button" variant="outline" size="large">
                  Hủy
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
