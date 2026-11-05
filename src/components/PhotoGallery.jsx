import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import './PhotoGallery.css';

/*
 * Thư viện ảnh theo nhóm: lưới ảnh nhỏ (lazy), bấm mở ảnh lớn,
 * chuyển ảnh trong cùng nhóm bằng nút hoặc phím ←/→, Esc để đóng.
 */
const PhotoGallery = ({ groups, eyebrow, title, intro }) => {
  const [open, setOpen] = useState(null); // { group, index }

  const images = open ? groups[open.group].images : [];
  const current = open ? images[open.index] : null;

  const step = (delta) => setOpen((prev) => {
    if (!prev) return prev;
    const total = groups[prev.group].images.length;
    return { ...prev, index: (prev.index + delta + total) % total };
  });

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(null);
      if (event.key === 'ArrowRight') step(1);
      if (event.key === 'ArrowLeft') step(-1);
    };
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener('keydown', onKey);
    };
    // step chỉ dùng setOpen dạng hàm, không cần theo dõi
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open !== null]);

  return (
    <section className="photo-gallery section" id="thu-vien-mau">
      <div className="container">
        <div className="segment-section-heading">
          <span>{eyebrow}</span>
          <h2>{title}</h2>
          {intro && <p>{intro}</p>}
        </div>

        <nav className="photo-gallery-tabs" aria-label="Nhóm ảnh">
          {groups.map((group) => (
            <a key={group.id} href={`#${group.id}`}>
              {group.title} <small>{group.images.length}</small>
            </a>
          ))}
        </nav>

        {groups.map((group, groupIndex) => (
          <div className="photo-gallery-group" id={group.id} key={group.id}>
            <div className="photo-gallery-group-head">
              <h3>{group.title} <small>{group.images.length} mẫu</small></h3>
              <p>{group.description}</p>
            </div>
            <ul className="photo-gallery-grid">
              {group.images.map((image, index) => (
                <li key={image.src}>
                  <button type="button" onClick={() => setOpen({ group: groupIndex, index })} aria-label={`Xem lớn: ${image.alt}`}>
                    <img src={image.thumb} alt={image.alt} width={image.width} height={image.height} loading="lazy" decoding="async" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {current && (
        <div className="photo-lightbox" role="dialog" aria-modal="true" aria-label={current.alt} onClick={() => setOpen(null)}>
          <button type="button" className="photo-lightbox-close" onClick={() => setOpen(null)} aria-label="Đóng"><X size={28} /></button>
          <button type="button" className="photo-lightbox-nav prev" onClick={(event) => { event.stopPropagation(); step(-1); }} aria-label="Ảnh trước"><ChevronLeft size={34} /></button>
          <figure onClick={(event) => event.stopPropagation()}>
            <img src={current.src} alt={current.alt} />
            <figcaption>{current.alt} · {open.index + 1}/{images.length}</figcaption>
          </figure>
          <button type="button" className="photo-lightbox-nav next" onClick={(event) => { event.stopPropagation(); step(1); }} aria-label="Ảnh sau"><ChevronRight size={34} /></button>
        </div>
      )}
    </section>
  );
};

export default PhotoGallery;
