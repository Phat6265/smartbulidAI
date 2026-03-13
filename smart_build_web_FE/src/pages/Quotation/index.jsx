// Quotation Management Page
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useQuotationStore from '../../store/quotation.store';
import { QUOTATION_STATUS } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatCurrency';
import Button from '../../components/common/Button';
import './Quotation.css';

const Quotation = () => {
  const { quotations, loading, error, fetchQuotations, acceptQuotation, rejectQuotation } = useQuotationStore();

  useEffect(() => {
    fetchQuotations().catch((err) => {
      console.error('Error fetching quotations:', err);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getStatusLabel = (status) => {
    const labels = {
      [QUOTATION_STATUS.PENDING]: 'Đang xử lý',
      [QUOTATION_STATUS.QUOTED]: 'Đã báo giá',
      [QUOTATION_STATUS.ACCEPTED]: 'Đã chấp nhận',
      [QUOTATION_STATUS.REJECTED]: 'Đã từ chối'
    };
    return labels[status] || status;
  };

  const getStatusClass = (status) => {
    const classes = {
      [QUOTATION_STATUS.PENDING]: 'quotation-status--pending',
      [QUOTATION_STATUS.QUOTED]: 'quotation-status--quoted',
      [QUOTATION_STATUS.ACCEPTED]: 'quotation-status--accepted',
      [QUOTATION_STATUS.REJECTED]: 'quotation-status--rejected'
    };
    return classes[status] || '';
  };

  const handleAccept = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn chấp nhận báo giá này?')) {
      try {
        await acceptQuotation(id);
        alert('Đã chấp nhận báo giá thành công!');
      } catch (err) {
        alert(err.message || 'Có lỗi xảy ra');
      }
    }
  };

  const handleReject = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn từ chối báo giá này?')) {
      try {
        await rejectQuotation(id);
        alert('Đã từ chối báo giá');
      } catch (err) {
        alert(err.message || 'Có lỗi xảy ra');
      }
    }
  };

  if (loading) {
    return (
      <div className="quotation-page">
        <div className="container">
          <div className="quotation-loading">Đang tải...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quotation-page">
        <div className="container">
          <div className="quotation-error">
            <p>{error}</p>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>
              Vui lòng kiểm tra backend MERN đang chạy.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quotation-page">
      <div className="container">
        <h1 className="quotation-title">Báo giá của tôi</h1>

        {quotations.length === 0 ? (
          <div className="quotation-empty">
            <p>Bạn chưa có báo giá nào</p>
            <Link to="/materials">
              <Button variant="primary" size="large">
                Xem vật liệu
              </Button>
            </Link>
          </div>
        ) : (
          <div className="quotation-list">
            {quotations.map((quotation) => (
              <div key={quotation._id || quotation.id} className="quotation-card">
                <div className="quotation-header">
                  <div>
                    <h3 className="quotation-id">
                      Mã báo giá: #{quotation._id || quotation.id}
                    </h3>
                    <p className="quotation-location">
                      Địa điểm: {quotation.location || 'Chưa có'}
                    </p>
                  </div>
                  <span className={`quotation-status ${getStatusClass(quotation.status)}`}>
                    {getStatusLabel(quotation.status)}
                  </span>
                </div>

                <div className="quotation-items">
                  <h4>Sản phẩm:</h4>
                  <ul>
                    {quotation.items?.map((item, index) => (
                      <li key={index}>
                        {item.name || `Vật liệu ${item.materialId}`} - 
                        Số lượng: {item.quantity} {item.unit || ''}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="quotation-footer">
                  <div className="quotation-total">
                    <span>Tổng tiền:</span>
                    <span className="quotation-total-amount">
                      {formatCurrency(quotation.totalPrice || 0)}
                    </span>
                  </div>
                  <div className="quotation-actions">
                    {quotation.status === QUOTATION_STATUS.QUOTED && (
                      <>
                        <Button
                          variant="primary"
                          size="small"
                          onClick={() => handleAccept(quotation._id || quotation.id)}
                        >
                          Chấp nhận
                        </Button>
                        <Button
                          variant="outline"
                          size="small"
                          onClick={() => handleReject(quotation._id || quotation.id)}
                        >
                          Từ chối
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {quotation.createdAt && (
                  <p className="quotation-date">
                    Ngày tạo: {new Date(quotation.createdAt).toLocaleDateString('vi-VN')}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Quotation;
