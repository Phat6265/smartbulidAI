// Checkout Page
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import useCartStore from '../../store/cart.store';
import useOrderStore from '../../store/order.store';
import { formatCurrency } from '../../utils/formatCurrency';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { createOrder, loading } = useOrderStore();
  
  const [formData, setFormData] = useState({
    shippingAddress: '',
    phone: '',
    note: ''
  });
  const [paymentStep, setPaymentStep] = useState('form'); // 'form', 'payment', 'success'
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
      const depositAmount = totalPrice * 0.1; // 10% deposit
      const remainingAmount = totalPrice - depositAmount;

      const orderData = {
        customerId: user._id || user.id,
        items: items.map(item => ({
          materialId: item.materialId,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        shippingAddress: formData.shippingAddress,
        phone: formData.phone,
        note: formData.note || '',
        totalPrice,
        depositAmount,
        remainingAmount,
        status: 'pending_payment'
      };

      const order = await createOrder(orderData);
      setOrderId(order._id || order.id);
      setPaymentStep('payment');
    } catch (error) {
      alert(error.message || 'Có lỗi xảy ra khi tạo đơn hàng');
    }
  };

  const handlePaymentComplete = () => {
    // In real app, this would verify payment via API
    alert('Thanh toán đặt cọc thành công! Đơn hàng của bạn đang được xử lý.');
    clearCart();
    setPaymentStep('success');
  };

  const totalPrice = getTotalPrice();
  const depositAmount = totalPrice * 0.1;
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
              <Button variant="outline" size="large" onClick={() => navigate('/materials')}>
                Tiếp tục mua sắm
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (paymentStep === 'payment') {
    return (
      <div className="checkout-page">
        <div className="container">
          <h1 className="checkout-title">Thanh toán đặt cọc</h1>
          
          <div className="checkout-payment">
            <div className="payment-summary">
              <h2>Tóm tắt đơn hàng</h2>
              <div className="payment-summary-row">
                <span>Tổng giá trị đơn hàng:</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
              <div className="payment-summary-row payment-highlight">
                <span>Số tiền đặt cọc (10%):</span>
                <span>{formatCurrency(depositAmount)}</span>
              </div>
              <div className="payment-summary-row">
                <span>Số tiền còn lại (thanh toán khi nhận hàng):</span>
                <span>{formatCurrency(remainingAmount)}</span>
              </div>
            </div>

            <div className="payment-qr">
              <h2>Quét mã QR để thanh toán</h2>
              <div className="qr-code-container">
                {/* Mock QR Code - In real app, this would be generated from payment gateway */}
                <div className="qr-code-placeholder">
                  <div className="qr-code-mock">
                    <div className="qr-grid">
                      {Array.from({ length: 25 }).map((_, i) => (
                        <div key={i} className={`qr-cell ${Math.random() > 0.5 ? 'filled' : ''}`}></div>
                      ))}
                    </div>
                  </div>
                  <p>Quét mã QR bằng ứng dụng ngân hàng</p>
                  <p className="qr-amount">{formatCurrency(depositAmount)}</p>
                </div>
              </div>
              <div className="payment-banks">
                <p>Hỗ trợ thanh toán qua:</p>
                <div className="bank-logos">
                  <span>Vietcombank</span>
                  <span>BIDV</span>
                  <span>VietinBank</span>
                  <span>Techcombank</span>
                  <span>Momo</span>
                  <span>ZaloPay</span>
                </div>
              </div>
              <Button variant="primary" size="large" fullWidth onClick={handlePaymentComplete}>
                Tôi đã thanh toán
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
                <p>💡 Bạn sẽ thanh toán 10% đặt cọc ({formatCurrency(depositAmount)}) ngay bây giờ</p>
                <p>Số tiền còn lại sẽ thanh toán khi nhận hàng</p>
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
