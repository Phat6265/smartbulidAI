// Order Detail Page
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useOrderStore from '../../store/order.store';
import { formatCurrency } from '../../utils/formatCurrency';
import { getMaterialImage } from '../../utils/materialImages.js';
import Button from '../../components/common/Button';
import LazyImage from '../../components/common/LazyImage';
import './OrderDetail.css';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentOrder, loading, error, fetchOrderById } = useOrderStore();

  useEffect(() => {
    if (id) {
      fetchOrderById(id).catch((err) => {
        console.error('Error fetching order:', err);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return (
      <div className="order-detail-page">
        <div className="container">
          <div className="order-detail-loading">Đang tải...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-detail-page">
        <div className="container">
          <div className="order-detail-error">
            <p>{error}</p>
            <Button onClick={() => navigate(-1)} variant="outline" style={{ marginTop: '1rem' }}>
              Quay lại
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentOrder) {
    return (
      <div className="order-detail-page">
        <div className="container">
          <div className="order-detail-empty">
            <p>Không tìm thấy đơn hàng</p>
            <Button onClick={() => navigate(-1)} variant="outline" style={{ marginTop: '1rem' }}>
              Quay lại
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-detail-page">
      <div className="container">
        <button onClick={() => navigate(-1)} className="order-detail-back">
          ← Quay lại
        </button>

        <div className="order-detail-content">
          <div className="order-detail-header">
            <h1 className="order-detail-title">Chi tiết đơn hàng</h1>
            <span className={`order-detail-status order-detail-status-${currentOrder.status}`}>
              {currentOrder.status === 'pending_payment' && 'Chờ thanh toán'}
              {currentOrder.status === 'paid_deposit' && 'Đã đặt cọc'}
              {currentOrder.status === 'shipped' && 'Đang giao hàng'}
              {currentOrder.status === 'delivered' && 'Đã giao hàng'}
              {currentOrder.status === 'completed' && 'Hoàn thành'}
              {currentOrder.status === 'cancelled' && 'Đã hủy'}
            </span>
          </div>

          <div className="order-detail-info">
            <div className="order-detail-section">
              <h2>Thông tin đơn hàng</h2>
              <div className="order-detail-info-grid">
                <div className="order-detail-info-item">
                  <span className="order-detail-label">Mã đơn hàng:</span>
                  <span className="order-detail-value">#{currentOrder._id || currentOrder.id}</span>
                </div>
                <div className="order-detail-info-item">
                  <span className="order-detail-label">Ngày đặt hàng:</span>
                  <span className="order-detail-value">
                    {currentOrder.createdAt 
                      ? new Date(currentOrder.createdAt).toLocaleDateString('vi-VN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : 'N/A'}
                  </span>
                </div>
                {currentOrder.paymentDate && (
                  <div className="order-detail-info-item">
                    <span className="order-detail-label">Ngày thanh toán:</span>
                    <span className="order-detail-value">
                      {new Date(currentOrder.paymentDate).toLocaleDateString('vi-VN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                )}
                {currentOrder.vnp_TransactionNo && (
                  <div className="order-detail-info-item">
                    <span className="order-detail-label">Mã giao dịch:</span>
                    <span className="order-detail-value">{currentOrder.vnp_TransactionNo}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="order-detail-section">
              <h2>Thông tin giao hàng</h2>
              <div className="order-detail-info-grid">
                <div className="order-detail-info-item">
                  <span className="order-detail-label">Tên khách hàng:</span>
                  <span className="order-detail-value">{currentOrder.customerName || 'N/A'}</span>
                </div>
                <div className="order-detail-info-item">
                  <span className="order-detail-label">Số điện thoại:</span>
                  <span className="order-detail-value">{currentOrder.phone || 'N/A'}</span>
                </div>
                <div className="order-detail-info-item full-width">
                  <span className="order-detail-label">Địa chỉ giao hàng:</span>
                  <span className="order-detail-value">{currentOrder.shippingAddress || 'N/A'}</span>
                </div>
                {currentOrder.note && (
                  <div className="order-detail-info-item full-width">
                    <span className="order-detail-label">Ghi chú:</span>
                    <span className="order-detail-value">{currentOrder.note}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="order-detail-section">
              <h2>Sản phẩm</h2>
              <div className="order-detail-items">
                {currentOrder.items && currentOrder.items.length > 0 ? (
                  currentOrder.items.map((item, index) => {
                    const materialForImage = {
                      name: item.name,
                      category: 'iron', // Assume iron for now, can be improved
                      subcategory: ''
                    };
                    const assetImage = getMaterialImage(materialForImage);
                    const imageUrl = assetImage || item.image;
                    
                    return (
                      <div key={index} className="order-detail-item">
                        <div className="order-detail-item-image">
                          {imageUrl ? (
                            <LazyImage src={imageUrl} alt={item.name} effect="blur" />
                          ) : (
                            <div className="order-detail-item-placeholder">📦</div>
                          )}
                        </div>
                        <div className="order-detail-item-info">
                          <h3 className="order-detail-item-name">{item.name}</h3>
                          <div className="order-detail-item-details">
                            <span>Số lượng: {item.quantity} {item.unit || ''}</span>
                            <span>Đơn giá: {formatCurrency(item.price)}</span>
                          </div>
                        </div>
                        <div className="order-detail-item-total">
                          {formatCurrency(item.price * item.quantity)}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p>Không có sản phẩm</p>
                )}
              </div>
            </div>

            <div className="order-detail-section">
              <h2>Tổng thanh toán</h2>
              <div className="order-detail-summary">
                <div className="order-detail-summary-row">
                  <span>Tổng giá trị đơn hàng:</span>
                  <span>{formatCurrency(currentOrder.totalAmount || 0)}</span>
                </div>
                {currentOrder.depositAmount && (
                  <div className="order-detail-summary-row">
                    <span>Đã đặt cọc (50%):</span>
                    <span>{formatCurrency(currentOrder.depositAmount)}</span>
                  </div>
                )}
                {currentOrder.remainingAmount && (
                  <div className="order-detail-summary-row">
                    <span>Còn lại:</span>
                    <span>{formatCurrency(currentOrder.remainingAmount)}</span>
                  </div>
                )}
                <div className="order-detail-summary-row order-detail-summary-total">
                  <span>Tổng cộng:</span>
                  <span>{formatCurrency(currentOrder.totalAmount || 0)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
