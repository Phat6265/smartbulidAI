import React, { useState, useEffect } from 'react';
import { getPrivacyPolicy } from '../../services/info.service';
import './Privacy.css';

const DEFAULT_CONTENT = (
  <>
    <div className="privacy-article">
      <h2>1. Giới thiệu</h2>
      <p>
        SmartBuild cam kết bảo vệ quyền riêng tư và dữ liệu cá nhân của tất cả người dùng.
        Chính sách bảo mật này giải thích cách chúng tôi thu thập, sử dụng, chia sẻ và bảo vệ dữ liệu cá nhân của bạn.
      </p>
    </div>
    <div className="privacy-article">
      <h2>2. Dữ liệu chúng tôi thu thập</h2>
      <p>Chúng tôi thu thập những thông tin sau:</p>
      <ul>
        <li>Thông tin đăng ký: Tên, email, số điện thoại, địa chỉ</li>
        <li>Thông tin thanh toán: Số thẻ, thông tin ngân hàng</li>
        <li>Thông tin sử dụng: Lịch sử duyệt, tìm kiếm, mua hàng</li>
        <li>Thông tin kỹ thuật: Địa chỉ IP, loại trình duyệt, hệ điều hành</li>
      </ul>
    </div>
    <div className="privacy-article">
      <h2>3. Cách sử dụng dữ liệu</h2>
      <p>Chúng tôi sử dụng dữ liệu của bạn để:</p>
      <ul>
        <li>Cung cấp dịch vụ và hỗ trợ khách hàng</li>
        <li>Xử lý đơn hàng và giao hàng</li>
        <li>Gửi thông báo và cập nhật</li>
        <li>Cải thiện dịch vụ và trải nghiệm người dùng</li>
        <li>Tuân thủ luật pháp và quy định</li>
      </ul>
    </div>
    <div className="privacy-article">
      <h2>4. Bảo vệ dữ liệu</h2>
      <p>
        Chúng tôi sử dụng các biện pháp bảo mật tiên tiến bao gồm mã hóa SSL/TLS,
        tường lửa, và hệ thống theo dõi để bảo vệ dữ liệu cá nhân của bạn khỏi truy cập trái phép.
      </p>
    </div>
    <div className="privacy-article">
      <h2>5. Chia sẻ dữ liệu</h2>
      <p>
        Chúng tôi không chia sẻ dữ liệu cá nhân của bạn với bên thứ ba mà không có sự đồng ý của bạn,
        trừ khi được pháp luật yêu cầu hoặc cần thiết để cung cấp dịch vụ.
      </p>
    </div>
    <div className="privacy-article">
      <h2>6. Quyền của bạn</h2>
      <p>Bạn có quyền:</p>
      <ul>
        <li>Truy cập dữ liệu cá nhân của bạn</li>
        <li>Yêu cầu sửa chữa dữ liệu không chính xác</li>
        <li>Yêu cầu xóa dữ liệu cá nhân</li>
        <li>Rút lại sự đồng ý của bạn bất kỳ lúc nào</li>
      </ul>
    </div>
    <div className="privacy-article">
      <h2>7. Liên hệ</h2>
      <p>
        Nếu bạn có bất kỳ câu hỏi nào về chính sách bảo mật này, vui lòng liên hệ với chúng tôi tại:
        <br />
        Email: privacy@smartbuild.vn
        <br />
        Điện thoại: +84 (0)28 1234 5678
      </p>
    </div>
    <div className="privacy-article">
      <h2>8. Cập nhật chính sách</h2>
      <p>
        Chúng tôi có quyền cập nhật chính sách bảo mật này bất kỳ lúc nào.
        Các thay đổi sẽ có hiệu lực ngay khi đăng tải trên website.
      </p>
    </div>
  </>
);

const Privacy = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getPrivacyPolicy()
      .then((data) => {
        if (!cancelled && data?.content) setContent(data.content);
        else if (!cancelled) setContent(false);
      })
      .catch(() => {
        if (!cancelled) setContent(false);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="privacy">
      <section className="privacy-hero">
        <div className="container">
          <h1 className="privacy-hero-title">Chính sách bảo mật</h1>
          <p className="privacy-hero-subtitle">Bảo vệ dữ liệu cá nhân của bạn là ưu tiên hàng đầu của chúng tôi</p>
        </div>
      </section>

      <section className="privacy-section">
        <div className="container">
          <div className="privacy-content">
            {loading ? (
              <p>Đang tải...</p>
            ) : content ? (
              <div className="privacy-article" dangerouslySetInnerHTML={{ __html: content }} />
            ) : (
              DEFAULT_CONTENT
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Privacy;
