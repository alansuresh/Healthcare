import {
  AlertTriangle,
  ArrowRight,
  CalendarCheck,
  CircleDollarSign,
  LogIn,
  LogOut,
} from 'lucide-react';
import type { ActivityRecord } from '../../types';
import { cn } from '../../utils/cn';
import { relativeTime } from '../../utils/format';

const iconMap = {
  admission: LogIn,
  discharge: LogOut,
  alert: AlertTriangle,
  appointment: CalendarCheck,
  payment: CircleDollarSign,
} as const;

const toneMap = {
  critical: 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300',
  warning: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300',
  success: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300',
  info: 'bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300',
} as const;

export function ActivityFeed({ items }: { items: ActivityRecord[] }) {
  return (
    <ul className="divide-y divide-ink-100 dark:divide-ink-800">
      {items.map((a) => {
        const Icon = iconMap[a.type];
        const tone = toneMap[a.severity ?? 'info'];
        return (
          <li
            key={a.id}
            className="flex items-start gap-3 py-3 first:pt-0 last:pb-0"
          >
            <span className={cn('grid h-9 w-9 shrink-0 place-items-center rounded-xl', tone)}>
              <Icon className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink-900 dark:text-white">
                {a.message}
              </p>
              {a.patient && (
                <p className="truncate text-xs text-ink-500 dark:text-ink-400">
                  {a.patient}
                </p>
              )}
            </div>
            <span className="whitespace-nowrap text-[11px] font-medium text-ink-400">
              {relativeTime(new Date(a.timestamp))}
            </span>
          </li>
        );
      })}
      <li className="pt-3">
        <button className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:underline">
          View full activity log
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </li>
    </ul>
  );
}
