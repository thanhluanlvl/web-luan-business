import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  HardDriveDownload,
  Images,
  MessageCircle,
  Phone,
  Search,
  ShieldCheck,
  X,
} from 'lucide-react';
import { services } from '../data';
import { printerArticles } from '../data/printerArticles';
import { advertisingArticles } from '../data/advertisingArticles';
import PrinterArticleCard from '../components/PrinterArticleCard';
import { PHONE_DISPLAY, PHONE_TEL, ZALO_URL } from '../lib/contact';
import './Home.css';

const API_BASE = import.meta.env.DEV ? 'http://localhost:3001' : '';

/* Năm nhóm việc chính, xếp tổ ong: ba ô trên, hai ô dưới. */
const COMB_TILES = [
  {
    to: '/sua-may-in-an-duong',
    label: 'Sửa máy in',
    cta: 'Xem dịch vụ',
    image: '/ai_service_printer_repair.jpg',
    alt: 'Kỹ thuật viên tháo hộp mực khỏi máy in laser trên bàn sửa chữa',
  },
  {
    to: '/dich-vu-sua-chua-thiet-bi-an-duong',
    label: 'Sửa máy tính',
    cta: 'Xem dịch vụ',
    image: '/ai_service_computer_repair.jpg',
    alt: 'Tay kỹ thuật viên mở nắp lưng laptop để thay linh kiện',
  },
  {
    to: '/do-muc-may-in-an-duong',
    label: 'Đổ mực tận nơi',
    cta: 'Xem dịch vụ',
    image: '/ai_service_toner_refill.jpg',
    alt: 'Đổ mực vào hộp mực máy in laser bằng phễu',
  },
  {
    to: '/cho-thue-may-photocopy-an-duong',
    label: 'Thuê photocopy',
    cta: 'Xem phương án',
    image: '/ai_service_photocopier.jpg',
    alt: 'Máy photocopy văn phòng đặt cạnh các ram giấy',
  },
  {
    to: '/dich-vu-in-an-quang-cao-an-duong',
    label: 'In bạt & biển hiệu',
    cta: 'Xem dịch vụ',
    image: '/article_banner_printing.png',
    alt: 'Máy in khổ lớn đang in bạt quảng cáo',
  },
];

