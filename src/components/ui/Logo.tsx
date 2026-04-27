import { cn } from '../../utils/cn';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'mark';
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: { box: 'h-7 w-7', text: 'text-base' },
  md: { box: 'h-9 w-9', text: 'text-lg' },
  lg: { box: 'h-11 w-11', text: 'text-xl' },
};

export function Logo({ className, variant = 'full', size = 'md' }: LogoProps) {
  const { box, text } = sizeMap[size];
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div
        className={cn(
          'relative grid place-items-center rounded-xl text-white shadow-glow',
          box,
        )}
        style={{
          background:
            'linear-gradient(135deg, #1d75f5 0%, #06c4ad 100%)',
        }}
        aria-hidden
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
          <path
            d="M10 4h4v6h6v4h-6v6h-4v-6H4v-4h6V4z"
            fill="currentColor"
          />
        </svg>
      </div>
      {variant === 'full' && (
        <div className="flex flex-col leading-tight">
          <span
            className={cn(
              'font-display font-bold tracking-tight text-ink-900 dark:text-white',
              text,
            )}
          >
            MediSync
          </span>
          <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-ink-400 dark:text-ink-500">
            Healthcare OS
          </span>
        </div>
      )}
    </div>
  );
}
