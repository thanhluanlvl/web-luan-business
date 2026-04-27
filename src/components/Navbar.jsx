import { Link } from 'react-router-dom';
import { Cpu } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
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
          <li><a href="#services">Dịch vụ</a></li>
          <li><a href="#projects">Dự án</a></li>
          <li><a href="#contact">Liên hệ</a></li>
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
