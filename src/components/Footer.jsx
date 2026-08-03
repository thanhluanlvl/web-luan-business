import { MapPin, Phone, Mail } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer" id="contact">
      <div className="container footer-container">
        <div className="footer-col">
          <h3>Hộ kinh doanh Nguyễn Thành Luân</h3>
          <p>Sửa chữa thiết bị, in bạt, in decal và thi công biển hiệu tại An Dương; địa chỉ rõ ràng, tư vấn đúng nhu cầu và báo phương án trước khi làm.</p>
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
            <li><MapPin size={18} className="tech-icon-orange" /> <span>296 Đặng Cương, An Dương, Hải Phòng</span></li>
          </ul>
        </div>
        <div className="footer-col">
          <h3>Dịch vụ</h3>
          <ul>
            <li><a href="/dich-vu-sua-chua-thiet-bi-an-duong">Sửa chữa thiết bị tại An Dương</a></li>
            <li><a href="/dich-vu-in-an-quang-cao-an-duong">In ấn & quảng cáo tại An Dương</a></li>
            <li><a href="/cho-thue-may-photocopy-an-duong">Cho thuê máy photocopy</a></li>
            <li><a href="/kien-thuc-may-in-an-duong">Kiến thức xử lý lỗi máy in</a></li>
            <li><a href="/kien-thuc-in-an-quang-cao-an-duong">Kiến thức in ấn & biển hiệu</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Nguyễn Thành Luân. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
