import { ChevronDown, ChevronUp, MoreHorizontal } from 'lucide-react';
import type { Patient } from '../../types';
import { Avatar } from '../ui/Avatar';
import { StatusBadge } from '../ui/StatusBadge';
import { formatDate } from '../../utils/format';
import { cn } from '../../utils/cn';

export type SortKey =
  | 'id'
  | 'name'
  | 'age'
  | 'department'
  | 'doctor'
  | 'admittedAt'
  | 'status';

export interface SortState {
  key: SortKey;
  dir: 'asc' | 'desc';
}

interface Props {
  patients: Patient[];
  sort: SortState;
  onSortChange: (next: SortState) => void;
}

const columns: { key: SortKey; label: string; sortable?: boolean; width?: string }[] = [
  { key: 'id', label: 'Patient ID', sortable: true, width: 'w-[120px]' },
  { key: 'name', label: 'Name', sortable: true },
  { key: 'age', label: 'Age', sortable: true, width: 'w-[80px]' },
  { key: 'department', label: 'Department', sortable: true },
  { key: 'doctor', label: 'Doctor', sortable: true },
  { key: 'admittedAt', label: 'Admit Date', sortable: true, width: 'w-[140px]' },
  { key: 'status', label: 'Status', sortable: true, width: 'w-[140px]' },
];

export function PatientTable({ patients, sort, onSortChange }: Props) {
  const toggleSort = (key: SortKey) => {
    if (sort.key === key) {
      onSortChange({ key, dir: sort.dir === 'asc' ? 'desc' : 'asc' });
    } else {
      onSortChange({ key, dir: 'asc' });
    }
  };

  return (
    <div className="surface overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink-100 bg-ink-50/60 text-[11px] font-semibold uppercase tracking-wide text-ink-500 dark:border-ink-800 dark:bg-ink-800/40 dark:text-ink-400">
              {columns.map((c) => {
                const active = sort.key === c.key;
                return (
                  <th
                    key={c.key}
                    scope="col"
                    className={cn(
                      'px-4 py-3 text-left first:pl-6',
                      c.width,
                      c.sortable && 'cursor-pointer select-none',
                    )}
                    onClick={() => c.sortable && toggleSort(c.key)}
                  >
                    <span className="inline-flex items-center gap-1">
                      {c.label}
                      {c.sortable && (
                        <span
                          className={cn(
                            'inline-flex flex-col leading-[0.7]',
                            active ? 'text-brand-600' : 'text-ink-300',
                          )}
                        >
                          <ChevronUp
                            className={cn(
                              'h-2.5 w-2.5',
                              active && sort.dir === 'asc' ? 'opacity-100' : 'opacity-50',
                            )}
                          />
                          <ChevronDown
                            className={cn(
                              'h-2.5 w-2.5',
                              active && sort.dir === 'desc' ? 'opacity-100' : 'opacity-50',
                            )}
                          />
                        </span>
                      )}
                    </span>
                  </th>
                );
              })}
              <th className="w-12" />
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100 dark:divide-ink-800">
            {patients.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-14 text-center text-sm text-ink-500">
                  No patients match your filters.
                </td>
              </tr>
            )}
            {patients.map((p) => (
              <tr
                key={p.id}
                className="group transition hover:bg-ink-50/70 dark:hover:bg-ink-800/40"
              >
                <td className="px-4 py-3.5 pl-6 font-mono text-xs font-semibold text-ink-600 dark:text-ink-300">
                  {p.id}
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <Avatar name={p.name} hue={p.avatarHue} size="sm" ringed />
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-ink-900 dark:text-white">
                        {p.name}
                      </p>
                      <p className="truncate text-xs text-ink-500">{p.condition}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-ink-700 dark:text-ink-200">{p.age}</td>
                <td className="px-4 py-3.5 text-ink-700 dark:text-ink-200">{p.department}</td>
                <td className="px-4 py-3.5 text-ink-700 dark:text-ink-200">{p.doctor}</td>
                <td className="px-4 py-3.5 text-ink-500">{formatDate(p.admittedAt)}</td>
                <td className="px-4 py-3.5">
                  <StatusBadge status={p.status} />
                </td>
                <td className="px-4 py-3.5 pr-4 text-right">
                  <button className="rounded-lg p-1.5 text-ink-400 opacity-0 transition hover:bg-ink-100 hover:text-ink-700 group-hover:opacity-100 dark:hover:bg-ink-700/60">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
