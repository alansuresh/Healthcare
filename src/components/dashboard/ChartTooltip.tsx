import type { TooltipProps } from 'recharts';

export function ChartTooltip({
  active,
  payload,
  label,
  valueFormatter,
}: TooltipProps<number, string> & {
  valueFormatter?: (v: number) => string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-ink-200 bg-white/95 px-3 py-2.5 text-xs shadow-card backdrop-blur dark:border-ink-700 dark:bg-ink-900/95">
      {label && (
        <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink-500">
          {label}
        </p>
      )}
      <ul className="space-y-1">
        {payload.map((p) => (
          <li key={p.dataKey as string} className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: (p.color as string) ?? '#1d75f5' }}
            />
            <span className="font-medium capitalize text-ink-600 dark:text-ink-300">
              {p.name as string}
            </span>
            <span className="ml-auto font-semibold text-ink-900 dark:text-white">
              {valueFormatter
                ? valueFormatter(Number(p.value))
                : (p.value as number).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
