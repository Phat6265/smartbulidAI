import React from 'react';
import './Shipping.css';

const Shipping = () => {
  return (
    <div className="shipping">
      <section className="shipping-hero">
        <div className="container">
          <h1 className="shipping-hero-title">Chính sách vận chuyển</h1>
          <p className="shipping-hero-subtitle">Thông tin chi tiết về dịch vụ giao hàng của SmartBuild</p>
        </div>
      </section>

      <section className="shipping-section">
        <div className="container">
          <div className="shipping-content">
            <div className="shipping-article">
              <h2>1. Phạm vi giao hàng</h2>
              <p>
                SmartBuild cung cấp dịch vụ giao hàng đến tất cả các địa chỉ trong Việt Nam.
                Chúng tôi hợp tác với các đối tác logistics uy tín để đảm bảo giao hàng an toàn và đúng hạn.
              </p>
            </div>

            <div className="shipping-article">
              <h2>2. Thời gian giao hàng</h2>
              <p>
                Thời gian giao hàng phụ thuộc vào địa điểm nhận hàng:
              </p>
              <ul>
                <li><strong>TP.HCM và khu vực lân cận:</strong> 1-2 ngày (Giao nhanh 4-6 giờ)</li>
                <li><strong>Các tỉnh thành lớn:</strong> 2-3 ngày</li>
                <li><strong>Các vùng ngoại thành:</strong> 3-5 ngày</li>
              </ul>
              <p style={{ marginTop: '1rem' }}>
                *Thời gian giao hàng tính từ khi bạn hoàn tất thanh toán. Thứ Bảy, Chủ nhật và các ngày lễ có thể bị trì hoãn.
              </p>
            </div>

            <div className="shipping-article">
              <h2>3. Phí vận chuyển</h2>
              <p>Phí vận chuyển được tính như sau:</p>
              <ul>
                <li><strong>Đơn hàng dưới 500.000 VNĐ:</strong> Phí vận chuyển 30.000 VNĐ</li>
                <li><strong>Đơn hàng từ 500.000 - 1.000.000 VNĐ:</strong> Phí vận chuyển 20.000 VNĐ</li>
                <li><strong>Đơn hàng từ 1.000.000 VNĐ trở lên:</strong> Miễn phí vận chuyển</li>
              </ul>
              <p style={{ marginTop: '1rem' }}>
                *Phí giao nhanh TP.HCM: 50.000 VNĐ. Miễn phí cho đơn từ 2.000.000 VNĐ trở lên.
              </p>
            </div>

            <div className="shipping-article">
              <h2>4. Theo dõi đơn hàng</h2>
              <p>
                Bạn có thể theo dõi trạng thái đơn hàng của mình realtime trên website hoặc app SmartBuild.
                Chúng tôi sẽ gửi email/SMS thông báo khi hàng được gửi và khi sắp đến nơi.
              </p>
            </div>

            <div className="shipping-article">
              <h2>5. Hàng bị hỏng hoặc mất mát</h2>
              <p>
                Nếu hàng đến bị hỏng hoặc bị mất trong quá trình vận chuyển:
              </p>
              <ul>
                <li>Chụp ảnh/quay video lại tình trạng hàng ngay khi nhận</li>
                <li>Liên hệ với SmartBuild trong vòng 24 giờ</li>
                <li>Cung cấp các bằng chứng (ảnh, video, hóa đơn)</li>
                <li>Chúng tôi sẽ xác nhận và hoàn tiền hoặc gửi hàng thay thế</li>
              </ul>
            </div>

            <div className="shipping-article">
              <h2>6. Từ chối nhận hàng</h2>
              <p>
                Nếu bạn không muốn nhận hàng, vui lòng thông báo trước khi giao hàng.
                Chúng tôi sẽ hủy đơn và hoàn tiền 100% (chưa trừ phí vận chuyển nếu đã thanh toán).
              </p>
            </div>

            <div className="shipping-article">
              <h2>7. Hàng chiều dài hoặc quá cồng kềnh</h2>
              <p>
                Với các vật liệu xây dựng chiều dài (sắt, gỗ...) hoặc quá cồng kềnh:
              </p>
              <ul>
                <li>Bạn có thể yêu cầu giao hàng vào Thứ 7, Chủ nhật (phí thêm 50.000 VNĐ)</li>
                <li>Chúng tôi sẽ liên hệ trước để xác nhận địa chỉ giao hàng</li>
                <li>Bạn cần có không gian đủ rộng để nhận hàng</li>
              </ul>
            </div>

            <div className="shipping-article">
              <h2>8. Quy định lưu ý</h2>
              <p>
                SmartBuild không chịu trách nhiệm về:
              </p>
              <ul>
                <li>Hàng bị hư hỏng do lỗi của người nhận (như chỉ định địa chỉ sai)</li>
                <li>Hàng bị hỏng do vận chuyển nếu người nhận không báo cáo trong 24 giờ</li>
                <li>Các trì hoãn do lực lượng khách quan (thiên tai, dịch bệnh, ...)</li>
              </ul>
            </div>

            <div className="shipping-article">
              <h2>9. Liên hệ hỗ trợ</h2>
              <p>
                Nếu bạn có bất kỳ câu hỏi nào về vận chuyển, vui lòng liên hệ:
                <br />
                Email: shipping@smartbuild.vn
                <br />
                Hotline: 1800 5555
                <br />
                Điện thoại: +84 (0)28 1234 5678
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Shipping;
