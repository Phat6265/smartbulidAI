import React, { useEffect, useState } from 'react';
import { getAllQuotations, updateQuotation } from '../../services/quotation.service';
import Button from '../../components/common/Button';
import './Admin.css';
import { useNotification } from '../../components/common/NotificationCenter';
import { FiEye, FiCheckCircle, FiXCircle, FiSend } from 'react-icons/fi';

const QuotationsAdmin = () => {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const { notifyError, notifySuccess, confirm } = useNotification();

  const fetchQuotations = async () => {
    setLoading(true);
    try {
      const res = await getAllQuotations();
      setQuotations(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchQuotations(); }, []);

  const changeStatus = async (q, status) => {
    try {
      const ok = await confirm({
        title: 'Xác nhận cập nhật trạng thái báo giá',
        message: `Bạn có chắc muốn chuyển trạng thái báo giá "${q._id || q.id}" sang "${status}"?`
      });
      if (!ok) return;
      await updateQuotation(q._id || q.id, { ...q, status });
      notifySuccess('Cập nhật trạng thái báo giá thành công');
      fetchQuotations();
    } catch (err) {
      notifyError(err.message || 'Cập nhật thất bại');
    }
  };

  return (
    <div className="admin-page-section">
      <h2>Quản lý Báo giá</h2>
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
              {quotations.map(q => (
                <tr key={q._id || q.id}>
                  <td>{q._id || q.id}</td>
                  <td>{q.customer?.name || q.customerName || '-'}</td>
                  <td>{q.status}</td>
                  <td>{q.totalPrice || '-'}</td>
                  <td>
                    <Button variant="outline-brown" onClick={() => setSelected(q)}>
                      <FiEye style={{ marginRight: 4 }} /> Xem chi tiết
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div className="admin-modal">
          <div className="admin-modal-content" style={{ maxWidth: 720 }}>
            <h3>Chi tiết báo giá</h3>
            <p><strong>Mã:</strong> {selected._id || selected.id}</p>
            <p><strong>Khách hàng:</strong> {selected.customer?.name || selected.customerName || '-'}</p>
            <p><strong>Địa điểm:</strong> {selected.location || '-'}</p>
            <p><strong>Trạng thái:</strong> {selected.status}</p>
            <p><strong>Ngày tạo:</strong> {selected.createdAt ? new Date(selected.createdAt).toLocaleString() : '-'}</p>

            <h4 style={{ marginTop: 16 }}>Danh sách vật liệu</h4>
            <div style={{ maxHeight: 260, overflowY: 'auto', marginTop: 8 }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Tên vật liệu</th>
                    <th>Số lượng</th>
                    <th>Đơn vị</th>
                  </tr>
                </thead>
                <tbody>
                  {(selected.items || []).map((item, idx) => (
                    <tr key={item.materialId || idx}>
                      <td>{item.name}</td>
                      <td>{item.quantity}</td>
                      <td>{item.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
              <strong>Tổng tiền dự kiến:</strong>
              <span>{(selected.totalPrice || 0).toLocaleString()}</span>
            </div>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between', marginTop: 16 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <Button variant="outline-brown" onClick={() => changeStatus(selected, 'quoted')}>
                  <FiSend style={{ marginRight: 4 }} /> Đã báo giá
                </Button>
                <Button variant="outline-brown" onClick={() => changeStatus(selected, 'accepted')}>
                  <FiCheckCircle style={{ marginRight: 4 }} /> Chấp nhận
                </Button>
                <Button variant="outline-danger" onClick={() => changeStatus(selected, 'rejected')}>
                  <FiXCircle style={{ marginRight: 4 }} /> Từ chối
                </Button>
              </div>
              <Button variant="outline-brown" type="button" onClick={() => setSelected(null)}>Đóng</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuotationsAdmin;
