import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { spaces } from '../data/content';
import { galleryPhotos } from '../data/media';
import { pad2, prefersReducedMotion, useUi } from '../lib/ui';
import { Icon } from './Icon';
import { Picture } from './Picture';

type FilterKey = (typeof spaces.filters)[number]['key'];
export function Spaces() {
  const { openPhotos } = useUi();
  const [filter, setFilter] = useState<FilterKey>('all');
  const [index, setIndex] = useState(0);
  const track = useRef<HTMLUListElement>(null);
  const items = useMemo(
    () => galleryPhotos.filter((p) => filter === 'all' || p.category === filter),
    [filter],
  );

  const scrollToIndex = useCallback((i: number) => {
    const el = track.current;
    const target = el?.children[i] as HTMLElement | undefined;
    if (!el || !target) return;
    const padding = parseFloat(getComputedStyle(el).scrollPaddingLeft) || 0;
    el.scrollTo({ left: target.offsetLeft - padding, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  }, []);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    el.scrollTo({ left: 0 });
    setIndex(0);
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const padding = parseFloat(getComputedStyle(el).scrollPaddingLeft) || 0;
        const kids = [...el.children] as HTMLElement[];
        let best = 0;
        let bestDist = Infinity;
        kids.forEach((k, i) => {
          const d = Math.abs(k.offsetLeft - padding - el.scrollLeft);
          if (d < bestDist) {
            bestDist = d;
            best = i;
          }
        });
        if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 4) best = kids.length - 1;
        setIndex(best);
      });
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [filter]);

  const go = (delta: number) => scrollToIndex(Math.max(0, Math.min(items.length - 1, index + delta)));

  return (
    <section id="spaces" className="spaces section" aria-labelledby="spaces-title">
      <div className="container">
        <header className="section-head section-head--split reveal">
          <div>
            <p className="eyebrow">{spaces.eyebrow}</p>
            <h2 id="spaces-title" className="heading">{spaces.heading}</h2>
          </div>
          <p className="section-head__body">{spaces.body}</p>
        </header>

        <div className="filters" role="group" aria-label="Filter the gallery">
          {spaces.filters.map((f) => (
            <button
              key={f.key}
              type="button"
              className="filter"
              aria-pressed={filter === f.key}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div
        className="gallery"
        role="region"
        aria-roledescription="carousel"
        aria-label="Spaces at ARQA gallery"
      >
        <ul
          ref={track}
          className="gallery__track"
          tabIndex={0}
          aria-label="Gallery items, scroll horizontally"
          onKeyDown={(e) => {
            if (e.target !== e.currentTarget) return;
            if (e.key === 'ArrowRight') {
              e.preventDefault();
              go(1);
            }
            if (e.key === 'ArrowLeft') {
              e.preventDefault();
              go(-1);
            }
          }}
        >
          {items.map((item, i) => (
            <li key={item.id} className="gallery__item">
              <button
                type="button"
                className="tile"
                onClick={() => openPhotos(items, i)}
                aria-label={`${spaces.openPhoto}: ${item.caption}`}
              >
                <span className="frame frame--4x3">
                  <Picture photo={item} sizes="(min-width: 1024px) 720px, 84vw" />
                  <span className="tile__hint" aria-hidden="true">
                    <Icon name="plus" size={16} /> {spaces.openPhoto}
                  </span>
                </span>
                <span className="tile__caption">{item.caption}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="container">
        <div className="slider-controls">
          <button type="button" className="arrow-btn" onClick={() => go(-1)} disabled={index === 0} aria-label="Previous">
            <Icon name="prev" />
          </button>
          <span className="counter" aria-live="polite">
            <span className="visually-hidden">Item </span>
            {pad2(index + 1)} <span className="counter__rule" aria-hidden="true" />
            <span className="visually-hidden"> of </span> {pad2(items.length)}
          </span>
          <button
            type="button"
            className="arrow-btn"
            onClick={() => go(1)}
            disabled={index >= items.length - 1}
            aria-label="Next"
          >
            <Icon name="next" />
          </button>
        </div>
      </div>
    </section>
  );
}
