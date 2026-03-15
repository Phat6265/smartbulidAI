import React, { useEffect, useState } from 'react';
import apiClient from '../../services/apiClient';
import { updateOrderStatus } from '../../services/order.service';
import Button from '../../components/common/Button';
import { useAuth } from '../../hooks/useAuth';
import './Admin.css';
import { objectsToCSV, downloadCSV } from '../../utils/csv';
import { useNotification } from '../../components/common/NotificationCenter';
import { FiEye, FiCheckCircle, FiCheck, FiTruck, FiXCircle } from 'react-icons/fi';

const PAGE_SIZE = 10;

const STATUS_LABELS = {
  pending_payment: 'Chờ thanh toán',
  approved: 'Đã duyệt',
  paid_deposit: 'Đã đặt cọc',
  shipped: 'Đã giao',
  delivered: 'Đã giao đến',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy'
};

const OrdersAdmin = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { notifyError, notifySuccess, confirm } = useNotification();

  const fetchOrders = async (pageNum = page) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(pageNum), limit: String(PAGE_SIZE) });
      if (fromDate) params.set('fromDate', fromDate);
      if (toDate) params.set('toDate', toDate);
      const res = await apiClient.get(`/orders?${params.toString()}`);
      const list = res?.orders ?? (Array.isArray(res) ? res : res?.data ?? []);
      setOrders(list.map(o => (o.id && !o._id ? { ...o, _id: o.id } : o)));
      setTotal(res?.total ?? list.length);
      setTotalPages(res?.totalPages ?? 1);
      setPage(res?.page ?? pageNum);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromDate, toDate]);

  const goToPage = (p) => {
    const next = Math.max(1, Math.min(p, totalPages));
    setPage(next);
    fetchOrders(next);
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
      fetchOrders(page);
    } catch (err) {
      notifyError(err.message || 'Cập nhật thất bại');
    }
  };

  const exportToCSV = () => {
    const cols = [
      { header: 'Mã đơn', accessor: (o) => o._id || o.id },
      { header: 'Khách hàng', accessor: (o) => o.customerName || o.customer?.name || o.customerId },
      { header: 'Trạng thái', accessor: (o) => STATUS_LABELS[o.status] ?? o.status },
      { header: 'Tổng tiền', accessor: (o) => o.totalAmount ?? o.total ?? o.totalPrice ?? 0 },
      { header: 'Ngày tạo', accessor: (o) => o.createdAt ? new Date(o.createdAt).toLocaleString('vi-VN') : '' }
    ];
    const csv = objectsToCSV(orders, cols);
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10);
    const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, '');
    downloadCSV(`don-hang_${dateStr}_${timeStr}.csv`, csv);
  };

  return (
    <div className="admin-page-section">
      <h2>Quản lý Đơn hàng</h2>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
        <label>From: <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} /></label>
        <label>To: <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} /></label>
        <Button variant="outline-brown" onClick={() => { setFromDate(''); setToDate(''); }}>Clear</Button>
        <Button variant="outline-brown" onClick={exportToCSV}>Export CSV</Button>
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
              {orders.map(o => (
                <tr key={o._id || o.id}>
                  <td>{o._id || o.id}</td>
                  <td>{o.customerName || o.customer?.name || o.customerId}</td>
                  <td>{STATUS_LABELS[o.status] ?? o.status}</td>
                  <td>{typeof (o.totalAmount ?? o.total ?? o.totalPrice) === 'number' ? (o.totalAmount ?? o.total ?? o.totalPrice).toLocaleString() : (o.totalAmount ?? o.total ?? o.totalPrice ?? '-')}</td>
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

      {!loading && total > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, flexWrap: 'wrap', gap: 8 }}>
          <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
            Trang {page} / {totalPages} — Tổng {total} đơn hàng
          </span>
          <div className="admin-pagination-bar">
            <button type="button" className="pagination-arrow" disabled={page <= 1} onClick={() => goToPage(page - 1)} aria-label="Trang trước">←</button>
            {(() => {
              const maxVisible = 5;
              let start = Math.max(1, page - Math.floor(maxVisible / 2));
              let end = Math.min(totalPages, start + maxVisible - 1);
              if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);
              const pages = [];
              for (let i = start; i <= end; i++) pages.push(i);
              return pages.map((p) => (
                <button type="button" key={p} className={p === page ? 'active' : ''} onClick={() => goToPage(p)}>{p}</button>
              ));
            })()}
            <button type="button" className="pagination-arrow" disabled={page >= totalPages} onClick={() => goToPage(page + 1)} aria-label="Trang sau">→</button>
          </div>
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
            <p><strong>Trạng thái:</strong> {STATUS_LABELS[selectedOrder.status] ?? selectedOrder.status}</p>
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
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {selectedOrder.status === 'pending_payment' && (
                  <Button variant="outline-brown" onClick={() => changeStatus(selectedOrder._id || selectedOrder.id, 'approved')}>
                    <FiCheck style={{ marginRight: 4 }} /> Duyệt đơn
                  </Button>
                )}
                <Button variant="outline-brown" onClick={() => changeStatus(selectedOrder._id || selectedOrder.id, 'paid_deposit')}>
                  <FiCheckCircle style={{ marginRight: 4 }} /> Đã đặt cọc
                </Button>
                <Button variant="outline-brown" onClick={() => changeStatus(selectedOrder._id || selectedOrder.id, 'shipped')}>
                  <FiTruck style={{ marginRight: 4 }} /> Đã giao
                </Button>
                {isAdmin && (
                  <Button variant="outline-danger" onClick={() => changeStatus(selectedOrder._id || selectedOrder.id, 'cancelled')}>
                    <FiXCircle style={{ marginRight: 4 }} /> Hủy
                  </Button>
                )}
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
