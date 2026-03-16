// Checkout Page
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import useCartStore from '../../store/cart.store';
import useOrderStore from '../../store/order.store';
import { createVNPayPaymentUrl } from '../../services/payment.service.js';
import { formatCurrency } from '../../utils/formatCurrency';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { items, getTotalPrice } = useCartStore();
  const { createOrder, loading } = useOrderStore();
  
  const [formData, setFormData] = useState({
    shippingAddress: '',
    phone: '',
    note: ''
  });
  const [paymentStep] = useState('form'); // reserved for future payment UX
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
      return;
    }
    if (items.length === 0) {
      navigate('/cart');
      return;
    }
  }, [isAuthenticated, items.length, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = async () => {
    if (!formData.shippingAddress || !formData.phone) {
      alert('Vui lòng điền đầy đủ thông tin giao hàng');
      return;
    }

    try {
      const totalPrice = getTotalPrice();
      const depositAmount = totalPrice * 0.5; // 50% deposit

      const orderData = {
        customerId: user._id || user.id,
        customerName: user.name || user.email,
        items: items.map(item => ({
          materialId: item.materialId,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        shippingAddress: formData.shippingAddress,
        phone: formData.phone,
        note: formData.note || '',
        totalAmount: totalPrice,
        depositAmount: depositAmount, // Lưu số tiền cọc
        status: 'pending_payment'
      };

      const order = await createOrder(orderData);
      const orderIdValue = order._id || order.id;
      setOrderId(orderIdValue);
      
      // Create VNPay payment URL
      try {
        const paymentResponse = await createVNPayPaymentUrl({
          orderId: orderIdValue,
          amount: depositAmount,
          language: 'vn'
        });
        
        // Redirect to VNPay payment page
        if (paymentResponse.paymentUrl) {
          window.location.href = paymentResponse.paymentUrl;
        } else {
          throw new Error('Không thể tạo URL thanh toán');
        }
      } catch (paymentError) {
        console.error('Payment error:', paymentError);
        alert('Có lỗi xảy ra khi tạo thanh toán. Vui lòng thử lại.');
      }
    } catch (error) {
      alert(error.message || 'Có lỗi xảy ra khi tạo đơn hàng');
    }
  };

  const totalPrice = getTotalPrice();
  const depositAmount = totalPrice * 0.5; // 50% deposit
  const remainingAmount = totalPrice - depositAmount;

  if (paymentStep === 'success') {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="checkout-success">
            <h1>Đặt hàng thành công!</h1>
            <p>Mã đơn hàng: #{orderId}</p>
            <p>Bạn đã thanh toán đặt cọc {formatCurrency(depositAmount)}</p>
            <p>Số tiền còn lại {formatCurrency(remainingAmount)} sẽ được thanh toán khi nhận hàng</p>
            <div className="checkout-success-actions">
              <Button variant="primary" size="large" onClick={() => navigate('/profile')}>
                Xem đơn hàng
              </Button>
              <Button variant="primary" size="large" onClick={() => navigate('/materials')}>
                Tiếp tục mua sắm
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="checkout-page">
      <div className="container">
        <h1 className="checkout-title">Thanh toán</h1>

        <div className="checkout-content">
          <div className="checkout-form-section">
            <h2>Thông tin giao hàng</h2>
            <div className="checkout-form">
              <Input
                label="Họ và tên"
                value={user?.name || ''}
                disabled
                fullWidth
              />
              <Input
                label="Email"
                value={user?.email || ''}
                disabled
                fullWidth
              />
              <Input
                label="Số điện thoại *"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                fullWidth
              />
              <Input
                label="Địa chỉ giao hàng *"
                name="shippingAddress"
                value={formData.shippingAddress}
                onChange={handleInputChange}
                required
                fullWidth
                multiline
                rows={3}
              />
              <Input
                label="Ghi chú (tùy chọn)"
                name="note"
                value={formData.note}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={3}
              />
            </div>
          </div>

          <div className="checkout-summary">
            <h2>Đơn hàng</h2>
            <div className="checkout-items">
              {items.map((item) => (
                <div key={item.materialId} className="checkout-item">
                  <span>{item.name} x {item.quantity}</span>
                  <span>{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="checkout-total">
              <div className="checkout-total-row">
                <span>Tạm tính:</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
              <div className="checkout-total-row checkout-total-highlight">
                <span>Tổng cộng:</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
              <div className="checkout-deposit-note">
                <p>💡 Bạn sẽ thanh toán 50% đặt cọc ({formatCurrency(depositAmount)}) ngay bây giờ</p>
                <p>Số tiền còn lại ({formatCurrency(remainingAmount)}) sẽ thanh toán khi nhận hàng</p>
              </div>
            </div>
            <Button
              variant="primary"
              size="large"
              fullWidth
              onClick={handleSubmitOrder}
              loading={loading}
            >
              Tiếp tục thanh toán
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
