import { Fragment, useEffect, useMemo, useState } from 'react';
import {
  CalendarDays,
  Download,
  TrendingUp,
  Users,
  Clock,
  HeartPulse,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import toast from 'react-hot-toast';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ChartTooltip } from '../components/dashboard/ChartTooltip';
import {
  appointmentTrends,
  departmentPerformance,
  patientDemographics,
  revenueTrend,
} from '../services/mockData';
import { compactNumber, currency, percent } from '../utils/format';
import { cn } from '../utils/cn';

const RANGES = ['7d', '30d', '90d', '12m'] as const;
type Range = (typeof RANGES)[number];

const HEATMAP_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HEATMAP_HOURS = ['00', '04', '08', '12', '16', '20'];

function makeHeatmap(): number[][] {
  let s = 7;
  const r = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  return HEATMAP_DAYS.map(() =>
    HEATMAP_HOURS.map(() => Math.floor(r() * 100)),
  );
}

export default function AnalyticsPage() {
  const [range, setRange] = useState<Range>('30d');
  const heatmap = useMemo(() => makeHeatmap(), []);

  useEffect(() => {
    document.title = 'Analytics · MediSync';
  }, []);

  const exportCsv = () => {
    const rows = [
      ['Department', 'Cases', 'Satisfaction'],
      ...departmentPerformance.map((d) => [d.department, d.cases, d.satisfaction]),
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medisync-departments-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Report exported');
  };

  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600 dark:text-brand-400">
            Analytics
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold text-ink-900 dark:text-white sm:text-[28px]">
            Performance & insights
          </h1>
          <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
            Decision-grade metrics across patients, operations, and revenue.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-xl border border-ink-200 bg-white p-1 text-sm dark:border-ink-700 dark:bg-ink-900">
            {RANGES.map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={cn(
                  'rounded-lg px-3 py-1.5 font-medium transition',
                  range === r
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-200'
                    : 'text-ink-600 hover:text-ink-900 dark:text-ink-300 dark:hover:text-white',
                )}
              >
                {r === '12m' ? '12 mo' : r}
              </button>
            ))}
          </div>
          <Button variant="outline" leftIcon={<CalendarDays className="h-4 w-4" />}>
            Custom
          </Button>
          <Button leftIcon={<Download className="h-4 w-4" />} onClick={exportCsv}>
            Export report
          </Button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Avg. wait time"
          value="14.2 min"
          delta={-6.4}
          icon={<Clock className="h-5 w-5" />}
          tone="emerald"
        />
        <KpiCard
          label="Patient retention"
          value="92.6%"
          delta={1.8}
          icon={<HeartPulse className="h-5 w-5" />}
          tone="brand"
        />
        <KpiCard
          label="New patients"
          value="1,284"
          delta={12.4}
          icon={<Users className="h-5 w-5" />}
          tone="teal"
        />
        <KpiCard
          label="Revenue per case"
          value={currency(2840)}
          delta={3.2}
          icon={<TrendingUp className="h-5 w-5" />}
          tone="violet"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Appointment Trends"
            subtitle={`Scheduled, completed and cancelled (${range})`}
            action={<Badge tone="teal" dot>Live</Badge>}
          />
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={appointmentTrends} margin={{ top: 8, right: 12, bottom: 0, left: -10 }}>
                <CartesianGrid stroke="rgba(99,117,149,0.12)" vertical={false} />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                <Tooltip content={<ChartTooltip />} />
                <Legend
                  iconType="circle"
                  wrapperStyle={{ fontSize: 12, paddingTop: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="scheduled"
                  stroke="#1d75f5"
                  strokeWidth={2.2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="completed"
                  stroke="#06c4ad"
                  strokeWidth={2.2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="cancelled"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                  strokeDasharray="4 4"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Patient Demographics"
            subtitle="Age range distribution"
          />
          <div className="space-y-4 pt-1">
            {patientDemographics.map((d) => {
              const total = d.male + d.female;
              const malePct = (d.male / total) * 100;
              return (
                <div key={d.range}>
                  <div className="mb-1 flex items-center justify-between text-[12px] text-ink-500">
                    <span className="font-medium text-ink-700 dark:text-ink-200">{d.range}</span>
                    <span>{total.toLocaleString()}</span>
                  </div>
                  <div className="flex h-2 overflow-hidden rounded-full bg-ink-100 dark:bg-ink-800">
                    <span
                      className="bg-brand-500"
                      style={{ width: `${malePct}%` }}
                      title={`Male ${d.male}`}
                    />
                    <span className="bg-teal-500 flex-1" title={`Female ${d.female}`} />
                  </div>
                </div>
              );
            })}
            <div className="flex items-center gap-4 pt-2 text-[11px] text-ink-500">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-brand-500" /> Male
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-teal-500" /> Female
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Revenue + Department Usage row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Department Usage"
            subtitle="Throughput across departments"
          />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={departmentPerformance}
                layout="vertical"
                margin={{ top: 4, right: 16, bottom: 4, left: 12 }}
              >
                <CartesianGrid stroke="rgba(99,117,149,0.12)" horizontal={false} />
                <XAxis type="number" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                <YAxis
                  type="category"
                  dataKey="department"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                  width={100}
                />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(29,117,245,0.06)' }} />
                <Bar dataKey="cases" radius={[0, 8, 8, 0]}>
                  {departmentPerformance.map((d, i) => (
                    <Cell
                      key={d.department}
                      fill={i % 2 === 0 ? '#1d75f5' : '#06c4ad'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Revenue Insights"
            subtitle="Top performing service lines"
          />
          <div className="space-y-3">
            {[
              { label: 'Cardiac surgery', amount: 184000, share: 32 },
              { label: 'Oncology programs', amount: 142000, share: 24 },
              { label: 'Maternity care', amount: 96000, share: 16 },
              { label: 'Diagnostics & imaging', amount: 84000, share: 14 },
              { label: 'Outpatient consults', amount: 76000, share: 14 },
            ].map((row) => (
              <div key={row.label}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium text-ink-800 dark:text-ink-100">{row.label}</span>
                  <span className="text-ink-500">{currency(row.amount)}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-ink-100 dark:bg-ink-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-500 to-teal-500"
                    style={{ width: `${row.share}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Heatmap */}
      <Card>
        <CardHeader
          title="Foot-traffic Heatmap"
          subtitle="Patient visits by day & hour"
          action={<Badge tone="brand">Last 30 days</Badge>}
        />
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            <div className="grid grid-cols-[60px_repeat(6,minmax(0,1fr))] gap-1.5">
              <div />
              {HEATMAP_HOURS.map((h) => (
                <div
                  key={h}
                  className="text-center text-[11px] font-medium text-ink-500"
                >
                  {h}:00
                </div>
              ))}
              {HEATMAP_DAYS.map((day, di) => (
                <Fragment key={day}>
                  <div className="flex items-center text-[11px] font-medium text-ink-500">
                    {day}
                  </div>
                  {heatmap[di].map((v, hi) => (
                    <div
                      key={`${day}-${hi}`}
                      className="group relative aspect-[2/1] rounded-md transition hover:scale-[1.04]"
                      style={{
                        background: heatColor(v),
                      }}
                      title={`${day} ${HEATMAP_HOURS[hi]}:00 · ${v} visits`}
                    >
                      <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-white/0 transition group-hover:text-white">
                        {v}
                      </span>
                    </div>
                  ))}
                </Fragment>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2 text-[11px] text-ink-500">
              <span>Less</span>
              {[10, 30, 50, 70, 90].map((v) => (
                <span
                  key={v}
                  className="h-3 w-5 rounded-sm"
                  style={{ background: heatColor(v) }}
                />
              ))}
              <span>More</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Revenue line */}
      <Card>
        <CardHeader
          title="Revenue trajectory"
          subtitle="Total revenue with running average"
          action={
            <Badge tone="success" dot>
              {percent(((revenueTrend.at(-1)!.revenue / revenueTrend[0].revenue - 1) * 100))} YoY
            </Badge>
          }
        />
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueTrend} margin={{ top: 8, right: 12, bottom: 0, left: -10 }}>
              <CartesianGrid stroke="rgba(99,117,149,0.12)" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
              <YAxis
                tickFormatter={(v) => `$${compactNumber(v)}`}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                content={<ChartTooltip valueFormatter={(v) => currency(v)} />}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#1d75f5"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

function heatColor(v: number) {
  // 0..100 -> brand gradient
  const t = v / 100;
  const start = [240, 247, 255]; // ink-50-ish
  const end = [29, 117, 245]; // brand-600
  const mix = start.map((s, i) => Math.round(s + (end[i] - s) * t));
  return `rgb(${mix.join(',')})`;
}

function KpiCard({
  label,
  value,
  delta,
  icon,
  tone,
}: {
  label: string;
  value: string;
  delta: number;
  icon: React.ReactNode;
  tone: 'brand' | 'teal' | 'emerald' | 'violet';
}) {
  const toneMap = {
    brand: 'from-brand-500/10 to-brand-500/0 text-brand-600 dark:text-brand-300',
    teal: 'from-teal-500/10 to-teal-500/0 text-teal-600 dark:text-teal-300',
    emerald:
      'from-emerald-500/10 to-emerald-500/0 text-emerald-600 dark:text-emerald-300',
    violet: 'from-violet-500/10 to-violet-500/0 text-violet-600 dark:text-violet-300',
  };
  const isUp = delta >= 0;
  return (
    <div className="surface relative overflow-hidden p-5">
      <div className={cn('absolute inset-0 bg-gradient-to-br opacity-70', toneMap[tone])} />
      <div className="relative">
        <div className="flex items-center justify-between">
          <span className={cn('grid h-9 w-9 place-items-center rounded-xl bg-white/70 dark:bg-ink-900/70', toneMap[tone])}>
            {icon}
          </span>
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold',
              isUp
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
                : 'bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300',
            )}
          >
            {isUp ? '▲' : '▼'} {Math.abs(delta).toFixed(1)}%
          </span>
        </div>
        <p className="mt-4 text-[12px] font-medium uppercase tracking-wide text-ink-500 dark:text-ink-400">
          {label}
        </p>
        <p className="mt-1 font-display text-2xl font-bold text-ink-900 dark:text-white">
          {value}
        </p>
      </div>
    </div>
  );
}
