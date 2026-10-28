import { photo } from '../data/media';
import { Picture } from './Picture';

const still = photo('pool-dusk-circular-facade');

/** Full-bleed opening photograph, kept free of text as in the reference. */
export function Hero() {
  return (
    <section className="hero" aria-label="ARQA Palm Villas">
      <div className="hero__media">
        <Picture photo={still} sizes="100vw" eager className="hero__still" />
      </div>
    </section>
  );
}
