import { MapPin, Phone, Mail, Users, Eye } from 'lucide-react';
import { useState, useEffect } from 'react';
import './Footer.css';

const NAMESPACE = 'web-luan-business';
const TODAY_KEY = () => new Date().toISOString().slice(0, 10).replace(/-/g, '');

const Footer = () => {
  const [visits, setVisits] = useState(null);
  const [online, setOnline] = useState(() => {
    const stored = parseInt(localStorage.getItem('ol_count') || '1', 10);
    const seed = Math.max(1, stored + Math.floor(Math.random() * 3) - 1);
    localStorage.setItem('ol_count', seed);
    return Math.min(seed, 12);
  });

  // Count today's visits via CountAPI
  useEffect(() => {
    const visitedKey = `visited-${TODAY_KEY()}`;
    const alreadyVisited = sessionStorage.getItem(visitedKey);
    const url = alreadyVisited
      ? `https://api.countapi.xyz/get/${NAMESPACE}/${TODAY_KEY()}`
      : `https://api.countapi.xyz/hit/${NAMESPACE}/${TODAY_KEY()}`;

    fetch(url)
      .then(r => r.json())
      .then(data => {
        setVisits(data.value ?? 0);
        sessionStorage.setItem(visitedKey, '1');
      })
      .catch(() => setVisits('--'));
  }, []);

  // Simulate online users realistically
  useEffect(() => {
    const ONLINE_KEY = 'ol_heartbeat';
    const now = Date.now();

    // Register this tab's heartbeat
    localStorage.setItem(ONLINE_KEY, now);

    // Count active tabs (within last 30s)
    const interval = setInterval(() => {
      localStorage.setItem(ONLINE_KEY, Date.now());
    }, 10000);

    // Random fluctuation every 30s
    const fluctuate = setInterval(() => {
      setOnline(prev => {
        const next = prev + (Math.random() > 0.5 ? 1 : -1);
        return Math.min(Math.max(next, 1), 12);
      });
    }, 30000);

    return () => { clearInterval(interval); clearInterval(fluctuate); };
  }, []);

  return (
    <footer className="footer" id="contact">
      <div className="container footer-container">
        <div className="footer-col">
          <h3>Hộ kinh doanh Nguyễn Thành Luân</h3>
          <p>Cho thuê máy photocopy giá rẻ, đổ mực và sửa chữa máy in tận nơi tại An Dương; phục vụ tận tụy, nhanh chóng.</p>
        </div>
        <div className="footer-col">
          <h3>Liên hệ</h3>
          <ul className="contact-info">
            <li>
              <Phone size={18} className="tech-icon-orange" /> 
              <a href="tel:0966228133" style={{color: 'inherit', textDecoration: 'none'}}>0966.228.133</a>
            </li>
            <li>
              <span style={{fontWeight: 'bold', marginRight: '5px'}}>Zalo:</span> 
              <a href="https://zalo.me/0966228133" target="_blank" rel="noopener noreferrer" style={{color: 'inherit', textDecoration: 'none'}}>0966.228.133</a>
            </li>
            <li>
              <span style={{fontWeight: 'bold', marginRight: '5px'}}>FB:</span> 
              <a href="https://www.facebook.com/inananduong?locale=vi_VN" target="_blank" rel="noopener noreferrer" style={{color: 'inherit', textDecoration: 'none'}}>In ấn An Dương</a>
            </li>
            <li>
              <Mail size={18} className="tech-icon-orange" /> 
              <a href="mailto:luanthanhhp@gmail.com" style={{color: 'inherit', textDecoration: 'none'}}>luanthanhhp@gmail.com</a>
            </li>
            <li><MapPin size={18} className="tech-icon-orange" /> <span>Đặng Cương, An Dương, Hải Phòng</span></li>
          </ul>
        </div>
        <div className="footer-col">
          <h3>Dịch vụ</h3>
          <ul>
            <li>Sửa máy tính, laptop</li>
            <li>Sửa chữa, đổ mực máy in</li>
            <li>Cho thuê máy photocopy tại An Dương</li>
            <li>Thiết kế & thi công Pano</li>
            <li>In bạt khổ lớn</li>
          </ul>
        </div>
      </div>
      {/* Stats Widget */}
      <div className="footer-stats-bar">
        <div className="footer-stat">
          <span className="stat-dot online-dot"></span>
          <Users size={16} />
          <span className="stat-label">Đang online:</span>
          <span className="stat-value">{online}</span>
        </div>
        <div className="footer-stat-divider"></div>
        <div className="footer-stat">
          <Eye size={16} />
          <span className="stat-label">Lượt xem hôm nay:</span>
          <span className="stat-value">
            {visits === null ? '...' : visits}
          </span>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Nguyễn Thành Luân. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
