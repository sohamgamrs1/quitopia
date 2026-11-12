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
          className="fixed inset-0 z-50 flex items-center justify-center bg-forest-950/70 p-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.96, y: 14 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.98, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 240, damping: 24 }}
            className="w-full max-w-md rounded-3xl border border-forest-900/10 bg-cream-50 p-7 text-center shadow-lift dark:border-cream-100/10 dark:bg-forest-900"
          >
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-300">
              <ShieldAlert className="h-6 w-6" strokeWidth={1.8} />
            </div>

            <h2 className="mt-5 text-[22px] font-extrabold leading-snug tracking-tightest">
              Do you really want to break your {streakDays}-day streak?
            </h2>
            <p className="muted mt-2 text-[13.5px]">
              <span className="font-semibold text-forest-900 dark:text-cream-50">{host}</span> is blocked
              {reason === 'schedule' ? ' during your focus hours' : ''}.
            </p>

            <div className="my-6">
              <BreathingExercise rounds={4} compact />
            </div>

            <p className="muted text-[12px]">
              {seconds > 0
                ? `You can leave in ${seconds}s. Breathe until then.`
                : 'The urge peaks and passes. This is the passing part.'}
            </p>

            <div className="mt-5 flex flex-col gap-2">
              <Button onClick={onLeave} disabled={seconds > 0} variant={seconds > 0 ? 'outline' : 'default'}>
                {seconds > 0 ? `Wait ${seconds}s` : 'Go back'}
              </Button>
              <p className="text-[11px] text-forest-900/35 dark:text-cream-100/35">
                Quitopia never sees what you do next. This screen is the whole intervention.
              </p>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
