import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import '../Admin/Admin.css';

const Staff = () => {
  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-layout">
          <aside className="admin-sidebar">
            <nav>
              <ul>
                <li><Link to="/staff/orders">Đơn hàng</Link></li>
                <li><Link to="/staff/quotations">Báo giá</Link></li>
                <li><Link to="/staff/inventory">Tồn kho</Link></li>
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

export default Staff;

