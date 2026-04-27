import { cn } from '../../utils/cn';

interface SwitchProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  label?: string;
  size?: 'sm' | 'md';
  className?: string;
  id?: string;
}

export function Switch({ checked, onChange, label, size = 'md', className, id }: SwitchProps) {
  const dims = size === 'sm' ? 'h-5 w-9' : 'h-6 w-11';
  const knob = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';
  const offset = size === 'sm' ? 'translate-x-4' : 'translate-x-5';

  return (
    <label className={cn('inline-flex cursor-pointer items-center gap-2', className)} htmlFor={id}>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-4',
          dims,
          checked
            ? 'bg-brand-600 focus:ring-brand-500/30'
            : 'bg-ink-200 focus:ring-ink-300/30 dark:bg-ink-700',
        )}
      >
        <span
          className={cn(
            'inline-block transform rounded-full bg-white shadow transition',
            knob,
            'translate-x-0.5',
            checked && offset,
          )}
        />
      </button>
      {label && (
        <span className="text-sm font-medium text-ink-700 dark:text-ink-200">{label}</span>
      )}
    </label>
  );
}
