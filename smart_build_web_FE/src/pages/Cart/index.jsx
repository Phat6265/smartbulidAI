// Cart Page
import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';
import useCartStore from '../../store/cart.store';
import { formatCurrency } from '../../utils/formatCurrency';
import { getMaterialImage } from '../../utils/materialImages.js';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import LazyImage from '../../components/common/LazyImage';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import useQuotationStore from '../../store/quotation.store';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();
  const { createQuotation } = useQuotationStore();

  const [isQuotationModalOpen, setIsQuotationModalOpen] = useState(false);
  const [quotationLocation, setQuotationLocation] = useState('');
  const [creatingQuotation, setCreatingQuotation] = useState(false);

  const quotationItems = useMemo(() => {
    return items.map((item) => ({
      materialId: item.materialId,
      name: item.name,
      quantity: item.quantity,
      unit: item.unit || ''
    }));
  }, [items]);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/cart');
      return;
    }
    if (items.length === 0) {
      alert('Giỏ hàng của bạn đang trống');
      return;
    }
    navigate('/checkout');
  };

  const openQuotationModal = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/cart');
      return;
    }
    if (items.length === 0) {
      alert('Giỏ hàng của bạn đang trống');
      return;
    }
    setIsQuotationModalOpen(true);
  };

  const handleCreateQuotation = async () => {
    if (!quotationLocation.trim()) {
      alert('Vui lòng nhập địa điểm công trình');
      return;
    }
    if (!user?._id && !user?.id) {
      alert('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
      return;
    }

    setCreatingQuotation(true);
    try {
      await createQuotation({
        customerId: user._id || user.id,
        customerName: user.name || user.email,
        location: quotationLocation.trim(),
        items: quotationItems
      });
      alert('Đã gửi yêu cầu báo giá thành công!');
      setIsQuotationModalOpen(false);
      setQuotationLocation('');
      navigate('/quotation');
    } catch (err) {
      alert(err?.message || 'Có lỗi xảy ra khi gửi yêu cầu báo giá');
    } finally {
      setCreatingQuotation(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <h1 className="cart-title">Giỏ hàng</h1>
          <div className="cart-empty">
            <p>Giỏ hàng của bạn đang trống</p>
            <Link to="/materials">
              <Button variant="primary" size="large">
                Tiếp tục mua sắm
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const totalPrice = getTotalPrice();

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="cart-title">Giỏ hàng</h1>

        <div className="cart-content">
          <div className="cart-items">
            {items.map((item) => (
              <div key={item.materialId} className="cart-item">
                <div className="cart-item-image">
                  {(() => {
                    // Ưu tiên sử dụng ảnh từ assets cho danh mục Sắt
                    const materialForImage = {
                      name: item.name,
                      category: item.category,
                      subcategory: item.subcategory
                    };
                    const assetImage = getMaterialImage(materialForImage);
                    const imageUrl = assetImage || item.image;
                    
                    return imageUrl ? (
                      <LazyImage src={imageUrl} alt={item.name} effect="blur" />
                    ) : (
                      <div className="cart-item-placeholder">📦</div>
                    );
                  })()}
                </div>
                <div className="cart-item-info">
                  <h3 className="cart-item-name">{item.name}</h3>
                  <p className="cart-item-price">{formatCurrency(item.price)}</p>
                </div>
                <div className="cart-item-quantity">
                  <button
                    className="cart-quantity-btn"
                    onClick={() => updateQuantity(item.materialId, item.quantity - 1)}
                  >
                    <FiMinus />
                  </button>
                  <span className="cart-quantity-value">{item.quantity}</span>
                  <button
                    className="cart-quantity-btn"
                    onClick={() => updateQuantity(item.materialId, item.quantity + 1)}
                  >
                    <FiPlus />
                  </button>
                </div>
                <div className="cart-item-total">
                  {formatCurrency(item.price * item.quantity)}
                </div>
                <button
                  className="cart-item-remove"
                  onClick={() => removeItem(item.materialId)}
                  aria-label="Remove item"
                >
                  <FiTrash2 />
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2 className="cart-summary-title">Tóm tắt đơn hàng</h2>
            <div className="cart-summary-row">
              <span>Tạm tính:</span>
              <span>{formatCurrency(totalPrice)}</span>
            </div>
            <div className="cart-summary-row cart-summary-total">
              <span>Tổng cộng:</span>
              <span>{formatCurrency(totalPrice)}</span>
            </div>
            <div className="cart-summary-actions">
              <Button variant="primary" size="large" fullWidth onClick={handleCheckout}>
                Thanh toán
              </Button>
              <Button variant="outline-brown" size="large" fullWidth onClick={openQuotationModal}>
                Yêu cầu báo giá
              </Button>
              <Link to="/materials">
                <Button variant="primary" size="large" fullWidth>
                  Tiếp tục mua sắm
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isQuotationModalOpen}
        onClose={() => (creatingQuotation ? null : setIsQuotationModalOpen(false))}
        title="Gửi yêu cầu báo giá"
        size="medium"
      >
        <div style={{ display: 'grid', gap: 12 }}>
          <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>
            Hệ thống sẽ gửi danh sách vật liệu trong giỏ hàng cho nhân viên để báo giá.
          </p>
          <Input
            label="Địa điểm công trình *"
            value={quotationLocation}
            onChange={(e) => setQuotationLocation(e.target.value)}
            placeholder="Ví dụ: Quận 7, TP.HCM"
            fullWidth
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginTop: 8 }}>
            <Button
              variant="outline-brown"
              type="button"
              onClick={() => setIsQuotationModalOpen(false)}
              disabled={creatingQuotation}
            >
              Hủy
            </Button>
            <Button
              variant="primary"
              type="button"
              onClick={handleCreateQuotation}
              loading={creatingQuotation}
            >
              Gửi yêu cầu
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Cart;
