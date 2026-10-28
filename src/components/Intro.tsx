import { actions, intro } from '../data/content';
import { photo } from '../data/media';
import { useUi } from '../lib/ui';
import { Picture } from './Picture';

const image = photo('timber-living-rattan');

export function Intro() {
  const { openInquiry } = useUi();
  return (
    <section className="intro section" aria-labelledby="intro-title">
      <div className="container intro__text reveal">
        <p className="eyebrow">{intro.eyebrow}</p>
        <h1 id="intro-title" className="display">
          {intro.heading[0]}
          <br />
          {intro.heading[1]}
        </h1>
        <p className="lede">{intro.body}</p>
        <div className="btn-row btn-row--center">
          <a className="btn btn--solid" href="#villas">
            {actions.explore}
          </a>
          <button type="button" className="btn btn--line" onClick={() => openInquiry()}>
            {actions.primary}
          </button>
        </div>
      </div>
      <figure className="container intro__figure reveal">
        <div className="frame frame--16x9">
          <Picture photo={image} sizes="(min-width: 1360px) 1280px, calc(100vw - 48px)" />
        </div>
      </figure>
    </section>
  );
}
