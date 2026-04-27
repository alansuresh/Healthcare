import { useEffect, useMemo, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  Plus,
  Search,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ViewToggle } from '../components/patients/ViewToggle';
import { PatientCard } from '../components/patients/PatientCard';
import {
  PatientTable,
  type SortState,
} from '../components/patients/PatientTable';
import type { Patient, PatientStatus, ViewMode } from '../types';
import { PATIENTS } from '../services/mockData';
import { cn } from '../utils/cn';

const STATUSES: { value: 'all' | PatientStatus; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'critical', label: 'Critical' },
  { value: 'stable', label: 'Stable' },
  { value: 'recovering', label: 'Recovering' },
  { value: 'discharged', label: 'Discharged' },
];

const PAGE_SIZE = 9;

export default function PatientsPage() {
  const [view, setView] = useState<ViewMode>(() => {
    return (localStorage.getItem('medisync.patients.view') as ViewMode) || 'grid';
  });
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState<string>('all');
  const [status, setStatus] = useState<'all' | PatientStatus>('all');
  const [sort, setSort] = useState<SortState>({ key: 'admittedAt', dir: 'desc' });
  const [page, setPage] = useState(1);

  useEffect(() => {
    document.title = 'Patients · MediSync';
  }, []);

  useEffect(() => {
    localStorage.setItem('medisync.patients.view', view);
  }, [view]);

  useEffect(() => {
    setPage(1);
  }, [search, department, status, view]);

  const departments = useMemo(
    () => Array.from(new Set(PATIENTS.map((p) => p.department))).sort(),
    [],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return PATIENTS.filter((p) => {
      if (status !== 'all' && p.status !== status) return false;
      if (department !== 'all' && p.department !== department) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.doctor.toLowerCase().includes(q) ||
        p.condition.toLowerCase().includes(q)
      );
    });
  }, [search, department, status]);

  const sorted = useMemo(() => {
    const dir = sort.dir === 'asc' ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const av = a[sort.key as keyof Patient];
      const bv = b[sort.key as keyof Patient];
      if (av == null) return 1;
      if (bv == null) return -1;
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir;
      return String(av).localeCompare(String(bv)) * dir;
    });
  }, [filtered, sort]);

  const pageSize = view === 'grid' ? PAGE_SIZE : 12;
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paged = sorted.slice((page - 1) * pageSize, page * pageSize);

  const exportCsv = () => {
    const rows = [
      ['ID', 'Name', 'Age', 'Gender', 'Condition', 'Department', 'Doctor', 'Room', 'Status', 'AdmittedAt'],
      ...sorted.map((p) => [
        p.id,
        p.name,
        p.age,
        p.gender,
        p.condition,
        p.department,
        p.doctor,
        p.room,
        p.status,
        p.admittedAt,
      ]),
    ];
    const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medisync-patients-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${sorted.length} patients`);
  };

  const filtersActive =
    search.trim().length > 0 || department !== 'all' || status !== 'all';

  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600 dark:text-brand-400">
            Care Roster
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold text-ink-900 dark:text-white sm:text-[28px]">
            Patients
          </h1>
          <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
            {sorted.length} of {PATIENTS.length} patients · live from EHR
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <ViewToggle view={view} onChange={setView} />
          <Button variant="outline" leftIcon={<Download className="h-4 w-4" />} onClick={exportCsv}>
            Export
          </Button>
          <Button leftIcon={<Plus className="h-4 w-4" />}>Admit patient</Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="flex flex-wrap items-center gap-3 p-4">
        <div className="relative w-full min-w-0 flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            type="search"
            placeholder="Search by name, ID, doctor, condition…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full rounded-xl border border-ink-200 bg-white py-2.5 pl-10 pr-9 text-sm placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15 dark:border-ink-700 dark:bg-ink-900 dark:placeholder:text-ink-500"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-800"
              aria-label="Clear"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {STATUSES.map((s) => (
            <button
              key={s.value}
              onClick={() => setStatus(s.value)}
              className={cn(
                'whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold transition',
                status === s.value
                  ? 'border-brand-600 bg-brand-50 text-brand-700 dark:border-brand-500 dark:bg-brand-500/15 dark:text-brand-200'
                  : 'border-ink-200 bg-white text-ink-600 hover:border-ink-300 hover:bg-ink-50 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-300 dark:hover:bg-ink-800',
              )}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="appearance-none rounded-xl border border-ink-200 bg-white py-2.5 pl-9 pr-9 text-sm text-ink-700 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-200"
            >
              <option value="all">All departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          {filtersActive && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearch('');
                setDepartment('all');
                setStatus('all');
              }}
            >
              Reset
            </Button>
          )}
        </div>
      </Card>

      {/* Content */}
      {view === 'grid' ? (
        paged.length === 0 ? (
          <Card className="grid place-items-center py-20 text-sm text-ink-500">
            No patients match your filters.
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 animate-fade-in">
            {paged.map((p) => (
              <PatientCard key={p.id} patient={p} />
            ))}
          </div>
        )
      ) : (
        <PatientTable patients={paged} sort={sort} onSortChange={setSort} />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-sm">
          <p className="text-ink-500">
            Showing{' '}
            <span className="font-semibold text-ink-700 dark:text-ink-200">
              {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, sorted.length)}
            </span>{' '}
            of {sorted.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-lg border border-ink-200 bg-white p-2 text-ink-600 transition hover:bg-ink-50 disabled:opacity-50 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-300"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => {
              const n = i + 1;
              const visible =
                n === 1 ||
                n === totalPages ||
                (n >= page - 1 && n <= page + 1);
              if (!visible) {
                if (n === page - 2 || n === page + 2) {
                  return (
                    <span key={n} className="px-1 text-ink-400">
                      …
                    </span>
                  );
                }
                return null;
              }
              return (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={cn(
                    'h-9 min-w-9 rounded-lg px-2.5 text-sm font-semibold transition',
                    n === page
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800',
                  )}
                >
                  {n}
                </button>
              );
            })}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded-lg border border-ink-200 bg-white p-2 text-ink-600 transition hover:bg-ink-50 disabled:opacity-50 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-300"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
