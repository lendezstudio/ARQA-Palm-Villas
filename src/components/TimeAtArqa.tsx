import { useState } from 'react';
import { timeAtArqa } from '../data/content';
import { photo } from '../data/media';
import { pad2 } from '../lib/ui';
import { Icon } from './Icon';
import { Picture } from './Picture';

const slides = timeAtArqa.slides.map((s) => ({ ...s, image: photo(s.photo) }));

/** Dark editorial section. Slides change only when the visitor asks; no auto-advance. */
export function TimeAtArqa() {
  const [index, setIndex] = useState(0);
  const go = (delta: number) => setIndex((i) => (i + delta + slides.length) % slides.length);
  const current = slides[index];

  return (
    <section className="time section section--dark" aria-labelledby="time-title">
      <div className="container time__grid">
        <div className="time__text reveal">
          <p className="eyebrow">{timeAtArqa.eyebrow}</p>
          <h2 id="time-title" className="heading heading--xl">{timeAtArqa.heading}</h2>
          <p className="lede">{timeAtArqa.body}</p>
          <a className="btn btn--line-light" href="#spaces">{timeAtArqa.action}</a>
        </div>

        <div
          className="time__carousel reveal"
          role="region"
          aria-roledescription="carousel"
          aria-label="Time at ARQA"
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') go(1);
            if (e.key === 'ArrowLeft') go(-1);
          }}
        >
          <div className="frame frame--4x5 time__frame">
            {slides.map((s, i) => (
              <div
                key={s.title}
                className={`time__slide${i === index ? ' is-active' : ''}`}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${slides.length}: ${s.title}`}
                aria-hidden={i !== index}
              >
                <Picture photo={s.image} sizes="(min-width: 1024px) 520px, calc(100vw - 48px)" />
              </div>
            ))}
          </div>
          <div className="time__caption" aria-live="polite">
            <h3 className="time__slide-title">{current.title}</h3>
            <p>{current.text}</p>
          </div>
          <div className="slider-controls slider-controls--light">
            <button type="button" className="arrow-btn" onClick={() => go(-1)} aria-label="Previous slide">
              <Icon name="prev" />
            </button>
            <span className="counter" aria-hidden="true">
              {pad2(index + 1)} <span className="counter__rule" /> {pad2(slides.length)}
            </span>
            <button type="button" className="arrow-btn" onClick={() => go(1)} aria-label="Next slide">
              <Icon name="next" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
