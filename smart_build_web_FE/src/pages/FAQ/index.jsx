import React, { useState, useEffect } from 'react';
import { getFaqs as fetchFaqs } from '../../services/info.service';
import './FAQ.css';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchFaqs()
      .then((data) => {
        if (!cancelled && Array.isArray(data)) setFaqs(data);
      })
      .catch(() => {
        if (!cancelled) setFaqs([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

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
          {loading ? (
            <p className="faq-loading">Đang tải câu hỏi thường gặp...</p>
          ) : (
          <div className="faq-list">
            {faqs.length === 0 ? (
              <p className="faq-empty">Chưa có câu hỏi nào. Vui lòng liên hệ để được hỗ trợ.</p>
            ) : (
            faqs.map((faq, index) => (
              <div
                key={faq._id || index}
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
            ))
            )}
          </div>
          )}

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
