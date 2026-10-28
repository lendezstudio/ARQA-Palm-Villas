import { fallbackSrc, srcSet, type Photo } from '../data/media';

interface PictureProps {
  photo: Photo;
  sizes: string;
  className?: string;
  eager?: boolean;
  /** Override the catalog focal point for this frame. */
  focal?: [number, number];
}

/** Responsive AVIF/WebP/JPEG picture with intrinsic size and reviewed focal point. */
export function Picture({ photo, sizes, className, eager = false, focal }: PictureProps) {
  const [x, y] = focal ?? photo.focal;
  return (
    <picture className={className}>
      <source type="image/avif" srcSet={srcSet(photo, 'avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet(photo, 'webp')} sizes={sizes} />
      <img
        src={fallbackSrc(photo)}
        srcSet={srcSet(photo, 'jpg')}
        sizes={sizes}
        width={photo.width}
        height={photo.height}
        alt={photo.alt}
        loading={eager ? 'eager' : 'lazy'}
        fetchPriority={eager ? 'high' : undefined}
        decoding="async"
        style={{ objectPosition: `${x * 100}% ${y * 100}%` }}
      />
    </picture>
  );
}
