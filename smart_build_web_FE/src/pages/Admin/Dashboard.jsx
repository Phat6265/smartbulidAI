import React, { useEffect, useState } from 'react';
import apiClient from '../../services/apiClient';
import { getMaterials } from '../../services/material.service';
import { getAllQuotations } from '../../services/quotation.service';
import Button from '../../components/common/Button';
import { formatCurrency } from '../../utils/formatCurrency';
import './Admin.css';
import { objectsToCSV, downloadCSV } from '../../utils/csv';

const Dashboard = () => {
  const [counts, setCounts] = useState({ materials: 0, orders: 0, users: 0, quotations: 0 });
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const materialsRes = await getMaterials();
        // Fetch all orders for dashboard (use high limit to get all)
        const ordersRes = await apiClient.get('/orders?limit=1000');
        const usersRes = await apiClient.get('/users');
        const quotationsRes = await getAllQuotations();

        // Handle paginated response from orders API
        const ordersArray = Array.isArray(ordersRes) 
          ? ordersRes 
          : (ordersRes?.orders || ordersRes?.data || []);
        
        setCounts({
          materials: (materialsRes.data || []).length,
          orders: ordersArray.length,
          users: (usersRes || []).length,
          quotations: (quotationsRes.data || []).length
        });

        // store orders for revenue report section
        setOrders(Array.isArray(ordersArray) ? ordersArray : []);
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
          <div className="dashboard-revenue-section">
            <div className="dashboard-section-header">
              <h3>Doanh thu dự kiến</h3>
            </div>
            
            <div className="dashboard-date-filter">
              <div className="dashboard-date-input-group">
                <label className="dashboard-date-label">
                  <span className="dashboard-date-label-text">Từ ngày</span>
                  <input 
                    type="date" 
                    className="dashboard-date-input"
                    value={fromDate} 
                    onChange={(e) => setFromDate(e.target.value)} 
                  />
                </label>
                <label className="dashboard-date-label">
                  <span className="dashboard-date-label-text">Đến ngày</span>
                  <input 
                    type="date" 
                    className="dashboard-date-input"
                    value={toDate} 
                    onChange={(e) => setToDate(e.target.value)} 
                  />
                </label>
              </div>
              <div className="dashboard-filter-actions">
                <Button variant="outline-brown" size="medium" onClick={() => { setFromDate(''); setToDate(''); }}>
                  Xóa bộ lọc
                </Button>
                <Button variant="outline-brown" size="medium" onClick={() => {
                  // export CSV of monthly breakdown for current filter
                  if (!Array.isArray(orders)) return;
                  const filtered = orders.filter(o => {
                    if (!fromDate && !toDate) return true;
                    const d = new Date(o.createdAt || Date.now());
                    if (fromDate) { if (d < new Date(fromDate)) return false; }
                    if (toDate) { const t = new Date(toDate); t.setHours(23,59,59,999); if (d > t) return false; }
                    return true;
                  });
                  const byMonthLocal = {};
                  filtered.forEach(o => {
                    const amount = parseFloat(o.totalAmount || o.total || o.totalPrice || 0) || 0;
                    const date = o.createdAt ? new Date(o.createdAt) : new Date();
                    const key = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}`;
                    byMonthLocal[key] = (byMonthLocal[key] || 0) + amount;
                  });
                  const rows = Object.keys(byMonthLocal).sort().map(k => ({ period: k, revenue: byMonthLocal[k] }));
                  const cols = [ { header: 'Period', accessor: 'period' }, { header: 'Revenue', accessor: 'revenue' } ];
                  const csv = objectsToCSV(rows, cols);
                  downloadCSV(`revenue-${Date.now()}.csv`, csv);
                }}>
                  📥 Xuất CSV
                </Button>
              </div>
            </div>

            <div className="dashboard-revenue-summary">
              <div className="dashboard-revenue-total">
                <span className="dashboard-revenue-label">Tổng doanh thu:</span>
                <span className="dashboard-revenue-value">
                  {formatCurrency(filteredOrdersTotal(orders, fromDate, toDate))}
                </span>
              </div>
            </div>

            {/* Biểu đồ cột doanh thu theo tháng */}
            <div className="dashboard-chart-section">
              <h4 className="dashboard-chart-title">Biểu đồ cột doanh thu theo tháng</h4>
              <div className="dashboard-chart-container">
                <BarChart data={filteredByMonth(orders, fromDate, toDate)} />
              </div>
            </div>

            {/* Biểu đồ tròn phân bổ số lượng: vật liệu / đơn hàng / báo giá */}
            <div className="dashboard-chart-section dashboard-pie-chart-section">
              <h4 className="dashboard-chart-title">Tỷ lệ số lượng</h4>
              <div className="dashboard-chart-container">
                <PieChart
                  data={[
                    { label: 'Vật liệu', value: counts.materials, color: '#d4a373' },
                    { label: 'Đơn hàng', value: counts.orders, color: '#a25f2a' },
                    { label: 'Báo giá', value: counts.quotations, color: '#8c4c1f' }
                  ]}
                />
              </div>
            </div>
          </div>
        )}
    
        {/* Revenue by material charts moved to separate admin route */}
    </div>
  );
};

  // helper to compute total for given date range
  function filteredOrdersTotal(orders, fromDate, toDate) {
    if (!Array.isArray(orders)) return 0;
    const filtered = orders.filter(o => {
      if (!fromDate && !toDate) return true;
      const d = new Date(o.createdAt || Date.now());
      if (fromDate) { if (d < new Date(fromDate)) return false; }
      if (toDate) { const t = new Date(toDate); t.setHours(23,59,59,999); if (d > t) return false; }
      return true;
    });
    // Order model uses totalAmount field
    return filtered.reduce((s, o) => s + (parseFloat(o.totalAmount || o.total || o.totalPrice || 0) || 0), 0);
  }

  function filteredByMonth(orders, fromDate, toDate) {
    if (!Array.isArray(orders)) return {};
    const filtered = orders.filter(o => {
      if (!fromDate && !toDate) return true;
      const d = new Date(o.createdAt || Date.now());
      if (fromDate) { if (d < new Date(fromDate)) return false; }
      if (toDate) { const t = new Date(toDate); t.setHours(23,59,59,999); if (d > t) return false; }
      return true;
    });
    const byMonth = {};
    filtered.forEach(o => {
      // Order model uses totalAmount field
      const amount = parseFloat(o.totalAmount || o.total || o.totalPrice || 0) || 0;
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
      return (
        <div className="dashboard-empty-state">
          <p>Chưa có dữ liệu doanh thu trong khoảng thời gian này.</p>
        </div>
      );
    }
    const max = Math.max(...entries.map(([, v]) => v));
    const minBarHeight = 20; // Minimum height in pixels for visibility
    const chartHeight = 300; // Chart container height in pixels
    
    // Calculate Y-axis scale values
    const yAxisSteps = 5;
    const yAxisMax = max > 0 ? Math.ceil(max / 1000000) * 1000000 : 1000000; // Round up to nearest million
    const yAxisValues = [];
    for (let i = 0; i <= yAxisSteps; i++) {
      yAxisValues.push((yAxisMax / yAxisSteps) * i);
    }
    
    return (
      <div className="admin-bar-chart-container">
        {/* Y-axis */}
        <div className="admin-bar-chart-y-axis">
          {yAxisValues.reverse().map((val, idx) => (
            <div key={idx} className="admin-bar-chart-y-label">
              <span className="admin-bar-chart-y-value">
                {val >= 1000000 ? `${(val / 1000000).toFixed(1)}M` : val >= 1000 ? `${(val / 1000).toFixed(0)}K` : val.toLocaleString()}
              </span>
              <span className="admin-bar-chart-y-line"></span>
            </div>
          ))}
        </div>
        
        {/* Chart area */}
        <div className="admin-bar-chart">
          {entries.map(([label, value]) => {
            // Calculate height with minimum visibility
            const heightPercent = max > 0 ? (value / max) * 100 : 0;
            const actualHeight = Math.max(
              (heightPercent / 100) * (chartHeight - 60), // Account for padding
              minBarHeight // Minimum height for visibility
            );
            
            return (
              <div key={label} className="admin-bar-chart-item">
                <div className="admin-bar-chart-bar-wrapper" style={{ height: `${chartHeight - 60}px` }}>
                  <div
                    className="admin-bar-chart-bar"
                    style={{ 
                      height: `${actualHeight}px`,
                      minHeight: `${minBarHeight}px`
                    }}
                    title={formatCurrency(value)}
                  />
                  <div className="admin-bar-chart-tooltip">
                    {formatCurrency(value)}
                  </div>
                </div>
                <div className="admin-bar-chart-label">{label}</div>
              </div>
            );
          })}
        </div>
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
