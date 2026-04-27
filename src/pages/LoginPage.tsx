import { useEffect, useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Activity,
  HeartPulse,
  Stethoscope,
  ArrowRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Checkbox } from '../components/ui/Checkbox';
import { Logo } from '../components/ui/Logo';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/authService';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, sendReset, signingIn, error, clearError, user } = useAuthStore();

  const [email, setEmail] = useState('admin@stlumen.health');
  const [password, setPassword] = useState('demo1234');
  const [remember, setRemember] = useState(true);
  const [showPw, setShowPw] = useState(false);
  const [errs, setErrs] = useState<{ email?: string; password?: string }>({});
  const [resetting, setResetting] = useState(false);

  // Redirect if already authenticated.
  useEffect(() => {
    if (user) {
      const from = (location.state as { from?: { pathname: string } } | null)?.from
        ?.pathname;
      navigate(from && from !== '/login' ? from : '/dashboard', { replace: true });
    }
  }, [user, navigate, location.state]);

  useEffect(() => () => clearError(), [clearError]);

  const validate = () => {
    const next: { email?: string; password?: string } = {};
    if (!email) next.email = 'Email is required.';
    else if (!emailRegex.test(email)) next.email = 'Enter a valid email address.';
    if (!password) next.password = 'Password is required.';
    else if (password.length < 6) next.password = 'Min 6 characters.';
    setErrs(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await signIn({ email, password, remember });
      toast.success('Welcome back!');
    } catch {
      // friendly error already in store.error
    }
  };

  const onForgot = async () => {
    if (!email || !emailRegex.test(email)) {
      setErrs((s) => ({ ...s, email: 'Enter your email to reset password.' }));
      return;
    }
    setResetting(true);
    try {
      await sendReset(email);
      toast.success(`Reset link sent to ${email}`);
    } catch {
      toast.error('Could not send reset link.');
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 bg-ink-50 lg:grid-cols-2 dark:bg-ink-950">
      {/* Left visual panel */}
      <div className="relative hidden overflow-hidden lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-700 via-brand-600 to-teal-600" />
        <div className="absolute inset-0 bg-hero-radial opacity-90" />
        <div className="absolute inset-0 bg-grid-light bg-[size:32px_32px] opacity-[0.08]" />

        {/* Floating accents */}
        <div className="absolute -left-16 top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-teal-300/20 blur-3xl" />

        <div className="relative flex h-full flex-col p-12 text-white">
          <Logo size="lg" />

          <div className="mt-auto space-y-8">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/85 backdrop-blur">
                <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-teal-300" />
                Enterprise Healthcare OS
              </p>
              <h1 className="mt-5 max-w-md font-display text-4xl font-bold leading-[1.1] tracking-tight text-balance">
                Run your hospital with the clarity of a modern command center.
              </h1>
              <p className="mt-4 max-w-md text-base leading-relaxed text-white/80">
                Real-time admissions, bed occupancy, vitals alerts, and revenue
                — unified into a single, secure operations layer for care
                teams.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <Tile icon={<HeartPulse className="h-4 w-4" />} label="Live vitals & alerts" />
              <Tile icon={<Activity className="h-4 w-4" />} label="Throughput analytics" />
              <Tile icon={<Stethoscope className="h-4 w-4" />} label="Care-team workflows" />
              <Tile icon={<ShieldCheck className="h-4 w-4" />} label="HIPAA-ready security" />
            </div>

            <div className="flex items-center gap-3 border-t border-white/15 pt-6 text-xs text-white/65">
              <ShieldCheck className="h-4 w-4" />
              SOC 2 Type II · HIPAA · ISO 27001
            </div>
          </div>
        </div>
      </div>

      {/* Right login panel */}
      <div className="relative flex items-center justify-center px-5 py-10 sm:px-10">
        <div className="absolute inset-0 -z-10 bg-hero-radial opacity-60" />
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center justify-between lg:hidden">
            <Logo />
          </div>

          <div className="rounded-3xl border border-ink-200/70 bg-white/80 p-7 shadow-card backdrop-blur sm:p-9 dark:border-ink-800 dark:bg-ink-900/80">
            <div className="mb-7">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-400">
                Sign in
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold text-ink-900 dark:text-white">
                Welcome back
              </h2>
              <p className="mt-1.5 text-sm text-ink-500 dark:text-ink-400">
                Use your work credentials to access the operations portal.
              </p>
            </div>

            <form onSubmit={onSubmit} noValidate className="space-y-4">
              <Input
                label="Work email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="you@hospital.org"
                value={email}
                leftIcon={<Mail className="h-4 w-4" />}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errs.email) setErrs((s) => ({ ...s, email: undefined }));
                }}
                error={errs.email}
              />

              <Input
                label="Password"
                type={showPw ? 'text' : 'password'}
                name="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                leftIcon={<Lock className="h-4 w-4" />}
                rightAdornment={
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="rounded-md p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-700 dark:hover:bg-ink-800"
                    aria-label={showPw ? 'Hide password' : 'Show password'}
                  >
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errs.password) setErrs((s) => ({ ...s, password: undefined }));
                }}
                error={errs.password}
              />

              <div className="flex items-center justify-between pt-1">
                <Checkbox
                  name="remember"
                  label="Remember me"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <button
                  type="button"
                  onClick={onForgot}
                  disabled={resetting}
                  className="text-sm font-medium text-brand-600 hover:text-brand-700 hover:underline disabled:opacity-60 dark:text-brand-400"
                >
                  {resetting ? 'Sending…' : 'Forgot password?'}
                </button>
              </div>

              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300"
                >
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                loading={signingIn}
                rightIcon={!signingIn && <ArrowRight className="h-4 w-4" />}
                className="w-full"
              >
                {signingIn ? 'Signing in' : 'Sign in to portal'}
              </Button>

              {!authService.isFirebaseConfigured && (
                <p className="text-center text-[11px] leading-relaxed text-ink-500 dark:text-ink-400">
                  Demo mode: any valid email + 6+ char password works.
                  Configure Firebase env vars for real auth.
                </p>
              )}
            </form>

            <div className="mt-7 flex items-center gap-3 text-xs text-ink-400">
              <span className="h-px flex-1 bg-ink-200 dark:bg-ink-800" />
              SSO providers
              <span className="h-px flex-1 bg-ink-200 dark:bg-ink-800" />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {['Microsoft', 'Okta', 'Google'].map((p) => (
                <button
                  key={p}
                  type="button"
                  className="rounded-xl border border-ink-200 bg-white px-3 py-2 text-xs font-semibold text-ink-700 transition hover:border-ink-300 hover:bg-ink-50 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-200 dark:hover:bg-ink-800"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-ink-500">
            Don't have access yet?{' '}
            <Link to="#" className="font-semibold text-brand-600 hover:underline">
              Request a workspace
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function Tile({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 backdrop-blur">
      <span className="grid h-7 w-7 place-items-center rounded-lg bg-white/15 text-white">
        {icon}
      </span>
      <span className="text-sm font-medium text-white/90">{label}</span>
    </div>
  );
}
