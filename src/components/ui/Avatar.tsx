import { cn } from '../../utils/cn';
import { initials } from '../../utils/format';

interface AvatarProps {
  name: string;
  src?: string | null;
  hue?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  ringed?: boolean;
}

const sizes = {
  sm: 'h-7 w-7 text-[10px]',
  md: 'h-9 w-9 text-xs',
  lg: 'h-11 w-11 text-sm',
  xl: 'h-14 w-14 text-base',
};

export function Avatar({
  name,
  src,
  hue,
  size = 'md',
  className,
  ringed,
}: AvatarProps) {
  const h = hue ?? hashHue(name);
  const bg = `linear-gradient(135deg, hsl(${h} 80% 62%), hsl(${(h + 38) % 360} 75% 48%))`;

  return (
    <span
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-semibold text-white shadow-sm',
        sizes[size],
        ringed &&
          'ring-2 ring-white dark:ring-ink-900 outline outline-1 outline-ink-200/60 dark:outline-ink-700',
        className,
      )}
      style={src ? undefined : { background: bg }}
      aria-label={name}
    >
      {src ? (
        <img src={src} alt={name} className="h-full w-full object-cover" />
      ) : (
        <span className="tracking-wide">{initials(name) || '?'}</span>
      )}
    </span>
  );
}

function hashHue(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h) % 360;
}
