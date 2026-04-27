import type { LucideIcon } from 'lucide-react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { cn } from '../../utils/cn';

interface StatCardProps {
  label: string;
  value: string;
  delta?: number; // percent
  icon: LucideIcon;
  tone?: 'brand' | 'teal' | 'amber' | 'rose' | 'violet' | 'emerald';
  spark?: number[];
}

const tones = {
  brand: { bg: 'bg-brand-50 dark:bg-brand-500/10', fg: 'text-brand-600 dark:text-brand-300' },
  teal: { bg: 'bg-teal-50 dark:bg-teal-500/10', fg: 'text-teal-600 dark:text-teal-300' },
  amber: { bg: 'bg-amber-50 dark:bg-amber-500/10', fg: 'text-amber-600 dark:text-amber-300' },
  rose: { bg: 'bg-rose-50 dark:bg-rose-500/10', fg: 'text-rose-600 dark:text-rose-300' },
  violet: { bg: 'bg-violet-50 dark:bg-violet-500/10', fg: 'text-violet-600 dark:text-violet-300' },
  emerald: {
    bg: 'bg-emerald-50 dark:bg-emerald-500/10',
    fg: 'text-emerald-600 dark:text-emerald-300',
  },
};

export function StatCard({ label, value, delta, icon: Icon, tone = 'brand', spark }: StatCardProps) {
  const isUp = (delta ?? 0) >= 0;
  return (
    <div className="surface group relative overflow-hidden p-5 transition hover:-translate-y-0.5 hover:shadow-card">
      <div className="flex items-start justify-between">
        <div className="space-y-1.5">
          <p className="text-[12px] font-medium uppercase tracking-wide text-ink-500 dark:text-ink-400">
            {label}
          </p>
          <p className="font-display text-2xl font-bold tracking-tight text-ink-900 dark:text-white">
            {value}
          </p>
        </div>
        <span className={cn('grid h-10 w-10 place-items-center rounded-xl', tones[tone].bg)}>
          <Icon className={cn('h-5 w-5', tones[tone].fg)} />
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between">
        {typeof delta === 'number' ? (
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold',
              isUp
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'
                : 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300',
            )}
          >
            {isUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {Math.abs(delta).toFixed(1)}%
          </span>
        ) : (
          <span />
        )}
        {spark && <Sparkline data={spark} positive={isUp} />}
      </div>
    </div>
  );
}

function Sparkline({ data, positive }: { data: number[]; positive: boolean }) {
  const w = 90;
  const h = 28;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = w / (data.length - 1);
  const points = data
    .map((v, i) => `${i * step},${h - ((v - min) / range) * h}`)
    .join(' ');
  const stroke = positive ? '#10b981' : '#ef4444';
  return (
    <svg width={w} height={h} className="opacity-90" aria-hidden>
      <defs>
        <linearGradient id={`g-${stroke}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.3" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline
        fill="none"
        stroke={stroke}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
      <polygon
        points={`0,${h} ${points} ${w},${h}`}
        fill={`url(#g-${stroke})`}
      />
    </svg>
  );
}
