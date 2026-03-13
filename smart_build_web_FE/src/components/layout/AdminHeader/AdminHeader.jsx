import React from 'react';
import './AdminHeader.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import logo from '../../../assets/icon/logo.png';

const AdminHeader = () => {
  const { user, logout } = useAuth();

  return (
    <header className="admin-topbar">
      <div className="admin-topbar-inner container">
        <Link to="/admin/dashboard" className="admin-logo">
          <img src={logo} alt="SmartBuild" style={{ height: '45px', objectFit: 'contain' }} />
        </Link>
        <div className="admin-top-actions">
          <span className="admin-user">{user?.name || 'Quản trị viên'}</span>
          <button className="admin-logout" onClick={logout}>Đăng xuất</button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
