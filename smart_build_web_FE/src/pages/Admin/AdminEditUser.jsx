// ===== NEW FILE CREATED FOR ADMIN USER CRUD FEATURE =====
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import useUserStore from '../../store/user.store';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import './Admin.css';

const AdminEditUserPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedUser, loading, error, fetchUserById, updateUser, clearSelectedUser } = useUserStore();
  const [formData, setFormData] = useState({ name: '', role: 'customer', phone: '', address: '', dateOfBirth: '' });
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (id) fetchUserById(id).catch(() => {});
    return () => clearSelectedUser();
  }, [id, fetchUserById, clearSelectedUser]);

  useEffect(() => {
    if (selectedUser) {
      setFormData({
        name: selectedUser.name || '',
        role: selectedUser.role || 'customer',
        phone: selectedUser.phone || '',
        address: selectedUser.address || '',
        dateOfBirth: selectedUser.dateOfBirth ? new Date(selectedUser.dateOfBirth).toISOString().slice(0, 10) : ''
      });
    }
  }, [selectedUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSubmitError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    try {
      await updateUser(id, {
        name: formData.name.trim(),
        role: formData.role,
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        dateOfBirth: formData.dateOfBirth || null
      });
      navigate(`/admin/users/${id}`);
    } catch (err) {
      setSubmitError(err?.message || 'Cập nhật thất bại');
    }
  };

  if (loading && !selectedUser) return <div className="admin-page-section">Đang tải...</div>;
  if (error && !selectedUser) return <div className="admin-page-section" style={{ color: 'var(--color-error)' }}>{error}</div>;
  if (!selectedUser) return <div className="admin-page-section">Không tìm thấy người dùng.</div>;

  return (
    <div className="admin-page-section">
      <h2 style={{ marginBottom: '1.5rem' }}>Chỉnh sửa người dùng</h2>
      {(error || submitError) && <p style={{ color: 'var(--color-error)', marginBottom: 8 }}>{submitError || error}</p>}
      <form onSubmit={handleSubmit} style={{ maxWidth: 400, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Input label="Họ và tên" name="name" value={formData.name} onChange={handleChange} fullWidth />
        <p><strong>Email:</strong> {selectedUser.email}</p>
        <div>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Vai trò</label>
          <select name="role" value={formData.role} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', borderRadius: 4 }}>
            <option value="customer">Khách hàng</option>
            <option value="admin">Quản trị viên</option>
          </select>
        </div>
        <Input label="Số điện thoại" name="phone" value={formData.phone} onChange={handleChange} fullWidth />
        <Input label="Địa chỉ" name="address" value={formData.address} onChange={handleChange} fullWidth />
        <Input label="Ngày sinh" type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} fullWidth />
        <div style={{ display: 'flex', gap: 8 }}>
          <Button type="submit" variant="primary" loading={loading}>Lưu thay đổi</Button>
          <Link to={`/admin/users/${id}`}><Button type="button" variant="outline">Hủy</Button></Link>
        </div>
      </form>
    </div>
  );
};

export default AdminEditUserPage;
