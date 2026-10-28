import { villas } from '../data/content';
import { pad2, useUi } from '../lib/ui';
import { Icon } from './Icon';

/**
 * Text-led villa index. Photographs are not yet mapped to villas, so no photo
 * is attributed to a name here; the villa films follow in the next section.
 */
export function Villas() {
  const { openInquiry } = useUi();
  return (
    <section id="villas" className="villas section section--sand" aria-labelledby="villas-title">
      <div className="container">
        <header className="section-head reveal">
          <p className="eyebrow">{villas.eyebrow}</p>
          <h2 id="villas-title" className="heading">{villas.heading}</h2>
          <p className="section-head__body">{villas.body}</p>
        </header>

        <ol className="villa-index">
          {villas.names.map((name, i) => (
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
                </div>
              </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
