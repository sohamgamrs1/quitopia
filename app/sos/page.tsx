'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, Coffee, Footprints, LifeBuoy, PenLine, Sparkles, Timer, Wind } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { BreathingExercise } from '@/components/breathing-exercise';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/controls';
import { useStore } from '@/lib/storage';
import { cn } from '@/lib/utils';

type Phase = 'idle' | 'active' | 'done';

const ACTIONS = [
  {
    id: 'shower',
    label: 'Cold shower',
    icon: Coffee,
    minutes: 2,
    body: 'Two minutes of cold water. Uncomfortable, fast, and it resets your body faster than anything else on this list.'
  },
  {
    id: 'walk',
    label: 'Go for a walk',
    icon: Footprints,
    minutes: 10,
    body: 'Leave the room the phone is in. Ten minutes outside, no headphones. The point is the change of place.'
  },
  {
    id: 'journal',
    label: 'Write it down',
    icon: PenLine,
    minutes: 5,
    body: 'One paragraph: what happened, what you felt, what you were avoiding. That is the whole exercise.'
  },
  {
    id: 'ground',
    label: 'Grounding game',
    icon: Sparkles,
    minutes: 3,
    body: 'Five things you can see, four you can touch, three you can hear, two you can smell, one you can taste.'
  }
];

const GROUNDING = [
  'Five things you can see',
  'Four things you can touch',
  'Three things you can hear',
  'Two things you can smell',
  'One thing you can taste'
];

export default function SosPage() {
  const defeatUrge = useStore((s) => s.defeatUrge);
  const urges = useStore((s) => s.game.urgesDefeated);

  const [phase, setPhase] = useState<Phase>('idle');
  const [remaining, setRemaining] = useState(600);
  const [action, setAction] = useState<string | null>(null);
  const [checked, setChecked] = useState<boolean[]>(Array(5).fill(false));
  const finished = useRef(false);

  useEffect(() => {
    if (phase !== 'active') return;
    const id = window.setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          window.clearInterval(id);
          setPhase('done');
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [phase]);

  const start = () => {
    finished.current = false;
    setRemaining(600);
    setPhase('active');
    setAction(null);
    setChecked(Array(5).fill(false));
  };

  const pass = () => {
    if (!finished.current) {
      finished.current = true;
      defeatUrge();
    }
    setPhase('done');
  };

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const progress = ((600 - remaining) / 600) * 100;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Urge SOS"
        subtitle="Ten minutes is all this needs. The urge peaks, holds, and falls away whether or not you act on it."
        action={<Badge tone="cream">{urges} urges defeated</Badge>}
      />

      {phase === 'idle' ? (
        <Card>
          <CardContent className="flex flex-col items-center py-10">
            <motion.button
              type="button"
              onClick={start}
              whileTap={{ scale: 0.96 }}
              className="grid h-40 w-40 place-items-center rounded-full bg-red-600 text-white shadow-lift"
              aria-label="Start the urge delay timer"
            >
              <div className="text-center">
                <LifeBuoy className="mx-auto h-8 w-8" />
                <span className="mt-1 block font-display text-xl font-semibold">SOS</span>
              </div>
            </motion.button>
            <p className="mt-6 max-w-sm text-center text-sm text-forest-900/60 dark:text-cream/60">
              Press it. A ten-minute timer starts, the breathing guide takes over, and you get four
              things to do instead.
            </p>
          </CardContent>
        </Card>
      ) : null}

      {phase === 'active' ? (
        <>
          <Card>
            <CardContent className="py-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-forest-900/50 dark:text-cream/50">
                    Urge delay
                  </p>
                  <p className="font-display text-3xl font-semibold tabular-nums">
                    {minutes}:{String(seconds).padStart(2, '0')}
                  </p>
                </div>
                <Timer className="h-6 w-6 text-forest-900/30 dark:text-cream/30" />
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-forest-900/10 dark:bg-cream/10">
                <div
                  className="h-full rounded-full bg-forest-600 transition-all duration-1000 dark:bg-mint"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="mt-8">
                <BreathingExercise rounds={4} />
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-3 sm:grid-cols-2">
            {ACTIONS.map(({ id, label, icon: Icon, body, minutes: mins }) => (
              <button
                key={id}
                type="button"
                onClick={() => setAction(action === id ? null : id)}
                className={cn(
                  'surface p-4 text-left transition-all hover:-translate-y-0.5',
                  action === id && 'ring-2 ring-teal'
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-mint/50 text-forest-800 dark:bg-forest-700 dark:text-mint">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{label}</p>
                    <p className="muted text-xs">{mins} min</p>
                  </div>
                </div>
                {action === id ? <p className="muted mt-3 text-sm leading-relaxed">{body}</p> : null}
              </button>
            ))}
          </div>

          {action === 'ground' ? (
            <Card>
              <CardHeader>
                <CardTitle>5-4-3-2-1</CardTitle>
                <CardDescription>Work down the list slowly. Tick each one off.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {GROUNDING.map((item, i) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() =>
                      setChecked((list) => list.map((value, index) => (index === i ? !value : value)))
                    }
                    className={cn(
                      'flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors',
                      checked[i]
                        ? 'border-forest-600 bg-mint/40 dark:border-mint dark:bg-forest-700'
                        : 'border-forest-900/10 dark:border-cream/10'
                    )}
                  >
                    <span
                      className={cn(
                        'grid h-5 w-5 place-items-center rounded-md border',
                        checked[i]
                          ? 'border-forest-600 bg-forest-600 text-white dark:border-mint dark:bg-mint dark:text-forest-900'
                          : 'border-forest-900/20 dark:border-cream/20'
                      )}
                    >
                      {checked[i] ? <Check className="h-3 w-3" /> : null}
                    </span>
                    {item}
                  </button>
                ))}
              </CardContent>
            </Card>
          ) : null}

          {action === 'journal' ? (
            <Card>
              <CardContent className="flex items-center justify-between gap-3 py-5">
                <p className="text-sm">Write it out — one paragraph is enough.</p>
                <Link href="/journal">
                  <Button size="sm">
                    <PenLine className="h-4 w-4" /> Open journal
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : null}

          <div className="flex flex-col gap-2 pb-4 sm:flex-row">
            <Button className="flex-1" onClick={pass}>
              <Check className="h-4 w-4" /> The urge passed (+50 XP)
            </Button>
            <Button variant="outline" onClick={() => setPhase('done')}>
              I am okay now
            </Button>
          </div>
        </>
      ) : null}

      {phase === 'done' ? (
        <Card>
          <CardContent className="flex flex-col items-center py-10 text-center">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-mint text-forest-900 dark:bg-forest-600 dark:text-cream">
              <Wind className="h-7 w-7" />
            </span>
            <h2 className="mt-4 font-display text-2xl font-semibold">You rode it out.</h2>
            <p className="muted mt-2 max-w-sm text-sm">
              That is one more rep for the part of your brain that learns the reward is not coming.
              Log it, then go do something else for a while.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <Button onClick={start}>Another urge is here</Button>
              <Link href="/journal">
                <Button variant="outline">Log what happened</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
