import React, { useEffect, useState } from 'react';
import apiClient from '../../services/apiClient';
import { updateOrderStatus } from '../../services/order.service';
import Button from '../../components/common/Button';
import './Admin.css';
import { objectsToCSV, downloadCSV } from '../../utils/csv';
import { useNotification } from '../../components/common/NotificationCenter';
import { FiEye, FiCheckCircle, FiTruck, FiXCircle } from 'react-icons/fi';

const OrdersAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { notifyError, notifySuccess, confirm } = useNotification();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/orders');
      const data = Array.isArray(res) ? res : (res.data || []);
      setOrders(data.map(o => (o.id && !o._id ? { ...o, _id: o.id } : o)));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orders, fromDate, toDate]);

  const applyFilters = () => {
    let list = [...orders];
    if (fromDate) {
      const f = new Date(fromDate);
      list = list.filter(o => new Date(o.createdAt || Date.now()) >= f);
    }
    if (toDate) {
      const t = new Date(toDate);
      // include the whole day
      t.setHours(23,59,59,999);
      list = list.filter(o => new Date(o.createdAt || Date.now()) <= t);
    }
    setFilteredOrders(list);
  };

  const changeStatus = async (orderId, status) => {
    try {
      const ok = await confirm({
        title: 'Xác nhận cập nhật trạng thái đơn hàng',
        message: `Bạn có chắc muốn chuyển trạng thái đơn hàng sang "${status}"?`
      });
      if (!ok) return;
      await updateOrderStatus(orderId, status);
      notifySuccess('Cập nhật trạng thái đơn hàng thành công');
      fetchOrders();
    } catch (err) {
      notifyError(err.message || 'Cập nhật thất bại');
    }
  };

  const exportRevenueCSV = () => {
    const cols = [
      { header: 'Mã', accessor: (o) => o._id || o.id },
      { header: 'Khách', accessor: (o) => o.customerName || o.customer?.name || o.customerId },
      { header: 'Trạng thái', accessor: 'status' },
      { header: 'Tổng', accessor: (o) => o.total || o.totalPrice || 0 },
      { header: 'Ngày', accessor: (o) => o.createdAt }
    ];
    const csv = objectsToCSV(filteredOrders.length ? filteredOrders : orders, cols);
    downloadCSV(`orders-revenue-${Date.now()}.csv`, csv);
  };

  return (
    <div className="admin-page-section">
      <h2>Quản lý Đơn hàng</h2>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
        <label>From: <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} /></label>
        <label>To: <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} /></label>
        <Button variant="outline-brown" onClick={() => { setFromDate(''); setToDate(''); setFilteredOrders(orders); }}>Clear</Button>
        <Button variant="outline-brown" onClick={exportRevenueCSV}>Export CSV</Button>
      </div>
      {loading ? <p>Đang tải...</p> : (
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Mã</th>
                <th>Khách</th>
                <th>Trạng thái</th>
                <th>Tổng</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {(filteredOrders.length ? filteredOrders : orders).map(o => (
                <tr key={o._id || o.id}>
                  <td>{o._id || o.id}</td>
                  <td>{o.customerName || o.customer?.name || o.customerId}</td>
                  <td>{o.status}</td>
                  <td>{o.total || o.totalPrice || '-'}</td>
                  <td>
                    <Button variant="outline-brown" onClick={() => setSelectedOrder(o)}>
                      <FiEye style={{ marginRight: 4 }} /> Chi tiết
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedOrder && (
        <div className="admin-modal">
          <div className="admin-modal-content" style={{ maxWidth: 720 }}>
            <h3>Chi tiết đơn hàng</h3>
            <p><strong>Mã:</strong> {selectedOrder._id || selectedOrder.id}</p>
            <p><strong>Khách:</strong> {selectedOrder.customerName || selectedOrder.customer?.name || selectedOrder.customerId}</p>
            <p><strong>Địa chỉ giao:</strong> {selectedOrder.shippingAddress || '-'}</p>
            <p><strong>Điện thoại:</strong> {selectedOrder.phone || '-'}</p>
            <p><strong>Ghi chú:</strong> {selectedOrder.note || '-'}</p>
            <p><strong>Trạng thái:</strong> {selectedOrder.status}</p>
            <p><strong>Ngày tạo:</strong> {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString() : '-'}</p>

            <h4 style={{ marginTop: 16 }}>Danh sách vật liệu</h4>
            <div style={{ maxHeight: 260, overflowY: 'auto', marginTop: 8 }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Tên vật liệu</th>
                    <th>Số lượng</th>
                    <th>Đơn giá</th>
                  </tr>
                </thead>
                <tbody>
                  {(selectedOrder.items || []).map((item, idx) => (
                    <tr key={item.materialId || idx}>
                      <td>{item.name}</td>
                      <td>{item.quantity}</td>
                      <td>{item.price || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
              <strong>Tổng tiền:</strong>
              <span>{(selectedOrder.totalAmount || selectedOrder.total || selectedOrder.totalPrice || 0).toLocaleString()}</span>
            </div>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between', marginTop: 16 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <Button variant="outline-brown" onClick={() => changeStatus(selectedOrder._id || selectedOrder.id, 'paid_deposit')}>
                  <FiCheckCircle style={{ marginRight: 4 }} /> Đã đặt cọc
                </Button>
                <Button variant="outline-brown" onClick={() => changeStatus(selectedOrder._id || selectedOrder.id, 'shipped')}>
                  <FiTruck style={{ marginRight: 4 }} /> Đã giao
                </Button>
                <Button variant="outline-danger" onClick={() => changeStatus(selectedOrder._id || selectedOrder.id, 'cancelled')}>
                  <FiXCircle style={{ marginRight: 4 }} /> Hủy
                </Button>
              </div>
              <Button variant="outline-brown" type="button" onClick={() => setSelectedOrder(null)}>Đóng</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersAdmin;
