# MediSync — Enterprise B2B Healthcare Portal

A production-quality, enterprise-grade healthcare operations dashboard built with React, TypeScript, Tailwind CSS, Firebase Authentication, and a PWA service worker for browser notifications.

> Designed to look at home alongside Epic, Cerner, and Athenahealth — clean, dense, accessible, and data-driven.

---

## ✨ Highlights

- **Modern stack** — React 18 + TypeScript + Vite, Tailwind CSS, Recharts, Zustand, react-router v6, Framer-friendly animations.
- **Firebase Authentication** — email/password sign-in, "Remember me" persistence, password reset, friendly error mapping. Falls back to a built-in demo provider when no Firebase config is supplied so the UI stays reviewable.
- **Service Worker / PWA** — runtime cache for the app shell, offline navigation fallback, push and message-driven browser notifications, click-through routing back into the app.
- **Polished UI system** — bespoke primitives (Button, Card, Input, Badge, Avatar, Switch, Checkbox, Skeleton), gradient brand mark, light/dark themes with smooth transitions, soft shadows, generous spacing.
- **Five fully-built pages** — Login, Dashboard, Analytics, Patients (grid + list), Appointments (week calendar), Billing (invoice ledger), Settings.
- **Patient grid ↔ list toggle** — animated sliding indicator, persisted to localStorage, instant view swap.
- **Charts** — patient growth area chart, revenue bar chart, department performance, bed occupancy donut, appointment trend line chart, foot-traffic heatmap, demographics progress bars.
- **Search, sort, filter, paginate** — the patient table is fully interactive with multi-column sort, status pills, department filter, search, CSV export.
- **Accessibility** — keyboard-friendly menus, focus rings, semantic HTML, color-contrast-tuned dark mode.

---

## 🚀 Getting started

```bash
# 1. install
npm install

# 2. run the dev server
npm run dev   # http://localhost:5173

# 3. type-check & build
npm run build
npm run preview
```

The login screen accepts any email + 6+ char password in **demo mode**. Real authentication kicks in once Firebase env vars are configured (below).

---

## 🔐 Firebase setup

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com).
2. **Build → Authentication → Sign-in method → Email/Password → Enable**.
3. **Project settings → General → Your apps → Web** to grab your config.
4. Copy `.env.example` → `.env` at the project root and fill in:

```env
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abcdef
```

5. Restart the dev server. The auth banner under the login button will disappear and live Firebase Auth will be used. `Remember me` toggles between `browserLocalPersistence` and `browserSessionPersistence`.

> No env vars? The app boots in **demo mode** and uses a local-storage backed session. Useful for portfolio review, offline previews, and CI screenshot tests.

---

## 🔔 Service worker & notifications

- The worker is registered at `public/service-worker.js` and bootstrapped from `src/sw/register.ts` on `window.load`.
- App-driven notifications are delivered by `postMessage`-ing the worker:

```ts
import { useNotifications } from '@/hooks/useNotifications';

const { request, notify } = useNotifications();
await request(); // prompts the user
await notify({
  title: 'Emergency case admitted',
  body: 'Patient routed to ICU · Bed C-204',
  url: '/patients',
});
```

- Use the **"Test alert"** button on the Dashboard to trigger a real notification flow end-to-end.
- The worker also handles real push events (`push`), tag deduplication, and click-through routing — point a real push provider at `notificationclick` when you're ready to wire backend pushes.

> Service workers require **HTTPS or localhost**. They are intentionally disabled in non-secure contexts.

---

## 🗂️ Folder structure

```
src/
├── components/
│   ├── dashboard/          ActivityFeed, ChartTooltip, StatCard
│   ├── layout/             Navbar, Sidebar
│   ├── patients/           PatientCard, PatientTable, ViewToggle
│   └── ui/                 Avatar, Badge, Button, Card, Checkbox,
│                           Input, Logo, Skeleton, StatusBadge, Switch
├── firebase/               Firebase init (lazy, env-aware)
├── hooks/                  useAuth, useTheme, useNotifications
├── layouts/                DashboardLayout (sidebar + navbar shell)
├── pages/                  Login, Dashboard, Analytics, Patients,
│                           Appointments, Billing, Settings
├── routes/                 AppRoutes (lazy), ProtectedRoute
├── services/               authService, notificationService, mockData
├── store/                  authStore (Zustand)
├── sw/                     register helper for the service worker
├── types/                  shared TS interfaces
└── utils/                  cn (class merger), format helpers
```

---

## 🎨 Design tokens

The Tailwind config defines a calibrated palette: `brand` (blues), `teal`, and `ink` (cool slate neutrals), with semantic `success / warning / danger / info` tokens and three layered shadow elevations (`soft / card / glow`). Dark mode is implemented as a class strategy — toggled from the navbar or Settings → Appearance — with carefully chosen surface and text contrasts.

Typography pairs **Plus Jakarta Sans** (display) with **Inter** (body) and ships OpenType features for tabular figures and stylistic alternates.

---

## ✅ Notable engineering choices

- **Lazy-loaded route chunks** keep the login bundle tiny and authenticated pages loaded on demand.
- **Strict TS** with `noUnusedLocals` / `noUnusedParameters` enabled — no dead code in CI.
- **Zustand** for auth keeps the store free of boilerplate while staying easy to test and replace.
- **Firebase auth fallback** removes the "credentials required to demo the UI" friction.
- **Recharts** wrapped in a custom `ChartTooltip` so all charts share a polished tooltip language.
- **`tailwind-merge` + `clsx`** in a single `cn()` helper enable safe utility composition without specificity bugs.
- **Pure presentational components** — pages compose data and behavior; UI primitives stay portable.

---

## 🧭 Roadmap ideas

- Role-based route guards (admin / physician / staff) — the role field is already on `AppUser`.
- Multi-language with `react-intl`. The Settings page already has a language picker scaffolded.
- Real-time admissions feed via Firestore `onSnapshot`.
- Patient drawer with vitals timeline.
- E2E tests with Playwright.

---

## 📄 License

For demonstration & portfolio purposes.
