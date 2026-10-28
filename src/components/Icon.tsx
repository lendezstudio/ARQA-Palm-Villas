type IconName = 'menu' | 'close' | 'prev' | 'next' | 'play' | 'pause' | 'fullscreen' | 'arrow' | 'plus';

const paths: Record<IconName, string> = {
  menu: 'M3 7h18M3 12h18M3 17h18',
  close: 'M5 5l14 14M19 5L5 19',
  prev: 'M15 4l-8 8 8 8',
  next: 'M9 4l8 8-8 8',
  play: 'M8 5v14l11-7z',
  pause: 'M8 5v14M16 5v14',
  fullscreen: 'M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5',
  arrow: 'M4 12h15M14 6l6 6-6 6',
  plus: 'M12 5v14M5 12h14',
};

/** Thin line icons drawn to match the fine-rule styling. */
export function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const filled = name === 'play';
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth="1.25"
      strokeLinecap="square"
    >
      <path d={paths[name]} />
    </svg>
  );
}
