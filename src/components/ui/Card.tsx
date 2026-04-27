import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../utils/cn';

export function Card({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('surface p-5', className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  action,
  className,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('mb-4 flex items-start justify-between gap-3', className)}>
      <div>
        <h3 className="font-display text-base font-semibold text-ink-900 dark:text-ink-50">
          {title}
        </h3>
        {subtitle && (
          <p className="mt-0.5 text-sm text-ink-500 dark:text-ink-400">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}
