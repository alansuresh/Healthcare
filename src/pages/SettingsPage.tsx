import { useEffect, useState } from 'react';
import { Bell, Globe, Moon, ShieldCheck, Sun, UserRound } from 'lucide-react';
import { Card, CardHeader } from '../components/ui/Card';
import { Switch } from '../components/ui/Switch';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { useTheme } from '../hooks/useTheme';
import { useAuthStore } from '../store/authStore';
import { useNotifications } from '../hooks/useNotifications';
import { authService } from '../services/authService';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const user = useAuthStore((s) => s.user);
  const { permission, request } = useNotifications();
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [criticalOnly, setCriticalOnly] = useState(false);
  const [language, setLanguage] = useState('en-US');

  useEffect(() => {
    document.title = 'Settings · MediSync';
  }, []);

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 animate-fade-in">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600 dark:text-brand-400">
          Workspace
        </p>
        <h1 className="mt-1 font-display text-2xl font-bold text-ink-900 dark:text-white sm:text-[28px]">
          Settings
        </h1>
        <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
          Manage your profile, preferences and notification policies.
        </p>
      </div>

      <Card>
        <CardHeader title="Profile" subtitle="Visible across the workspace" />
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <Avatar name={user?.displayName ?? user?.email ?? 'User'} size="xl" ringed />
          <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
            <Input
              label="Full name"
              defaultValue={user?.displayName ?? ''}
              leftIcon={<UserRound className="h-4 w-4" />}
            />
            <Input label="Work email" defaultValue={user?.email ?? ''} disabled />
            <Input label="Job title" defaultValue="Operations Lead" />
            <Input label="Department" defaultValue="Administration" />
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline">Cancel</Button>
          <Button>Save changes</Button>
        </div>
      </Card>

      <Card>
        <CardHeader
          title="Appearance"
          subtitle="Light, dark, and density preferences"
        />
        <div className="grid grid-cols-2 gap-3">
          <ThemeOption
            active={theme === 'light'}
            label="Light"
            icon={<Sun className="h-4 w-4" />}
            onClick={() => setTheme('light')}
            preview="bg-gradient-to-br from-white to-ink-100"
          />
          <ThemeOption
            active={theme === 'dark'}
            label="Dark"
            icon={<Moon className="h-4 w-4" />}
            onClick={() => setTheme('dark')}
            preview="bg-gradient-to-br from-ink-900 to-ink-950"
          />
        </div>
      </Card>

      <Card>
        <CardHeader
          title="Notifications"
          subtitle="Choose what reaches your devices"
        />
        <div className="space-y-4">
          <Row
            icon={<Bell className="h-4 w-4" />}
            title="Browser push notifications"
            desc={
              permission === 'granted'
                ? 'Enabled for this device.'
                : permission === 'denied'
                  ? 'Blocked. Re-enable in your browser settings.'
                  : 'Receive critical alerts even when MediSync is closed.'
            }
            right={
              permission === 'granted' ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Enabled
                </span>
              ) : (
                <Button size="sm" onClick={request}>
                  {permission === 'denied' ? 'Open settings' : 'Enable'}
                </Button>
              )
            }
          />
          <Row
            icon={<Bell className="h-4 w-4" />}
            title="Email summaries"
            desc="Daily digest delivered at 7:00 AM local time."
            right={<Switch checked={emailAlerts} onChange={setEmailAlerts} />}
          />
          <Row
            icon={<Bell className="h-4 w-4" />}
            title="SMS alerts"
            desc="Pager-style SMS for critical incidents."
            right={<Switch checked={smsAlerts} onChange={setSmsAlerts} />}
          />
          <Row
            icon={<ShieldCheck className="h-4 w-4" />}
            title="Critical-only mode"
            desc="Mute everything except life-threatening alerts."
            right={<Switch checked={criticalOnly} onChange={setCriticalOnly} />}
          />
        </div>
      </Card>

      <Card>
        <CardHeader title="Localization" subtitle="Language and time zone" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="block text-[13px] font-medium text-ink-700 dark:text-ink-200">
              Language
            </label>
            <div className="relative">
              <Globe className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="input-base appearance-none pl-10"
              >
                <option value="en-US">English (US)</option>
                <option value="en-GB">English (UK)</option>
                <option value="es-ES">Español</option>
                <option value="fr-FR">Français</option>
                <option value="de-DE">Deutsch</option>
                <option value="ja-JP">日本語</option>
              </select>
            </div>
          </div>
          <Input label="Time zone" defaultValue="America/New_York" />
        </div>
      </Card>

      <Card>
        <CardHeader title="Security" subtitle="Authentication and sessions" />
        <div className="space-y-3 text-sm">
          <p className="rounded-xl bg-ink-50 px-4 py-3 text-ink-600 dark:bg-ink-800/60 dark:text-ink-300">
            <span className="font-semibold">
              {authService.isFirebaseConfigured ? 'Firebase Authentication' : 'Demo authentication'}
            </span>
            {' · '}
            {authService.isFirebaseConfigured
              ? 'Sessions are managed via secure Firebase ID tokens.'
              : 'Configure Firebase env variables to enable real auth.'}
          </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline">Change password</Button>
            <Button variant="outline">Manage devices</Button>
            <Button variant="danger">Sign out everywhere</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

function Row({
  icon,
  title,
  desc,
  right,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  right: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-ink-100 px-4 py-3.5 dark:border-ink-800">
      <div className="flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-300">
          {icon}
        </span>
        <div>
          <p className="text-sm font-semibold text-ink-900 dark:text-white">{title}</p>
          <p className="text-xs text-ink-500 dark:text-ink-400">{desc}</p>
        </div>
      </div>
      <div className="shrink-0">{right}</div>
    </div>
  );
}

function ThemeOption({
  active,
  label,
  icon,
  onClick,
  preview,
}: {
  active: boolean;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  preview: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative overflow-hidden rounded-xl border p-3 text-left transition ${
        active
          ? 'border-brand-500 ring-4 ring-brand-500/15'
          : 'border-ink-200 hover:border-ink-300 dark:border-ink-700 dark:hover:border-ink-600'
      }`}
    >
      <div className={`mb-3 h-20 w-full rounded-lg ${preview}`} />
      <div className="flex items-center justify-between text-sm">
        <span className="inline-flex items-center gap-2 font-semibold text-ink-900 dark:text-white">
          {icon}
          {label}
        </span>
        {active && (
          <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-700 dark:bg-brand-500/15 dark:text-brand-300">
            Active
          </span>
        )}
      </div>
    </button>
  );
}
