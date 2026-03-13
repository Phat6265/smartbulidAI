// Footer Component
import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">SmartBuild</h3>
            <p className="footer-description">
              Nền tảng bán vật liệu xây dựng với báo giá minh bạch và hỗ trợ AI nhận diện vật liệu.
            </p>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Thông tin</h4>
            <ul className="footer-links">
              <li>
                <Link to="/about">Về chúng tôi</Link>
              </li>
              <li>
                <Link to="/contact">Liên hệ</Link>
              </li>
              <li>
                <Link to="/faq">Câu hỏi thường gặp</Link>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Chính sách</h4>
            <ul className="footer-links">
              <li>
                <Link to="/privacy">Chính sách bảo mật</Link>
              </li>
              <li>
                <Link to="/terms">Điều khoản sử dụng</Link>
              </li>
              <li>
                <Link to="/shipping">Chính sách vận chuyển</Link>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Liên hệ</h4>
            <ul className="footer-contact">
              <li>Email: contact@smartbuild.vn</li>
              <li>Điện thoại: 1900-xxxx</li>
              <li>Địa chỉ: Hà Nội, Việt Nam</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} SmartBuild. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

