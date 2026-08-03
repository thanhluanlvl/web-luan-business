import { useEffect } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  MapPin,
  Phone,
  Printer,
  ShieldCheck,
  Wrench,
} from 'lucide-react';
import './PhotocopierRental.css';

const PAGE_TITLE = 'Cho thuê máy photocopy giá rẻ tại An Dương | Nguyễn Thành Luân';
const PAGE_DESCRIPTION = 'Cho thuê máy photocopy giá rẻ tại An Dương, Hải Phòng; lắp đặt, bảo trì, đổ mực và sửa máy tận nơi với thái độ tận tụy.';
const PAGE_URL = 'https://suamayinanduong.com/cho-thue-may-photocopy-an-duong';

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Cho thuê máy photocopy giá rẻ tại An Dương',
  description: PAGE_DESCRIPTION,
  url: PAGE_URL,
  areaServed: {
    '@type': 'Place',
    name: 'An Dương, Hải Phòng',
  },
  provider: {
    '@type': 'LocalBusiness',
    name: 'Hộ kinh doanh Nguyễn Thành Luân',
    telephone: '+84966228133',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '296 Đặng Cương',
      addressLocality: 'An Dương',
      addressRegion: 'Hải Phòng',
      addressCountry: 'VN',
    },
  },
};

const PhotocopierRental = () => {
  useEffect(() => {
    const description = document.querySelector('meta[name="description"]');
    const canonical = document.querySelector('link[rel="canonical"]');
    const previousTitle = document.title;
    const previousDescription = description?.getAttribute('content');
    const previousCanonical = canonical?.getAttribute('href');

    document.title = PAGE_TITLE;
    description?.setAttribute('content', PAGE_DESCRIPTION);
    canonical?.setAttribute('href', PAGE_URL);

    return () => {
      document.title = previousTitle;
      if (previousDescription) description?.setAttribute('content', previousDescription);
      if (previousCanonical) canonical?.setAttribute('href', previousCanonical);
    };
  }, []);

  return (
    <main className="rental-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      <section className="rental-hero">
        <div className="container rental-hero-grid">
          <div className="rental-hero-copy">
            <span className="rental-kicker"><MapPin size={17} /> Phục vụ quanh khu vực An Dương, Hải Phòng</span>
            <h1>Cho thuê máy photocopy giá rẻ tại An Dương</h1>
            <p>
              Có máy dùng ngay, không cần bỏ vốn lớn. Chúng tôi khảo sát nhu cầu, lắp đặt tận nơi,
              hướng dẫn sử dụng và đồng hành tận tụy trong suốt thời gian thuê.
            </p>
            <div className="rental-hero-actions">
              <a className="btn-primary" href="tel:0966228133"><Phone size={19} /> Gọi 0966.228.133</a>
              <a className="btn-outline rental-zalo" href="https://zalo.me/0966228133" target="_blank" rel="noopener noreferrer">
                Nhận tư vấn qua Zalo <ArrowRight size={18} />
              </a>
            </div>
            <ul className="rental-trust-list">
              <li><CheckCircle2 size={18} /> Báo phương án rõ ràng</li>
              <li><CheckCircle2 size={18} /> Lắp đặt tận nơi</li>
              <li><CheckCircle2 size={18} /> Hỗ trợ trong quá trình thuê</li>
            </ul>
          </div>
          <figure className="rental-hero-image">
            <img
              src="/service_photocopier_rental.png"
              alt="Kỹ thuật viên lắp đặt máy photocopy cho thuê tại An Dương, Hải Phòng"
            />
          </figure>
        </div>
      </section>

      <article className="rental-article container">
        <section className="rental-intro">
          <span className="rental-section-label">GIẢI PHÁP TIẾT KIỆM CHO VĂN PHÒNG</span>
          <h2>Dịch vụ cho thuê máy photocopy tận tụy, phù hợp nhu cầu thực tế</h2>
          <p>
            Một chiếc máy photocopy phù hợp giúp công việc in, sao chụp và scan tài liệu diễn ra liền mạch,
            nhưng chi phí mua máy, thay vật tư và sửa chữa có thể tạo áp lực cho doanh nghiệp nhỏ. Dịch vụ
            <strong> cho thuê máy photocopy giá rẻ tại An Dương</strong> giúp văn phòng, trường học, cửa hàng,
            cơ sở sản xuất và đơn vị hành chính chủ động thiết bị mà không phải đầu tư ban đầu quá lớn.
          </p>
          <p>
            Chúng tôi không chỉ giao máy rồi rời đi. Mỗi nhu cầu được lắng nghe kỹ về lượng bản in, khổ giấy,
            chức năng in hai mặt, scan và kết nối mạng để lựa chọn máy hợp lý. Mục tiêu là một phương án thuê
            dễ sử dụng, chi phí minh bạch và được hỗ trợ tận tụy quanh khu vực An Dương, Hải Phòng.
          </p>
        </section>

        <section className="rental-benefit-grid" aria-label="Lợi ích khi thuê máy photocopy">
          <div className="rental-benefit-card">
            <Printer size={30} />
            <h3>Máy phù hợp khối lượng công việc</h3>
            <p>Tư vấn theo nhu cầu in thực tế để tránh thuê máy quá yếu hoặc trả chi phí cho tính năng không cần thiết.</p>
          </div>
          <div className="rental-benefit-card">
            <Wrench size={30} />
            <h3>Bảo trì và sửa máy photocopy tận nơi</h3>
            <p>Khi máy có dấu hiệu bản in mờ, kẹt giấy hay báo lỗi, chúng tôi tiếp nhận và hỗ trợ nhanh trong khu vực.</p>
          </div>
          <div className="rental-benefit-card">
            <ShieldCheck size={30} />
            <h3>Chi phí rõ ràng, dùng máy an tâm</h3>
            <p>Phương án thuê, định mức bản in, vật tư và phạm vi hỗ trợ được trao đổi rõ trước khi lắp đặt.</p>
          </div>
          <div className="rental-benefit-card">
            <Clock3 size={30} />
            <h3>Phục vụ gần, phản hồi nhanh</h3>
            <p>Lợi thế ở An Dương giúp việc khảo sát, giao máy, đổ mực và xử lý sự cố thuận tiện hơn.</p>
          </div>
        </section>

        <section className="rental-toner-block">
          <div>
            <span className="rental-section-label">ĐỒNG HÀNH TRONG SUỐT THỜI GIAN THUÊ</span>
            <h2>Đổ mực máy in, đổ mực máy photocopy tận nơi tại An Dương</h2>
          </div>
          <div className="rental-toner-copy">
            <p>
              Bản in mờ, chữ không đều hay xuất hiện vệt đen thường là dấu hiệu máy cần kiểm tra vật tư và vệ sinh.
              Dịch vụ <strong>đổ mực máy in tại An Dương</strong> và <strong>đổ mực máy photocopy tận nơi</strong>
              sử dụng loại mực phù hợp với từng dòng máy, đồng thời kiểm tra hộp mực, trống, gạt và đường giấy để hạn
              chế lỗi quay lại.
            </p>
            <p>
              Với máy đang thuê, nội dung bảo trì, vật tư và số bản in sẽ được ghi rõ trong từng phương án. Với máy
              của khách hàng, chúng tôi vẫn nhận vệ sinh, sửa máy in, sửa máy photocopy và nạp mực tận nơi quanh
              Đặng Cương cùng các khu vực lân cận An Dương. Cách làm luôn gọn gàng, giải thích dễ hiểu và đặt sự ổn
              định của thiết bị lên trước.
            </p>
          </div>
        </section>

        <section className="rental-process">
          <span className="rental-section-label">QUY TRÌNH ĐƠN GIẢN</span>
          <h2>Thuê máy photocopy nhanh, không mất thời gian</h2>
          <ol>
            <li><strong>Trao đổi nhu cầu:</strong> số người dùng, lượng bản in, khổ giấy và chức năng cần thiết.</li>
            <li><strong>Đề xuất phương án:</strong> chọn cấu hình máy và nội dung hỗ trợ phù hợp ngân sách.</li>
            <li><strong>Giao và lắp đặt:</strong> kết nối máy tính, hướng dẫn sử dụng và in thử tại địa điểm.</li>
            <li><strong>Chăm sóc định kỳ:</strong> tiếp nhận yêu cầu bảo trì, sửa chữa và đổ mực trong quá trình thuê.</li>
          </ol>
        </section>

        <section className="rental-faq">
          <span className="rental-section-label">CÂU HỎI THƯỜNG GẶP</span>
          <h2>Thông tin cần biết trước khi thuê máy</h2>
          <details>
            <summary>Giá thuê máy photocopy tại An Dương được tính như thế nào?</summary>
            <p>Chi phí phụ thuộc vào cấu hình máy, lượng bản in dự kiến, thời gian thuê và phạm vi vật tư đi kèm. Hãy gửi nhu cầu để nhận phương án vừa đủ, tránh lãng phí.</p>
          </details>
          <details>
            <summary>Thuê máy có bao gồm bảo trì và đổ mực không?</summary>
            <p>Phạm vi bảo trì, đổ mực, vật tư và định mức bản in được nêu rõ trong từng phương án thuê để khách hàng dễ theo dõi và chủ động chi phí.</p>
          </details>
          <details>
            <summary>Có hỗ trợ tận nơi quanh khu vực An Dương không?</summary>
            <p>Có. Chúng tôi nhận khảo sát, lắp đặt, đổ mực và sửa máy photocopy tại Đặng Cương cùng các khu vực lân cận An Dương, Hải Phòng.</p>
          </details>
        </section>

        <section className="rental-final-cta">
          <div>
            <span>CẦN MÁY PHOTOCOPY CHO VĂN PHÒNG?</span>
            <h2>Gọi một cuộc, chúng tôi tư vấn thật nhu cầu và phục vụ tận tụy.</h2>
          </div>
          <a href="tel:0966228133"><Phone size={20} /> 0966.228.133</a>
        </section>
      </article>
    </main>
  );
};

export default PhotocopierRental;
