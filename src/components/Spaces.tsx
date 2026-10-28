import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { actions, spaces } from '../data/content';
import { asset, formatDuration, galleryPhotos, publicVideos, type Photo, type Video } from '../data/media';
import { pad2, prefersReducedMotion, useUi } from '../lib/ui';
import { Icon } from './Icon';
import { Picture } from './Picture';

type FilterKey = (typeof spaces.filters)[number]['key'];
type Item = { kind: 'photo'; photo: Photo } | { kind: 'video'; video: Video };

/** Interleave the walkthroughs through the photos so All Spaces reads as one journey. */
function buildItems(filter: FilterKey): Item[] {
  const photos: Item[] = galleryPhotos
    .filter((p) => filter === 'all' || p.category === filter)
    .map((p) => ({ kind: 'photo', photo: p }));
  const videos: Item[] = publicVideos.map((v) => ({ kind: 'video', video: v }));
  if (filter === 'video') return videos;
  if (filter !== 'all') return photos;
  const out: Item[] = [];
  photos.forEach((p, i) => {
    out.push(p);
    const v = videos[(i - 1) / 6];
    if (i % 6 === 1 && v) out.push(v);
  });
  return out;
}

export function Spaces() {
  const { openPhotos, openVideo } = useUi();
  const [filter, setFilter] = useState<FilterKey>('all');
  const [index, setIndex] = useState(0);
  const track = useRef<HTMLUListElement>(null);
  const items = useMemo(() => buildItems(filter), [filter]);
  const photosInView = useMemo(
    () => items.flatMap((i) => (i.kind === 'photo' ? [i.photo] : [])),
    [items],
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
          <div>
            <p className="section-head__body">{spaces.body}</p>
            <button type="button" className="link-arrow" onClick={() => openVideo(publicVideos[0].id)}>
              <span>{actions.walkthrough}</span>
              <Icon name="arrow" size={18} />
            </button>
          </div>
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
          {items.map((item) =>
            item.kind === 'photo' ? (
              <li key={item.photo.id} className="gallery__item">
                <button
                  type="button"
                  className="tile"
                  onClick={() => openPhotos(photosInView, photosInView.indexOf(item.photo))}
                  aria-label={`${spaces.openPhoto}: ${item.photo.caption}`}
                >
                  <span className="frame frame--4x3">
                    <Picture photo={item.photo} sizes="(min-width: 1024px) 720px, 84vw" />
                    <span className="tile__hint" aria-hidden="true">
                      <Icon name="plus" size={16} /> {spaces.openPhoto}
                    </span>
                  </span>
                  <span className="tile__caption">{item.photo.caption}</span>
                </button>
              </li>
            ) : (
              <li key={item.video.id} className="gallery__item">
                <VideoTile video={item.video} onOpen={() => openVideo(item.video.id)} />
              </li>
            ),
          )}
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

export function VideoTile({ video, onOpen }: { video: Video; onOpen: () => void }) {
  return (
    <button type="button" className="tile tile--video" onClick={onOpen} aria-label={`${actions.walkthrough}: ${video.title}, ${formatDuration(video.duration)}${video.audio_track ? ', with sound' : ''}`}>
      <span className="frame frame--4x3">
        <picture>
          <source type="image/webp" srcSet={asset(`${video.thumb}.webp`)} />
          <img src={asset(`${video.thumb}.jpg`)} width={720} height={540} alt="" loading="lazy" decoding="async" />
        </picture>
        <span className="tile__play" aria-hidden="true">
          <Icon name="play" size={18} />
        </span>
        <span className="tile__meta" aria-hidden="true">
          {video.kind} · {formatDuration(video.duration)}
          {video.audio_track ? ' · Sound' : ''}
        </span>
      </span>
      <span className="tile__caption">
        {video.title}
        <span className="tile__sub">{actions.walkthrough}</span>
      </span>
    </button>
  );
}
