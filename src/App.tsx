import { useAuth } from './hooks/useAuth';
import { AppRoutes } from './routes/AppRoutes';

export default function App() {
  // Hooks the auth state subscription so the store is hydrated before any
  // ProtectedRoute renders its children.
  useAuth();
  return <AppRoutes />;
}
