'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BreathingExercise } from './breathing-exercise';

/**
 * The screen a blocked site gets. Sixty seconds before the exit is available, and the
 * wait is filled with something to do rather than a countdown to stare at.
 */
export function BlockScreen({
  open,
  host,
  streakDays,
  reason,
  onLeave
}: {
  open: boolean;
  host: string;
  streakDays: number;
  reason?: string;
  onLeave: () => void;
}) {
  const [seconds, setSeconds] = useState(60);

  useEffect(() => {
    if (!open) {
      setSeconds(60);
      return;
    }
    setSeconds(60);
    const id = window.setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => window.clearInterval(id);
  }, [open]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-forest-900/80 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.95, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.97, opacity: 0 }}
            className="w-full max-w-md rounded-3xl bg-cream p-6 text-center shadow-lift dark:bg-forest-800"
          >
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-300">
              <ShieldAlert className="h-7 w-7" />
            </div>

            <h2 className="mt-4 font-display text-xl font-semibold">
              Do you really want to break your {streakDays}-day streak?
            </h2>
            <p className="muted mt-2 text-sm">
              <span className="font-medium text-forest-900 dark:text-cream">{host}</span> is blocked
              {reason === 'schedule' ? ' during your focus hours' : ''}.
            </p>

            <div className="my-5">
              <BreathingExercise rounds={4} compact />
            </div>

            <p className="muted text-xs">
              {seconds > 0
                ? `You can leave in ${seconds}s. Breathe until then.`
                : 'The urge peaks and passes. This is the passing part.'}
            </p>

            <div className="mt-5 flex flex-col gap-2">
              <Button onClick={onLeave} disabled={seconds > 0} variant="secondary">
                {seconds > 0 ? `Wait ${seconds}s` : 'Go back'}
              </Button>
              <p className="text-[11px] text-forest-900/40 dark:text-cream/40">
                Quitopia never sees what you do next. This screen is the whole intervention.
              </p>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
