import React from 'react';
import './AdminFooter.css';

const AdminFooter = () => {
  return (
    <footer className="admin-footer">
      <div className="container" style={{ textAlign: 'center' }}>
        <p>© {new Date().getFullYear()} SmartBuild Project - Hệ thống quản lý vật liệu xây dựng</p>
      </div>
    </footer>
  );
};

export default AdminFooter;
