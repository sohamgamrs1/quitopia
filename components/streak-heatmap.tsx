'use client';

import { useMemo } from 'react';
import { dayKey } from '@/lib/utils';
import type { CheckIn, Slip } from '@/lib/storage';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** A year of squares, GitHub-style, built from check-ins and slips. */
export function StreakHeatmap({ checkins, slips }: { checkins: CheckIn[]; slips: Slip[] }) {
  const { weeks, monthLabels } = useMemo(() => {
    const clean = new Set(checkins.filter((c) => c.clean).map((c) => c.date));
    const slipDays = new Set(slips.map((s) => dayKey(s.at)));

    const end = new Date();
    const start = new Date(end);
    start.setDate(start.getDate() - 363);
    // align to Monday
    const offset = (start.getDay() + 6) % 7;
    start.setDate(start.getDate() - offset);

    const weeks: { date: string; level: 0 | 1 | 2 | 3 }[] = [];
    const labels: { index: number; label: string }[] = [];
    let lastMonth = -1;

    const cursor = new Date(start);
    let weekIndex = 0;
    while (cursor <= end) {
      for (let d = 0; d < 7; d++) {
        const key = dayKey(cursor);
        let level: 0 | 1 | 2 | 3 = 0;
        if (slipDays.has(key)) level = 1;
        else if (clean.has(key)) level = 3;
        else if (new Date(key) <= end) level = 2;
        weeks.push({ date: key, level });

        if (cursor.getDate() <= 7 && cursor.getMonth() !== lastMonth) {
          lastMonth = cursor.getMonth();
          labels.push({ index: weekIndex, label: MONTHS[lastMonth] });
        }
        cursor.setDate(cursor.getDate() + 1);
      }
      weekIndex++;
    }
    return { weeks, monthLabels: labels };
  }, [checkins, slips]);

  const colour = (level: number) => {
    switch (level) {
      case 1:
        return 'bg-red-400/70 dark:bg-red-400/50';
      case 3:
        return 'bg-forest-600 dark:bg-mint';
      case 2:
        return 'bg-forest-900/10 dark:bg-cream/10';
      default:
        return 'bg-forest-900/5 dark:bg-cream/5';
    }
  };

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[720px]">
        <div className="mb-1 grid grid-flow-col auto-cols-[14px] gap-[3px] text-[10px] text-forest-900/40 dark:text-cream/40">
          {monthLabels.map((m) => (
            <span key={`${m.label}-${m.index}`} style={{ gridColumnStart: m.index + 1 }}>
              {m.label}
            </span>
          ))}
        </div>
        <div className="grid grid-flow-col grid-rows-7 gap-[3px]">
          {weeks.map((day) => (
            <div
              key={day.date}
              title={day.date}
              className={`h-3.5 w-3.5 rounded-[3px] ${colour(day.level)}`}
            />
          ))}
        </div>
        <div className="mt-3 flex items-center gap-3 text-[11px] text-forest-900/50 dark:text-cream/50">
          <span className="flex items-center gap-1">
            <i className="h-3 w-3 rounded-[3px] bg-red-400/70" /> slipped
          </span>
          <span className="flex items-center gap-1">
            <i className="h-3 w-3 rounded-[3px] bg-forest-600 dark:bg-mint" /> checked in clean
          </span>
          <span className="flex items-center gap-1">
            <i className="h-3 w-3 rounded-[3px] bg-forest-900/10 dark:bg-cream/10" /> no check-in
          </span>
        </div>
      </div>
    </div>
  );
}
