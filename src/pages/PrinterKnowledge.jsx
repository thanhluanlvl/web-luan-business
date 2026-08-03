import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Phone, Wrench } from 'lucide-react';
import PrinterArticleCard from '../components/PrinterArticleCard';
import { printerArticles } from '../data/printerArticles';
import useSeoMeta from '../lib/useSeoMeta';
import './PrinterArticles.css';

const PAGE_URL = 'https://suamayinanduong.com/kien-thuc-may-in-an-duong';

const PrinterKnowledge = () => {
  useSeoMeta({
    title: 'Kiến thức máy in An Dương | Đổ mực, sửa chữa và xử lý sự cố',
    description: 'Hướng dẫn đổ mực, sửa máy in, xử lý kẹt giấy và bản in mờ sọc lem tại An Dương. Nội dung dễ hiểu từ dịch vụ Nguyễn Thành Luân.',
    url: PAGE_URL,
    image: 'https://suamayinanduong.com/service_toner_refill.png',
  });

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Kiến thức máy in tại An Dương',
    url: PAGE_URL,
    description: 'Các bài viết về đổ mực, sửa máy in và xử lý sự cố máy in tại An Dương, Hải Phòng.',
    hasPart: printerArticles.map((article) => ({
      '@type': 'Article',
      headline: article.title,
      url: `https://suamayinanduong.com/${article.slug}`,
    })),
  };

  return (
    <main className="printer-knowledge-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />

      <header className="printer-knowledge-hero">
        <div className="container">
          <span><Wrench size={18} /> KIẾN THỨC MÁY IN DỄ ÁP DỤNG</span>
          <h1>Đổ mực, sửa chữa và xử lý sự cố máy in tại An Dương</h1>
          <p>
            Những hướng dẫn thực tế giúp bạn nhận biết lỗi, xử lý bước đầu an toàn và biết lúc nào nên gọi kỹ thuật viên.
            Nội dung được viết cho gia đình, cửa hàng và văn phòng quanh An Dương, Hải Phòng.
          </p>
          <div className="printer-knowledge-actions">
            <a className="btn-primary" href="tel:0966228133"><Phone size={18} /> Gọi 0966.228.133</a>
            <Link className="btn-outline printer-home-link" to="/">Xem toàn bộ dịch vụ <ArrowRight size={18} /></Link>
          </div>
        </div>
      </header>

      <section className="section container">
        <div className="printer-section-heading">
          <span><MapPin size={17} /> Nguyễn Thành Luân · 296 Đặng Cương, An Dương</span>
          <h2>4 bài hướng dẫn máy in mới nhất</h2>
          <p>Từ dấu hiệu hết mực đến kẹt giấy và sọc đen, mỗi bài đều đi thẳng vào nguyên nhân, cách kiểm tra và lưu ý an toàn.</p>
        </div>
        <div className="printer-article-grid">
          {printerArticles.map((article) => <PrinterArticleCard article={article} key={article.slug} />)}
        </div>
      </section>
    </main>
  );
};

export default PrinterKnowledge;
