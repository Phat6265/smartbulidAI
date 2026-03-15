// ===== MODIFIED START (ADMIN USER CRUD FEATURE) =====
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useUserStore from '../../store/user.store';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import './Admin.css';
import { useNotification } from '../../components/common/NotificationCenter';
import { FiTrash2, FiEdit2, FiEye } from 'react-icons/fi';

const AdminUserListPage = () => {
  const [filter, setFilter] = useState('');
  const { users, loading, error, fetchUsers, updateUser, deleteUser } = useUserStore();
  const { notifyError, confirm } = useNotification();

  useEffect(() => {
    fetchUsers().catch(() => {});
  }, [fetchUsers]);

  const handleRoleChange = async (user, newRole) => {
    try {
      await updateUser(user._id || user.id, { ...user, role: newRole });
      fetchUsers();
    } catch (err) {
      notifyError(err?.message || 'Cập nhật thất bại');
    }
  };

  const handleDelete = async (user) => {
    const ok = await confirm({
      title: 'Xác nhận xóa người dùng',
      message: `Bạn có chắc chắn muốn xóa người dùng ${user.name}?`
    });
    if (!ok) return;
    try {
      await deleteUser(user._id || user.id);
      fetchUsers();
    } catch (err) {
      notifyError(err?.message || 'Xóa thất bại');
    }
  };

  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(filter.toLowerCase()) ||
      u.email?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="admin-page-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Quản lý Người dùng</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <Input placeholder="Tìm tên hoặc email" value={filter} onChange={(e) => setFilter(e.target.value)} fullWidth={false} />
          <Link to="/admin/users/new">
            <Button variant="primary">Tạo người dùng</Button>
          </Link>
          <Button variant="outline" onClick={() => fetchUsers()}>Tải lại</Button>
        </div>
      </div>

      {loading ? (
        <p>Đang tải...</p>
      ) : error ? (
        <p style={{ color: 'var(--color-error)' }}>{error}</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Tên</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u._id || u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <Link to={`/admin/users/${u._id || u.id}`}>
                        <Button variant="outline" size="small"><FiEye style={{ marginRight: 4 }} /> Xem</Button>
                      </Link>
                      <Link to={`/admin/users/${u._id || u.id}/edit`}>
                        <Button variant="outline" size="small"><FiEdit2 style={{ marginRight: 4 }} /> Sửa</Button>
                      </Link>
                      <Button variant="outline" size="small" onClick={() => handleRoleChange(u, u.role === 'admin' ? 'customer' : 'admin')}>
                        {u.role === 'admin' ? 'Bỏ Admin' : 'Thêm Admin'}
                      </Button>
                      <Button variant="outline" size="small" onClick={() => handleDelete(u)}>
                        <FiTrash2 style={{ marginRight: 4 }} /> Xóa
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUserListPage;
// ===== MODIFIED END (ADMIN USER CRUD FEATURE) =====
