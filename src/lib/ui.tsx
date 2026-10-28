import { createContext, useContext } from 'react';
import type { Photo } from '../data/media';

export interface InquiryPreset {
  villa?: string;
  message?: string;
}

export interface UiApi {
  openInquiry: (preset?: InquiryPreset) => void;
  openPhotos: (photos: Photo[], index: number) => void;
  openVideo: (id: string) => void;
  /** True while any viewer is open, so background media stays paused. */
  viewerOpen: boolean;
}

export const UiContext = createContext<UiApi | null>(null);

export function useUi(): UiApi {
  const ui = useContext(UiContext);
  if (!ui) throw new Error('useUi must be used inside UiContext');
  return ui;
}

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function prefersSaveData(): boolean {
  const c = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return Boolean(c?.saveData);
}

export function pad2(n: number): string {
  return String(n).padStart(2, '0');
}
