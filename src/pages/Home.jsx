import { useState, useEffect } from 'react';
import { Zap, Cpu, X, ChevronLeft, ChevronRight, Phone, Smartphone } from 'lucide-react';
import { services } from '../data';
import './Home.css';

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const getImageUrl = (imgPath) => {
    if (!imgPath) return '';
    if (imgPath.startsWith('http')) return imgPath;
    if (imgPath.startsWith('/uploads/')) return `http://localhost:3001${imgPath}`;
    return imgPath.startsWith('/') ? imgPath : '/' + imgPath;
  };

  useEffect(() => {
    fetch('http://localhost:3001/api/projects')
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(err => console.error("Error fetching projects:", err));
  }, []);

  const openSlideshow = (project) => {
    setSelectedProject(project);
    setCurrentImageIndex(0);
  };

  const nextImage = (e) => {
    e.stopPropagation();
    if (selectedProject?.images?.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedProject.images.length);
    }
  };

  const prevImage = (e) => {
    e.stopPropagation();
    if (selectedProject?.images?.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + selectedProject.images.length) % selectedProject.images.length);
    }
  };

  return (
    <div className="home-wrapper">
      {/* Hero Section */}
      <section className="hero" style={{ backgroundImage: `url('/luan_storefront.png')` }}>
        <div className="hero-layout animate-fade-in">
          
          {/* Cột trái: Thông tin */}
          <div className="hero-content">
            <span className="hero-subtitle">CHUYÊN NGHIỆP - TẬN TÂM - UY TÍN</span>
            <h1 className="hero-title">Giải pháp toàn diện cho <br/><span className="text-highlight">Công nghệ & Quảng cáo</span></h1>
            <p className="hero-desc">
              Từ sửa chữa máy tính, máy in đến thiết kế thi công bảng hiệu chuyên nghiệp. 
              Chúng tôi cam kết mang lại chất lượng dịch vụ tốt nhất cho bạn.
            </p>
            <div className="hero-actions">
              <a href="#services" className="btn-primary">Khám phá dịch vụ <Zap size={20} className="tech-icon-orange" /></a>
              <a href="#contact" className="btn-outline" style={{ color: 'white', borderColor: 'white' }}>Liên hệ ngay</a>
            </div>
          </div>

          {/* Cột phải: Thông tin liên hệ */}
          <div className="hero-contact">
            <h2 className="contact-title">CẦN HỖ TRỢ GẤP?</h2>
            
            <a href="tel:0966228133" className="contact-item">
              <Phone size={36} className="tech-icon-orange" />
              <div className="contact-item-text">
                <span>Gọi Hotline 24/7</span>
                <strong>0966.228.133</strong>
              </div>
            </a>

            <a href="https://zalo.me/0966228133" target="_blank" rel="noopener noreferrer" className="contact-item">
              <Smartphone size={36} className="tech-icon" />
              <div className="contact-item-text">
                <span>Nhắn tin Zalo</span>
                <strong>0966.228.133</strong>
              </div>
            </a>
          </div>

        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="section bg-light">
        <div className="container">
          <h2 className="section-title">Dịch Vụ Nổi Bật</h2>
          <div className="services-grid">
            {services.map(service => (
              <div key={service.id} className="service-card">
                <div className="service-img" style={{ backgroundImage: `url(${getImageUrl(service.image)})`, backgroundSize: 'cover' }}>
                </div>
                <div className="service-content">
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <ul className="service-features">
                    <li><Cpu size={16} className="tech-icon-orange" /> Nhanh chóng</li>
                    <li><Cpu size={16} className="tech-icon-orange" /> Uy tín</li>
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="section">
        <div className="container">
          <h2 className="section-title">Dự Án Đã Thực Hiện</h2>
          <div className="projects-grid">
            {projects.length > 0 ? projects.map(project => (
              <div key={project.id} className="project-card" onClick={() => openSlideshow(project)} style={{cursor: 'pointer'}}>
                <div className="project-img" style={{ backgroundImage: `url(${getImageUrl(project.image)})` }}>
                </div>
                <div className="project-info">
                  <span className="project-category">{project.category}</span>
                  <h3>{project.title}</h3>
                  <p style={{fontSize: '0.85rem', color: '#666', marginTop: '0.5rem'}}>{project.description}</p>
                </div>
              </div>
            )) : (
              <p style={{ textAlign: 'center', gridColumn: '1 / -1' }}>Chưa có dự án nào.</p>
            )}
          </div>
        </div>
      </section>

      {/* Slideshow Modal */}
      {selectedProject && (
        <div className="modal-overlay" onClick={() => setSelectedProject(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedProject(null)}><X size={24} /></button>
            <h3 className="modal-title">{selectedProject.title}</h3>
            <p className="modal-category">{selectedProject.category}</p>
            
            <div className="slideshow-container">
              {selectedProject.images && selectedProject.images.length > 0 ? (
                <>
                  <img 
                    src={getImageUrl(selectedProject.images[currentImageIndex])} 
                    alt="Slide" 
                    className="slide-image" 
                  />
                  
                  {selectedProject.images.length > 1 && (
                    <>
                      <button className="slide-btn prev" onClick={prevImage}><ChevronLeft size={30} /></button>
                      <button className="slide-btn next" onClick={nextImage}><ChevronRight size={30} /></button>
                      <div className="slide-dots">
                        {selectedProject.images.map((_, idx) => (
                          <span key={idx} className={`dot ${idx === currentImageIndex ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}></span>
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="no-image">Không có ảnh</div>
              )}
            </div>
            {selectedProject.description && (
              <p className="modal-description">{selectedProject.description}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
