import { ArrowRight, Clock3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import './PrinterArticleCard.css';

const PrinterArticleCard = ({ article }) => (
  <article className="printer-article-card">
    <Link className="printer-article-image" to={`/${article.slug}`} aria-label={`Đọc bài ${article.title}`}>
      <img
        src={article.image}
        alt={article.imageAlt}
        loading="lazy"
        style={{ objectPosition: article.imagePosition || 'center' }}
      />
    </Link>
    <div className="printer-article-card-content">
      <div className="printer-article-meta">
        <span>{article.category}</span>
        <small><Clock3 size={14} /> {article.readingTime}</small>
      </div>
      <h3><Link to={`/${article.slug}`}>{article.title}</Link></h3>
      <p>{article.excerpt}</p>
      <Link className="printer-article-link" to={`/${article.slug}`}>
        Đọc bài viết <ArrowRight size={17} />
      </Link>
    </div>
  </article>
);

export default PrinterArticleCard;
