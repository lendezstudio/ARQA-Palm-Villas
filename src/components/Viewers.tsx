import { useEffect, useRef, useState } from 'react';
import { actions } from '../data/content';
import { asset, fallbackSrc, srcSet, video as getVideo, type Photo } from '../data/media';
import { Dialog } from './Dialog';
import { Icon } from './Icon';

function CloseButton({ onClose }: { onClose: () => void }) {
  return (
    <button type="button" className="viewer__close" onClick={onClose} aria-label={actions.closeViewer} data-autofocus>
      <Icon name="close" size={22} />
    </button>
  );
}

interface PhotoLightboxProps {
  photos: Photo[];
  index: number | null;
  onIndex: (i: number) => void;
  onClose: () => void;
}

/** Full-screen view of the whole, uncropped photograph. */
export function PhotoLightbox({ photos, index, onIndex, onClose }: PhotoLightboxProps) {
  const open = index !== null;
  const p = open ? photos[index] : null;
  const go = (d: number) => index !== null && onIndex((index + d + photos.length) % photos.length);

  return (
    <Dialog open={open} onClose={onClose} label="Photo viewer" className="viewer">
      {p && (
        <div
          className="viewer__inner"
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') go(1);
            if (e.key === 'ArrowLeft') go(-1);
          }}
        >
          <picture key={p.id} className="viewer__media">
            <source type="image/avif" srcSet={srcSet(p, 'avif')} sizes="100vw" />
            <source type="image/webp" srcSet={srcSet(p, 'webp')} sizes="100vw" />
            <img
              className="viewer__img"
              src={fallbackSrc(p, 2048)}
              srcSet={srcSet(p, 'jpg')}
              sizes="100vw"
              width={p.width}
              height={p.height}
              alt={p.alt}
            />
          </picture>
          <CloseButton onClose={onClose} />
          {photos.length > 1 && (
            <>
              <button type="button" className="viewer__nav viewer__nav--prev" onClick={() => go(-1)} aria-label="Previous photo">
                <Icon name="prev" size={24} />
              </button>
              <button type="button" className="viewer__nav viewer__nav--next" onClick={() => go(1)} aria-label="Next photo">
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
 * Full-screen player for the original clip with its audio. Sound starts only
 * because the visitor clicked; if the browser still blocks play(), a visible
 * Play button appears. Closing pauses playback and releases the file.
 */
export function VideoViewer({ id, onClose }: VideoViewerProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [blocked, setBlocked] = useState(false);
  const v = id ? getVideo(id) : null;

  useEffect(() => {
    const el = ref.current;
    if (!v || !el) return;
    setBlocked(false);
    el.muted = false;
    el.volume = 1;
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

  return (
    <Dialog open={Boolean(v)} onClose={onClose} label={v ? `Video: ${v.title}` : 'Video viewer'} className="viewer">
      {v && (
        <div className="viewer__inner">
          <video
            ref={ref}
            key={v.id}
            className="viewer__media viewer__video"
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
              <span>Play</span>
            </button>
          )}
          <CloseButton onClose={onClose} />
        </div>
      )}
    </Dialog>
  );
}
