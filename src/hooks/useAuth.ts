import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

export function useAuth() {
  const state = useAuthStore();
  useEffect(() => {
    const unsub = state.init();
    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return state;
}
