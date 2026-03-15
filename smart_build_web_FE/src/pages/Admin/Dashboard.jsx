import React, { useEffect, useState } from 'react';
import apiClient from '../../services/apiClient';
import { getMaterials } from '../../services/material.service';
import { getAllQuotations } from '../../services/quotation.service';
import './Admin.css';
import { objectsToCSV, downloadCSV } from '../../utils/csv';

const Dashboard = () => {
  const [counts, setCounts] = useState({ materials: 0, orders: 0, users: 0, quotations: 0 });
  const [loading, setLoading] = useState(true);
  const [revenue, setRevenue] = useState({ total: 0, byMonth: {} });
  const [orders, setOrders] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const materialsRes = await getMaterials();
        const ordersRes = await apiClient.get('/orders');
        const usersRes = await apiClient.get('/users');
        const quotationsRes = await getAllQuotations();

        const ordersArray = ordersRes?.orders || [];
        setCounts({
          materials: (materialsRes.data || []).length,
          orders: ordersArray.length,
          users: (usersRes || []).length,
          quotations: (quotationsRes.data || []).length
        });

        // store orders and compute revenue summary from orders
        setOrders(ordersArray);
        let total = 0;
        const byMonth = {};
        ordersArray.forEach(o => {
          const amount = parseFloat(o.total || o.totalPrice || 0) || 0;
          total += amount;
          const date = o.createdAt ? new Date(o.createdAt) : new Date();
          const key = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}`;
          byMonth[key] = (byMonth[key] || 0) + amount;
        });
        setRevenue({ total, byMonth });
      } catch (err) {
        console.error('Failed to fetch dashboard counts', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCounts();
  }, []);

  return (
    <div className="admin-dashboard">
      <h2>Dashboard</h2>
      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <div className="admin-dashboard-cards">
          <div className="admin-card">
            <div className="admin-card-title">Vật liệu</div>
            <div className="admin-card-value">{counts.materials}</div>
          </div>
          <div className="admin-card">
            <div className="admin-card-title">Đơn hàng</div>
            <div className="admin-card-value">{counts.orders}</div>
          </div>
          <div className="admin-card">
            <div className="admin-card-title">Người dùng</div>
            <div className="admin-card-value">{counts.users}</div>
          </div>
          <div className="admin-card">
            <div className="admin-card-title">Báo giá</div>
            <div className="admin-card-value">{counts.quotations}</div>
          </div>
        </div>
      )}

        {!loading && (
          <div style={{ marginTop: 24 }}>
            <h3>Doanh thu dự kiến</h3>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
              <label>From: <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} /></label>
              <label>To: <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} /></label>
              <button className="btn btn-outline" onClick={() => { setFromDate(''); setToDate(''); }}>Clear</button>
              <button className="btn btn-primary" onClick={() => {
                // recompute revenue based on date range below when rendering
              }}>Apply</button>
              <button className="btn btn-outline" onClick={() => {
                // export CSV of monthly breakdown for current filter
                const filtered = orders.filter(o => {
                  if (!fromDate && !toDate) return true;
                  const d = new Date(o.createdAt || Date.now());
                  if (fromDate) { if (d < new Date(fromDate)) return false; }
                  if (toDate) { const t = new Date(toDate); t.setHours(23,59,59,999); if (d > t) return false; }
                  return true;
                });
                const byMonthLocal = {};
                filtered.forEach(o => {
                  const amount = parseFloat(o.total || o.totalPrice || 0) || 0;
                  const date = o.createdAt ? new Date(o.createdAt) : new Date();
                  const key = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}`;
                  byMonthLocal[key] = (byMonthLocal[key] || 0) + amount;
                });
                const rows = Object.keys(byMonthLocal).sort().map(k => ({ period: k, revenue: byMonthLocal[k] }));
                const cols = [ { header: 'Period', accessor: 'period' }, { header: 'Revenue', accessor: 'revenue' } ];
                const csv = objectsToCSV(rows, cols);
                downloadCSV(`revenue-${Date.now()}.csv`, csv);
              }}>Export CSV</button>
            </div>
            <p>Tổng: {filteredOrdersTotal(orders, fromDate, toDate).toLocaleString()}</p>

            {/* Biểu đồ cột doanh thu theo tháng */}
            <div style={{ marginTop: 16 }}>
              <h4 style={{ marginBottom: 8 }}>Biểu đồ cột doanh thu theo tháng</h4>
              <BarChart data={filteredByMonth(orders, fromDate, toDate)} />
            </div>

            {/* Biểu đồ tròn phân bổ số lượng: vật liệu / đơn hàng / báo giá */}
            <div style={{ marginTop: 24, maxWidth: 420 }}>
              <h4 style={{ marginBottom: 8 }}>Tỷ lệ số lượng (pie chart)</h4>
              <PieChart
                data={[
                  { label: 'Vật liệu', value: counts.materials, color: '#d4a373' },
                  { label: 'Đơn hàng', value: counts.orders, color: '#a25f2a' },
                  { label: 'Báo giá', value: counts.quotations, color: '#8c4c1f' }
                ]}
              />
            </div>
          </div>
        )}
    
        {/* Revenue by material charts moved to separate admin route */}
    </div>
  );
};

  // helper to compute total for given date range
  function filteredOrdersTotal(orders, fromDate, toDate) {
    const filtered = orders.filter(o => {
      if (!fromDate && !toDate) return true;
      const d = new Date(o.createdAt || Date.now());
      if (fromDate) { if (d < new Date(fromDate)) return false; }
      if (toDate) { const t = new Date(toDate); t.setHours(23,59,59,999); if (d > t) return false; }
      return true;
    });
    return filtered.reduce((s, o) => s + (parseFloat(o.total || o.totalPrice || 0) || 0), 0);
  }

  function filteredByMonth(orders, fromDate, toDate) {
    const filtered = orders.filter(o => {
      if (!fromDate && !toDate) return true;
      const d = new Date(o.createdAt || Date.now());
      if (fromDate) { if (d < new Date(fromDate)) return false; }
      if (toDate) { const t = new Date(toDate); t.setHours(23,59,59,999); if (d > t) return false; }
      return true;
    });
    const byMonth = {};
    filtered.forEach(o => {
      const amount = parseFloat(o.total || o.totalPrice || 0) || 0;
      const date = o.createdAt ? new Date(o.createdAt) : new Date();
      const key = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}`;
      byMonth[key] = (byMonth[key] || 0) + amount;
    });
    return byMonth;
  }

  // Biểu đồ cột đơn giản bằng div, không dùng thư viện ngoài
  const BarChart = ({ data }) => {
    const entries = Object.entries(data || {}).sort((a, b) => a[0].localeCompare(b[0]));
    if (!entries.length) {
      return <p style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>Chưa có dữ liệu doanh thu trong khoảng thời gian này.</p>;
    }
    const max = Math.max(...entries.map(([, v]) => v));
    return (
      <div className="admin-bar-chart">
        {entries.map(([label, value]) => (
          <div key={label} className="admin-bar-chart-item">
            <div
              className="admin-bar-chart-bar"
              style={{ height: `${(value / max) * 100 || 0}%` }}
            />
            <div className="admin-bar-chart-label">{label}</div>
            <div className="admin-bar-chart-value">{value.toLocaleString()}</div>
          </div>
        ))}
      </div>
    );
  };

  // Biểu đồ tròn đơn giản bằng SVG
  const PieChart = ({ data }) => {
    const total = data.reduce((s, d) => s + (d.value || 0), 0);
    if (!total) {
      return <p style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>Chưa có dữ liệu để vẽ biểu đồ.</p>;
    }

    let cumulative = 0;
    const radius = 60;
    const circumference = 2 * Math.PI * radius;

    const segments = data.map((d) => {
      const value = d.value || 0;
      const fraction = value / total;
      const offset = cumulative;
      cumulative += fraction;
      return { ...d, fraction, offset };
    });

    return (
      <div className="admin-pie-chart-wrapper">
        <svg width="160" height="160" viewBox="0 0 160 160" className="admin-pie-chart">
          <g transform="translate(80,80)">
            {segments.map((seg, idx) => (
              <circle
                key={seg.label}
                r={radius}
                cx="0"
                cy="0"
                fill="transparent"
                stroke={seg.color}
                strokeWidth="32"
                strokeDasharray={`${seg.fraction * circumference} ${circumference}`}
                strokeDashoffset={-seg.offset * circumference}
              />
            ))}
          </g>
        </svg>
        <ul className="admin-pie-chart-legend">
          {segments.map(seg => (
            <li key={seg.label}>
              <span className="legend-color" style={{ backgroundColor: seg.color }} />
              <span>{seg.label}</span>
              <span style={{ marginLeft: 'auto' }}>{seg.value}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

export default Dashboard;
