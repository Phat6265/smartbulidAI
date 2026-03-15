// ===== NEW FILE CREATED FOR ADMIN USER CRUD FEATURE =====
import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import useUserStore from '../../store/user.store';
import { formatDateOfBirth } from '../../utils/formatDateOfBirth';
import Button from '../../components/common/Button';
import './Admin.css';

const AdminUserDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedUser, loading, error, fetchUserById, clearSelectedUser } = useUserStore();

  useEffect(() => {
    if (id) fetchUserById(id).catch(() => {});
    return () => clearSelectedUser();
  }, [id, fetchUserById, clearSelectedUser]);

  if (loading && !selectedUser) return <div className="admin-page-section">Đang tải...</div>;
  if (error && !selectedUser) return <div className="admin-page-section" style={{ color: 'var(--color-error)' }}>{error}</div>;
  if (!selectedUser) return <div className="admin-page-section">Không tìm thấy người dùng.</div>;

  const u = selectedUser;
  return (
    <div className="admin-page-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Chi tiết người dùng</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link to={`/admin/users/${u._id || u.id}/edit`}>
            <Button variant="primary">Chỉnh sửa</Button>
          </Link>
          <Button variant="outline" onClick={() => navigate('/admin/users')}>Quay lại</Button>
        </div>
      </div>
      <div style={{ maxWidth: 560, background: 'var(--color-bg-secondary)', padding: '1.5rem', borderRadius: 8, border: '1px solid var(--color-border)' }}>
        {u.avatarUrl && (
          <p style={{ marginBottom: 8 }}>
            <img src={u.avatarUrl} alt="" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover' }} />
          </p>
        )}
        <p><strong>Tên:</strong> {u.name}</p>
        <p><strong>Email:</strong> {u.email}</p>
        <p><strong>Vai trò:</strong> {u.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}</p>
        <p><strong>Số điện thoại:</strong> {u.phone || '—'}</p>
        <p><strong>Địa chỉ:</strong> {u.address || '—'}</p>
        <p><strong>Ngày sinh:</strong> {formatDateOfBirth(u.dateOfBirth)}</p>
      </div>
    </div>
  );
};

export default AdminUserDetailPage;
