import type { InputHTMLAttributes } from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../utils/cn';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string;
}

export function Checkbox({ label, className, id, checked, ...props }: CheckboxProps) {
  const inputId = id ?? props.name;
  return (
    <label
      htmlFor={inputId}
      className={cn(
        'inline-flex cursor-pointer items-center gap-2 select-none',
        className,
      )}
    >
      <span className="relative inline-flex">
        <input
          id={inputId}
          type="checkbox"
          checked={checked}
          className="peer h-4 w-4 cursor-pointer appearance-none rounded-md border border-ink-300 bg-white transition checked:border-brand-600 checked:bg-brand-600 focus:outline-none focus:ring-4 focus:ring-brand-500/20 dark:border-ink-600 dark:bg-ink-900"
          {...props}
        />
        <Check
          className="pointer-events-none absolute left-0.5 top-0.5 h-3 w-3 text-white opacity-0 peer-checked:opacity-100"
          strokeWidth={3.5}
        />
      </span>
      {label && (
        <span className="text-sm text-ink-700 dark:text-ink-200">{label}</span>
      )}
    </label>
  );
}
