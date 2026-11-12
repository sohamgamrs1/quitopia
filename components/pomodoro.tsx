'use client';

import { useEffect, useRef, useState } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs } from '@/components/ui/controls';

export function Pomodoro({ onComplete }: { onComplete?: () => void }) {
  const [length, setLength] = useState(25);
  const [remaining, setRemaining] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const completed = useRef(false);

  useEffect(() => {
    setRemaining(length * 60);
    setRunning(false);
    completed.current = false;
  }, [length]);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          window.clearInterval(id);
          setRunning(false);
          if (!completed.current) {
            completed.current = true;
            onComplete?.();
          }
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [running, onComplete]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const percent = 100 - (remaining / (length * 60)) * 100;

  return (
    <div className="surface p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-[17px] font-bold tracking-tight">Focus session</h3>
          <p className="muted mt-0.5 text-[12.5px]">Blocker settings stay locked while the timer runs.</p>
        </div>
        <Tabs
          tabs={[
            { id: '25', label: '25m' },
            { id: '50', label: '50m' }
          ]}
          value={String(length)}
          onChange={(id) => setLength(Number(id))}
        />
      </div>

      <div className="mt-6 flex items-center gap-6">
        <div className="relative grid h-24 w-24 shrink-0 place-items-center">
          <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
            <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="7" opacity="0.08" />
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke="currentColor"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={`${(percent / 100) * 276} 276`}
              className="text-forest-700 dark:text-mint-300"
            />
          </svg>
          <span className="display-number text-[19px] tabular-nums">
            {minutes}:{String(seconds).padStart(2, '0')}
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <Button onClick={() => setRunning((r) => !r)} variant={running ? 'outline' : 'default'}>
            {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {running ? 'Pause' : 'Start focus'}
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setRemaining(length * 60);
              setRunning(false);
            }}
          >
            <RotateCcw className="h-4 w-4" /> Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
