import { create } from 'zustand';
import { authService, type SignInArgs } from '../services/authService';
import type { AppUser } from '../types';

interface AuthState {
  user: AppUser | null;
  initializing: boolean;
  signingIn: boolean;
  error: string | null;
  init: () => () => void;
  signIn: (args: SignInArgs) => Promise<void>;
  signOut: () => Promise<void>;
  sendReset: (email: string) => Promise<void>;
  clearError: () => void;
}

const friendlyError = (e: unknown): string => {
  const code = (e as { code?: string })?.code;
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Invalid email or password.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again in a few minutes.';
    case 'auth/network-request-failed':
      return 'Network error. Check your connection and try again.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    default:
      return (e as Error)?.message || 'Something went wrong. Please try again.';
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  user: authService.loadCachedUser(),
  initializing: true,
  signingIn: false,
  error: null,

  init: () => {
    const unsubscribe = authService.subscribe((user) => {
      set({ user, initializing: false });
    });
    return unsubscribe;
  },

  signIn: async (args) => {
    set({ signingIn: true, error: null });
    try {
      const user = await authService.signIn(args);
      set({ user, signingIn: false });
    } catch (e) {
      set({ signingIn: false, error: friendlyError(e) });
      throw e;
    }
  },

  signOut: async () => {
    await authService.signOut();
    set({ user: null });
  },

  sendReset: async (email: string) => {
    try {
      await authService.sendReset(email);
    } catch (e) {
      set({ error: friendlyError(e) });
      throw e;
    }
  },

  clearError: () => set({ error: null }),
}));
