import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { ThemeProvider } from './hooks/useTheme';
import { registerServiceWorker } from './sw/register';
import './index.css';

registerServiceWorker();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-right"
          gutter={10}
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: '12px',
              padding: '12px 14px',
              fontSize: '14px',
              fontWeight: 500,
              boxShadow:
                '0 1px 2px rgba(15, 23, 42, 0.04), 0 12px 32px rgba(15, 23, 42, 0.12)',
            },
          }}
        />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
);
