import {
  BedDouble,
  Stethoscope,
  Phone,
  MoreHorizontal,
  ClipboardList,
} from 'lucide-react';
import type { Patient } from '../../types';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { StatusBadge } from '../ui/StatusBadge';
import { formatDate } from '../../utils/format';

export function PatientCard({ patient }: { patient: Patient }) {
  return (
    <div className="surface group relative flex flex-col p-5 transition hover:-translate-y-0.5 hover:shadow-card">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar name={patient.name} hue={patient.avatarHue} size="lg" ringed />
          <div>
            <p className="font-display text-base font-semibold text-ink-900 dark:text-white">
              {patient.name}
            </p>
            <p className="text-xs text-ink-500">
              {patient.age} · {patient.gender === 'F' ? 'Female' : patient.gender === 'M' ? 'Male' : 'Other'} ·{' '}
              {patient.bloodType ?? '—'}
            </p>
          </div>
        </div>
        <button className="rounded-lg p-1.5 text-ink-400 opacity-0 transition hover:bg-ink-100 hover:text-ink-700 group-hover:opacity-100 dark:hover:bg-ink-800">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      <p className="mt-4 text-sm font-medium text-ink-700 dark:text-ink-200">
        {patient.condition}
      </p>
      <p className="mt-0.5 text-xs text-ink-500">{patient.department}</p>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <Detail icon={<BedDouble className="h-3.5 w-3.5" />} label="Room" value={patient.room} />
        <Detail
          icon={<Stethoscope className="h-3.5 w-3.5" />}
          label="Doctor"
          value={patient.doctor.replace('Dr. ', '')}
        />
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-ink-100 pt-4 dark:border-ink-800">
        <StatusBadge status={patient.status} />
        <p className="text-[11px] text-ink-500">
          Admitted {formatDate(patient.admittedAt)}
        </p>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <Button variant="outline" size="sm" leftIcon={<ClipboardList className="h-3.5 w-3.5" />}>
          Chart
        </Button>
        <Button variant="ghost" size="sm" leftIcon={<Phone className="h-3.5 w-3.5" />}>
          Contact
        </Button>
        <Button size="sm" className="ml-auto">
          View
        </Button>
      </div>
    </div>
  );
}

function Detail({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-ink-50 px-3 py-2 dark:bg-ink-800/60">
      <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-ink-500">
        {icon}
        {label}
      </p>
      <p className="mt-0.5 truncate text-sm font-semibold text-ink-900 dark:text-white">{value}</p>
    </div>
  );
}
