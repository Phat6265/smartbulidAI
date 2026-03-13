// Header Component
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiCamera, FiMenu, FiX, FiHome, FiPackage, FiFileText, FiShoppingCart, FiUser, FiChevronDown, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../../../hooks/useAuth';
import useCartStore from '../../../store/cart.store';
import Button from '../../common/Button';
import { ROUTES } from '../../../utils/constants';
import './Header.css';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const cartItemsCount = useCartStore((state) => state.getTotalItems());

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuOpen && !event.target.closest('.header-user-menu')) {
        setUserMenuOpen(false);
      }
    };

    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuOpen]);

  const menuItems = [
    { 
      path: '/', 
      label: 'Trang chủ',
      icon: <FiHome />
    },
    { 
      path: '/materials', 
      label: 'Vật liệu xây dựng',
      icon: <FiPackage />
    },
    { 
      path: '/project-quotation', 
      label: 'Báo giá công trình',
      icon: <FiFileText />,
      requireAuth: true
    },
    {
      path: '/ai-recognition',
      label: 'AI - Nhận diện vật liệu',
      icon: <FiCamera />,
      className: 'header-link--ai',
      requireAuth: true
    }
  ];

  // Keep all menu items visible. If a route requires auth and the user is not
  // authenticated, we will point the link to the login page so guests see the
  // menu but are redirected to login when clicking.
  const visibleMenuItems = menuItems;

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <Link to="/" className="header-logo">
            <img 
              src="/logo.png" 
              alt="SmartBuild" 
              className="header-logo-image"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="header-nav">
            {visibleMenuItems.map((item) => (
              <Link
                key={item.path}
                to={item.requireAuth && !isAuthenticated ? ROUTES.LOGIN : item.path}
                className={`header-link ${item.className || ''}`}
              >
                <span className="header-link-icon">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          {/* User Actions */}
          <div className="header-actions">
            {/* Cart Icon - Only show for authenticated users */}
            {isAuthenticated && (
              <Link to="/cart" className="header-cart">
                <FiShoppingCart />
                {cartItemsCount > 0 && (
                  <span className="header-cart-badge">{cartItemsCount}</span>
                )}
              </Link>
            )}

            {isAuthenticated ? (
              <>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="header-link">
                    Admin
                  </Link>
                )}
                <Link to="/quotation" className="header-link">
                  Báo giá của tôi
                </Link>
                <div className="header-user-menu">
                  <button
                    className="header-user-button"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                  >
                    <span className="header-user-name">{user?.name || user?.email}</span>
                    <FiChevronDown className={`header-user-chevron ${userMenuOpen ? 'open' : ''}`} />
                  </button>
                  {userMenuOpen && (
                    <div className="header-user-dropdown">
                      <Link
                        to="/profile"
                        className="header-user-dropdown-item"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <FiUser />
                        <span>Hồ sơ</span>
                      </Link>
                      <button
                        className="header-user-dropdown-item"
                        onClick={() => {
                          handleLogout();
                          setUserMenuOpen(false);
                        }}
                      >
                        <FiLogOut />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="text" size="small">
                    Đăng nhập
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="small">
                    Đăng ký
                  </Button>
                </Link>
              </>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="header-mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="header-mobile-nav">
            {visibleMenuItems.map((item) => (
              <Link
                key={item.path}
                to={item.requireAuth && !isAuthenticated ? ROUTES.LOGIN : item.path}
                className={`header-link ${item.className || ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="header-link-icon">{item.icon}</span>
                {item.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                <Link
                  to="/cart"
                  className="header-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FiShoppingCart /> Giỏ hàng {cartItemsCount > 0 && `(${cartItemsCount})`}
                </Link>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="header-link"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin
                  </Link>
                )}
                <Link
                  to="/quotation"
                  className="header-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Báo giá của tôi
                </Link>
                <Link
                  to="/profile"
                  className="header-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FiUser /> Hồ sơ
                </Link>
                <Button
                  variant="outline"
                  size="small"
                  fullWidth
                  onClick={handleLogout}
                >
                  Đăng xuất
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="text" size="small" fullWidth>
                    Đăng nhập
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="small" fullWidth>
                    Đăng ký
                  </Button>
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;

