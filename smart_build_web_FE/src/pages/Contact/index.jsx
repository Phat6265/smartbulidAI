import React, { useState } from 'react';
import './Contact.css';
import Button from '../../components/common/Button';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement API call to send contact form
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="contact">
      <section className="contact-hero">
        <div className="container">
          <h1 className="contact-hero-title">Liên hệ với chúng tôi</h1>
          <p className="contact-hero-subtitle">Chúng tôi sẵn sàng giúp bạn giải đáp mọi thắc mắc</p>
        </div>
      </section>

      <section className="contact-section">
        <div className="container">
          <div className="contact-wrapper">
            <div className="contact-info">
              <h2>Thông tin liên hệ</h2>
              
              <div className="contact-item">
                <div className="contact-item-icon">📍</div>
                <div className="contact-item-content">
                  <h3>Địa chỉ</h3>
                  <p>123 Đường ABC, Quận 1, TP.HCM, Việt Nam</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-item-icon">📞</div>
                <div className="contact-item-content">
                  <h3>Điện thoại</h3>
                  <p>+84 (0)28 1234 5678</p>
                  <p>Hotline: 1800 5555</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-item-icon">✉️</div>
                <div className="contact-item-content">
                  <h3>Email</h3>
                  <p>support@smartbuild.vn</p>
                  <p>info@smartbuild.vn</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-item-icon">🕐</div>
                <div className="contact-item-content">
                  <h3>Giờ làm việc</h3>
                  <p>Thứ 2 - Thứ 6: 08:00 - 17:00</p>
                  <p>Thứ 7: 08:00 - 12:00</p>
                </div>
              </div>
            </div>

            <form className="contact-form" onSubmit={handleSubmit}>
              <h2>Gửi tin nhắn cho chúng tôi</h2>
              
              {submitted && (
                <div className="contact-success">
                  Cảm ơn bạn! Chúng tôi sẽ liên hệ lại sớm.
                </div>
              )}

              <div className="form-group">
                <label htmlFor="name">Họ và tên</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Nhập họ và tên của bạn"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Nhập email của bạn"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Số điện thoại</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Nhập số điện thoại của bạn"
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Chủ đề</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="Chủ đề liên hệ"
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Tin nhắn</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  placeholder="Nhập tin nhắn của bạn"
                />
              </div>

              <Button variant="primary" size="large" type="submit">
                Gửi tin nhắn
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
