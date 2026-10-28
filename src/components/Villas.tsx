import { actions, villas } from '../data/content';
import { publicVideos } from '../data/media';
import { pad2, useUi } from '../lib/ui';
import { Icon } from './Icon';

const slug = (name: string) => name.toLowerCase().replace(/\s+/g, '-');

/**
 * Text-led villa index. Photographs are not yet mapped to villas, so no photo
 * is attributed to a name here. A film is linked only where the footage itself
 * carries the villa's title card (villa_id set in the media catalog).
 */
export function Villas() {
  const { openInquiry, openVideo } = useUi();
  return (
    <section id="villas" className="villas section section--sand" aria-labelledby="villas-title">
      <div className="container">
        <header className="section-head reveal">
          <p className="eyebrow">{villas.eyebrow}</p>
          <h2 id="villas-title" className="heading">{villas.heading}</h2>
          <p className="section-head__body">{villas.body}</p>
        </header>

        <ol className="villa-index">
          {villas.names.map((name, i) => {
            const film = publicVideos.find((v) => v.villa_id === slug(name));
            return (
              <li key={name} className="villa-index__row reveal">
                <span className="villa-index__num">{pad2(i + 1)}</span>
                <h3 className="villa-index__name">{name}</h3>
                <p className="villa-index__text">{villas.shared}</p>
                <div className="villa-index__actions">
                  <button
                    type="button"
                    className="link-arrow"
                    onClick={() => openInquiry({ villa: name })}
                    aria-label={`${villas.action}: ${name}`}
                  >
                    <span>{villas.action}</span>
                    <Icon name="arrow" size={18} />
                  </button>
                  {film && (
                    <button
                      type="button"
                      className="link-play"
                      onClick={() => openVideo(film.id)}
                      aria-label={`${actions.walkthrough}: ${name}`}
                    >
                      <Icon name="play" size={12} />
                      <span>{actions.walkthrough}</span>
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
