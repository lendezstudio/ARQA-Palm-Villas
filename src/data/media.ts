import raw from './media.json';

/**
 * Typed media source of truth. Generated values come from `npm run media`
 * (scripts/build_media.py reading media/catalog.json). villa_id stays null
 * until the owner confirms which villa a file shows.
 */
export type Approval = 'owner_approval_required' | 'internal_only' | 'permission_review' | 'approved';
export type PhotoCategory = 'interior' | 'poolside' | 'detail' | 'brand' | 'internal' | 'event' | 'people' | 'collage';

export interface Photo {
  id: string;
  original_file: string;
  optimized_file?: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  /** Focal point as [x, y] fractions, used for object-position in cropped frames. */
  focal: [number, number];
  villa_id: string | null;
  role: string;
  category: PhotoCategory;
  approval: Approval;
  public: boolean;
  reason?: string;
  variants: number[];
}

export interface Video {
  id: string;
  original_file: string;
  optimized_file?: string;
  width: number;
  height: number;
  orientation: 'portrait' | 'landscape';
  duration: number;
  video_codec: string;
  audio_track: { codec: string; channels: number; sample_rate: number } | null;
  captions: string | null;
  title: string;
  kind: string;
  description: string;
  poster?: string;
  thumb?: string;
  hero_loop_file?: string;
  villa_id: string | null;
  role: string;
  approval: Approval;
  public: boolean;
  reason?: string;
}

const data = raw as unknown as { photos: Photo[]; videos: Video[] };

export const allPhotos = data.photos;
export const allVideos = data.videos;

const photoMap = new Map(allPhotos.filter((p) => p.public).map((p) => [p.id, p]));
const videoMap = new Map(allVideos.filter((v) => v.public).map((v) => [v.id, v]));

export function photo(id: string): Photo {
  const p = photoMap.get(id);
  if (!p) throw new Error(`Unknown or non-public photo: ${id}`);
  return p;
}

export function video(id: string): Video {
  const v = videoMap.get(id);
  if (!v) throw new Error(`Unknown or non-public video: ${id}`);
  return v;
}

export const publicVideos = allVideos.filter((v) => v.public);

/** Photos shown in the Spaces at ARQA gallery, in curated order. */
export const galleryPhotos: Photo[] = [
  'pool-dusk-circular-facade',
  'timber-living-rattan',
  'corridor-circular-window',
  'thatched-villa-pool',
  'aframe-lounge',
  'circular-window-over-pool',
  'covered-dining-wide',
  'bedroom-rattan-bed',
  'stair-circular-openings',
  'pitched-roof-exterior',
  'thatched-living',
  'circular-window-view',
  'living-to-pool',
  'pitched-villa-dusk',
  'bedroom-pillow-detail',
  'timber-window',
  'circular-window-facade',
  'timber-ceiling-loft',
  'balcony-greenery',
  'thatched-villa-exterior',
  'bedroom-dark-headboard',
  'stair-corridor-light',
  'pool-courtyard-doorway',
  'living-rattan-dining',
  'thatched-pool-plunge',
  'rocking-chair-corner',
  'circular-facade-pool-corner',
  'bedroom-bunks',
  'covered-dining-pool',
  'circular-villa-garden',
].map(photo);

export function srcSet(p: Photo, ext: 'avif' | 'webp' | 'jpg'): string {
  return p.variants.map((w) => `${import.meta.env.BASE_URL}media/photos/${p.id}-${w}.${ext} ${w}w`).join(', ');
}

export function fallbackSrc(p: Photo, maxWidth = 1200): string {
  const w = p.variants.filter((v) => v <= maxWidth).pop() ?? p.variants[0];
  return `${import.meta.env.BASE_URL}media/photos/${p.id}-${w}.jpg`;
}

export function asset(path: string): string {
  return `${import.meta.env.BASE_URL}${path}`;
}

export function formatDuration(seconds: number): string {
  const s = Math.round(seconds);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}
