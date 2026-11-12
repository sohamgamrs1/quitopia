'use client';

import { useEffect, useState } from 'react';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/controls';
import { useStore } from '@/lib/storage';
import { dayKey } from '@/lib/utils';
import { cn } from '@/lib/utils';

const MOODS = ['😞', '😕', '😐', '🙂', '😄'];

export function CheckInCard() {
  const checkins = useStore((s) => s.checkins);
  const addCheckIn = useStore((s) => s.addCheckIn);
  const addXp = useStore((s) => s.addXp);

  const today = dayKey();
  const existing = checkins.find((c) => c.date === today);

  const [mood, setMood] = useState(3);
  const [urge, setUrge] = useState(3);
  const [clean, setClean] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (existing) {
      setMood(existing.mood);
      setUrge(existing.urge);
      setClean(existing.clean);
      setSaved(true);
    }
  }, [existing]);

  const save = () => {
    addCheckIn({ date: today, mood, urge, clean, at: new Date().toISOString() });
    if (!existing) addXp(10);
    setSaved(true);
  };

  return (
    <div className="surface p-5">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-display text-base font-semibold">Today&apos;s check-in</h3>
          <p className="muted text-xs">
            {saved ? 'Saved. You can edit it any time today.' : 'Thirty seconds, once a day.'}
          </p>
        </div>
        {saved ? <Check className="h-5 w-5 text-forest-600 dark:text-mint" /> : null}
      </div>

      <div className="mt-4">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-forest-900/50 dark:text-cream/50">
          Mood
        </p>
        <div className="flex gap-2">
          {MOODS.map((emoji, i) => (
            <button
              key={emoji}
              type="button"
              onClick={() => setMood(i + 1)}
              aria-label={`Mood ${i + 1}`}
              className={cn(
                'grid h-11 w-11 place-items-center rounded-xl text-xl transition-all',
                mood === i + 1
                  ? 'bg-mint shadow-sm dark:bg-forest-600'
                  : 'bg-forest-900/5 hover:bg-forest-900/10 dark:bg-cream/5 dark:hover:bg-cream/10'
              )}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-xs font-medium uppercase tracking-wide text-forest-900/50 dark:text-cream/50">
          <span>Urge strength</span>
          <span className="text-forest-900 dark:text-cream">{urge}/10</span>
        </div>
        <Slider value={urge} onChange={setUrge} min={1} max={10} label="Urge strength" />
      </div>

      <div className="mt-5 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setClean(true)}
          className={cn(
            'flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition-colors',
            clean
              ? 'bg-mint text-forest-900 dark:bg-forest-600 dark:text-cream'
              : 'bg-forest-900/5 text-forest-900/60 dark:bg-cream/5 dark:text-cream/60'
          )}
        >
          <Check className="h-4 w-4" /> Stayed clean
        </button>
        <button
          type="button"
          onClick={() => setClean(false)}
          className={cn(
            'flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition-colors',
            !clean
              ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-200'
              : 'bg-forest-900/5 text-forest-900/60 dark:bg-cream/5 dark:text-cream/60'
          )}
        >
          <X className="h-4 w-4" /> I slipped
        </button>
      </div>

      <Button onClick={save} className="mt-4 w-full">
        {saved ? 'Update check-in' : 'Save check-in (+10 XP)'}
      </Button>
    </div>
  );
}
