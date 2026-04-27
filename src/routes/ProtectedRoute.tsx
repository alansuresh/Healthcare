import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Logo } from '../components/ui/Logo';

interface Props {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: Props) {
  const { user, initializing } = useAuthStore();
  const location = useLocation();

  if (initializing) {
    return (
      <div className="grid min-h-screen place-items-center bg-ink-50 dark:bg-ink-950">
        <div className="flex flex-col items-center gap-3">
          <Logo size="lg" variant="mark" />
          <div className="h-1 w-32 overflow-hidden rounded-full bg-ink-200 dark:bg-ink-800">
            <div className="h-full w-1/2 animate-pulse-soft rounded-full bg-gradient-to-r from-brand-500 to-teal-500" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
