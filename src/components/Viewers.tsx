import { useEffect, useRef, useState } from 'react';
import { actions } from '../data/content';
import { asset, fallbackSrc, formatDuration, srcSet, video as getVideo, type Photo } from '../data/media';
import { pad2 } from '../lib/ui';
import { Dialog } from './Dialog';
import { Icon } from './Icon';

interface PhotoLightboxProps {
  photos: Photo[];
  index: number | null;
  onIndex: (i: number) => void;
  onClose: () => void;
}

/** Shows the whole, uncropped photograph. */
export function PhotoLightbox({ photos, index, onIndex, onClose }: PhotoLightboxProps) {
  const open = index !== null;
  const p = open ? photos[index] : null;
  const go = (d: number) => index !== null && onIndex((index + d + photos.length) % photos.length);

  return (
    <Dialog open={open} onClose={onClose} label="Photo viewer" className="viewer">
      {p && index !== null && (
        <div
          className="viewer__inner"
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') go(1);
            if (e.key === 'ArrowLeft') go(-1);
          }}
        >
          <div className="viewer__bar">
            <span className="counter counter--light">
              {pad2(index + 1)} <span className="counter__rule" aria-hidden="true" /> {pad2(photos.length)}
            </span>
            <button type="button" className="icon-text-btn icon-text-btn--light" onClick={onClose} data-autofocus>
              <Icon name="close" />
              <span>{actions.closeViewer}</span>
            </button>
          </div>
          <figure className="viewer__stage">
            <picture key={p.id}>
              <source type="image/avif" srcSet={srcSet(p, 'avif')} sizes="90vw" />
              <source type="image/webp" srcSet={srcSet(p, 'webp')} sizes="90vw" />
              <img
                className="viewer__img"
                src={fallbackSrc(p, 2048)}
                srcSet={srcSet(p, 'jpg')}
                sizes="90vw"
                width={p.width}
                height={p.height}
                alt={p.alt}
              />
            </picture>
            <figcaption className="viewer__caption">{p.caption}</figcaption>
          </figure>
          {photos.length > 1 && (
            <>
              <button type="button" className="viewer__nav viewer__nav--prev arrow-btn arrow-btn--light" onClick={() => go(-1)} aria-label="Previous photo">
                <Icon name="prev" size={24} />
              </button>
              <button type="button" className="viewer__nav viewer__nav--next arrow-btn arrow-btn--light" onClick={() => go(1)} aria-label="Next photo">
                <Icon name="next" size={24} />
              </button>
            </>
          )}
        </div>
      )}
    </Dialog>
  );
}

interface VideoViewerProps {
  id: string | null;
  onClose: () => void;
}

/**
 * Plays the original clip with its audio. Sound starts only because the visitor
 * clicked; if the browser still blocks play(), a visible Play button appears.
 * Closing pauses playback and releases the file.
 */
export function VideoViewer({ id, onClose }: VideoViewerProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [blocked, setBlocked] = useState(false);
  const [canFullscreen, setCanFullscreen] = useState(false);
  const v = id ? getVideo(id) : null;

  useEffect(() => {
    const el = ref.current;
    if (!v || !el) return;
    setBlocked(false);
    el.muted = false;
    el.volume = 1;
    setCanFullscreen(
      Boolean(document.fullscreenEnabled || (el as HTMLVideoElement & { webkitEnterFullscreen?: () => void }).webkitEnterFullscreen),
    );
    el.play().catch(() => setBlocked(true));
    return () => {
      el.pause();
      el.removeAttribute('src');
      el.load();
    };
  }, [v]);

  const playNow = () => {
    const el = ref.current;
    if (!el) return;
    el.muted = false;
    el.play().then(() => setBlocked(false)).catch(() => setBlocked(true));
  };

  const fullscreen = () => {
    const el = ref.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null;
    if (!el) return;
    if (el.requestFullscreen) el.requestFullscreen().catch(() => el.webkitEnterFullscreen?.());
    else el.webkitEnterFullscreen?.();
  };

  return (
    <Dialog open={Boolean(v)} onClose={onClose} label={v ? `Video: ${v.title}` : 'Video viewer'} className="viewer">
      {v && (
        <div className="viewer__inner">
          <div className="viewer__bar">
            <p className="viewer__title">
              {v.title}
              <span>
                {v.kind} · {formatDuration(v.duration)}
                {v.audio_track ? ' · Sound on' : ' · No sound'}
              </span>
            </p>
            <div className="viewer__tools">
              {canFullscreen && (
                <button type="button" className="icon-text-btn icon-text-btn--light" onClick={fullscreen}>
                  <Icon name="fullscreen" />
                  <span>Fullscreen</span>
                </button>
              )}
              <button type="button" className="icon-text-btn icon-text-btn--light" onClick={onClose} data-autofocus>
                <Icon name="close" />
                <span>{actions.closeViewer}</span>
              </button>
            </div>
          </div>
          <div className={`viewer__stage viewer__stage--video is-${v.orientation}`}>
            <video
              ref={ref}
              key={v.id}
              className="viewer__video"
              src={asset(v.optimized_file!)}
              poster={asset(`${v.poster}.jpg`)}
              width={v.width}
              height={v.height}
              controls
              playsInline
              preload="metadata"
              onPlay={() => setBlocked(false)}
            />
            {blocked && (
              <button type="button" className="viewer__play" onClick={playNow}>
                <Icon name="play" size={22} />
                <span>Play{v.audio_track ? ' with sound' : ''}</span>
              </button>
            )}
          </div>
          {v.description && <p className="viewer__caption">{v.description}</p>}
        </div>
      )}
    </Dialog>
  );
}
