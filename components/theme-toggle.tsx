'use client';

import { Moon, Sun } from 'lucide-react';
import { useStore } from '@/lib/storage';
import { cn } from '@/lib/utils';

export function ThemeToggle({ variant = 'light' }: { variant?: 'light' | 'dark' }) {
  const theme = useStore((s) => s.settings.theme);
  const setTheme = useStore((s) => s.setTheme);

  return (
    <button
      type="button"
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className={cn(
        'grid h-9 w-9 place-items-center rounded-full transition-colors',
        variant === 'dark'
          ? 'text-cream-100/60 hover:bg-cream-100/10 hover:text-cream-50'
          : 'text-forest-900/55 hover:bg-forest-900/[0.06] hover:text-forest-900 dark:text-cream-100/55 dark:hover:bg-cream-100/10'
      )}
    >
      {theme === 'dark' ? <Sun className="h-[17px] w-[17px]" strokeWidth={1.8} /> : <Moon className="h-[17px] w-[17px]" strokeWidth={1.8} />}
    </button>
  );
}
