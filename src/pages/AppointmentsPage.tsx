import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { cn } from '../utils/cn';
import { PATIENTS } from '../services/mockData';

const HOURS = Array.from({ length: 9 }, (_, i) => 8 + i); // 8 AM – 4 PM

interface Slot {
  day: number; // 0..6
  hour: number;
  patient: string;
  doctor: string;
  type: 'consult' | 'surgery' | 'follow-up';
}

function buildSlots(weekStart: Date): Slot[] {
  let s = weekStart.getDate() * 17 + weekStart.getMonth() + 1;
  const r = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  const slots: Slot[] = [];
  for (let d = 0; d < 7; d++) {
    const count = 2 + Math.floor(r() * 3);
    const hoursUsed = new Set<number>();
    for (let i = 0; i < count; i++) {
      let h = HOURS[Math.floor(r() * HOURS.length)];
      while (hoursUsed.has(h)) h = HOURS[Math.floor(r() * HOURS.length)];
      hoursUsed.add(h);
      const patient = PATIENTS[Math.floor(r() * PATIENTS.length)];
      slots.push({
        day: d,
        hour: h,
        patient: patient.name,
        doctor: patient.doctor,
        type: r() > 0.7 ? 'surgery' : r() > 0.4 ? 'follow-up' : 'consult',
      });
    }
  }
  return slots;
}

const startOfWeek = (d: Date) => {
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const out = new Date(d);
  out.setHours(0, 0, 0, 0);
  out.setDate(diff);
  return out;
};

const fmtDay = (d: Date) =>
  d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });

const typeStyle: Record<Slot['type'], string> = {
  consult:
    'border-brand-200 bg-brand-50 text-brand-800 dark:border-brand-500/30 dark:bg-brand-500/15 dark:text-brand-200',
  surgery:
    'border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-500/30 dark:bg-rose-500/15 dark:text-rose-200',
  'follow-up':
    'border-teal-200 bg-teal-50 text-teal-800 dark:border-teal-500/30 dark:bg-teal-500/15 dark:text-teal-200',
};

export default function AppointmentsPage() {
  const [cursor, setCursor] = useState(() => startOfWeek(new Date()));
  const slots = useMemo(() => buildSlots(cursor), [cursor]);
  const days = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => {
        const d = new Date(cursor);
        d.setDate(cursor.getDate() + i);
        return d;
      }),
    [cursor],
  );

  useEffect(() => {
    document.title = 'Appointments · MediSync';
  }, []);

  const move = (delta: number) => {
    const next = new Date(cursor);
    next.setDate(cursor.getDate() + delta * 7);
    setCursor(next);
  };

  const today = new Date();

  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-5 animate-fade-in">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600 dark:text-brand-400">
            Schedule
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold text-ink-900 dark:text-white sm:text-[28px]">
            Appointments
          </h1>
          <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
            Week of {cursor.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => move(-1)} aria-label="Previous week">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={() => setCursor(startOfWeek(new Date()))}>
            Today
          </Button>
          <Button variant="outline" size="icon" onClick={() => move(1)} aria-label="Next week">
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button leftIcon={<Plus className="h-4 w-4" />}>New appointment</Button>
        </div>
      </div>

      <Card className="p-0">
        <CardHeader
          title="Week schedule"
          subtitle="Color-coded by appointment type"
          action={
            <div className="flex items-center gap-3 text-xs text-ink-500">
              <Legend color="bg-brand-500" label="Consult" />
              <Legend color="bg-teal-500" label="Follow-up" />
              <Legend color="bg-rose-500" label="Surgery" />
            </div>
          }
          className="px-5 pt-5"
        />

        <div className="overflow-x-auto">
          <div className="grid min-w-[860px] grid-cols-[80px_repeat(7,minmax(0,1fr))] divide-x divide-ink-100 border-t border-ink-100 dark:divide-ink-800 dark:border-ink-800">
            {/* Header row */}
            <div className="bg-ink-50/50 dark:bg-ink-800/30" />
            {days.map((d) => {
              const isToday = d.toDateString() === today.toDateString();
              return (
                <div
                  key={d.toISOString()}
                  className={cn(
                    'bg-ink-50/50 px-3 py-2 text-xs font-semibold uppercase tracking-wide dark:bg-ink-800/30',
                    isToday ? 'text-brand-600 dark:text-brand-300' : 'text-ink-500',
                  )}
                >
                  {fmtDay(d)}
                  {isToday && (
                    <Badge tone="brand" className="ml-2 align-middle text-[9px]">
                      Today
                    </Badge>
                  )}
                </div>
              );
            })}

            {/* Hours grid */}
            {HOURS.map((h) => (
              <Row key={h} hour={h} days={days} slots={slots} />
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

function Row({ hour, days, slots }: { hour: number; days: Date[]; slots: Slot[] }) {
  const label = `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`;
  return (
    <>
      <div className="border-t border-ink-100 px-3 py-3 text-xs font-medium text-ink-500 dark:border-ink-800">
        {label}
      </div>
      {days.map((_, di) => {
        const slot = slots.find((s) => s.day === di && s.hour === hour);
        return (
          <div
            key={`${hour}-${di}`}
            className="relative min-h-[74px] border-t border-ink-100 px-2 py-1.5 transition hover:bg-ink-50/60 dark:border-ink-800 dark:hover:bg-ink-800/40"
          >
            {slot && (
              <div
                className={cn(
                  'group cursor-pointer rounded-lg border px-2.5 py-1.5 text-[11px] leading-snug shadow-sm transition hover:-translate-y-0.5 hover:shadow',
                  typeStyle[slot.type],
                )}
              >
                <p className="font-semibold capitalize">{slot.type}</p>
                <p className="truncate font-medium">{slot.patient}</p>
                <p className="truncate text-[10px] opacity-80">{slot.doctor}</p>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={cn('h-2 w-2 rounded-full', color)} />
      {label}
    </span>
  );
}
