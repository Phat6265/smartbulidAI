// Guest Home Page - Same UI as Home but for unauthenticated users
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MATERIAL_CATEGORIES, PROJECT_TYPES } from '../../utils/constants';
import Button from '../../components/common/Button';
import wallIcon from '../../assets/icon/wall-removebg-preview.png';
import cementIcon from '../../assets/icon/cement-removebg-preview.png';
import sandIcon from '../../assets/icon/sand-removebg-preview.png';
import steelIcon from '../../assets/icon/steel-removebg-preview.png';
import waterTapIcon from '../../assets/icon/water-tap-removebg-preview.png';
import cameraAIIcon from '../../assets/icon/cameraAI.png';
import nhaCap4Img from '../../assets/img/nha-cap-4.jpg';
import nha1TangImg from '../../assets/img/nha-1-tang.jpg';
import nha2TangImg from '../../assets/img/nha-2-tang.jpg';
import nhaTroImg from '../../assets/img/nha-tro.jpg';
import banner1Img from '../../assets/img/banner1.jpg';
import banner2Img from '../../assets/img/banner2.jpg';
import banner3Img from '../../assets/img/banner3.jpg';
import './GuestHome.css';

// Icon mapping
const CATEGORY_ICONS = {
  'wall-removebg-preview.png': wallIcon,
  'cement-removebg-preview.png': cementIcon,
  'sand-removebg-preview.png': sandIcon,
  'steel-removebg-preview.png': steelIcon,
  'water-tap-removebg-preview.png': waterTapIcon
};

// Project image mapping
const PROJECT_IMAGES = {
  'nha-cap-4.jpg': nhaCap4Img,
  'nha-1-tang.jpg': nha1TangImg,
  'nha-2-tang.jpg': nha2TangImg,
  'nha-tro.jpg': nhaTroImg
};

const GuestHome = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Carousel images
  const carouselImages = [
    {
      image: banner1Img,
      title: 'Vật liệu xây dựng – Báo giá minh bạch',
      subtitle: 'Nền tảng bán vật liệu xây dựng với hỗ trợ AI nhận diện vật liệu'
    },
    {
      image: banner2Img,
      title: 'Chất lượng đảm bảo – Giá cả hợp lý',
      subtitle: 'Cam kết cung cấp vật liệu xây dựng chất lượng cao với giá tốt nhất thị trường'
    },
    {
      image: banner3Img,
      title: 'Giao hàng nhanh chóng – Tư vấn chuyên nghiệp',
      subtitle: 'Đội ngũ chuyên gia sẵn sàng hỗ trợ và tư vấn cho mọi công trình của bạn'
    }
  ];

  // Auto slide every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [carouselImages.length]);

  // Handle manual slide navigation
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="home">
      {/* Banner Carousel Section */}
      <section className="home-banner">
        <div className="home-carousel">
          <div 
            className="home-carousel-track"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {carouselImages.map((slide, index) => (
              <div key={index} className="home-carousel-slide">
                <img 
                  src={slide.image} 
                  alt={slide.title}
                  className="home-carousel-image"
                />
                <div className="home-carousel-overlay">
                  <div className="container">
                    <div className="home-banner-content">
                      <h1 className="home-banner-title">
                        {slide.title}
                      </h1>
                      <p className="home-banner-subtitle">
                        {slide.subtitle}
                      </p>
                      <div className="home-banner-actions">
                        <Link to="/materials">
                          <Button variant="primary" size="large">
                            Xem vật liệu
                          </Button>
                        </Link>
                        <Link to="/login">
                          <Button variant="outline" size="large">
                            Yêu cầu báo giá
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Carousel Indicators */}
          <div className="home-carousel-indicators">
            {carouselImages.map((_, index) => (
              <button
                key={index}
                className={`home-carousel-indicator ${index === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Material Categories Section */}
      <section className="home-section">
        <div className="container">
          <div className="home-categories-wrapper">
            <h2 className="home-section-title">Danh mục vật liệu</h2>
            <div className="home-categories">
            {MATERIAL_CATEGORIES.map((category) => (
              <Link
                key={category.id}
                to={`/materials?category=${category.id}`}
                className="home-category-card"
              >
                <div className="home-category-icon">
                  <img 
                    src={CATEGORY_ICONS[category.iconPath]} 
                    alt={category.name}
                    className="home-category-icon-img"
                  />
                </div>
                <h3 className="home-category-name">{category.name}</h3>
              </Link>
            ))}
            </div>
          </div>
        </div>
      </section>

      {/* AI Recognition Section */}
      <section className="home-section home-section--highlight">
        <div className="container">
          <div className="home-ai-card">
            <div className="home-ai-visual">
              <img src={cameraAIIcon} alt="AI Camera" className="home-ai-icon-large" />
              <div className="home-ai-features">
                <div className="home-ai-feature-item">
                  <div className="home-ai-feature-dot"></div>
                  <p className="home-ai-feature-text">Nhận diện chính xác 99%</p>
                </div>
                <div className="home-ai-feature-item">
                  <div className="home-ai-feature-dot"></div>
                  <p className="home-ai-feature-text">Hỗ trợ 100+ loại vật liệu</p>
                </div>
                <div className="home-ai-feature-item">
                  <div className="home-ai-feature-dot"></div>
                  <p className="home-ai-feature-text">Gợi ý giá thị trường</p>
                </div>
              </div>
            </div>
            <div className="home-ai-content">
              <h3 className="home-ai-title">Không biết tên vật liệu?</h3>
              <p className="home-ai-text">Chụp ảnh vật liệu của bạn, hệ thống AI sẽ tự động nhận diện và gợi ý các sản phẩm phù hợp cùng với báo giá chi tiết</p>
              <div className="home-ai-button-group">
                <Link to="/login">
                  <Button variant="primary" size="large">
                    Thử nhận diện ngay
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Quotation Section */}
      <section className="home-section">
        <div className="container">
          <h2 className="home-section-title">Báo giá công trình</h2>
          <div className="home-projects">
            {PROJECT_TYPES.map((project) => (
              <Link
                key={project.id}
                to="/login"
                className="home-project-card"
              >
                <div className="home-project-icon">
                  <img 
                    src={PROJECT_IMAGES[project.imagePath]} 
                    alt={project.name}
                    className="home-project-icon-img"
                  />
                </div>
                <h3 className="home-project-name">{project.name}</h3>
                <p className="home-project-description">{project.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default GuestHome;
