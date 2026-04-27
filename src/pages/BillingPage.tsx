import { useEffect } from 'react';
import {
  CircleDollarSign,
  CreditCard,
  Download,
  FileText,
  Receipt,
  TrendingUp,
} from 'lucide-react';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { StatCard } from '../components/dashboard/StatCard';
import { currency, formatDate } from '../utils/format';

const invoices = [
  {
    id: 'INV-2049',
    patient: 'Aanya Patel',
    amount: 4820,
    status: 'paid',
    due: '2026-04-12',
    method: 'Insurance · Aetna',
  },
  {
    id: 'INV-2048',
    patient: 'Marcus Bennett',
    amount: 12_640,
    status: 'pending',
    due: '2026-05-02',
    method: 'Insurance · BlueCross',
  },
  {
    id: 'INV-2047',
    patient: 'Olivia Foster',
    amount: 1850,
    status: 'paid',
    due: '2026-04-10',
    method: 'Card · ••••4242',
  },
  {
    id: 'INV-2046',
    patient: 'Hiroshi Tanaka',
    amount: 28_400,
    status: 'overdue',
    due: '2026-03-30',
    method: 'Wire',
  },
  {
    id: 'INV-2045',
    patient: 'Sofia Rivera',
    amount: 6450,
    status: 'paid',
    due: '2026-04-08',
    method: 'Insurance · UnitedHC',
  },
  {
    id: 'INV-2044',
    patient: 'Layla Brooks',
    amount: 3200,
    status: 'pending',
    due: '2026-05-09',
    method: 'Card · ••••0091',
  },
] as const;

const statusTone = {
  paid: { tone: 'success' as const, label: 'Paid' },
  pending: { tone: 'warning' as const, label: 'Pending' },
  overdue: { tone: 'danger' as const, label: 'Overdue' },
};

export default function BillingPage() {
  useEffect(() => {
    document.title = 'Billing · MediSync';
  }, []);

  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600 dark:text-brand-400">
            Finance
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold text-ink-900 dark:text-white sm:text-[28px]">
            Billing & Invoices
          </h1>
          <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
            Track collections, payouts and outstanding claims.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" leftIcon={<Download className="h-4 w-4" />}>
            Export
          </Button>
          <Button leftIcon={<FileText className="h-4 w-4" />}>New invoice</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Collected (MTD)" value={currency(486_320)} delta={9.2} icon={CircleDollarSign} tone="emerald" />
        <StatCard label="Outstanding" value={currency(132_400)} delta={-4.1} icon={Receipt} tone="amber" />
        <StatCard label="Avg. claim time" value="6.4 days" delta={-1.2} icon={TrendingUp} tone="brand" />
        <StatCard label="Active payors" value="32" delta={2.0} icon={CreditCard} tone="violet" />
      </div>

      <Card className="p-0">
        <CardHeader
          title="Recent invoices"
          subtitle="Last 30 days · all departments"
          className="p-5"
          action={<Badge tone="brand">{invoices.length} records</Badge>}
        />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-y border-ink-100 bg-ink-50/60 text-[11px] font-semibold uppercase tracking-wide text-ink-500 dark:border-ink-800 dark:bg-ink-800/40">
                <th className="px-5 py-3 text-left">Invoice</th>
                <th className="px-5 py-3 text-left">Patient</th>
                <th className="px-5 py-3 text-left">Method</th>
                <th className="px-5 py-3 text-left">Due</th>
                <th className="px-5 py-3 text-right">Amount</th>
                <th className="px-5 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100 dark:divide-ink-800">
              {invoices.map((inv) => (
                <tr key={inv.id} className="transition hover:bg-ink-50/70 dark:hover:bg-ink-800/40">
                  <td className="px-5 py-3.5 font-mono text-xs font-semibold text-ink-700 dark:text-ink-200">
                    {inv.id}
                  </td>
                  <td className="px-5 py-3.5 font-medium text-ink-900 dark:text-white">
                    {inv.patient}
                  </td>
                  <td className="px-5 py-3.5 text-ink-600 dark:text-ink-300">{inv.method}</td>
                  <td className="px-5 py-3.5 text-ink-500">{formatDate(inv.due)}</td>
                  <td className="px-5 py-3.5 text-right font-semibold text-ink-900 dark:text-white">
                    {currency(inv.amount)}
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge tone={statusTone[inv.status].tone} dot>
                      {statusTone[inv.status].label}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
