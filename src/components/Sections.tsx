import { actions, contactLabels, footer, invitation, location, plan } from '../data/content';
import { contacts, credit, map } from '../data/contacts';
import { asset, photo } from '../data/media';
import { useUi } from '../lib/ui';
import { Icon } from './Icon';
import { Picture } from './Picture';

const invitationImage = photo('covered-dining-wide');

export function Location() {
  return (
    <section id="location" className="location section section--sand" aria-labelledby="location-title">
      <div className="container location__grid">
        <div className="location__map frame frame--16x9 reveal">
          <iframe
            src={map.embed}
            title={location.mapTitle}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
        <div className="location__text reveal">
          <p className="eyebrow">{location.eyebrow}</p>
          <h2 id="location-title" className="heading">{location.heading}</h2>
          <p className="lede">{location.body}</p>
          <p className="location__place">{footer.place}</p>
          <div className="btn-row location__actions">
            <a className="btn btn--line" href={map.place} target="_blank" rel="noopener noreferrer">
              {location.openMap}
            </a>
            <a className="link-arrow" href={map.directions} target="_blank" rel="noopener noreferrer">
              <span>{location.directions}</span>
              <Icon name="arrow" size={18} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Direct contact lines; each is shown only when configured in contacts.ts. */
export function ContactLines({ className }: { className?: string }) {
  return (
    <ul className={className}>
      {contacts.email && (
        <li>
          <a href={`mailto:${contacts.email}`}>{contacts.email}</a>
        </li>
      )}
      {contacts.phone && (
        <li>
          <a href={`tel:${contacts.phone.tel}`}>{contacts.phone.display}</a>
        </li>
      )}
    </ul>
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
          <div className="plan__direct">
            <p>{contactLabels.direct}</p>
            <ContactLines className="contact-lines" />
          </div>
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
          <p className="site-footer__place">{footer.place}</p>
          <ContactLines className="contact-lines contact-lines--footer" />
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
