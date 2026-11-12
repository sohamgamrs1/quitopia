'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

function diffParts(fromMs: number) {
  const total = Math.max(0, Date.now() - fromMs);
  const days = Math.floor(total / 86_400_000);
  const hours = Math.floor((total % 86_400_000) / 3_600_000);
  const minutes = Math.floor((total % 3_600_000) / 60_000);
  const seconds = Math.floor((total % 60_000) / 1000);
  return { days, hours, minutes, seconds };
}

export function StreakCounter({ since, className }: { since: string; className?: string }) {
  const [parts, setParts] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const anchor = new Date(since).getTime();
    const tick = () => setParts(diffParts(anchor));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [since]);

  const cells = [
    { value: parts.days, label: 'days' },
    { value: parts.hours, label: 'hours' },
    { value: parts.minutes, label: 'mins' },
    { value: parts.seconds, label: 'secs' }
  ];

  return (
    <div className={cn('grid grid-cols-4 gap-2 sm:gap-3', className)}>
      {cells.map((cell) => (
        <div
          key={cell.label}
          className="rounded-2xl bg-forest-700/5 px-2 py-3 text-center dark:bg-cream/5"
        >
          <div className="font-display text-2xl font-semibold tabular-nums sm:text-4xl">
            {String(cell.value).padStart(2, '0')}
          </div>
          <div className="mt-1 text-[10px] uppercase tracking-wider text-forest-900/50 dark:text-cream/50 sm:text-xs">
            {cell.label}
          </div>
        </div>
      ))}
    </div>
  );
}
