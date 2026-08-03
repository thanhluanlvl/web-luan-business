import { ArrowLeft, CalendarDays, Clock3, MapPin, Phone, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import PrinterArticleCard from '../components/PrinterArticleCard';
import { printerArticles } from '../data/printerArticles';
import useSeoMeta from '../lib/useSeoMeta';
import './PrinterArticles.css';

const PUBLISHED_DATE = '2026-08-03';

const PrinterArticle = ({ article }) => {
  const pageUrl = `https://suamayinanduong.com/${article.slug}`;
  const imageUrl = `https://suamayinanduong.com${article.image}`;
  const relatedArticles = printerArticles.filter((item) => item.slug !== article.slug).slice(0, 3);

  useSeoMeta({
    title: article.metaTitle,
    description: article.metaDescription,
    url: pageUrl,
    image: imageUrl,
  });

  const articleSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        headline: article.title,
        description: article.metaDescription,
        image: imageUrl,
        datePublished: PUBLISHED_DATE,
        dateModified: PUBLISHED_DATE,
        mainEntityOfPage: pageUrl,
        author: {
          '@type': 'Organization',
          name: 'Hộ kinh doanh Nguyễn Thành Luân',
          url: 'https://suamayinanduong.com/',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Hộ kinh doanh Nguyễn Thành Luân',
          url: 'https://suamayinanduong.com/',
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: article.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      },
    ],
  };

  return (
    <main className="printer-article-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <header className="printer-article-hero">
        <div className="container printer-article-hero-grid">
          <div className="printer-article-heading">
            <div className="printer-article-kicker-row">
              <Link className="printer-back-link" to="/kien-thuc-may-in-an-duong"><ArrowLeft size={17} /> Kiến thức máy in</Link>
              <span className="printer-article-category">{article.category} · An Dương, Hải Phòng</span>
            </div>
            <h1>{article.title}</h1>
            <p>{article.excerpt}</p>
            <div className="printer-article-byline">
              <span><CalendarDays size={16} /> 03/08/2026</span>
              <span><Clock3 size={16} /> {article.readingTime}</span>
              <span><MapPin size={16} /> 296 Đặng Cương</span>
            </div>
          </div>
          <figure className="printer-article-hero-image">
            <img src={article.image} alt={article.imageAlt} style={{ objectPosition: article.imagePosition || 'center' }} />
          </figure>
        </div>
      </header>

      <article className="printer-article-body container">
        <div className="printer-article-main">
          <div className="printer-article-intro">
            {article.intro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>

          {article.sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {section.bullets && (
                <ul>
                  {section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                </ul>
              )}
              {section.note && <aside className="printer-safety-note"><ShieldAlert size={22} /><p>{section.note}</p></aside>}
            </section>
          ))}

          <section className="printer-article-faq">
            <h2>Câu hỏi thường gặp</h2>
            {article.faqs.map((faq) => (
              <details key={faq.question}>
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </section>
        </div>

        <aside className="printer-local-card">
          <img src="/luan_storefront.png?v=296" alt="Nguyễn Thành Luân tại cửa hàng 296 Đặng Cương, An Dương" />
          <div>
            <span>PHỤC VỤ TẬN TỤY TẠI AN DƯƠNG</span>
            <h2>Cần kiểm tra máy in tận nơi?</h2>
            <p>Gửi mã máy và ảnh trang in lỗi qua Zalo để được hướng dẫn bước đầu và chuẩn bị đúng vật tư trước khi đến.</p>
            <a href="tel:0966228133"><Phone size={18} /> 0966.228.133</a>
            <a href="https://zalo.me/0966228133" target="_blank" rel="noopener noreferrer">Nhắn Zalo</a>
          </div>
        </aside>
      </article>

      <section className="printer-related-section">
        <div className="container">
          <div className="printer-section-heading">
            <span>ĐỌC THÊM</span>
            <h2>Bài viết xử lý máy in liên quan</h2>
          </div>
          <div className="printer-article-grid printer-related-grid">
            {relatedArticles.map((item) => <PrinterArticleCard article={item} key={item.slug} />)}
          </div>
        </div>
      </section>
    </main>
  );
};

export default PrinterArticle;
