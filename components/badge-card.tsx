'use client';

import { BADGES } from '@/data/badges';
import { cn } from '@/lib/utils';

export function BadgeCard({ earnedIds }: { earnedIds: string[] }) {
  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
      {BADGES.map((badge) => {
        const earned = earnedIds.includes(badge.id);
        return (
          <div
            key={badge.id}
            className={cn(
              'rounded-2xl border p-3 text-center transition-all',
              earned
                ? 'border-mint bg-mint/30 dark:border-forest-500 dark:bg-forest-700'
                : 'border-forest-900/10 bg-white/40 opacity-60 dark:border-cream/10 dark:bg-forest-800/40'
            )}
            title={badge.description}
          >
            <div className="text-2xl">{earned ? badge.emoji : '🔒'}</div>
            <p className="mt-1 text-[11px] font-semibold leading-tight">{badge.label}</p>
            <p className="mt-0.5 text-[10px] leading-tight text-forest-900/50 dark:text-cream/50">
              {earned ? 'Earned' : badge.streakDays ? `${badge.streakDays} days` : 'Locked'}
            </p>
          </div>
        );
      })}
    </div>
  );
}
