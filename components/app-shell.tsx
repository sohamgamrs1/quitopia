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
import { LeafMark } from './icons';

const NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/blocker', label: 'Blocker', icon: Shield },
  { href: '/sos', label: 'Urge SOS', icon: LifeBuoy },
  { href: '/journal', label: 'Journal', icon: PenLine },
  { href: '/stats', label: 'Insights', icon: BarChart3 },
  { href: '/learn', label: 'Resources', icon: BookOpen },
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

  const initial = (profile?.name?.trim()?.[0] ?? 'Q').toUpperCase();

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[276px_1fr]">
      {/* ---------- Desktop sidebar ---------- */}
      <aside className="hidden p-3 lg:block">
        <div className="sticky top-3 flex h-[calc(100vh-1.5rem)] flex-col rounded-[2rem] bg-forest-900 px-5 py-7 text-cream-100 shadow-lift">
          <Link href="/dashboard" className="mb-9 flex items-center gap-2.5 px-2">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-mint-300/15 text-mint-300">
              <LeafMark className="h-6 w-6" />
            </span>
            <span className="text-[21px] font-extrabold tracking-tightest text-cream-50">Quitopia</span>
          </Link>

          <nav className="flex flex-col gap-1">
            {NAV.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'group flex items-center gap-3 rounded-full px-3.5 py-2.5 text-[14.5px] font-semibold tracking-tight transition-all duration-200',
                    active
                      ? 'bg-mint-300 text-forest-900 shadow-[0_8px_24px_-12px_rgba(168,230,207,0.9)]'
                      : 'text-cream-100/65 hover:bg-cream-100/[0.07] hover:text-cream-50'
                  )}
                >
                  <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto">
            <div className="mb-3 rounded-2xl bg-cream-100/[0.06] p-3 text-[11.5px] leading-relaxed text-cream-100/60">
              Everything you enter stays in this browser.
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-cream-100/[0.06] p-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-mint-300 text-sm font-bold text-forest-900">
                {initial}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13.5px] font-semibold text-cream-50">
                  {profile?.name || 'Friend'}
                </p>
                <p className="text-[11px] text-cream-100/50">Local profile</p>
              </div>
              <ThemeToggle variant="dark" />
            </div>
          </div>
        </div>
      </aside>

      <div className="flex min-h-screen flex-col">
        {/* ---------- Mobile top bar ---------- */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-forest-900/[0.07] bg-cream-100/80 px-4 py-3 backdrop-blur-xl lg:hidden dark:border-cream-100/10 dark:bg-forest-950/80">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-forest-900 text-mint-300">
              <LeafMark className="h-5 w-5" />
            </span>
            <span className="text-[17px] font-extrabold tracking-tightest">Quitopia</span>
          </Link>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <Link
              href="/settings"
              aria-label="Settings"
              className="grid h-9 w-9 place-items-center rounded-full text-forest-900/60 hover:bg-forest-900/[0.06] dark:text-cream-100/60 dark:hover:bg-cream-100/10"
            >
              <Settings className="h-[18px] w-[18px]" strokeWidth={1.8} />
            </Link>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1180px] flex-1 px-4 pb-28 pt-6 lg:px-8 lg:pb-12 lg:pt-8">
          {!hydrated ? <ShellSkeleton /> : children}
        </main>

        {/* ---------- Mobile bottom nav ---------- */}
        <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-forest-900/[0.07] bg-cream-100/90 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden dark:border-cream-100/10 dark:bg-forest-950/90">
          <div className="grid grid-cols-5">
            {BOTTOM.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'flex flex-col items-center gap-1 py-2.5 text-[10.5px] font-semibold tracking-tight transition-colors',
                    active ? 'text-forest-900 dark:text-mint-300' : 'text-forest-900/45 dark:text-cream-100/45'
                  )}
                >
                  <span
                    className={cn(
                      'grid h-8 w-12 place-items-center rounded-full transition-colors',
                      active && 'bg-mint-200/70 dark:bg-mint-300/20'
                    )}
                  >
                    <Icon className="h-[18px] w-[18px]" strokeWidth={1.9} />
                  </span>
                  {label}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}

function ShellSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 w-44 rounded-full bg-forest-900/[0.07] dark:bg-cream-100/10" />
      <div className="h-64 rounded-3xl bg-forest-900/[0.05] dark:bg-cream-100/[0.06]" />
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="h-28 rounded-3xl bg-forest-900/[0.05] dark:bg-cream-100/[0.06]" />
        <div className="h-28 rounded-3xl bg-forest-900/[0.05] dark:bg-cream-100/[0.06]" />
        <div className="h-28 rounded-3xl bg-forest-900/[0.05] dark:bg-cream-100/[0.06]" />
      </div>
    </div>
  );
}
