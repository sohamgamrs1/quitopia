'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {
  BarChart3,
  BookOpen,
  HeartHandshake,
  Home,
  LifeBuoy,
  PenLine,
  Settings,
  Shield,
  Users
} from 'lucide-react';
import { useStore } from '@/lib/storage';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './theme-toggle';

const NAV = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/blocker', label: 'Blocker', icon: Shield },
  { href: '/sos', label: 'SOS', icon: LifeBuoy },
  { href: '/journal', label: 'Journal', icon: PenLine },
  { href: '/stats', label: 'Stats', icon: BarChart3 },
  { href: '/learn', label: 'Learn', icon: BookOpen },
  { href: '/community', label: 'Community', icon: Users },
  { href: '/accountability', label: 'Partner', icon: HeartHandshake },
  { href: '/settings', label: 'Settings', icon: Settings }
];

const BOTTOM = NAV.filter((item) =>
  ['/dashboard', '/blocker', '/sos', '/journal', '/settings'].includes(item.href)
);

const BARE_ROUTES = ['/', '/onboarding'];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const hydrated = useStore((s) => s.hydrated);
  const profile = useStore((s) => s.profile);

  const bare = BARE_ROUTES.includes(pathname);

  useEffect(() => {
    if (!hydrated || bare) return;
    if (!profile?.onboarded) router.replace('/onboarding');
  }, [hydrated, profile, bare, router]);

  if (bare) return <>{children}</>;

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[264px_1fr]">
      {/* Desktop sidebar */}
      <aside className="hidden border-r border-forest-900/10 bg-white/70 p-5 backdrop-blur lg:block dark:border-cream/10 dark:bg-forest-800/50">
        <Link href="/dashboard" className="mb-8 flex items-center gap-2 px-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-forest-700 text-cream dark:bg-mint dark:text-forest-900">
            🌿
          </span>
          <span className="font-display text-lg font-semibold">Quitopia</span>
        </Link>
        <nav className="flex flex-col gap-1">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                  active
                    ? 'bg-forest-700 text-cream dark:bg-mint dark:text-forest-900'
                    : 'text-forest-900/70 hover:bg-forest-900/5 dark:text-cream/70 dark:hover:bg-cream/10'
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-8 rounded-2xl bg-mint/40 p-4 text-xs leading-relaxed text-forest-900/80 dark:bg-forest-700 dark:text-cream/80">
          Everything you enter stays in this browser. No account, no server, no sync.
        </div>
      </aside>

      <div className="flex min-h-screen flex-col">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-forest-900/10 bg-cream/85 px-4 py-3 backdrop-blur lg:hidden dark:border-cream/10 dark:bg-forest-900/85">
          <Link href="/dashboard" className="flex items-center gap-2 font-display font-semibold">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-forest-700 text-sm text-cream dark:bg-mint dark:text-forest-900">
              🌿
            </span>
            Quitopia
          </Link>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <Link
              href="/settings"
              aria-label="Settings"
              className="grid h-9 w-9 place-items-center rounded-full text-forest-900/70 hover:bg-forest-900/5 dark:text-cream/70 dark:hover:bg-cream/10"
            >
              <Settings className="h-4 w-4" />
            </Link>
          </div>
        </header>

        <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-28 pt-5 lg:px-8 lg:pb-12 lg:pt-8">
          {!hydrated ? <ShellSkeleton /> : children}
        </main>

        {/* Mobile bottom nav */}
        <nav className="fixed bottom-0 left-0 right-0 z-30 grid grid-cols-5 border-t border-forest-900/10 bg-cream/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden dark:border-cream/10 dark:bg-forest-900/95">
          {BOTTOM.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            const isSos = href === '/sos';
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium',
                  active ? 'text-forest-700 dark:text-mint' : 'text-forest-900/50 dark:text-cream/50'
                )}
              >
                <Icon className={cn('h-5 w-5', isSos && 'text-red-600')} />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

function ShellSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 w-40 rounded-lg bg-forest-900/10 dark:bg-cream/10" />
      <div className="h-40 rounded-2xl bg-forest-900/5 dark:bg-cream/5" />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="h-28 rounded-2xl bg-forest-900/5 dark:bg-cream/5" />
        <div className="h-28 rounded-2xl bg-forest-900/5 dark:bg-cream/5" />
      </div>
    </div>
  );
}
