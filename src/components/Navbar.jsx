import { Link, useNavigate } from 'react-router-dom';
import { Cpu } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  const handleDownloadClick = (event) => {
    event.preventDefault();
    navigate('/#downloads');

    const revealDownloads = (attempt = 0) => {
      const section = document.getElementById('downloads');
      if (section) {
        section.scrollIntoView({ block: 'start' });
        return;
      }

      if (attempt < 10) {
        window.setTimeout(() => revealDownloads(attempt + 1), 25);
      }
    };

    window.setTimeout(revealDownloads, 0);
  };

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <Link to="/" className="nav-logo">
          <div className="logo-icon">
            <Cpu size={28} className="tech-icon" />
          </div>
          <div className="logo-text">
            <span>Nguyễn Thành Luân</span>
            <span className="logo-subtitle">Sửa chữa & Thiết kế</span>
          </div>
        </Link>
        <ul className="nav-links">
          <li><Link to="/">Trang chủ</Link></li>
          <li><Link to="/dich-vu-sua-chua-thiet-bi-an-duong">Sửa chữa</Link></li>
          <li><Link to="/dich-vu-in-an-quang-cao-an-duong">In ấn</Link></li>
          <li>
            <Link to="/#downloads" className="download-nav-link" onClick={handleDownloadClick}>
              Download
            </Link>
          </li>
          <li><Link to="/pdf-tools" style={{ color: 'var(--secondary-color)', fontWeight: 'bold' }}>Công cụ PDF</Link></li>
          <li><Link to="/#contact">Liên hệ</Link></li>
          <li>
            <Link to="/admin" className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
              Quản lý
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
