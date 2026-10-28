import { useEffect, useRef, useState } from 'react';
import { actions } from '../data/content';
import { asset, photo, video } from '../data/media';
import { prefersReducedMotion, prefersSaveData, useUi } from '../lib/ui';
import { Icon } from './Icon';
import { Picture } from './Picture';

const still = photo('pool-dusk-circular-facade');
const film = video('film-circular-villa');
/** The supplied footage is portrait, so the muted loop is used only on portrait screens. */
const PORTRAIT = '(max-aspect-ratio: 4/5)';

export function Hero() {
  const { openVideo, viewerOpen } = useUi();
  const ref = useRef<HTMLVideoElement>(null);
  const [useLoop, setUseLoop] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(PORTRAIT);
    const update = () => setUseLoop(mq.matches && !prefersReducedMotion() && !prefersSaveData());
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Only one source plays: the background loop yields to any open viewer.
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (viewerOpen || paused) v.pause();
    else v.play().catch(() => setPaused(true));
  }, [viewerOpen, paused, useLoop]);

  return (
    <section className="hero" aria-label="ARQA Palm Villas">
      <div className="hero__media">
        <Picture photo={still} sizes="100vw" eager className="hero__still" />
        {useLoop && film.hero_loop_file && (
          <video
            ref={ref}
            className="hero__video"
            src={asset(film.hero_loop_file)}
            poster={asset(`${film.poster}.jpg`)}
            muted
            loop
            playsInline
            autoPlay
            preload="auto"
            aria-hidden="true"
            tabIndex={-1}
          />
        )}
      </div>

      <div className="hero__controls">
        {film.audio_track && (
          <button type="button" className="hero__btn" onClick={() => openVideo(film.id)}>
            <Icon name="play" size={14} />
            <span>{actions.withSound}</span>
          </button>
        )}
        {useLoop && (
          <button
            type="button"
            className="hero__btn hero__btn--icon"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? 'Play background video' : 'Pause background video'}
          >
            <Icon name={paused ? 'play' : 'pause'} size={16} />
          </button>
        )}
      </div>
    </section>
  );
}
