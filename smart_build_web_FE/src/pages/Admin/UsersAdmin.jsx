import React, { useEffect, useState } from 'react';
import { getAllUsers, updateUser, deleteUser } from '../../services/admin.user.service';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input/Input.jsx';
import './Admin.css';
import { useNotification } from '../../components/common/NotificationCenter';
import { FiTrash2 } from 'react-icons/fi';

const UsersAdmin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');
  const { notifyError, notifySuccess, confirm } = useNotification();

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAllUsers();
      setUsers(res.data || []);
    } catch (err) {
      setError(err.message || 'Lỗi khi tải người dùng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (user, newRole) => {
    try {
      await updateUser(user._id || user.id, { ...user, role: newRole });
      fetchUsers();
    } catch (err) {
      notifyError(err.message || 'Cập nhật thất bại');
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
      notifyError(err.message || 'Xóa thất bại');
    }
  };

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(filter.toLowerCase()) ||
    u.email?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="admin-page-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Quản lý Người dùng</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <Input placeholder="Tìm tên hoặc email" value={filter} onChange={(e) => setFilter(e.target.value)} fullWidth={false} />
          <Button variant="outline-brown" onClick={fetchUsers}>Tải lại</Button>
        </div>
      </div>

      {loading ? <p>Đang tải...</p> : error ? <p style={{ color: 'var(--color-error)' }}>{error}</p> : (
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
              {filtered.map(u => (
                <tr key={u._id || u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Button variant="outline-brown" onClick={() => handleRoleChange(u, u.role === 'admin' ? 'customer' : 'admin')}>{u.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}</Button>
                      <Button variant="outline-danger" onClick={() => handleDelete(u)}>
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

export default UsersAdmin;
