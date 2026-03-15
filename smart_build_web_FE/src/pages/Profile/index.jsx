// Profile Page
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import useOrderStore from '../../store/order.store';
import useUserStore from '../../store/user.store';
import { useNotification } from '../../components/common/NotificationCenter';
import { formatCurrency } from '../../utils/formatCurrency';
import { ROUTES } from '../../utils/constants';
import Button from '../../components/common/Button';
import ProfileCard from '../../components/profile/ProfileCard';
import './Profile.css';

// ===== MODIFIED START (CUSTOMER PROFILE FEATURE) =====
const Profile = () => {
  const navigate = useNavigate();
  const { confirm } = useNotification();
  const { user, isAuthenticated, logout } = useAuth();
  const { orders, loading, fetchUserOrders } = useOrderStore();
  const { profile, loading: profileLoading, fetchProfile, deleteAccount, updateAvatar, loading: userStoreLoading } = useUserStore();
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/profile');
      return;
    }
    if (activeTab === 'info') {
      fetchProfile().catch(console.error);
    }
    if (activeTab === 'orders' && user?._id) {
      fetchUserOrders(user._id).catch(console.error);
    }
  }, [isAuthenticated, activeTab, user?._id, navigate, fetchProfile, fetchUserOrders]);

  const handleDeleteAccount = async () => {
    const ok = await confirm({
      title: 'Xóa tài khoản',
      message: 'Bạn có chắc muốn xóa tài khoản? Hành động này không thể hoàn tác.',
      confirmText: 'Xóa tài khoản',
      cancelText: 'Hủy'
    });
    if (!ok) return;
    try {
      await deleteAccount();
      logout();
      navigate(ROUTES.HOME);
    } catch (err) {
      console.error(err);
    }
  };
// ===== MODIFIED END (CUSTOMER PROFILE FEATURE) =====

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
              {/* ===== MODIFIED START (CUSTOMER PROFILE FEATURE) ===== */}
              <h2>Thông tin cá nhân</h2>
              {profileLoading ? (
                <div className="profile-loading">Đang tải...</div>
              ) : (
                <ProfileCard
                  profile={profile}
                  onDeleteAccount={handleDeleteAccount}
                  onAvatarUpload={updateAvatar}
                  avatarUploadLoading={userStoreLoading}
                />
              )}
              {/* ===== MODIFIED END (CUSTOMER PROFILE FEATURE) ===== */}
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
                        <p>Tổng tiền: {formatCurrency(order.totalPrice || order.totalAmount || 0)}</p>
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
