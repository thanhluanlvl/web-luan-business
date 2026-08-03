import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Phone, Printer } from 'lucide-react';
import PrinterArticleCard from '../components/PrinterArticleCard';
import { advertisingArticles } from '../data/advertisingArticles';
import useSeoMeta from '../lib/useSeoMeta';
import './PrinterArticles.css';

const PAGE_URL = 'https://suamayinanduong.com/kien-thuc-in-an-quang-cao-an-duong';

const AdvertisingKnowledge = () => {
  useSeoMeta({
    title: 'In bạt, in decal và thi công biển hiệu tại An Dương',
    description: 'Kiến thức in bạt chất lượng cao, in bạt giá rẻ, in decal và thi công biển hiệu tại An Dương. Hướng dẫn chọn vật liệu, thiết kế và lắp đặt.',
    url: PAGE_URL,
    image: 'https://suamayinanduong.com/article_banner_printing.png',
  });

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Kiến thức in ấn và biển hiệu tại An Dương',
    url: PAGE_URL,
    description: 'Các bài viết về in bạt, in decal, thiết kế và thi công biển quảng cáo tại An Dương, Hải Phòng.',
    hasPart: advertisingArticles.map((article) => ({
      '@type': 'Article',
      headline: article.title,
      url: `https://suamayinanduong.com/${article.slug}`,
    })),
  };

  return (
    <main className="printer-knowledge-page advertising-knowledge-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />

      <header className="printer-knowledge-hero advertising-knowledge-hero">
        <div className="container">
          <span><Printer size={18} /> KIẾN THỨC IN ẤN & BIỂN HIỆU THỰC TẾ</span>
          <h1>In bạt, in decal và thi công biển hiệu tại An Dương</h1>
          <p>
            Hướng dẫn chọn vật liệu, chuẩn bị nội dung, tối ưu chi phí và thi công quảng cáo phù hợp với cửa hàng, văn phòng và sự kiện.
            Nội dung tập trung vào những nhu cầu thực tế quanh An Dương, Hải Phòng.
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
          <h2>6 bài hướng dẫn in ấn và biển quảng cáo</h2>
          <p>Từ in bạt chất lượng cao, in bạt giá rẻ đến decal kính và biển hiệu mặt tiền, mỗi bài đều giúp bạn chọn đúng vật liệu và phương án thực hiện.</p>
        </div>
        <div className="printer-article-grid">
          {advertisingArticles.map((article) => <PrinterArticleCard article={article} key={article.slug} />)}
        </div>
      </section>
    </main>
  );
};

export default AdvertisingKnowledge;
