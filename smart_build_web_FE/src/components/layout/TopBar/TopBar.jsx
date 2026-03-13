// TopBar Component - Contact Information Bar
import React from 'react';
import { FiPhone, FiMail } from 'react-icons/fi';
import './TopBar.css';

const TopBar = () => {
  return (
    <div className="topbar">
      <div className="container">
        <div className="topbar-content">
          {/* Left Side - Contact Info */}
          <div className="topbar-left">
            <a href="tel:0939979745" className="topbar-item">
              <FiPhone className="topbar-icon" />
              <span>0939979745</span>
            </a>
            <a href="tel:0941405259" className="topbar-item">
              <FiPhone className="topbar-icon" />
              <span>0941405259</span>
            </a>
            <a href="mailto:info@smartbuild.vn" className="topbar-item">
              <FiMail className="topbar-icon" />
              <span>info@smartbuild.vn</span>
            </a>
          </div>

          {/* Right Side - Website Name */}
          <div className="topbar-right">
            <span className="topbar-website-name">SmartBuild - Vật liệu xây dựng</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
