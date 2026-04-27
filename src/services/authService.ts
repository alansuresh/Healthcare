import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  type User,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../firebase/config';
import type { AppUser } from '../types';

const DEMO_KEY = 'medisync.demo.user';
const DEMO_REMEMBER_KEY = 'medisync.demo.remember';

const toAppUser = (user: User): AppUser => ({
  uid: user.uid,
  email: user.email,
  displayName: user.displayName ?? user.email?.split('@')[0] ?? null,
  photoURL: user.photoURL,
  role: 'admin',
});

const demoUser = (email: string): AppUser => ({
  uid: `demo-${btoa(email).replace(/=/g, '')}`,
  email,
  displayName: email
    .split('@')[0]
    .replace(/[._-]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase()),
  photoURL: null,
  role: 'admin',
});

export interface SignInArgs {
  email: string;
  password: string;
  remember: boolean;
}

export const authService = {
  isFirebaseConfigured,

  async signIn({ email, password, remember }: SignInArgs): Promise<AppUser> {
    if (isFirebaseConfigured && auth) {
      await setPersistence(
        auth,
        remember ? browserLocalPersistence : browserSessionPersistence,
      );
      const cred = await signInWithEmailAndPassword(auth, email, password);
      return toAppUser(cred.user);
    }
    // Demo fallback — accepts any email + password >= 6 chars.
    if (password.length < 6) {
      const err = new Error('Password must be at least 6 characters.');
      (err as Error & { code: string }).code = 'auth/weak-password';
      throw err;
    }
    const user = demoUser(email);
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem(DEMO_KEY, JSON.stringify(user));
    localStorage.setItem(DEMO_REMEMBER_KEY, remember ? '1' : '0');
    return user;
  },

  async signOut(): Promise<void> {
    if (isFirebaseConfigured && auth) {
      await firebaseSignOut(auth);
      return;
    }
    localStorage.removeItem(DEMO_KEY);
    sessionStorage.removeItem(DEMO_KEY);
  },

  async sendReset(email: string): Promise<void> {
    if (isFirebaseConfigured && auth) {
      await sendPasswordResetEmail(auth, email);
      return;
    }
    // Demo no-op with simulated latency.
    await new Promise((r) => setTimeout(r, 700));
  },

  loadCachedUser(): AppUser | null {
    if (isFirebaseConfigured) return null;
    const raw =
      localStorage.getItem(DEMO_KEY) || sessionStorage.getItem(DEMO_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AppUser;
    } catch {
      return null;
    }
  },

  subscribe(cb: (user: AppUser | null) => void): () => void {
    if (isFirebaseConfigured && auth) {
      return onAuthStateChanged(auth, (u) => cb(u ? toAppUser(u) : null));
    }
    cb(this.loadCachedUser());
    return () => undefined;
  },
};
