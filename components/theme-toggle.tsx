'use client';

import { Moon, Sun } from 'lucide-react';
import { useStore } from '@/lib/storage';

export function ThemeToggle() {
  const theme = useStore((s) => s.settings.theme);
  const setTheme = useStore((s) => s.setTheme);

  return (
    <button
      type="button"
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="grid h-9 w-9 place-items-center rounded-full text-forest-900/70 transition-colors hover:bg-forest-900/5 dark:text-cream/70 dark:hover:bg-cream/10"
    >
      {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
