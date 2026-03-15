import React, { useState, useEffect } from 'react';
import { getTermsOfService } from '../../services/info.service';
import './Terms.css';

const DEFAULT_CONTENT = (
  <>
    <div className="terms-article">
      <h2>1. Chấp nhận điều khoản</h2>
      <p>
        Bằng cách truy cập và sử dụng website SmartBuild, bạn đồng ý ràng buộc bởi các điều khoản sử dụng này.
        Nếu bạn không đồng ý với bất kỳ phần nào, vui lòng không sử dụng dịch vụ.
      </p>
    </div>
    <div className="terms-article">
      <h2>2. Các tài khoản người dùng</h2>
      <p>
        Bạn chịu trách nhiệm duy trì tính bảo mật của tài khoản của bạn.
        SmartBuild không chịu trách nhiệm về bất kỳ hoạt động trái phép trên tài khoản của bạn.
      </p>
    </div>
    <div className="terms-article">
      <h2>3. Sản phẩm và dịch vụ</h2>
      <p>
        SmartBuild cung cấp nền tảng để mua bán vật liệu xây dựng.
        Chúng tôi không chịu trách nhiệm về chất lượng của các sản phẩm từ người bán.
        Tuy nhiên, chúng tôi cam kết hoàn trả tiền nếu sản phẩm không phù hợp với mô tả.
      </p>
    </div>
    <div className="terms-article">
      <h2>4. Thanh toán</h2>
      <p>
        Tất cả các giao dịch phải được thanh toán đầy đủ trước khi giao hàng.
        SmartBuild chấp nhận thanh toán qua chuyển khoản, thẻ tín dụng, ví điện tử và tiền mặt.
        Chúng tôi sử dụng công nghệ mã hóa để bảo vệ thông tin thanh toán của bạn.
      </p>
    </div>
    <div className="terms-article">
      <h2>5. Giao hàng</h2>
      <p>
        SmartBuild sẽ nỗ lực giao hàng trong thời gian cam kết.
        Tuy nhiên, chúng tôi không chịu trách nhiệm về các trì hoãn do lực lượng khách quan gây ra.
        Vui lòng kiểm tra hàng ngay khi nhận và báo cáo bất kỳ vấn đề trong 24 giờ.
      </p>
    </div>
    <div className="terms-article">
      <h2>6. Chính sách hoàn trả</h2>
      <p>
        Bạn có thể trả lại sản phẩm trong vòng 7 ngày nếu chưa sử dụng.
        Sản phẩm phải còn nguyên vẹn, chưa được mở gói hoặc sử dụng.
        Chi phí vận chuyển hoàn trả sẽ do bên mua chịu.
      </p>
    </div>
    <div className="terms-article">
      <h2>7. Hạn chế trách nhiệm</h2>
      <p>
        SmartBuild không chịu trách nhiệm về bất kỳ thiệt hại gián tiếp, ngẫu nhiên, đặc biệt hoặc hậu quả nào
        phát sinh từ việc sử dụng hoặc không thể sử dụng dịch vụ của chúng tôi.
      </p>
    </div>
    <div className="terms-article">
      <h2>8. Hành vi người dùng</h2>
      <p>Bạn cam kết không sử dụng SmartBuild để:</p>
      <ul>
        <li>Tham gia bất kỳ hoạt động bất hợp pháp hoặc gây hại</li>
        <li>Lừa đảo hoặc gây khó dễ cho những người dùng khác</li>
        <li>Tải lên hoặc chia sẻ nội dung có hại hoặc không phù hợp</li>
        <li>Vi phạm bất kỳ luật hiện hành nào</li>
      </ul>
    </div>
    <div className="terms-article">
      <h2>9. Sở hữu trí tuệ</h2>
      <p>
        Tất cả nội dung trên website SmartBuild, bao gồm văn bản, hình ảnh, biểu tượng, video,
        đều được bảo vệ bằng luật bản quyền. Bạn không được phép sao chép, sửa đổi hoặc phân phối mà không có sự cho phép.
      </p>
    </div>
    <div className="terms-article">
      <h2>10. Thay đổi điều khoản</h2>
      <p>
        SmartBuild có quyền sửa đổi các điều khoản này bất kỳ lúc nào.
        Các thay đổi sẽ có hiệu lực ngay khi đăng tải trên website.
        Việc tiếp tục sử dụng dịch vụ sau khi các thay đổi được đăng tải có nghĩa là bạn chấp nhận các điều khoản mới.
      </p>
    </div>
    <div className="terms-article">
      <h2>11. Liên hệ</h2>
      <p>
        Nếu bạn có bất kỳ câu hỏi nào về các điều khoản sử dụng này, vui lòng liên hệ với chúng tôi tại:
        <br />
        Email: support@smartbuild.vn
        <br />
        Điện thoại: +84 (0)28 1234 5678
      </p>
    </div>
  </>
);

const Terms = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getTermsOfService()
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
    <div className="terms">
      <section className="terms-hero">
        <div className="container">
          <h1 className="terms-hero-title">Điều khoản sử dụng</h1>
          <p className="terms-hero-subtitle">Vui lòng đọc kỹ các điều khoản trước khi sử dụng dịch vụ</p>
        </div>
      </section>

      <section className="terms-section">
        <div className="container">
          <div className="terms-content">
            {loading ? (
              <p>Đang tải...</p>
            ) : content ? (
              <div className="terms-article" dangerouslySetInnerHTML={{ __html: content }} />
            ) : (
              DEFAULT_CONTENT
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Terms;
