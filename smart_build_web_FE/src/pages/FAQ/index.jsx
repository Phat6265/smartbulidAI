import React, { useState } from 'react';
import './FAQ.css';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const faqs = [
    {
      question: 'SmartBuild là gì?',
      answer: 'SmartBuild là nền tảng điện tử chuyên cung cấp vật liệu xây dựng với giá cả minh bạch, chất lượng đảm bảo và dịch vụ tư vấn chuyên nghiệp.'
    },
    {
      question: 'Làm sao để đặt hàng?',
      answer: 'Bạn có thể duyệt các vật liệu trên trang, thêm vào giỏ hàng, và thanh toán trực tiếp trên website. Hoặc liên hệ với nhân viên để được tư vấn và nhận báo giá.'
    },
    {
      question: 'Có phí giao hàng không?',
      answer: 'Phí giao hàng tùy thuộc vào địa chỉ và số lượng đơn hàng. Đơn hàng từ 1 triệu đồng trở lên sẽ được giảm phí giao hàng. Liên hệ với chúng tôi để biết thêm chi tiết.'
    },
    {
      question: 'Thời gian giao hàng bao lâu?',
      answer: 'Chúng tôi giao hàng trong vòng 1-3 ngày làm việc tùy theo địa điểm. Khu vực TP.HCM giao nhanh 4-6 giờ.'
    },
    {
      question: 'Vật liệu không phù hợp có thể trả lại không?',
      answer: 'Có, bạn có thể trả lại vật liệu trong vòng 7 ngày nếu chưa sử dụng. Vui lòng liên hệ với chúng tôi để xử lý.'
    },
    {
      question: 'Chức năng AI nhận diện vật liệu hoạt động như thế nào?',
      answer: 'Bạn có thể chụp ảnh vật liệu hoặc tải lên hình ảnh. Hệ thống AI sẽ nhận diện loại vật liệu và gợi ý các sản phẩm tương tự có sẵn trên SmartBuild.'
    },
    {
      question: 'Có hỗ trợ báo giá cho dự án lớn không?',
      answer: 'Có, chúng tôi cung cấp dịch vụ báo giá chuyên nghiệp cho các dự án xây dựng lớn. Vui lòng sử dụng tính năng "Yêu cầu báo giá" hoặc liên hệ trực tiếp.'
    },
    {
      question: 'Thanh toán bằng cách nào?',
      answer: 'Chúng tôi chấp nhận thanh toán bằng chuyển khoản, thẻ tín dụng, ví điện tử và tiền mặt khi giao hàng.'
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? -1 : index);
  };

  return (
    <div className="faq">
      <section className="faq-hero">
        <div className="container">
          <h1 className="faq-hero-title">Câu hỏi thường gặp</h1>
          <p className="faq-hero-subtitle">Tìm câu trả lời cho những thắc mắc của bạn</p>
        </div>
      </section>

      <section className="faq-section">
        <div className="container">
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`faq-item ${activeIndex === index ? 'active' : ''}`}
              >
                <button
                  className="faq-question"
                  onClick={() => toggleFAQ(index)}
                >
                  <span>{faq.question}</span>
                  <span className="faq-icon">
                    {activeIndex === index ? '−' : '+'}
                  </span>
                </button>
                {activeIndex === index && (
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="faq-contact">
            <h2>Không tìm thấy câu trả lời?</h2>
            <p>Liên hệ với chúng tôi để được hỗ trợ trực tiếp</p>
            <a href="/contact" className="faq-contact-link">
              Liên hệ ngay →
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;
