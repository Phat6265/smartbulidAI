// Admin Page
import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import './Admin.css';

const Admin = () => {
  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-layout">
          <aside className="admin-sidebar">
            <nav>
              <ul>
                <li><Link to="/admin/dashboard">Dashboard</Link></li>
                <li><Link to="/admin/materials">Vật liệu</Link></li>
                <li><Link to="/admin/orders">Đơn hàng</Link></li>
                <li><Link to="/admin/quotations">Báo giá</Link></li>
                <li><Link to="/admin/revenue-report">Báo cáo doanh thu</Link></li>
                <li><Link to="/admin/users">Người dùng</Link></li>
                <li><Link to="/admin/settings">Cài đặt</Link></li>
              </ul>
            </nav>
          </aside>
          <section className="admin-content">
            <Outlet />
          </section>
        </div>
      </div>
    </div>
  );
};

export default Admin;

