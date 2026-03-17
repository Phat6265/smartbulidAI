import React, { useEffect, useState } from 'react';
import apiClient from '../../services/apiClient';
import { updateOrderStatus } from '../../services/order.service';
import Button from '../../components/common/Button';
import './Admin.css';
import { objectsToCSV, downloadCSV } from '../../utils/csv';
import { useNotification } from '../../components/common/NotificationCenter';
import { FiEye, FiCheckCircle, FiTruck, FiXCircle } from 'react-icons/fi';

const statusLabel = (status) => {
  switch (status) {
    case 'pending_payment':
      return 'Chờ thanh toán';
    case 'paid_deposit':
      return 'Đã đặt cọc';
    case 'shipped':
      return 'Đang giao hàng';
    case 'delivered':
      return 'Đã giao hàng';
    case 'completed':
      return 'Hoàn thành';
    case 'cancelled':
      return 'Đã hủy';
    default:
      return status || '-';
  }
};

const OrdersAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDepositPanel, setShowDepositPanel] = useState(false);
  const [depositInput, setDepositInput] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { notifyError, notifySuccess, confirm } = useNotification();

  const fetchOrders = async (pageParam = 1) => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/orders?page=${pageParam}&limit=10`);
      // apiClient đã trả về response.data,
      // backend /api/orders trả về dạng { orders, total, page, limit, totalPages }
      const list = Array.isArray(res)
        ? res
        : Array.isArray(res?.orders)
          ? res.orders
          : [];
      setOrders(list.map((o) => (o.id && !o._id ? { ...o, _id: o.id } : o)));
      setPage(res.page || pageParam);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(1);
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

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages || newPage === page) return;
    fetchOrders(newPage);
  };

  const changeStatus = async (orderId, status, extra = {}) => {
    try {
      const ok = await confirm({
        title: 'Xác nhận cập nhật trạng thái đơn hàng',
        message: `Bạn có chắc muốn chuyển trạng thái đơn hàng sang "${statusLabel(status)}"?`
      });
      if (!ok) return;
      const updated = await updateOrderStatus(orderId, status, extra);
      notifySuccess('Cập nhật trạng thái đơn hàng thành công');
      // Cập nhật ngay trong UI để thấy trạng thái thay đổi lập tức
      setOrders((prev) =>
        prev.map((o) =>
          (o._id || o.id) === (orderId)
            ? { ...o, status: updated.status || status }
            : o
        )
      );
      setSelectedOrder((prev) =>
        prev && (prev._id || prev.id) === (orderId)
          ? { ...prev, status: updated.status || status, ...extra }
          : prev
      );
      // Vẫn refetch để đồng bộ với server (phòng trường hợp backend thay đổi thêm field khác)
      fetchOrders();
    } catch (err) {
      notifyError(err.message || 'Cập nhật thất bại');
    }
  };

  const exportRevenueCSV = () => {
    const cols = [
      { header: 'Mã', accessor: (o) => o._id || o.id },
      { header: 'Khách', accessor: (o) => o.customerName || o.customer?.name || o.customerId },
      { header: 'Trạng thái', accessor: (o) => statusLabel(o.status) },
      { header: 'Tổng', accessor: (o) => o.totalAmount || o.total || o.totalPrice || 0 },
      {
        header: 'Ngày tạo',
        accessor: (o) =>
          o.createdAt ? new Date(o.createdAt).toLocaleString('vi-VN') : ''
      }
    ];
    const csv = objectsToCSV(filteredOrders.length ? filteredOrders : orders, cols);

    // Đặt tên file theo ngày giờ hiện tại: orders-YYYYMMDD-HHmmss.csv
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const ts = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(
      now.getHours()
    )}${pad(now.getMinutes())}${pad(now.getSeconds())}`;

    downloadCSV(`orders-${ts}.csv`, csv);
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
      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <>
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
                {(filteredOrders.length ? filteredOrders : orders).map((o) => (
                  <tr key={o._id || o.id}>
                    <td>{o._id || o.id}</td>
                    <td>{o.customerName || o.customer?.name || o.customerId}</td>
                    <td>{statusLabel(o.status)}</td>
                    <td>
                      {(o.totalAmount || o.total || o.totalPrice || 0).toLocaleString()} đ
                    </td>
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

          {totalPages >= 1 && (
            <div className="admin-orders-pagination">
              <div className="profile-pagination-info">
                Trang {page} / {totalPages}
              </div>
              <div className="profile-pagination-controls">
                <button
                  type="button"
                  className="profile-pagination-page"
                  disabled={page <= 1}
                  onClick={() => handlePageChange(page - 1)}
                >
                  ←
                </button>
                {(() => {
                  const maxVisible = 5;
                  let start = Math.max(1, page - Math.floor(maxVisible / 2));
                  let end = Math.min(totalPages, start + maxVisible - 1);
                  if (end - start + 1 < maxVisible) {
                    start = Math.max(1, end - maxVisible + 1);
                  }
                  const pages = [];
                  for (let i = start; i <= end; i++) {
                    pages.push(i);
                  }
                  return pages.map((p) => (
                    <button
                      key={p}
                      type="button"
                      className={`profile-pagination-page ${p === page ? 'active' : ''}`}
                      onClick={() => handlePageChange(p)}
                    >
                      {p}
                    </button>
                  ));
                })()}
                <button
                  type="button"
                  className="profile-pagination-page"
                  disabled={page >= totalPages}
                  onClick={() => handlePageChange(page + 1)}
                >
                  →
                </button>
              </div>
            </div>
          )}
        </>
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
            <p><strong>Trạng thái:</strong> {statusLabel(selectedOrder.status)}</p>
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

            {(() => {
              const total =
                selectedOrder.totalAmount ||
                selectedOrder.total ||
                selectedOrder.totalPrice ||
                0;
              const deposit = selectedOrder.depositAmount || 0;
              const remaining =
                selectedOrder.remainingAmount != null
                  ? selectedOrder.remainingAmount
                  : Math.max(total - deposit, 0);
              return (
                <>
                  <div className="order-payment-summary">
                    <table>
                      <tbody>
                        <tr className="total-row">
                          <th style={{ textAlign: 'left' }}>Tổng tiền</th>
                          <td>{total.toLocaleString()} đ</td>
                        </tr>
                        <tr>
                          <th style={{ textAlign: 'left' }}>Đã đặt cọc</th>
                          <td>{deposit.toLocaleString()} đ</td>
                        </tr>
                        <tr>
                          <th style={{ textAlign: 'left' }}>Còn lại phải thanh toán</th>
                          <td>{remaining.toLocaleString()} đ</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </>
              );
            })()}

            {/* overlay nhập tiền đặt cọc được render riêng phía dưới */}

            <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between', marginTop: 16 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <Button
                  variant="outline-brown"
                  onClick={() => {
                    const total =
                      selectedOrder.totalAmount ||
                      selectedOrder.total ||
                      selectedOrder.totalPrice ||
                      0;
                    const currentDeposit = selectedOrder.depositAmount || 0;
                    const defaultDeposit = currentDeposit || Math.round(total / 2);
                    setDepositInput(defaultDeposit.toString());
                    setShowDepositPanel(true);
                  }}
                >
                  <FiCheckCircle style={{ marginRight: 4 }} /> Đã đặt cọc
                </Button>
                <Button variant="outline-brown" onClick={() => changeStatus(selectedOrder._id || selectedOrder.id, 'delivered')}>
                  <FiTruck style={{ marginRight: 4 }} /> Đã giao
                </Button>
                <Button variant="outline-danger" onClick={() => changeStatus(selectedOrder._id || selectedOrder.id, 'cancelled')}>
                  <FiXCircle style={{ marginRight: 4 }} /> Hủy
                </Button>
              </div>
              <Button variant="outline-brown" type="button" onClick={() => setSelectedOrder(null)}>Đóng</Button>
            </div>
          </div>

          {showDepositPanel && (() => {
            const total =
              selectedOrder.totalAmount ||
              selectedOrder.total ||
              selectedOrder.totalPrice ||
              0;
            const deposit = Number(depositInput || 0);
            const remaining = Math.max(total - (Number.isNaN(deposit) ? 0 : deposit), 0);

            return (
              <div className="order-deposit-backdrop">
                <div className="order-deposit-modal">
                  <h4>Nhập số tiền khách đã đặt cọc</h4>
                  <p className="order-deposit-total">
                    Tổng đơn: <strong>{total.toLocaleString()} đ</strong>
                  </p>
                  <div className="order-deposit-body">
                    <label>
                      Số tiền đặt cọc
                      <input
                        type="number"
                        min="0"
                        max={total}
                        value={depositInput}
                        onChange={(e) => setDepositInput(e.target.value)}
                        className="order-deposit-input"
                      />
                    </label>
                    <div className="order-deposit-remaining">
                      <span>Còn lại phải thanh toán:</span>
                      <strong>{remaining.toLocaleString()} đ</strong>
                    </div>
                  </div>
                  <div className="order-deposit-actions">
                    <Button
                      variant="outline-brown"
                      onClick={async () => {
                        const totalOrder =
                          selectedOrder.totalAmount ||
                          selectedOrder.total ||
                          selectedOrder.totalPrice ||
                          0;
                        const value = Number(depositInput);
                        if (Number.isNaN(value) || value < 0 || value > totalOrder) {
                          notifyError('Số tiền đặt cọc không hợp lệ');
                          return;
                        }
                        const remainingAmount = totalOrder - value;
                        await changeStatus(
                          selectedOrder._id || selectedOrder.id,
                          'shipped',
                          { depositAmount: value, remainingAmount }
                        );
                        setShowDepositPanel(false);
                      }}
                    >
                      Lưu đặt cọc
                    </Button>
                    <Button
                      variant="outline-brown"
                      type="button"
                      onClick={() => setShowDepositPanel(false)}
                    >
                      Đóng
                    </Button>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default OrdersAdmin;
