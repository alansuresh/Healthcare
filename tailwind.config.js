/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
        display: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#eff8ff',
          100: '#daeeff',
          200: '#bce1ff',
          300: '#8ecfff',
          400: '#59b4ff',
          500: '#3494ff',
          600: '#1d75f5',
          700: '#1a5fe1',
          800: '#1c4eb6',
          900: '#1d448f',
          950: '#152b58',
        },
        teal: {
          50: '#effefb',
          100: '#c8fff5',
          200: '#92ffea',
          300: '#54f5dc',
          400: '#1ee0c6',
          500: '#06c4ad',
          600: '#019d8d',
          700: '#067c72',
          800: '#0b625b',
          900: '#0e514c',
          950: '#012e2d',
        },
        ink: {
          50: '#f6f8fb',
          100: '#eceff5',
          200: '#d5dce8',
          300: '#afbccf',
          400: '#8294b0',
          500: '#637595',
          600: '#4d5c7b',
          700: '#3f4b64',
          800: '#363f53',
          900: '#1f2536',
          950: '#0f1320',
        },
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        info: '#3b82f6',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(15, 23, 42, 0.04), 0 4px 16px rgba(15, 23, 42, 0.06)',
        card: '0 1px 2px rgba(15, 23, 42, 0.04), 0 8px 24px rgba(15, 23, 42, 0.08)',
        glow: '0 10px 40px -10px rgba(29, 117, 245, 0.45)',
      },
      backgroundImage: {
        'grid-light':
          'linear-gradient(to right, rgba(15,23,42,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,23,42,0.04) 1px, transparent 1px)',
        'hero-radial':
          'radial-gradient(at 20% 20%, rgba(52,148,255,0.18) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(6,196,173,0.18) 0px, transparent 50%), radial-gradient(at 0% 80%, rgba(29,68,143,0.12) 0px, transparent 50%)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
          '0%': { opacity: '0', transform: 'translateX(-8px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out',
        'slide-in': 'slide-in 0.35s ease-out',
        shimmer: 'shimmer 1.6s linear infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
