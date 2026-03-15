// Cart Page
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';
import useCartStore from '../../store/cart.store';
import { formatCurrency } from '../../utils/formatCurrency';
import { getMaterialImage } from '../../utils/materialImages';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import LazyImage from '../../components/common/LazyImage';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore();

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
              <Link to="/materials">
                <Button variant="primary" size="large" fullWidth>
                  Tiếp tục mua sắm
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
