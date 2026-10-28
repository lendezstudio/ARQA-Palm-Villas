import { useEffect, useMemo, useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { InquiryPanel } from './components/InquiryPanel';
import { Intro } from './components/Intro';
import { Footer, Invitation, Location, PlanYourStay } from './components/Sections';
import { Spaces } from './components/Spaces';
import { TimeAtArqa } from './components/TimeAtArqa';
import { Villas } from './components/Villas';
import { PhotoLightbox, VideoViewer } from './components/Viewers';
import { actions } from './data/content';
import type { Photo } from './data/media';
import { UiContext, type InquiryPreset, type UiApi } from './lib/ui';

export function App() {
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [preset, setPreset] = useState<InquiryPreset | null>(null);
  const [lightbox, setLightbox] = useState<{ photos: Photo[]; index: number } | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);

  const viewerOpen = Boolean(lightbox || videoId);
  const ui = useMemo<UiApi>(
    () => ({
      openInquiry: (p) => {
        setPreset(p ?? null);
        setInquiryOpen(true);
      },
      openPhotos: (photos, index) => setLightbox({ photos, index }),
      openVideo: (id) => setVideoId(id),
      viewerOpen,
    }),
    [viewerOpen],
  );

  useReveal();

  return (
    <UiContext.Provider value={ui}>
      <a className="skip-link" href="#main">Skip to content</a>
      <Header />
      <main id="main">
        <span id="top" />
        <Hero />
        <Intro />
        <Villas />
        <TimeAtArqa />
        <Spaces />
        <Location />
        <PlanYourStay />
        <Invitation />
      </main>
      <Footer />

      <div className="mobile-cta">
        <button type="button" className="btn btn--solid btn--block" onClick={() => ui.openInquiry()}>
          {actions.primary}
        </button>
      </div>

      <InquiryPanel open={inquiryOpen} preset={preset} onClose={() => setInquiryOpen(false)} />
      <PhotoLightbox
        photos={lightbox?.photos ?? []}
        index={lightbox?.index ?? null}
        onIndex={(index) => setLightbox((l) => (l ? { ...l, index } : l))}
        onClose={() => setLightbox(null)}
      />
      <VideoViewer id={videoId} onClose={() => setVideoId(null)} />
    </UiContext.Provider>
  );
}

/** Subtle fade-in as sections enter; skipped entirely for reduced motion. */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      els.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    document.documentElement.classList.add('js-reveal');
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target);
          }
        }),
      { rootMargin: '0px 0px -8% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}
