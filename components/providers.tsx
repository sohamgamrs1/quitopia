'use client';

import { useEffect } from 'react';
import { useStore } from '@/lib/storage';

export function Providers({ children }: { children: React.ReactNode }) {
  const theme = useStore((s) => s.settings.theme);

  // Zustand persist is skipped on the server, so rehydrate once on the client.
  useEffect(() => {
    void useStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Service worker: makes the app work offline after the first load.
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;
    if (process.env.NODE_ENV !== 'production') return;
    const register = () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        /* offline support is a bonus, never a blocker */
      });
    };
    window.addEventListener('load', register);
    return () => window.removeEventListener('load', register);
  }, []);

  return <>{children}</>;
}
