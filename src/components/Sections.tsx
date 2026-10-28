import { actions, footer, invitation, location, plan } from '../data/content';
import { contacts, credit } from '../data/contacts';
import { asset, photo } from '../data/media';
import { useUi } from '../lib/ui';
import { Icon } from './Icon';
import { Picture } from './Picture';

const locationImage = photo('balcony-greenery');
const invitationImage = photo('covered-dining-wide');

export function Location() {
  const { openInquiry } = useUi();
  return (
    <section id="location" className="location section section--sand" aria-labelledby="location-title">
      <div className="container location__grid">
        <figure className="location__figure reveal">
          <div className="frame frame--16x9">
            <Picture photo={locationImage} sizes="(min-width: 1024px) 720px, calc(100vw - 48px)" />
          </div>
          <figcaption className="caption">{locationImage.caption}</figcaption>
        </figure>
        <div className="location__text reveal">
          <p className="eyebrow">{location.eyebrow}</p>
          <h2 id="location-title" className="heading">{location.heading}</h2>
          <p className="lede">{location.body}</p>
          <p className="location__place">{footer.place}</p>
          <button
            type="button"
            className="btn btn--line"
            onClick={() => openInquiry({ message: location.directionsMessage })}
          >
            {location.action}
          </button>
        </div>
      </div>
    </section>
  );
}

export function PlanYourStay() {
  const { openInquiry } = useUi();
  return (
    <section id="plan" className="plan section" aria-labelledby="plan-title">
      <div className="container plan__grid">
        <div className="plan__intro reveal">
          <p className="eyebrow">{plan.eyebrow}</p>
          <h2 id="plan-title" className="heading">{plan.heading}</h2>
          <p className="lede">{plan.body}</p>
          <button type="button" className="btn btn--solid" onClick={() => openInquiry()}>
            {plan.action}
          </button>
        </div>
        <div className="faq reveal">
          {plan.questions.map((item) => (
            <details key={item.q} className="faq__item">
              <summary>
                <span>{item.q}</span>
                <span className="faq__icon" aria-hidden="true">
                  <Icon name="plus" size={18} />
                </span>
              </summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Invitation() {
  const { openInquiry } = useUi();
  return (
    <section className="invitation" aria-labelledby="invitation-title">
      <div className="invitation__media">
        <Picture photo={invitationImage} sizes="100vw" />
      </div>
      <div className="invitation__panel reveal">
        <h2 id="invitation-title" className="heading">{invitation.heading}</h2>
        <p>{invitation.body}</p>
        <button type="button" className="btn btn--solid-light" onClick={() => openInquiry()}>
          {actions.primary}
        </button>
      </div>
    </section>
  );
}

export function Footer() {
  const links = [
    { label: 'Our Villas', href: '#villas' },
    { label: 'Gallery', href: '#spaces' },
    { label: 'Plan Your Stay', href: '#plan' },
  ];
  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div className="site-footer__brand">
          <span className="site-footer__plate">
            <img src={asset('media/brand/arqa-logo.webp')} width={618} height={760} alt="ARQA Palm Villas" loading="lazy" />
          </span>
          <p>
            {footer.name}
            <br />
            {footer.place}
          </p>
        </div>
        <nav aria-label="Footer">
          <ul className="site-footer__links">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
            <li>
              <a href={contacts.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>
            </li>
            <li>
              <a href={contacts.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
            </li>
          </ul>
        </nav>
      </div>
      <div className="container site-footer__base">
        <p>© {new Date().getFullYear()} {footer.name}</p>
        <p>
          Designed by{' '}
          <a href={credit.href} target="_blank" rel="noopener">
            {credit.label}
          </a>
        </p>
      </div>
    </footer>
  );
}
