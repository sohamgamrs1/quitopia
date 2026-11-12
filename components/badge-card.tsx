'use client';

import { Lock } from 'lucide-react';
import { BADGES } from '@/data/badges';
import { BadgeIcon } from './icons';
import { cn } from '@/lib/utils';

export function BadgeCard({ earnedIds }: { earnedIds: string[] }) {
  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
      {BADGES.map((badge) => {
        const earned = earnedIds.includes(badge.id);
        return (
          <div
            key={badge.id}
            title={badge.description}
            className={cn(
              'flex flex-col items-center rounded-2xl border px-2 py-4 text-center transition-all',
              earned
                ? 'border-forest-900/10 bg-mint-100/60 text-forest-800 dark:border-mint-300/20 dark:bg-mint-300/10 dark:text-mint-200'
                : 'border-forest-900/[0.07] bg-white/40 text-forest-900/35 dark:border-cream-100/10 dark:bg-forest-900/40 dark:text-cream-100/35'
            )}
          >
            <span
              className={cn(
                'grid h-10 w-10 place-items-center rounded-full',
                earned ? 'bg-white/70 dark:bg-forest-900/50' : 'bg-forest-900/[0.04] dark:bg-cream-100/[0.06]'
              )}
            >
              {earned ? <BadgeIcon id={badge.id} /> : <Lock className="h-4 w-4" strokeWidth={1.7} />}
            </span>
            <p className="mt-2 text-[11.5px] font-semibold leading-tight">{badge.label}</p>
            <p className="mt-0.5 text-[10.5px] leading-tight opacity-60">
              {earned ? 'Earned' : badge.streakDays ? `${badge.streakDays} days` : 'Locked'}
            </p>
          </div>
        );
      })}
    </div>
  );
}