// Phần mềm của tiệm: link tải ngắn trên VPS, file nén .zip (EXE trần hay bị chặn).
const SHOP_SOFTWARE = [
  {
    id: 'ricoh-scan-setup',
    name: 'Ricoh Scan Setup',
    description: 'Tự cài Scan về máy tính và cài máy in cho máy photocopy Ricoh, chỉ cần nhập IP máy. Miễn phí.',
    url: 'https://rustdesk.suamayinanduong.com/ricoh',
  },
  {
    id: 'it-helpdesk',
    name: 'IT HelpDesk',
    description: 'Cài để tiệm hỗ trợ sửa máy tính, máy in từ xa nhanh chóng.',
    url: 'https://rustdesk.suamayinanduong.com/hd',
  },
];

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

    const scrollToHash = () => {
      const targetId = window.location.hash.slice(1);
      if (!targetId) return;

      window.requestAnimationFrame(() => {
        document.getElementById(targetId)?.scrollIntoView({ block: 'start' });
      });
      settleTimer = window.setTimeout(() => {
        document.getElementById(targetId)?.scrollIntoView({ block: 'start' });
      }, 150);
    };

    scrollToHash();
    window.addEventListener('hashchange', scrollToHash);
    return () => {
      window.clearTimeout(settleTimer);
      window.removeEventListener('hashchange', scrollToHash);
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

  const visibleShopSoftware = useMemo(() => {
    const keyword = downloadSearch.trim().toLocaleLowerCase('vi');
    if (!keyword) return SHOP_SOFTWARE;
    return SHOP_SOFTWARE.filter((item) =>
      `${item.name} ${item.description}`.toLocaleLowerCase('vi').includes(keyword));
  }, [downloadSearch]);

  const imageCount = selectedProject?.images?.length || 0;

  useEffect(() => {
    if (!selectedProject) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') setSelectedProject(null);
      if (imageCount > 1 && event.key === 'ArrowRight') setCurrentImageIndex((prev) => (prev + 1) % imageCount);
      if (imageCount > 1 && event.key === 'ArrowLeft') setCurrentImageIndex((prev) => (prev - 1 + imageCount) % imageCount);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedProject, imageCount]);

  const openSlideshow = (project) => {
    setSelectedProject(project);
    setCurrentImageIndex(0);
  };

  const nextImage = (e) => {
    e.stopPropagation();
    if (imageCount > 0) setCurrentImageIndex((prev) => (prev + 1) % imageCount);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    if (imageCount > 0) setCurrentImageIndex((prev) => (prev - 1 + imageCount) % imageCount);
  };

  const renderTile = (tile) => (
    <Link className="comb-tile" to={tile.to} key={tile.to}>
      <img src={tile.image} alt={tile.alt} loading="lazy" />
      <span className="comb-label">
        <b>{tile.label}</b>
        <span>{tile.cta}</span>
      </span>
    </Link>
  );

  return (
    <div className="home-wrapper">
      {/* Đầu trang: ảnh lớn, chữ căn giữa */}
      <section className="hero-e" aria-labelledby="hero-title">
        <div className="container hero-e-inner">
          <p className="hero-e-eyebrow">Sửa chữa · In ấn · Tận nơi quanh An Dương</p>
          <h1 id="hero-title" className="hero-e-title">
            Công nghệ <b>&amp; Quảng cáo</b>
          </h1>
          <p className="hero-e-sub">296 Đặng Cương · An Dương · Hải Phòng</p>
          <div className="hero-e-actions">
            <a href={PHONE_TEL} className="btn-primary btn-lg"><Phone size={20} /> Gọi {PHONE_DISPLAY}</a>
            <a href={ZALO_URL} target="_blank" rel="noopener noreferrer" className="btn-glass btn-lg">
              <MessageCircle size={20} /> Nhắn Zalo
            </a>
          </div>
        </div>
        <a href="#service-paths" className="hero-e-chev" aria-label="Xem các nhóm dịch vụ">
          <ChevronDown size={26} />
        </a>
      </section>

      {/* Năm nhóm việc chính */}
      <section id="service-paths" className="section comb-section">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Chọn việc bạn đang cần</span>
            <h2>Năm nhóm việc nhận nhiều nhất</h2>
            <p>Bấm vào từng ô để xem cách làm, cam kết và chi phí dự kiến của nhóm việc đó.</p>
          </div>
          <div className="comb">
            <div className="comb-row">{COMB_TILES.slice(0, 3).map(renderTile)}</div>
            <div className="comb-row comb-row-2">{COMB_TILES.slice(3).map(renderTile)}</div>
          </div>
        </div>
      </section>

      {/* Giới thiệu ngắn */}
      <section className="intro-section">
        <div className="container">
          <div className="intro-rule" />
          <p className="intro-text">
            Hộ kinh doanh Nguyễn Thành Luân nhận sửa máy tính, máy in, máy photocopy, đổ mực tận nơi và
            in bạt, in decal, thi công biển hiệu quanh An Dương, Hải Phòng. Mọi việc đều được kiểm tra,
            báo phương án và chi phí trước khi làm.
          </p>
          <div className="intro-rule" />
          <ul className="home-trust-band" aria-label="Cam kết dịch vụ">
            <li><CheckCircle2 size={19} /> Địa chỉ thật: 296 Đặng Cương</li>
            <li><CheckCircle2 size={19} /> Báo phương án trước khi làm</li>
            <li><CheckCircle2 size={19} /> Hỗ trợ tận nơi quanh An Dương</li>
            <li><CheckCircle2 size={19} /> Gọi &amp; Zalo: {PHONE_DISPLAY}</li>
          </ul>
        </div>
      </section>

      {/* Dịch vụ nổi bật */}
      <section id="services" className="section services-section">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Dịch vụ tại cửa hàng và tận nơi</span>
            <h2>Dịch vụ nổi bật</h2>
            <p>Sáu nhóm việc khách hàng quanh An Dương gọi nhiều nhất. Bấm vào từng dịch vụ để xem chi tiết.</p>
          </div>
          <div className="services-grid">
            {services.map(service => (
              <article key={service.id} className="service-card">
                <Link className="service-media" to={service.href} tabIndex={-1} aria-hidden="true">
                  <img
                    className="service-img"
                    src={getImageUrl(service.image)}
                    alt={service.imageAlt || `${service.title} tại An Dương, Hải Phòng`}
                    loading="lazy"
                    style={{ objectPosition: service.imagePosition || 'center' }}
                  />
                </Link>
                <div className="service-content">
                  <h3>
                    <Link className="service-title-link" to={service.href}>
                      {service.title}
                    </Link>
                  </h3>
                  <p>{service.description}</p>
                  <ul className="service-features">
                    {service.features.map(feature => (
                      <li key={feature}><CheckCircle2 size={15} /> {feature}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Kiến thức máy in */}
      <section id="printer-knowledge" className="section knowledge-section">
        <div className="container">
          <div className="knowledge-heading">
            <div>
              <span className="eyebrow">Kiến thức hữu ích tại An Dương</span>
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

      {/* Kiến thức in ấn */}
      <section id="advertising-knowledge" className="section advertising-knowledge-section">
        <div className="container">
          <div className="knowledge-heading">
            <div>
              <span className="eyebrow">In ấn &amp; biển hiệu tại An Dương</span>
              <h2>In bạt, in decal và thi công biển quảng cáo</h2>
              <p>Kinh nghiệm chọn vật liệu, chuẩn bị file, tối ưu chi phí và làm mặt tiền cửa hàng rõ đẹp, chắc chắn.</p>
            </div>
            <Link className="knowledge-all-link" to="/kien-thuc-in-an-quang-cao-an-duong">
              Xem {advertisingArticles.length} bài hướng dẫn <ArrowRight size={18} />
            </Link>
          </div>
          <div className="knowledge-grid">
            {advertisingArticles.slice(0, 4).map((article) => <PrinterArticleCard article={article} key={article.slug} />)}
          </div>
        </div>
      </section>

      {/* Kho phần mềm */}
      <section id="downloads" className="section downloads-section">
        <div className="container">
          <div className="downloads-heading">
            <div>
              <span className="downloads-kicker"><Download size={16} /> Kho cài đặt nhanh</span>
              <h2>Download phần mềm</h2>
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

          {visibleShopSoftware.length > 0 && (
            <div className="downloads-grid">
              {visibleShopSoftware.map((item) => (
                <article className="software-card" key={item.id}>
                  <span className="software-icon"><HardDriveDownload size={24} /></span>
                  <div className="software-copy">
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                  </div>
                  <div className="software-card-footer">
                    <span><ShieldCheck size={15} /> File nén .zip</span>
                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                      Tải về <Download size={17} />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}

          {downloadsLoading && <div className="downloads-state">Đang tải kho phần mềm…</div>}
          {!downloadsLoading && downloadsError && (
            <div className="downloads-state error">{downloadsError}</div>
          )}
          {!downloadsLoading && !downloadsError && visibleDownloads.length > 0 && (
            <div className="downloads-grid downloads-grid-more">
              {visibleDownloads.map((item) => (
                <article className="software-card" key={item.id}>
                  <span className="software-icon"><HardDriveDownload size={24} /></span>
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
          {!downloadsLoading && !downloadsError && downloadSearch.trim() &&
            visibleDownloads.length === 0 && visibleShopSoftware.length === 0 && (
            <div className="downloads-state">Không tìm thấy phần mềm phù hợp.</div>
          )}
        </div>
      </section>

      {/* Dự án */}
      <section id="projects" className="section projects-section">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow"><Images size={16} /> Hình ảnh thực tế</span>
            <h2>Dự án đã thực hiện</h2>
            <p>Một số công trình biển hiệu và hạng mục kỹ thuật đã bàn giao. Bấm vào từng dự án để xem ảnh.</p>
          </div>
          <div className="projects-grid">
            {projects.length > 0 ? projects.map(project => (
              <button type="button" key={project.id} className="project-card" onClick={() => openSlideshow(project)}>
                <img src={getImageUrl(project.image)} alt="" loading="lazy" />
                <span className="project-info">
                  <span className="project-category">{project.category}</span>
                  <span className="project-title">{project.title}</span>
                  {project.description && <span className="project-desc">{project.description}</span>}
                  <span className="project-more">Xem ảnh <ArrowRight size={15} /></span>
                </span>
              </button>
            )) : (
              <p className="projects-empty">Chưa có dự án nào.</p>
            )}
          </div>
        </div>
      </section>

      {/* Xem ảnh dự án */}
      {selectedProject && (
        <div className="modal-overlay" onClick={() => setSelectedProject(null)}>
          <div
            className="modal-content"
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            onClick={e => e.stopPropagation()}
          >
            <button type="button" className="modal-close" onClick={() => setSelectedProject(null)} aria-label="Đóng" autoFocus>
              <X size={22} />
            </button>
            <p className="modal-category">{selectedProject.category}</p>
            <h3 id="project-modal-title" className="modal-title">{selectedProject.title}</h3>

            <div className="slideshow-container">
              {imageCount > 0 ? (
                <>
                  <img
                    src={getImageUrl(selectedProject.images[currentImageIndex])}
                    alt={`${selectedProject.title} – ảnh ${currentImageIndex + 1}`}
                    className="slide-image"
                  />

                  {imageCount > 1 && (
                    <>
                      <button type="button" className="slide-btn prev" onClick={prevImage} aria-label="Ảnh trước"><ChevronLeft size={26} /></button>
                      <button type="button" className="slide-btn next" onClick={nextImage} aria-label="Ảnh sau"><ChevronRight size={26} /></button>
                      <div className="slide-dots">
                        {selectedProject.images.map((_, idx) => (
                          <button
                            type="button"
                            key={idx}
                            className={`dot ${idx === currentImageIndex ? 'active' : ''}`}
                            aria-label={`Ảnh ${idx + 1}`}
                            aria-current={idx === currentImageIndex}
                            onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                          />
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
