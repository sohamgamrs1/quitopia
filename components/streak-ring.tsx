'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * The centrepiece: one number, one ring. The ring fills across the current milestone
 * (7 → 14 → 30 → 90 days) so there is always a next step without inventing points.
 */
const MILESTONES = [7, 14, 30, 90, 180, 365];

function nextMilestone(days: number): number {
  return MILESTONES.find((m) => days < m) ?? Math.ceil((days + 1) / 365) * 365;
}

export function StreakRing({
  days,
  startedAt,
  className
}: {
  days: number;
  startedAt: string;
  className?: string;
}) {
  const [elapsed, setElapsed] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const anchor = new Date(startedAt).getTime();
    const tick = () => {
      const total = Math.max(0, Date.now() - anchor);
      setElapsed({
        hours: Math.floor((total % 86_400_000) / 3_600_000),
        minutes: Math.floor((total % 3_600_000) / 60_000),
        seconds: Math.floor((total % 60_000) / 1000)
      });
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [startedAt]);

  const target = nextMilestone(days);
  const previous = MILESTONES.filter((m) => m <= days).pop() ?? 0;
  const span = Math.max(1, target - previous);
  const progress = Math.min(1, (days - previous) / span);
  const circumference = 2 * Math.PI * 118;

  return (
    <div className={cn('relative flex flex-col items-center justify-center', className)}>
      <svg viewBox="0 0 280 280" className="h-[248px] w-[248px] sm:h-[286px] sm:w-[286px]">
        <defs>
          <linearGradient id="ringFill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7FD8BC" />
            <stop offset="55%" stopColor="#1D6B57" />
            <stop offset="100%" stopColor="#0B3B2E" />
          </linearGradient>
        </defs>
        <circle cx="140" cy="140" r="118" fill="none" stroke="#0B3B2E" strokeOpacity="0.08" strokeWidth="16" />
        <circle
          cx="140"
          cy="140"
          r="118"
          fill="none"
          stroke="url(#ringFill)"
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray={`${circumference * progress} ${circumference}`}
          transform="rotate(-90 140 140)"
          className="transition-all duration-1000 ease-out"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="display-number text-[64px] leading-none text-forest-900 sm:text-[76px] dark:text-cream-50">
          {days}
        </span>
        <span className="mt-1 text-[13px] font-semibold uppercase tracking-[0.16em] text-forest-900/50 dark:text-cream-100/50">
          Days clean
        </span>
        <span className="mt-3 font-mono text-[11.5px] tabular-nums text-forest-900/40 dark:text-cream-100/40">
          {String(elapsed.hours).padStart(2, '0')}:{String(elapsed.minutes).padStart(2, '0')}:
          {String(elapsed.seconds).padStart(2, '0')}
        </span>
      </div>

      <p className="muted mt-1 text-[12px]">
        Started {new Date(startedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        {' · '}
        {days >= target ? 'milestone reached' : `${target - days} days to ${target}`}
      </p>
    </div>
  );
}

/** Decorative botanical flourish — drawn, not an image asset. */
export function BotanicalFlourish({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 160" className={cn('pointer-events-none', className)} aria-hidden="true">
      <g stroke="#1D6B57" strokeOpacity="0.35" fill="none" strokeWidth="1.4" strokeLinecap="round">
        <path d="M24 150c18-34 34-58 62-76" />
        <path d="M52 116c-10-2-18-8-22-18 12-1 20 4 22 18Z" />
        <path d="M68 96c-2-12 2-21 12-27 3 12-2 22-12 27Z" />
        <path d="M92 74c-10-4-16-11-17-22 12 2 18 9 17 22Z" />
        <path d="M120 150c14-28 32-46 58-58" />
        <path d="M148 118c-2-12 3-21 14-26 2 12-4 21-14 26Z" />
        <path d="M170 100c-10-5-15-13-15-24 12 3 17 11 15 24Z" />
      </g>
      <g fill="#A8E6CF" fillOpacity="0.5">
        <circle cx="52" cy="116" r="2.4" />
        <circle cx="68" cy="96" r="2" />
        <circle cx="148" cy="118" r="2.4" />
      </g>
    </svg>
  );
}
