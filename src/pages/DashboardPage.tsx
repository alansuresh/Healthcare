import { useEffect } from 'react';
import {
  Users,
  Stethoscope,
  BedDouble,
  CircleDollarSign,
  Siren,
  Activity,
  Bell,
  Download,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { StatCard } from '../components/dashboard/StatCard';
import { ChartTooltip } from '../components/dashboard/ChartTooltip';
import { ActivityFeed } from '../components/dashboard/ActivityFeed';
import {
  ACTIVITY,
  bedOccupancy,
  departmentPerformance,
  monthlyPatients,
  revenueTrend,
} from '../services/mockData';
import { compactNumber, currency } from '../utils/format';
import { useAuthStore } from '../store/authStore';
import { useNotifications } from '../hooks/useNotifications';

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const { permission, request, notify } = useNotifications();

  useEffect(() => {
    document.title = 'Dashboard · MediSync';
  }, []);

  const sendDemoNotification = async () => {
    if (permission !== 'granted') {
      const result = await request();
      if (result !== 'granted') return;
    }
    await notify({
      title: 'Emergency case admitted',
      body: 'New patient assigned to ICU · Bed C-204',
      tag: 'emergency-demo',
      url: '/patients',
    });
  };

  const totalRevenue = revenueTrend[revenueTrend.length - 1].revenue;

  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-6 animate-fade-in">
      {/* Greeting */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600 dark:text-brand-400">
            Operations · {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold text-ink-900 dark:text-white sm:text-[28px]">
            Welcome back, {user?.displayName?.split(' ')[0] ?? 'Doctor'}.
          </h1>
          <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
            Here's what's happening across St. Lumen Hospital today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="md" leftIcon={<Download className="h-4 w-4" />}>
            Export
          </Button>
          <Button
            size="md"
            leftIcon={<Bell className="h-4 w-4" />}
            onClick={sendDemoNotification}
          >
            Test alert
          </Button>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard
          label="Total Patients"
          value="12,486"
          delta={8.4}
          icon={Users}
          tone="brand"
          spark={[20, 22, 19, 25, 27, 30, 34]}
        />
        <StatCard
          label="Active Doctors"
          value="312"
          delta={2.1}
          icon={Stethoscope}
          tone="teal"
          spark={[18, 20, 21, 23, 22, 24, 25]}
        />
        <StatCard
          label="Inpatients"
          value="376"
          delta={-1.6}
          icon={BedDouble}
          tone="violet"
          spark={[40, 38, 39, 36, 35, 37, 36]}
        />
        <StatCard
          label="Monthly Revenue"
          value={currency(totalRevenue)}
          delta={12.6}
          icon={CircleDollarSign}
          tone="emerald"
          spark={[10, 14, 16, 22, 25, 30, 34]}
        />
        <StatCard
          label="Emergency Cases"
          value="48"
          delta={5.4}
          icon={Siren}
          tone="rose"
          spark={[8, 10, 12, 9, 11, 14, 13]}
        />
        <StatCard
          label="Bed Occupancy"
          value="78.2%"
          delta={1.2}
          icon={Activity}
          tone="amber"
          spark={[60, 64, 66, 70, 72, 75, 78]}
        />
      </div>

      {/* Main charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Monthly Patients Growth"
            subtitle="New vs. returning patients · trailing 12 months"
            action={
              <Badge tone="brand" dot>
                +18.6% YoY
              </Badge>
            }
          />
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyPatients} margin={{ top: 8, right: 8, bottom: 0, left: -10 }}>
                <defs>
                  <linearGradient id="newPatients" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1d75f5" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#1d75f5" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="returningPatients" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06c4ad" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#06c4ad" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(99,117,149,0.12)" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                <YAxis
                  tickFormatter={(v) => compactNumber(v)}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'rgba(29,117,245,0.15)', strokeWidth: 2 }} />
                <Area
                  type="monotone"
                  dataKey="returning"
                  name="Returning"
                  stroke="#06c4ad"
                  strokeWidth={2}
                  fill="url(#returningPatients)"
                />
                <Area
                  type="monotone"
                  dataKey="new"
                  name="New"
                  stroke="#1d75f5"
                  strokeWidth={2}
                  fill="url(#newPatients)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Bed Occupancy"
            subtitle={`${bedOccupancy[0].value} of 460 beds in use`}
          />
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<ChartTooltip />} />
                <Pie
                  data={bedOccupancy}
                  innerRadius={56}
                  outerRadius={84}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {bedOccupancy.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 space-y-2">
            {bedOccupancy.map((b) => (
              <div key={b.name} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-sm" style={{ background: b.color }} />
                  <span className="text-ink-600 dark:text-ink-300">{b.name}</span>
                </span>
                <span className="font-semibold text-ink-900 dark:text-white">{b.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Revenue Trends"
            subtitle="Revenue vs. operating expenses"
            action={
              <div className="flex items-center gap-3 text-xs text-ink-500">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-brand-500" /> Revenue
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-ink-300" /> Expenses
                </span>
              </div>
            }
          />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueTrend} margin={{ top: 8, right: 8, bottom: 0, left: -10 }}>
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
                  cursor={{ fill: 'rgba(29,117,245,0.06)' }}
                />
                <Bar dataKey="revenue" name="Revenue" fill="#1d75f5" radius={[6, 6, 0, 0]} />
                <Bar dataKey="expenses" name="Expenses" fill="#cbd5e1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title="Recent Activity" subtitle="Live across all departments" />
          <ActivityFeed items={ACTIVITY} />
        </Card>
      </div>

      {/* Department performance */}
      <Card>
        <CardHeader
          title="Department Performance"
          subtitle="Cases handled and patient satisfaction"
          action={
            <div className="flex items-center gap-3 text-xs text-ink-500">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-brand-500" /> Cases
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-teal-500" /> Satisfaction %
              </span>
            </div>
          }
        />
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={departmentPerformance}
              margin={{ top: 8, right: 8, bottom: 0, left: -10 }}
            >
              <CartesianGrid stroke="rgba(99,117,149,0.12)" vertical={false} />
              <XAxis dataKey="department" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(29,117,245,0.06)' }} />
              <Legend wrapperStyle={{ display: 'none' }} />
              <Bar dataKey="cases" name="Cases" fill="#1d75f5" radius={[6, 6, 0, 0]} />
              <Bar
                dataKey="satisfaction"
                name="Satisfaction"
                fill="#06c4ad"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
