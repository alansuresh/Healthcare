import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  LineChart,
  Users,
  CalendarDays,
  Receipt,
  Settings,
  LifeBuoy,
  X,
} from 'lucide-react';
import { Logo } from '../ui/Logo';
import { cn } from '../../utils/cn';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const items = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/analytics', label: 'Analytics', icon: LineChart },
  { to: '/patients', label: 'Patients', icon: Users, badge: '48' },
  { to: '/appointments', label: 'Appointments', icon: CalendarDays },
  { to: '/billing', label: 'Billing', icon: Receipt },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      <div
        onClick={onClose}
        className={cn(
          'fixed inset-0 z-40 bg-ink-950/40 backdrop-blur-sm transition-opacity lg:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 flex h-screen w-72 flex-col border-r border-ink-200/70 bg-white transition-transform dark:border-ink-800 dark:bg-ink-900 lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex items-center justify-between px-5 pt-5">
          <Logo />
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-ink-500 hover:bg-ink-100 dark:hover:bg-ink-800 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-5 py-5">
          <div className="rounded-2xl border border-ink-200/70 bg-gradient-to-br from-brand-50 to-teal-50 p-3.5 dark:border-ink-800 dark:from-brand-500/10 dark:to-teal-500/10">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-700 dark:text-brand-300">
              St. Lumen Hospital
            </p>
            <p className="mt-1 text-sm font-semibold text-ink-900 dark:text-white">
              Operations · West Wing
            </p>
            <p className="mt-0.5 text-xs text-ink-500 dark:text-ink-400">
              312 beds · 48 active staff
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-6 scroll-thin">
          <p className="px-3 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-400">
            Workspace
          </p>
          {items.map(({ to, label, icon: Icon, badge }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                cn('nav-link', isActive && 'nav-link-active')
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className="h-[18px] w-[18px] shrink-0" />
                  <span className="flex-1">{label}</span>
                  {badge && (
                    <span
                      className={cn(
                        'rounded-md px-1.5 py-0.5 text-[10px] font-semibold',
                        isActive
                          ? 'bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-200'
                          : 'bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-300',
                      )}
                    >
                      {badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-ink-200/70 p-3 dark:border-ink-800">
          <a
            href="#"
            className="nav-link"
            onClick={(e) => e.preventDefault()}
          >
            <LifeBuoy className="h-[18px] w-[18px]" />
            Help & Support
          </a>
          <p className="px-3 pt-3 text-[10px] text-ink-400">
            v1.0.0 · Build {new Date().getFullYear()}
          </p>
        </div>
      </aside>
    </>
  );
}
