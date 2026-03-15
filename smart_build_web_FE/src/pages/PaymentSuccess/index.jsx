// Payment Success Page
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import useCartStore from '../../store/cart.store';
import Button from '../../components/common/Button';
import { formatCurrency } from '../../utils/formatCurrency';
import './PaymentSuccess.css';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const clearCart = useCartStore((state) => state.clearCart);
  
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const success = searchParams.get('success');
    const orderIdParam = searchParams.get('orderId');
    const code = searchParams.get('code');
    const messageParam = searchParams.get('message');

    if (orderIdParam) {
      setOrderId(orderIdParam);
    }

    if (success === 'true') {
      setPaymentStatus('success');
      setMessage(messageParam || 'Thanh toán thành công!');
      // Clear cart after successful payment
      clearCart();
    } else {
      setPaymentStatus('failed');
      setMessage(messageParam || 'Thanh toán thất bại. Vui lòng thử lại.');
    }
  }, [searchParams, clearCart]);

  const handleViewOrders = () => {
    navigate('/profile');
  };

  const handleContinueShopping = () => {
    navigate('/materials');
  };

  if (paymentStatus === 'success') {
    return (
      <div className="payment-success-page">
        <div className="container">
          <div className="payment-success-content">
            <div className="payment-success-icon success">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
                <path d="M8 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 className="payment-success-title">Thanh toán thành công!</h1>
            <p className="payment-success-message">{message}</p>
            {orderId && (
              <div className="payment-success-info">
                <p><strong>Mã đơn hàng:</strong> #{orderId}</p>
                <p className="payment-success-note">
                  Đơn hàng của bạn đã được xác nhận. Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.
                </p>
              </div>
            )}
            <div className="payment-success-actions">
              <Button variant="primary" size="large" onClick={handleViewOrders}>
                Xem đơn hàng của tôi
              </Button>
              <Button variant="primary" size="large" onClick={handleContinueShopping}>
                Tiếp tục mua sắm
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'failed') {
    return (
      <div className="payment-success-page">
        <div className="container">
          <div className="payment-success-content">
            <div className="payment-success-icon failed">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
                <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h1 className="payment-success-title">Thanh toán thất bại</h1>
            <p className="payment-success-message error">{message}</p>
            <div className="payment-success-actions">
              <Button variant="primary" size="large" onClick={() => navigate('/checkout')}>
                Thử lại thanh toán
              </Button>
              <Button variant="primary" size="large" onClick={handleContinueShopping}>
                Về trang chủ
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-success-page">
      <div className="container">
        <div className="payment-success-content">
          <p>Đang xử lý...</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
