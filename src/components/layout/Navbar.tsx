import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Menu,
  Moon,
  Search,
  Sun,
  LogOut,
  Settings,
  UserRound,
  HelpCircle,
} from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { useTheme } from '../../hooks/useTheme';
import { useAuthStore } from '../../store/authStore';
import { cn } from '../../utils/cn';
import { relativeTime } from '../../utils/format';
import { ACTIVITY } from '../../services/mockData';

interface NavbarProps {
  onOpenSidebar: () => void;
}

export function Navbar({ onOpenSidebar }: NavbarProps) {
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);

  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 border-b border-ink-200/70 bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:border-ink-800 dark:bg-ink-900/85 dark:supports-[backdrop-filter]:bg-ink-900/70">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          onClick={onOpenSidebar}
          className="rounded-lg p-2 text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Search */}
        <div className="relative hidden flex-1 max-w-xl md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            type="search"
            placeholder="Search patients, doctors, departments…"
            className="block w-full rounded-xl border border-ink-200 bg-ink-50 py-2.5 pl-10 pr-16 text-sm placeholder:text-ink-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/15 dark:border-ink-700 dark:bg-ink-800/60 dark:placeholder:text-ink-500 dark:focus:bg-ink-800"
          />
          <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md border border-ink-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-ink-500 dark:border-ink-700 dark:bg-ink-900">
            ⌘K
          </kbd>
        </div>

        <div className="ml-auto flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            aria-label="Toggle theme"
            className="text-ink-600 dark:text-ink-200"
          >
            {theme === 'dark' ? (
              <Sun className="h-[18px] w-[18px]" />
            ) : (
              <Moon className="h-[18px] w-[18px]" />
            )}
          </Button>

          {/* Notifications */}
          <div ref={notifRef} className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setNotifOpen((s) => !s)}
              aria-label="Notifications"
              className="text-ink-600 dark:text-ink-200"
            >
              <Bell className="h-[18px] w-[18px]" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-ink-900" />
            </Button>
            {notifOpen && (
              <div className="absolute right-0 mt-2 w-[22rem] origin-top-right animate-fade-in rounded-2xl border border-ink-200 bg-white p-2 shadow-card dark:border-ink-800 dark:bg-ink-900">
                <div className="flex items-center justify-between px-2 py-1.5">
                  <p className="text-sm font-semibold">Notifications</p>
                  <button className="text-xs font-medium text-brand-600 hover:underline">
                    Mark all read
                  </button>
                </div>
                <div className="max-h-80 space-y-1 overflow-y-auto scroll-thin">
                  {ACTIVITY.slice(0, 6).map((a) => (
                    <div
                      key={a.id}
                      className="flex gap-3 rounded-xl px-2 py-2.5 hover:bg-ink-50 dark:hover:bg-ink-800"
                    >
                      <span
                        className={cn(
                          'mt-1 h-2 w-2 shrink-0 rounded-full',
                          a.severity === 'critical' && 'bg-rose-500',
                          a.severity === 'warning' && 'bg-amber-500',
                          a.severity === 'success' && 'bg-emerald-500',
                          (!a.severity || a.severity === 'info') && 'bg-brand-500',
                        )}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{a.message}</p>
                        {a.patient && (
                          <p className="truncate text-xs text-ink-500">{a.patient}</p>
                        )}
                        <p className="mt-0.5 text-[11px] text-ink-400">
                          {relativeTime(new Date(a.timestamp))}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => {
                    setNotifOpen(false);
                    navigate('/dashboard');
                  }}
                  className="mt-1 block w-full rounded-xl bg-ink-50 py-2 text-center text-xs font-semibold text-ink-700 hover:bg-ink-100 dark:bg-ink-800/60 dark:text-ink-200 dark:hover:bg-ink-800"
                >
                  View all activity
                </button>
              </div>
            )}
          </div>

          {/* Profile */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => setProfileOpen((s) => !s)}
              className="flex items-center gap-2 rounded-xl p-1 pr-2.5 transition hover:bg-ink-100 dark:hover:bg-ink-800"
            >
              <Avatar
                name={user?.displayName ?? user?.email ?? 'User'}
                src={user?.photoURL}
                size="md"
                ringed
              />
              <div className="hidden text-left leading-tight md:block">
                <p className="max-w-[140px] truncate text-sm font-semibold">
                  {user?.displayName ?? 'Operations'}
                </p>
                <p className="text-[11px] capitalize text-ink-500">
                  {user?.role ?? 'admin'}
                </p>
              </div>
            </button>
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-60 origin-top-right animate-fade-in rounded-2xl border border-ink-200 bg-white p-2 shadow-card dark:border-ink-800 dark:bg-ink-900">
                <div className="px-3 py-2">
                  <p className="truncate text-sm font-semibold">
                    {user?.displayName ?? 'Operations'}
                  </p>
                  <p className="truncate text-xs text-ink-500">{user?.email}</p>
                </div>
                <hr className="my-1 border-ink-100 dark:border-ink-800" />
                <DropdownLink
                  icon={<UserRound className="h-4 w-4" />}
                  label="Profile"
                  onClick={() => navigate('/settings')}
                />
                <DropdownLink
                  icon={<Settings className="h-4 w-4" />}
                  label="Workspace settings"
                  onClick={() => navigate('/settings')}
                />
                <DropdownLink
                  icon={<HelpCircle className="h-4 w-4" />}
                  label="Help & docs"
                />
                <hr className="my-1 border-ink-100 dark:border-ink-800" />
                <DropdownLink
                  icon={<LogOut className="h-4 w-4" />}
                  label="Sign out"
                  danger
                  onClick={handleSignOut}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

function DropdownLink({
  icon,
  label,
  onClick,
  danger,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition',
        danger
          ? 'text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10'
          : 'text-ink-700 hover:bg-ink-50 dark:text-ink-200 dark:hover:bg-ink-800',
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
