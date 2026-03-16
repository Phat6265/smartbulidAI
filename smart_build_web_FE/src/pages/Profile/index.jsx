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
  const { orders, loading, fetchUserOrders, ordersPage, ordersLimit, ordersTotal, ordersTotalPages } = useOrderStore();
  const { profile, loading: profileLoading, fetchProfile, deleteAccount, updateAvatar, loading: userStoreLoading } = useUserStore();
  const [activeTab, setActiveTab] = useState('info');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/profile');
      return;
    }
    if (activeTab === 'info') {
      fetchProfile().catch(console.error);
    }
    if (activeTab === 'orders' && (user?._id || user?.id)) {
      const userId = user._id || user.id;
      fetchUserOrders(userId, currentPage, ordersLimit || 10, statusFilter).catch(console.error);
    }
  }, [isAuthenticated, activeTab, user?._id, user?.id, currentPage, statusFilter, ordersLimit, navigate, fetchProfile, fetchUserOrders]);

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

  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (user) {
      const userId = user._id || user.id;
      if (userId) {
        fetchUserOrders(userId, page, 10, statusFilter).catch(console.error);
      }
    }
  };

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    handlePageChange(1); // Reset về trang 1 khi đổi filter
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
            onClick={() => {
              setActiveTab('info');
              setCurrentPage(1);
            }}
          >
            Thông tin cá nhân
          </button>
          <button
            className={`profile-tab ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('orders');
              setStatusFilter('all'); // Reset filter khi chuyển tab
              handlePageChange(1);
            }}
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
              <div className="profile-orders-header">
                <h2>Đơn hàng của tôi</h2>
                <div className="profile-orders-filter">
                  <label>Lọc theo trạng thái:</label>
                  <select 
                    value={statusFilter} 
                    onChange={(e) => handleStatusFilterChange(e.target.value)}
                    className="profile-orders-filter-select"
                  >
                    <option value="all">Tất cả</option>
                    <option value="pending_payment">Chờ thanh toán</option>
                    <option value="paid_deposit">Đã đặt cọc</option>
                    <option value="shipped">Đang giao hàng</option>
                    <option value="delivered">Đã giao hàng</option>
                    <option value="completed">Hoàn thành</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
                </div>
              </div>
              {loading ? (
                <div className="profile-loading">Đang tải...</div>
              ) : orders.length === 0 ? (
                <div className="profile-empty">
                  Bạn chưa có đơn hàng nào
                  <br />
                  <small style={{ color: '#666', fontSize: '0.875rem', marginTop: '0.5rem', display: 'block' }}>
                    User ID: {user?._id || user?.id || 'N/A'}
                  </small>
                </div>
              ) : (
                <>
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
                              const userId = user._id || user.id;
                              if (userId) {
                                await fetchUserOrders(userId, currentPage, 10, statusFilter);
                              }
                            }}
                          >
                            Xác nhận đã nhận hàng
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  </div>
                  
                  {/* Pagination */}
                  {ordersTotalPages > 1 && (
                    <div className="profile-pagination">
                      <div className="profile-pagination-info">
                        <span>Trang {ordersPage} / {ordersTotalPages} — Tổng {ordersTotal} đơn hàng</span>
                      </div>
                      <div className="profile-pagination-controls">
                        <button
                          type="button"
                          className="profile-pagination-arrow"
                          disabled={ordersPage <= 1}
                          onClick={() => handlePageChange(ordersPage - 1)}
                          aria-label="Trang trước"
                        >
                          ←
                        </button>
                        {(() => {
                          const maxVisible = 5;
                          let start = Math.max(1, ordersPage - Math.floor(maxVisible / 2));
                          let end = Math.min(ordersTotalPages, start + maxVisible - 1);
                          if (end - start + 1 < maxVisible) {
                            start = Math.max(1, end - maxVisible + 1);
                          }
                          const pages = [];
                          for (let i = start; i <= end; i++) {
                            pages.push(i);
                          }
                          return pages.map((p) => (
                            <button
                              type="button"
                              key={p}
                              className={`profile-pagination-page ${p === ordersPage ? 'active' : ''}`}
                              onClick={() => handlePageChange(p)}
                            >
                              {p}
                            </button>
                          ));
                        })()}
                        <button
                          type="button"
                          className="profile-pagination-arrow"
                          disabled={ordersPage >= ordersTotalPages}
                          onClick={() => handlePageChange(ordersPage + 1)}
                          aria-label="Trang sau"
                        >
                          →
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
