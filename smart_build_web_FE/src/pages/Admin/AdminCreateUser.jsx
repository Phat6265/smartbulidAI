// ===== NEW FILE CREATED FOR ADMIN USER CRUD FEATURE =====
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useUserStore from '../../store/user.store';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { isValidEmail, isValidPassword } from '../../utils/validators';
import './Admin.css';

const AdminCreateUserPage = () => {
  const navigate = useNavigate();
  const { createUser, loading, error } = useUserStore();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'customer' });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const next = {};
    if (!formData.name?.trim()) next.name = 'Tên không được để trống';
    if (!isValidEmail(formData.email)) next.email = 'Email không hợp lệ';
    if (!isValidPassword(formData.password)) next.password = 'Mật khẩu tối thiểu 6 ký tự';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await createUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role
      });
      navigate('/admin/users');
    } catch (err) {
      setErrors({ submit: err?.message || 'Tạo thất bại' });
    }
  };

  return (
    <div className="admin-page-section">
      <h2 style={{ marginBottom: '1.5rem' }}>Tạo người dùng mới</h2>
      {error && <p style={{ color: 'var(--color-error)', marginBottom: 8 }}>{error}</p>}
      {errors.submit && <p style={{ color: 'var(--color-error)', marginBottom: 8 }}>{errors.submit}</p>}
      <form onSubmit={handleSubmit} style={{ maxWidth: 400, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Input label="Họ và tên" name="name" value={formData.name} onChange={handleChange} error={errors.name} required fullWidth />
        <Input label="Email" type="email" name="email" value={formData.email} onChange={handleChange} error={errors.email} required fullWidth />
        <Input label="Mật khẩu" type="password" name="password" value={formData.password} onChange={handleChange} error={errors.password} required fullWidth />
        <div>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Vai trò</label>
          <select name="role" value={formData.role} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', borderRadius: 4 }}>
            <option value="customer">Khách hàng</option>
            <option value="admin">Quản trị viên</option>
          </select>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button type="submit" variant="primary" loading={loading}>Tạo người dùng</Button>
          <Link to="/admin/users"><Button type="button" variant="outline">Hủy</Button></Link>
        </div>
      </form>
    </div>
  );
};

export default AdminCreateUserPage;
