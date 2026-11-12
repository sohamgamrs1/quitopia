'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type Phase = 'Inhale' | 'Hold' | 'Exhale' | 'Rest';

const PHASES: { phase: Phase; seconds: number; scale: number }[] = [
  { phase: 'Inhale', seconds: 4, scale: 1.12 },
  { phase: 'Hold', seconds: 4, scale: 1.12 },
  { phase: 'Exhale', seconds: 4, scale: 0.82 },
  { phase: 'Rest', seconds: 4, scale: 0.82 }
];

export function BreathingExercise({
  rounds = 4,
  onComplete,
  compact = false
}: {
  rounds?: number;
  onComplete?: () => void;
  compact?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [remaining, setRemaining] = useState(PHASES[0].seconds);
  const [completedRounds, setCompletedRounds] = useState(0);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setRemaining((r) => {
        if (r > 1) return r - 1;
        setIndex((i) => {
          const next = (i + 1) % PHASES.length;
          if (next === 0) {
            setCompletedRounds((c) => {
              const total = c + 1;
              if (total >= rounds) {
                setRunning(false);
                onComplete?.();
              }
              return total;
            });
          }
          setRemaining(PHASES[next].seconds);
          return next;
        });
        return PHASES[(index + 1) % PHASES.length].seconds;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [running, index, rounds, onComplete]);

  const current = PHASES[index];
  const size = compact ? 158 : 232;

  return (
    <div className="flex flex-col items-center">
      <div className="relative grid place-items-center" style={{ width: size, height: size }}>
        <motion.div
          className="absolute inset-0 rounded-full bg-mint-300/40 dark:bg-mint-300/20"
          animate={{ scale: current.scale }}
          transition={{ duration: current.seconds, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute inset-8 rounded-full bg-mint-400/45 dark:bg-mint-400/25"
          animate={{ scale: current.scale }}
          transition={{ duration: current.seconds, ease: 'easeInOut' }}
        />
        <div className="relative text-center">
          <div className="text-[12px] font-semibold uppercase tracking-[0.18em] text-forest-900/55 dark:text-cream-100/55">
            {current.phase}
          </div>
          <div className="display-number mt-1 text-[34px] leading-none text-forest-900 dark:text-cream-50">
            {remaining}
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2">
        {Array.from({ length: rounds }).map((_, i) => (
          <span
            key={i}
            className={cn(
              'h-1.5 w-9 rounded-full transition-colors',
              i < completedRounds ? 'bg-forest-700 dark:bg-mint-300' : 'bg-forest-900/10 dark:bg-cream-100/15'
            )}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={() => setRunning((r) => !r)}
        className="mt-4 text-[12px] font-semibold text-forest-900/45 underline-offset-4 hover:underline dark:text-cream-100/45"
      >
        {running ? 'Pause' : 'Resume'}
      </button>
    </div>
  );
}
