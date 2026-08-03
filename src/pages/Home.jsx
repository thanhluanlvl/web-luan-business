import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Zap,
  Cpu,
  X,
  ChevronLeft,
  ChevronRight,
  Phone,
  Smartphone,
  Download,
  HardDriveDownload,
  Search,
  ShieldCheck,
} from 'lucide-react';
import { services } from '../data';
import { printerArticles } from '../data/printerArticles';
import PrinterArticleCard from '../components/PrinterArticleCard';
import './Home.css';

const API_BASE = import.meta.env.DEV ? 'http://localhost:3001' : '';

const getDriveLabels = (resourceType) => {
  if (resourceType === 'folder') return { type: 'Thư mục Google Drive', action: 'Mở thư mục' };
  if (resourceType === 'file') return { type: 'File Google Drive', action: 'Mở file' };
  return { type: 'Link Google Drive', action: 'Mở Drive' };
};

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [downloads, setDownloads] = useState([]);
  const [downloadsLoading, setDownloadsLoading] = useState(true);
  const [downloadsError, setDownloadsError] = useState('');
  const [downloadSearch, setDownloadSearch] = useState('');

  useEffect(() => {
    let settleTimer;

    const scrollToDownloads = () => {
      if (window.location.hash !== '#downloads') return;

      window.requestAnimationFrame(() => {
        document.getElementById('downloads')?.scrollIntoView({ block: 'start' });
      });
      settleTimer = window.setTimeout(() => {
        document.getElementById('downloads')?.scrollIntoView({ block: 'start' });
      }, 150);
    };

    scrollToDownloads();
    window.addEventListener('hashchange', scrollToDownloads);
    return () => {
      window.clearTimeout(settleTimer);
      window.removeEventListener('hashchange', scrollToDownloads);
    };
  }, []);

  const getImageUrl = (imgPath) => {
    if (!imgPath) return '';
    if (imgPath.startsWith('http')) return imgPath;
    if (imgPath.startsWith('/uploads/')) return `http://localhost:3001${imgPath}`;
    return imgPath.startsWith('/') ? imgPath : '/' + imgPath;
  };

  useEffect(() => {
    const projectsUrl = import.meta.env.DEV ? 'http://localhost:3001/api/projects' : '/projects.json';
    fetch(projectsUrl)
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(err => console.error("Error fetching projects:", err));
  }, []);

  useEffect(() => {
    fetch(`${API_BASE}/api/downloads`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Không tải được danh sách.');
        return data;
      })
      .then(data => setDownloads(data.downloads || []))
      .catch(error => setDownloadsError(error.message || 'Không tải được danh sách.'))
      .finally(() => setDownloadsLoading(false));
  }, []);

  const visibleDownloads = useMemo(() => {
    const keyword = downloadSearch.trim().toLocaleLowerCase('vi');
    if (!keyword) return downloads;
    return downloads.filter((item) =>
      `${item.name} ${item.description || ''}`.toLocaleLowerCase('vi').includes(keyword)
    );
  }, [downloadSearch, downloads]);

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
      <section className="hero" style={{ backgroundImage: `url('/luan_storefront.png?v=296')` }}>
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
              <article key={service.id} className="service-card">
                <img
                  className="service-img"
                  src={getImageUrl(service.image)}
                  alt={service.imageAlt || `${service.title} tại An Dương, Hải Phòng`}
                  loading="lazy"
                  style={{ objectPosition: service.imagePosition || 'center' }}
                />
                <div className="service-content">
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <ul className="service-features">
                    {(service.features || ['Nhanh chóng', 'Uy tín']).map(feature => (
                      <li key={feature}><Cpu size={16} className="tech-icon-orange" /> {feature}</li>
                    ))}
                  </ul>
                  {service.href && (
                    <Link className="service-detail-link" to={service.href}>
                      Xem chi tiết dịch vụ <ArrowRight size={17} />
                    </Link>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Printer Knowledge Section */}
      <section id="printer-knowledge" className="section knowledge-section">
        <div className="container">
          <div className="knowledge-heading">
            <div>
              <span>KIẾN THỨC HỮU ÍCH TẠI AN DƯƠNG</span>
              <h2>Đổ mực, sửa chữa và xử lý sự cố máy in</h2>
              <p>Hướng dẫn dễ hiểu để nhận biết lỗi, xử lý bước đầu an toàn và biết khi nào nên gọi kỹ thuật viên tận nơi.</p>
            </div>
            <Link className="knowledge-all-link" to="/kien-thuc-may-in-an-duong">
              Xem tất cả bài viết <ArrowRight size={18} />
            </Link>
          </div>
          <div className="knowledge-grid">
            {printerArticles.map((article) => <PrinterArticleCard article={article} key={article.slug} />)}
          </div>
        </div>
      </section>

      {/* Downloads Section */}
      <section id="downloads" className="section downloads-section">
        <div className="container">
          <div className="downloads-heading">
            <div>
              <span className="downloads-kicker"><Download size={16} /> KHO CÀI ĐẶT NHANH</span>
              <h2>Download Phần Mềm</h2>
              <p>Các công cụ cần thiết được chọn lọc để tải và cài đặt nhanh trên mọi máy tính.</p>
            </div>
            {downloads.length > 4 && (
              <label className="downloads-search">
                <Search size={18} />
                <input
                  type="search"
                  placeholder="Tìm phần mềm…"
                  value={downloadSearch}
                  onChange={(event) => setDownloadSearch(event.target.value)}
                  aria-label="Tìm phần mềm"
                />
              </label>
            )}
          </div>

          {downloadsLoading && <div className="downloads-state">Đang tải kho phần mềm…</div>}
          {!downloadsLoading && downloadsError && (
            <div className="downloads-state error">{downloadsError}</div>
          )}
          {!downloadsLoading && !downloadsError && visibleDownloads.length > 0 && (
            <div className="downloads-grid">
              {visibleDownloads.map((item, index) => (
                <article className="software-card" key={item.id}>
                  <div className="software-card-top">
                    <span className="software-icon"><HardDriveDownload size={24} /></span>
                    <span className="software-number">{String(index + 1).padStart(2, '0')}</span>
                  </div>
                  <div className="software-copy">
                    <h3>{item.name}</h3>
                    <p>{item.description || 'Phần mềm hỗ trợ cài đặt dành cho máy tính.'}</p>
                  </div>
                  <div className="software-card-footer">
                    <span><ShieldCheck size={15} /> {getDriveLabels(item.resource_type).type}</span>
                    <a
                      href={`${API_BASE}/api/downloads?action=download&id=${item.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {getDriveLabels(item.resource_type).action} <Download size={17} />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
          {!downloadsLoading && !downloadsError && downloads.length === 0 && (
            <div className="downloads-state">Kho phần mềm đang được cập nhật.</div>
          )}
          {!downloadsLoading && !downloadsError && downloads.length > 0 && visibleDownloads.length === 0 && (
            <div className="downloads-state">Không tìm thấy phần mềm phù hợp.</div>
          )}
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
