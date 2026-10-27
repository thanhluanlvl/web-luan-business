import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Megaphone, Menu, Phone, Wrench, X } from 'lucide-react';
import { PHONE_DISPLAY, PHONE_TEL } from '../lib/contact';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(() => typeof window !== 'undefined' && window.scrollY > 8);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const close = () => setOpen(false);

  // Trang chủ có ảnh lớn ngay dưới thanh menu, nên menu nằm đè lên ảnh khi chưa cuộn.
  const isHome = location.pathname === '/';
  const overlay = isHome && !scrolled;

  const handleDownloadClick = (event) => {
    event.preventDefault();
    setOpen(false);
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

  const className = [
    'site-header',
    isHome ? 'is-home' : '',
    overlay ? 'is-overlay' : '',
    scrolled ? 'is-scrolled' : '',
    open ? 'is-open' : '',
  ].filter(Boolean).join(' ');

  return (
    <header className={className}>
      <nav className="container nav-bar" aria-label="Điều hướng chính">
        <Link to="/" className="nav-brand" onClick={close}>
          <span className="brand-mark" aria-hidden="true">
            <Wrench size={20} strokeWidth={2.4} />
            <span className="brand-mark-badge"><Megaphone size={11} strokeWidth={2.6} /></span>
          </span>
          <span className="brand-text">
            <strong>Nguyễn Thành Luân</strong>
            <small>Công nghệ &amp; Quảng cáo</small>
          </span>
        </Link>

        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="site-menu"
          aria-label={open ? 'Đóng menu' : 'Mở menu'}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className="nav-menu" id="site-menu">
          <ul className="nav-links">
            <li><NavLink to="/" end onClick={close}>Trang chủ</NavLink></li>
            <li><NavLink to="/dich-vu-sua-chua-thiet-bi-an-duong" onClick={close}>Sửa chữa</NavLink></li>
            <li><NavLink to="/dich-vu-in-an-quang-cao-an-duong" onClick={close}>In ấn</NavLink></li>
            <li><a href="https://rustdesk.suamayinanduong.com/hd" onClick={close}>Download</a></li>
            <li><NavLink to="/pdf-tools" onClick={close}>Công cụ PDF</NavLink></li>
            <li><Link to="/#contact" onClick={close}>Liên hệ</Link></li>
          </ul>
          <div className="nav-actions">
            <Link to="/admin" className="nav-admin" onClick={close}>Quản lý</Link>
            <a href={PHONE_TEL} className="btn-primary nav-call"><Phone size={18} /> {PHONE_DISPLAY}</a>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
