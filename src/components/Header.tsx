import { useState } from 'react';
import { actions, nav } from '../data/content';
import { contacts } from '../data/contacts';
import { asset, photo } from '../data/media';
import { useUi } from '../lib/ui';
import { Dialog } from './Dialog';
import { Icon } from './Icon';

const logo = photo('logo') as ReturnType<typeof photo> & { trimmed_width: number; trimmed_height: number };

export function Header() {
  const { openInquiry } = useUi();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="site-header">
        <div className="site-header__bar">
          <div className="site-header__start">
            <button
              type="button"
              className="menu-toggle"
              aria-expanded={menuOpen}
              aria-controls="site-menu"
              onClick={() => setMenuOpen(true)}
            >
              <Icon name="menu" />
              <span>Menu</span>
            </button>
            <nav className="site-nav" aria-label="Primary">
              <ul>
                {nav.map((item) => (
                  <li key={item.href}>
                    <a href={item.href}>{item.label}</a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <a className="brand-plate" href="#top" aria-label="ARQA Palm Villas, back to top">
            <img
              src={asset('media/brand/arqa-logo.webp')}
              width={logo.trimmed_width}
              height={logo.trimmed_height}
              alt="ARQA Palm Villas"
            />
          </a>

          <div className="site-header__end">
            <button type="button" className="btn btn--solid btn--header" onClick={() => openInquiry()}>
              {actions.primary}
            </button>
          </div>
        </div>
      </header>

      <Dialog open={menuOpen} onClose={() => setMenuOpen(false)} label="Site menu" className="menu-panel">
        <div id="site-menu" className="menu-panel__inner">
          <div className="menu-panel__top">
            <button type="button" className="icon-text-btn" onClick={() => setMenuOpen(false)} data-autofocus>
              <Icon name="close" />
              <span>{actions.closeMenu}</span>
            </button>
          </div>
          <nav aria-label="Menu">
            <ul className="menu-panel__links">
              {nav.map((item, i) => (
                <li key={item.href}>
                  <a href={item.href} onClick={() => setMenuOpen(false)}>
                    <span className="menu-panel__num">{String(i + 1).padStart(2, '0')}</span>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="menu-panel__foot">
            <button
              type="button"
              className="btn btn--solid"
              onClick={() => {
                setMenuOpen(false);
                openInquiry();
              }}
            >
              {actions.primary}
            </button>
            <p className="menu-panel__social">
              <a href={contacts.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>
              <a href={contacts.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
            </p>
          </div>
        </div>
      </Dialog>
    </>
  );
}
