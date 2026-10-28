import { actions, films } from '../data/content';
import { asset, formatDuration, publicVideos } from '../data/media';
import { useUi } from '../lib/ui';
import { Icon } from './Icon';

/**
 * Villa films, shown beside the villa index because each film's own title
 * card names the villa. Portrait frames match the 9:16 footage.
 */
export function Films() {
  const { openVideo } = useUi();
  return (
    <section id="films" className="films section" aria-labelledby="films-title">
      <div className="container">
        <header className="section-head reveal">
          <p className="eyebrow">{films.eyebrow}</p>
          <h2 id="films-title" className="heading">{films.heading}</h2>
          <p className="section-head__body">{films.body}</p>
        </header>

        <ul className="films__grid">
          {publicVideos.map((v) => (
            <li key={v.id} className="reveal">
              <button
                type="button"
                className="film-card"
                onClick={() => openVideo(v.id)}
                aria-label={`${actions.walkthrough}: ${v.title}, ${formatDuration(v.duration)}${v.audio_track ? ', with sound' : ''}`}
              >
                <span className="frame frame--4x5">
                  <picture>
                    <source type="image/webp" srcSet={asset(`${v.poster}.webp`)} />
                    <img
                      src={asset(`${v.poster}.jpg`)}
                      width={v.width}
                      height={v.height}
                      alt=""
                      loading="lazy"
                      decoding="async"
                    />
                  </picture>
                  <span className="film-card__play" aria-hidden="true">
                    <Icon name="play" size={22} />
                  </span>
                </span>
                <span className="film-card__text" aria-hidden="true">
                  <span className="film-card__title">{v.title}</span>
                  <span className="film-card__meta">
                    {v.kind} · {formatDuration(v.duration)}
                    {v.audio_track ? ' · Sound' : ''}
                  </span>
                  <span className="film-card__desc">{v.description}</span>
                  <span className="link-arrow film-card__action">
                    <span>{actions.walkthrough}</span>
                    <Icon name="arrow" size={18} />
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
