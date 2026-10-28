import { useCallback, useEffect, useRef, useState } from 'react';
import { asset, video } from '../data/media';
import { prefersReducedMotion, prefersSaveData, useUi } from '../lib/ui';
import { Icon } from './Icon';

const clip = video('walkthrough-circular-villa');
const HIDE_AFTER_MS = 5000;

/**
 * Hero walkthrough. Browsers only allow muted autoplay, so it starts muted;
 * play/pause, sound and volume controls show for 5 seconds, then fade until
 * the visitor moves, taps or tabs into the hero again. Stays visible while paused.
 */
export function Hero() {
  const { viewerOpen } = useUi();
  const ref = useRef<HTMLVideoElement>(null);
  const timer = useRef<number>(0);
  const [playing, setPlaying] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [muted, setMuted] = useState(true);
  const [volume, setVolume] = useState(1);
  const [controlsVisible, setControlsVisible] = useState(true);

  const reveal = useCallback(() => {
    setControlsVisible(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setControlsVisible(false), HIDE_AFTER_MS);
  }, []);

  // Autoplay (muted) unless the visitor prefers reduced motion or data saving.
  useEffect(() => {
    if (prefersReducedMotion() || prefersSaveData()) setUserPaused(true);
    reveal();
    return () => window.clearTimeout(timer.current);
  }, [reveal]);

  // Only one source plays: the hero yields while a film or photo viewer is open.
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (viewerOpen || userPaused) v.pause();
    else {
      v.muted = muted;
      v.play().catch(() => setUserPaused(true));
    }
  }, [viewerOpen, userPaused]);

  const togglePlay = () => {
    setUserPaused((p) => !p);
    reveal();
  };

  const toggleMute = () => {
    const v = ref.current;
    if (!v) return;
    const next = !muted;
    v.muted = next;
    if (!next && v.volume === 0) {
      v.volume = 1;
      setVolume(1);
    }
    setMuted(next);
    if (!next && v.paused) setUserPaused(false);
    reveal();
  };

  const changeVolume = (value: number) => {
    const v = ref.current;
    if (!v) return;
    v.volume = value;
    v.muted = value === 0;
    setVolume(value);
    setMuted(value === 0);
    reveal();
  };

  const showControls = controlsVisible || !playing;

  return (
    <section
      className="hero"
      aria-label="ARQA Palm Villas walkthrough"
      onPointerMove={reveal}
      onPointerDown={reveal}
      onFocus={reveal}
    >
      <div className="hero__media">
        <img className="hero__backdrop" src={asset(clip.backdrop!)} alt="" aria-hidden="true" />
        <video
          ref={ref}
          className="hero__video"
          src={asset(clip.optimized_file!)}
          poster={asset(`${clip.poster}.jpg`)}
          width={clip.width}
          height={clip.height}
          muted
          loop
          playsInline
          preload="auto"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onClick={togglePlay}
        />
      </div>

      <div className={`hero__controls${showControls ? ' is-visible' : ''}`}>
        <button
          type="button"
          className="hero__btn"
          onClick={togglePlay}
          aria-label={playing ? 'Pause video' : 'Play video'}
        >
          <Icon name={playing ? 'pause' : 'play'} size={18} />
        </button>
        <button
          type="button"
          className="hero__btn"
          onClick={toggleMute}
          aria-label={muted ? 'Turn sound on' : 'Turn sound off'}
          aria-pressed={!muted}
        >
          <Icon name={muted ? 'mute' : 'volume'} size={20} />
        </button>
        <label className="hero__volume">
          <span className="visually-hidden">Volume</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={muted ? 0 : volume}
            onChange={(e) => changeVolume(Number(e.target.value))}
          />
        </label>
      </div>
    </section>
  );
}
