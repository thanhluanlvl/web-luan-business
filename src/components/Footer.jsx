import { Link } from 'react-router-dom';
import { Globe, Mail, MapPin, MessageCircle, Navigation, Phone } from 'lucide-react';
import { ADDRESS, EMAIL, FACEBOOK_URL, MAP_URL, PHONE_DISPLAY, PHONE_TEL, ZALO_URL } from '../lib/contact';
import './Footer.css';

const serviceLinks = [
  { to: '/dich-vu-sua-chua-thiet-bi-an-duong', label: 'Sửa chữa thiết bị tại An Dương' },
  { to: '/dich-vu-in-an-quang-cao-an-duong', label: 'In ấn & quảng cáo tại An Dương' },
  { to: '/cho-thue-may-photocopy-an-duong', label: 'Cho thuê máy photocopy' },
  { to: '/kien-thuc-may-in-an-duong', label: 'Kiến thức xử lý lỗi máy in' },
  { to: '/kien-thuc-in-an-quang-cao-an-duong', label: 'Kiến thức in ấn & biển hiệu' },
];

const Footer = () => {
  return (
    <>
      <footer className="footer" id="contact">
        <div className="container">
          <div className="footer-cta">
            <div>
              <p className="footer-cta-eyebrow">Liên hệ trực tiếp</p>
              <h2>Cần tư vấn hoặc báo giá?</h2>
              <p>Gửi ảnh thiết bị đang lỗi, mã máy hoặc kích thước biển hiệu qua Zalo để được hướng dẫn và báo phương án nhanh.</p>
            </div>
            <div className="footer-cta-actions">
              <a href={PHONE_TEL} className="btn-primary btn-lg"><Phone size={20} /> {PHONE_DISPLAY}</a>
              <a href={ZALO_URL} target="_blank" rel="noopener noreferrer" className="btn-glass btn-lg">
                <MessageCircle size={20} /> Nhắn Zalo
              </a>
            </div>
          </div>

          <div className="footer-grid">
            <div className="footer-col footer-about">
              <p className="footer-brand">Hộ kinh doanh Nguyễn Thành Luân</p>
              <p>Sửa chữa thiết bị, in bạt, in decal và thi công biển hiệu tại An Dương; địa chỉ rõ ràng, tư vấn đúng nhu cầu và báo phương án trước khi làm.</p>
              <a href={MAP_URL} target="_blank" rel="noopener noreferrer" className="footer-map">
                <Navigation size={16} /> Chỉ đường đến cửa hàng
              </a>
            </div>
            <div className="footer-col">
              <h3>Liên hệ</h3>
              <ul className="contact-info">
                <li><Phone size={18} /> <a href={PHONE_TEL}>{PHONE_DISPLAY}</a></li>
                <li><MessageCircle size={18} /> <a href={ZALO_URL} target="_blank" rel="noopener noreferrer">Zalo: {PHONE_DISPLAY}</a></li>
                <li><Globe size={18} /> <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer">Facebook: In ấn An Dương</a></li>
                <li><Mail size={18} /> <a href={`mailto:${EMAIL}`}>{EMAIL}</a></li>
                <li><MapPin size={18} /> <span>{ADDRESS}</span></li>
              </ul>
            </div>
            <div className="footer-col">
              <h3>Dịch vụ &amp; kiến thức</h3>
              <ul className="footer-links">
                {serviceLinks.map((item) => (
                  <li key={item.to}><Link to={item.to}>{item.label}</Link></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="container">
            <p>&copy; {new Date().getFullYear()} Hộ kinh doanh Nguyễn Thành Luân · {ADDRESS}</p>
          </div>
        </div>
      </footer>

      <nav className="mobile-callbar" aria-label="Liên hệ nhanh">
        <a href={PHONE_TEL} className="is-call"><Phone size={19} /> Gọi ngay</a>
        <a href={ZALO_URL} target="_blank" rel="noopener noreferrer"><MessageCircle size={19} /> Nhắn Zalo</a>
      </nav>
    </>
  );
};

export default Footer;
