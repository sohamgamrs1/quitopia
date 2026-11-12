'use client';

import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/controls';
import { useStore } from '@/lib/storage';
import { dayKey, cn } from '@/lib/utils';

const MOODS = ['Low', 'Meh', 'Okay', 'Good', 'Great'];

/** Drawn faces instead of emoji, so the card reads as designed rather than decorated. */
function MoodFace({ level, active }: { level: number; active: boolean }) {
  const stroke = active ? '#0B3B2E' : 'currentColor';
  const mouths = [
    'M9 18c1.6-1.6 4.4-1.6 6 0',
    'M9 17.5c1.6-.6 4.4-.6 6 0',
    'M9 17h6',
    'M9 16c1.6 1.8 4.4 1.8 6 0',
    'M8.6 15c2 3 6.8 3 8.8 0'
  ];
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9.2" stroke={stroke} strokeWidth="1.5" strokeOpacity={active ? 1 : 0.5} />
      <circle cx="9" cy="10" r="1" fill={stroke} fillOpacity={active ? 1 : 0.5} />
      <circle cx="15" cy="10" r="1" fill={stroke} fillOpacity={active ? 1 : 0.5} />
      <path d={mouths[level - 1]} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeOpacity={active ? 1 : 0.5} />
    </svg>
  );
}

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
    <div className="surface p-6">
      <div className="flex items-start justify-between">
        <h3 className="text-[17px] font-bold tracking-tight">Today&apos;s check-in</h3>
        {saved ? (
          <span className="pill bg-mint-100 text-forest-800 dark:bg-mint-300/20 dark:text-mint-200">
            <Check className="h-3 w-3" /> saved
          </span>
        ) : null}
      </div>

      <div className="mt-5">
        <p className="eyebrow mb-2.5">Mood</p>
        <div className="flex gap-2">
          {MOODS.map((label, i) => {
            const active = mood === i + 1;
            return (
              <button
                key={label}
                type="button"
                onClick={() => setMood(i + 1)}
                aria-label={`Mood: ${label}`}
                title={label}
                className={cn(
                  'grid h-11 flex-1 place-items-center rounded-2xl border transition-all duration-200',
                  active
                    ? 'border-forest-900/15 bg-mint-200/70 text-forest-900 dark:border-mint-300/30 dark:bg-mint-300/15 dark:text-mint-200'
                    : 'border-forest-900/[0.07] text-forest-900/45 hover:bg-forest-900/[0.04] dark:border-cream-100/10 dark:text-cream-100/45'
                )}
              >
                <MoodFace level={i + 1} active={active} />
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-2.5 flex items-center justify-between">
          <p className="eyebrow">Urge strength</p>
          <span className="text-[13px] font-bold tabular-nums">{urge}/10</span>
        </div>
        <Slider value={urge} onChange={setUrge} min={1} max={10} label="Urge strength" />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2">
        {[
          { value: true, label: 'Stayed clean' },
          { value: false, label: 'I slipped' }
        ].map((option) => (
          <button
            key={option.label}
            type="button"
            onClick={() => setClean(option.value)}
            className={cn(
              'rounded-2xl border py-2.5 text-[13px] font-semibold transition-all',
              clean === option.value
                ? option.value
                  ? 'border-forest-900/15 bg-mint-200/70 text-forest-900 dark:border-mint-300/30 dark:bg-mint-300/15 dark:text-mint-200'
                  : 'border-red-200 bg-red-50 text-red-700 dark:border-red-500/25 dark:bg-red-500/10 dark:text-red-200'
                : 'border-forest-900/[0.07] text-forest-900/50 hover:bg-forest-900/[0.04] dark:border-cream-100/10 dark:text-cream-100/50'
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      <Button onClick={save} className="mt-4 w-full" variant={saved ? 'outline' : 'default'}>
        {saved ? 'Update check-in' : 'Log how you feel'}
      </Button>
    </div>
  );
}
