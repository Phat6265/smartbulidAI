import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, PieChart, Pie, Tooltip, Cell, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import apiClient from '../../services/apiClient';
import { getMaterials } from '../../services/material.service';
import { objectsToCSV, downloadCSV } from '../../utils/csv';

const COLORS = ['#5A3E2B', '#D4A373', '#C18F59', '#6B5E53', '#A67C52', '#8B5A2B', '#BC8F8F', '#DEB887', '#CD853F', '#A0522D'];

const RevenueReport = () => {
  const [materials, setMaterials] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [mRes, oRes, uRes] = await Promise.all([
          getMaterials(),
          apiClient.get('/orders'),
          apiClient.get('/users')
        ]);

        const mats = (mRes.data || []).map(m => ({ id: m._id || m.id, name: m.name }));
        setMaterials(mats);

        const ordersArray = Array.isArray(oRes) ? oRes : (oRes.data || []);
        setOrders(ordersArray);

        const usersArray = Array.isArray(uRes) ? uRes : (uRes.data || []);
        setUsers(usersArray);
      } catch (err) {
        console.error('Failed to fetch revenue data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredOrders = orders.filter(o => {
    if (!fromDate && !toDate) return true;
    const d = new Date(o.createdAt || Date.now());
    if (fromDate && d < new Date(fromDate)) return false;
    if (toDate) {
      const t = new Date(toDate);
      t.setHours(23, 59, 59, 999);
      if (d > t) return false;
    }
    return true;
  });

  const totalRevenue = filteredOrders.reduce((sum, o) => sum + (parseFloat(o.totalAmount || 0)), 0);
  const totalOrders = filteredOrders.length;
  const totalCustomers = users.filter(u => u.role === 'customer').length;

  const computeByMaterial = () => {
    const map = {};
    filteredOrders.forEach(o => {
      (o.items || []).forEach(item => {
        const id = item.materialId || item.id || item._id;
        const name = item.name || (materials.find(m => m.id == id)?.name) || `#${id}`;
        const price = parseFloat(item.price || item.unitPrice || 0);
        const qty = parseFloat(item.quantity || 1);
        const amount = price * qty;
        if (!map[name]) map[name] = 0;
        map[name] += amount;
      });
    });
    const arr = Object.keys(map).map((k) => ({ name: k, value: map[k] }));
    arr.sort((a, b) => b.value - a.value);
    return arr;
  };

  const computeByStatus = () => {
    const map = {};
    filteredOrders.forEach(o => {
      const status = o.status || 'unknown';
      if (!map[status]) map[status] = 0;
      map[status]++;
    });
    return Object.keys(map).map(k => ({ name: k, value: map[k] }));
  };

  const materialData = computeByMaterial();
  const statusData = computeByStatus();

  const exportCSV = () => {
    const cols = [{ header: 'Material', accessor: 'name' }, { header: 'Revenue', accessor: 'value' }];
    const csv = objectsToCSV(materialData, cols);
    downloadCSV(`revenue-by-material-${Date.now()}.csv`, csv);
  };

  if (loading) return <p>Đang tải báo cáo...</p>;

  return (
    <div style={{ marginTop: 24 }}>
      <h2 style={{ marginBottom: 24, textAlign: 'center' }}>Báo cáo Tổng quan</h2>

      {/* Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 32 }}>
        <div style={{ padding: 24, borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-primary)', textAlign: 'left', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 'bold' }}>Tổng doanh thu</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 'bold', marginTop: 12, color: 'var(--color-primary)' }}>{totalRevenue.toLocaleString()} VNĐ</div>
        </div>
        <div style={{ padding: 24, borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-primary)', textAlign: 'left', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 'bold' }}>Tổng đơn hàng</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 'bold', marginTop: 12, color: 'var(--color-primary)' }}>{totalOrders}</div>
        </div>
        <div style={{ padding: 24, borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-primary)', textAlign: 'left', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 'bold' }}>Khách hàng</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 'bold', marginTop: 12, color: 'var(--color-primary)' }}>{totalCustomers}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 24, justifyContent: 'center', backgroundColor: 'var(--color-bg-secondary)', padding: 16, borderRadius: 12 }}>
        <label>Từ: <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} /></label>
        <label>Đến: <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} /></label>
        <button className="btn btn-outline" onClick={() => { setFromDate(''); setToDate(''); }}>Xóa lọc</button>
        <button className="btn btn-primary" onClick={exportCSV}>Xuất CSV</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
        {/* Pie Chart: Status */}
        <div style={{ border: '1px solid var(--color-border)', borderRadius: 12, padding: 20, background: 'var(--color-bg-primary)', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <h4 style={{ marginBottom: 16 }}>Trạng thái đơn hàng (Số lượng)</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={(entry) => `${entry.name}: ${entry.value}`}>
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart: Revenue sharing */}
        <div style={{ border: '1px solid var(--color-border)', borderRadius: 12, padding: 20, background: 'var(--color-bg-primary)', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <h4 style={{ marginBottom: 16 }}>Tỷ trọng doanh thu theo vật tư</h4>
          {materialData.length === 0 ? <p>Không có dữ liệu</p> : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={materialData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} labelLine={false} label={(entry) => `${entry.name.substring(0, 10)}...`}>
                  {materialData.map((entry, index) => (
                    <Cell key={`cell-m-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => value.toLocaleString()} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Bar Chart: Revenue */}
        <div style={{ border: '1px solid var(--color-border)', borderRadius: 12, padding: 20, background: 'var(--color-bg-primary)', gridColumn: 'span 2', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <h4 style={{ marginBottom: 16 }}>Doanh thu chi tiết theo vật tư</h4>
          {materialData.length === 0 ? <p>Không có dữ liệu</p> : (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={materialData} margin={{ top: 20, right: 30, left: 40, bottom: 100 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  interval={0}
                  height={100}
                  tick={{ fontSize: 12 }}
                />
                <YAxis tickFormatter={(value) => (value / 1000000).toFixed(1) + 'M'} />
                <Tooltip formatter={(value) => value.toLocaleString() + ' VNĐ'} />
                <Bar dataKey="value" fill="#4D96FF" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default RevenueReport;
