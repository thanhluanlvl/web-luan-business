import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  MapPin,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import useSeoMeta from '../lib/useSeoMeta';
import './SegmentLanding.css';

const trustIcons = [MapPin, ClipboardCheck, ShieldCheck, Clock3];

const SegmentLanding = ({ landing }) => {
  const pageUrl = `https://suamayinanduong.com/${landing.slug}`;
  const imageUrl = `https://suamayinanduong.com${landing.heroImage}`;

  useSeoMeta({
    title: landing.metaTitle,
    description: landing.metaDescription,
    url: pageUrl,
    image: imageUrl,
  });

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        name: landing.title,
        description: landing.metaDescription,
        url: pageUrl,
        image: imageUrl,
        areaServed: { '@type': 'Place', name: 'An Dương, Hải Phòng' },
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
      },
      {
        '@type': 'FAQPage',
        mainEntity: landing.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      },
    ],
  };

  return (
    <main className={`segment-landing segment-${landing.theme}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <header className="segment-hero">
        <div className="container segment-hero-grid">
          <div className="segment-hero-copy">
            <span className="segment-kicker"><MapPin size={17} /> {landing.eyebrow}</span>
            <h1>{landing.title}</h1>
            <p>{landing.description}</p>
            <div className="segment-actions">
              <a className="btn-primary" href="tel:0966228133"><Phone size={19} /> Gọi 0966.228.133</a>
              <a className="btn-outline segment-zalo" href="https://zalo.me/0966228133" target="_blank" rel="noopener noreferrer">
                Nhắn Zalo để tư vấn <ArrowRight size={18} />
              </a>
            </div>
            <ul className="segment-highlights">
              {landing.heroHighlights.map((item) => <li key={item}><CheckCircle2 size={18} /> {item}</li>)}
            </ul>
          </div>
          <figure className="segment-hero-image">
            <img src={landing.heroImage} alt={landing.heroImageAlt} style={{ objectPosition: landing.heroImagePosition }} />
          </figure>
        </div>
      </header>

      <section className="segment-trust section">
        <div className="container">
          <div className="segment-section-heading">
            <span>CAM KẾT CÓ THỂ KIỂM CHỨNG</span>
            <h2>{landing.trustTitle}</h2>
            <p>{landing.trustIntro}</p>
          </div>
          <div className="segment-trust-grid">
            {landing.trustPoints.map((point, index) => {
              const TrustIcon = trustIcons[index];
              return (
                <article key={point.title}>
                  <TrustIcon size={27} />
                  <h3>{point.title}</h3>
                  <p>{point.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="segment-services section" id="segment-services">
        <div className="container">
          <div className="segment-section-heading">
            <span>DỊCH VỤ CHUYÊN BIỆT</span>
            <h2>{landing.servicesTitle}</h2>
            <p>{landing.servicesIntro}</p>
          </div>
          <div className="segment-service-grid">
            {landing.services.map((service) => (
              <article className="segment-service-card" key={service.title}>
                <Link to={service.href} className="segment-service-image" aria-label={service.label}>
                  <img src={service.image} alt={service.imageAlt} loading="lazy" />
                </Link>
                <div>
                  <h3><Link to={service.href}>{service.title}</Link></h3>
                  <p>{service.description}</p>
                  <Link className="segment-service-link" to={service.href}>{service.label} <ArrowRight size={17} /></Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="segment-proof section">
        <div className="container segment-proof-grid">
          <figure>
            <img src="/luan_storefront.png?v=296" alt="Nguyễn Thành Luân tại địa chỉ 296 Đặng Cương, An Dương" loading="lazy" />
          </figure>
          <div>
            <span>{landing.proofEyebrow}</span>
            <h2>{landing.proofTitle}</h2>
            {landing.proofParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            <ul>
              {landing.proofBullets.map((item) => <li key={item}><CheckCircle2 size={19} /> {item}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="segment-process section">
        <div className="container">
          <div className="segment-section-heading">
            <span>QUY TRÌNH MINH BẠCH</span>
            <h2>{landing.processTitle}</h2>
          </div>
          <ol className="segment-process-grid">
            {landing.process.map((step, index) => (
              <li key={step.title}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="segment-faq section">
        <div className="container segment-faq-wrap">
          <div className="segment-section-heading">
            <span>CÂU HỎI THƯỜNG GẶP</span>
            <h2>Thông tin cần biết trước khi đặt dịch vụ</h2>
          </div>
          {landing.faqs.map((faq) => (
            <details key={faq.question}>
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="segment-final-cta">
        <div className="container">
          <div>
            <span>{landing.finalEyebrow}</span>
            <h2>{landing.finalTitle}</h2>
          </div>
          <div className="segment-final-actions">
            <a href="tel:0966228133"><Phone size={20} /> 0966.228.133</a>
            <a href="https://zalo.me/0966228133" target="_blank" rel="noopener noreferrer">Nhắn Zalo</a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SegmentLanding;
