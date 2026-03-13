import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about">
      <section className="about-hero">
        <div className="container">
          <h1 className="about-hero-title">Về chúng tôi</h1>
          <p className="about-hero-subtitle">Khám phá câu chuyện và tầm nhìn của SmartBuild</p>
        </div>
      </section>

      <section className="about-section">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2>Sứ mệnh của chúng tôi</h2>
              <p>
                SmartBuild được thành lập với mục đích cách mạng hóa ngành xây dựng bằng cách cung cấp
                một nền tảng công nghệ hiện đại để mua bán vật liệu xây dựng với giá cả minh bạch và chất lượng đảm bảo.
              </p>
              <p>
                Chúng tôi tin rằng mỗi công trình xây dựng đều xứng đáng được hỗ trợ bởi những vật liệu tốt nhất
                và những dịch vụ tư vấn chuyên nghiệp.
              </p>
            </div>
            <div className="about-image">
              <img src="https://via.placeholder.com/400x300" alt="Về chúng tôi" />
            </div>
          </div>
        </div>
      </section>

      <section className="about-section about-section--alt">
        <div className="container">
          <h2 className="about-section-title">Tầm nhìn</h2>
          <p className="about-section-text">
            Trở thành nền tảng số 1 tại Việt Nam trong cung cấp vật liệu xây dựng,
            giúp các nhà thầu, kiến trúc sư và chủ đầu tư tiếp cận vật liệu chất lượng cao
            với giá cả hợp lý thông qua công nghệ tiên tiến và dịch vụ khách hàng xuất sắc.
          </p>
        </div>
      </section>

      <section className="about-section">
        <div className="container">
          <h2 className="about-section-title">Giá trị cốt lõi</h2>
          <div className="about-values">
            <div className="about-value-card">
              <div className="about-value-icon">✓</div>
              <h3>Chất lượng</h3>
              <p>Cam kết cung cấp những vật liệu xây dựng chất lượng cao nhất</p>
            </div>
            <div className="about-value-card">
              <div className="about-value-icon">✓</div>
              <h3>Minh bạch</h3>
              <p>Giá cả công khai, không có chi phí ẩn, báo giá chi tiết</p>
            </div>
            <div className="about-value-card">
              <div className="about-value-icon">✓</div>
              <h3>Đáng tin cậy</h3>
              <p>Đối tác lâu dài của hàng ngàn công trình xây dựng</p>
            </div>
            <div className="about-value-card">
              <div className="about-value-icon">✓</div>
              <h3>Công nghệ</h3>
              <p>Ứng dụng AI để nhận diện vật liệu và tư vấn chuyên nghiệp</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
