// Profile Page
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import useOrderStore from '../../store/order.store';
import { formatCurrency } from '../../utils/formatCurrency';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, refreshUser } = useAuth();
  const { orders, loading, fetchUserOrders } = useOrderStore();
  const [activeTab, setActiveTab] = useState('info');
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/profile');
      return;
    }

    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }

    if (activeTab === 'orders' && user?._id) {
      fetchUserOrders(user._id).catch(console.error);
    }
  }, [isAuthenticated, user, activeTab, navigate, fetchUserOrders]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    // In real app, this would update user profile via API
    alert('Thông tin đã được cập nhật!');
    await refreshUser();
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="profile-page">
      <div className="container">
        <h1 className="profile-title">Hồ sơ khách hàng</h1>

        <div className="profile-tabs">
          <button
            className={`profile-tab ${activeTab === 'info' ? 'active' : ''}`}
            onClick={() => setActiveTab('info')}
          >
            Thông tin cá nhân
          </button>
          <button
            className={`profile-tab ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            Đơn hàng của tôi
          </button>
        </div>

        <div className="profile-content">
          {activeTab === 'info' && (
            <div className="profile-info">
              <h2>Cập nhật thông tin</h2>
              <div className="profile-form">
                <Input
                  label="Họ và tên"
                  name="name"
                  value={profileData.name}
                  onChange={handleInputChange}
                  fullWidth
                />
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  fullWidth
                  disabled
                />
                <Input
                  label="Số điện thoại"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleInputChange}
                  fullWidth
                />
                <Input
                  label="Địa chỉ"
                  name="address"
                  value={profileData.address}
                  onChange={handleInputChange}
                  fullWidth
                />
                <Button variant="primary" size="large" onClick={handleSaveProfile}>
                  Lưu thông tin
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="profile-orders">
              <h2>Đơn hàng của tôi</h2>
              {loading ? (
                <div className="profile-loading">Đang tải...</div>
              ) : orders.length === 0 ? (
                <div className="profile-empty">Bạn chưa có đơn hàng nào</div>
              ) : (
                <div className="orders-list">
                  {orders.map((order) => (
                    <div key={order._id || order.id} className="order-card">
                      <div className="order-header">
                        <span className="order-id">Đơn hàng #{order._id || order.id}</span>
                        <span className={`order-status order-status-${order.status}`}>
                          {order.status === 'pending_payment' && 'Chờ thanh toán'}
                          {order.status === 'paid_deposit' && 'Đã đặt cọc'}
                          {order.status === 'shipped' && 'Đang giao hàng'}
                          {order.status === 'delivered' && 'Đã giao hàng'}
                          {order.status === 'completed' && 'Hoàn thành'}
                          {order.status === 'cancelled' && 'Đã hủy'}
                        </span>
                      </div>
                      <div className="order-body">
                        <p>Số lượng sản phẩm: {order.items?.length || 0}</p>
                        <p>Tổng tiền: {formatCurrency(order.totalPrice || 0)}</p>
                        <p>Địa chỉ giao hàng: {order.shippingAddress || 'Chưa có'}</p>
                      </div>
                      <div className="order-actions">
                        <Button
                          variant="outline"
                          size="small"
                          onClick={() => navigate(`/orders/${order._id || order.id}`)}
                        >
                          Xem chi tiết
                        </Button>
                        {order.status === 'delivered' && (
                          <Button
                            variant="primary"
                            size="small"
                            onClick={async () => {
                              const { confirmDelivery } = useOrderStore.getState();
                              await confirmDelivery(order._id || order.id);
                              await fetchUserOrders(user._id);
                            }}
                          >
                            Xác nhận đã nhận hàng
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
