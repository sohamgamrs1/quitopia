'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input, Label, Textarea } from '@/components/ui/input';
import { Progress } from '@/components/ui/controls';
import { ADDICTIONS, FREQUENCIES, TRIGGERS } from '@/lib/addictions';
import { AddictionIcon, LeafMark } from '@/components/icons';
import { useStore } from '@/lib/storage';
import { cn, dayKey } from '@/lib/utils';

const STEPS = ['Name', 'Addictions', 'Frequency', 'Triggers', 'Goal'];

export default function OnboardingPage() {
  const router = useRouter();
  const saveProfile = useStore((s) => s.saveProfile);

  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [addictions, setAddictions] = useState<string[]>([]);
  const [customAddiction, setCustomAddiction] = useState('');
  const [frequency, setFrequency] = useState('');
  const [triggers, setTriggers] = useState<string[]>([]);
  const [goal, setGoal] = useState<'quit' | 'reduce'>('quit');
  const [startDate, setStartDate] = useState(dayKey());
  const [reason, setReason] = useState('');

  const toggle = (list: string[], value: string) =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

  const canContinue = () => {
    if (step === 0) return name.trim().length > 0;
    if (step === 1)
      return (
        addictions.length > 0 &&
        (!addictions.includes('custom') || customAddiction.trim().length > 0)
      );
    if (step === 2) return frequency.length > 0;
    if (step === 3) return triggers.length > 0;
    return reason.trim().length > 0;
  };

  const finish = () => {
    saveProfile({
      name: name.trim(),
      addictions,
      customAddiction: customAddiction.trim(),
      frequency,
      triggers,
      goal,
      startDate,
      reason: reason.trim(),
      onboarded: true
    });
    router.push('/dashboard');
  };

  return (
    <div className="mx-auto min-h-screen w-full max-w-2xl px-5 py-8">
      <div className="mb-8 flex items-center gap-2.5">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-forest-900 text-mint-300">
          <LeafMark className="h-5 w-5" />
        </span>
        <span className="text-[19px] font-extrabold tracking-tightest">Quitopia</span>
      </div>

      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-xs font-medium">
          <span className="muted">
            Step {step + 1} of {STEPS.length} · {STEPS[step]}
          </span>
          <span className="muted">{Math.round(((step + 1) / STEPS.length) * 100)}%</span>
        </div>
        <Progress value={((step + 1) / STEPS.length) * 100} />
      </div>

      <motion.div
        key={step}
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.25 }}
      >
        {step === 0 ? (
          <section className="surface p-6">
            <h1 className="font-display text-2xl font-semibold">First, what should we call you?</h1>
            <p className="muted mt-1 text-sm">
              Just a name. It stays on this device and is only used to greet you.
            </p>
            <div className="mt-6">
              <Label htmlFor="name">Your name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Soham"
                autoFocus
                maxLength={40}
              />
            </div>
          </section>
        ) : null}

        {step === 1 ? (
          <section className="surface p-6">
            <h1 className="font-display text-2xl font-semibold">What are you quitting?</h1>
            <p className="muted mt-1 text-sm">Pick everything that applies. You can change this later.</p>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {ADDICTIONS.map((item) => {
                const active = addictions.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setAddictions((list) => toggle(list, item.id))}
                    className={cn(
                      'flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all',
                      active
                        ? 'border-forest-600 bg-mint/40 dark:border-mint dark:bg-forest-700'
                        : 'border-forest-900/10 hover:border-forest-900/25 dark:border-cream/10 dark:hover:border-cream/25'
                    )}
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-forest-900/[0.05] text-forest-700 dark:bg-cream-100/10 dark:text-mint-300">
                      <AddictionIcon id={item.id} />
                    </span>
                    <span className="flex-1 font-medium">{item.label}</span>
                    {active ? <Check className="h-4 w-4" /> : null}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => setAddictions((list) => toggle(list, 'custom'))}
                className={cn(
                  'flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all',
                  addictions.includes('custom')
                    ? 'border-forest-600 bg-mint/40 dark:border-mint dark:bg-forest-700'
                    : 'border-forest-900/10 hover:border-forest-900/25 dark:border-cream/10 dark:hover:border-cream/25'
                )}
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-forest-900/[0.05] text-forest-700 dark:bg-cream-100/10 dark:text-mint-300">
                  <AddictionIcon id="custom" />
                </span>
                <span className="flex-1 font-medium">Something else</span>
                {addictions.includes('custom') ? <Check className="h-4 w-4" /> : null}
              </button>
            </div>
            {addictions.includes('custom') ? (
              <div className="mt-4">
                <Label htmlFor="custom">Name it</Label>
                <Input
                  id="custom"
                  value={customAddiction}
                  onChange={(e) => setCustomAddiction(e.target.value)}
                  placeholder="Late-night news scrolling"
                  maxLength={60}
                />
              </div>
            ) : null}
          </section>
        ) : null}

        {step === 2 ? (
          <section className="surface p-6">
            <h1 className="font-display text-2xl font-semibold">How often does it happen?</h1>
            <p className="muted mt-1 text-sm">Be honest. Nobody else sees this.</p>
            <div className="mt-5 space-y-2">
              {FREQUENCIES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFrequency(item.id)}
                  className={cn(
                    'flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium transition-all',
                    frequency === item.id
                      ? 'border-forest-600 bg-mint/40 dark:border-mint dark:bg-forest-700'
                      : 'border-forest-900/10 hover:border-forest-900/25 dark:border-cream/10 dark:hover:border-cream/25'
                  )}
                >
                  {item.label}
                  {frequency === item.id ? <Check className="h-4 w-4" /> : null}
                </button>
              ))}
            </div>
          </section>
        ) : null}

        {step === 3 ? (
          <section className="surface p-6">
            <h1 className="font-display text-2xl font-semibold">What sets it off?</h1>
            <p className="muted mt-1 text-sm">
              These become your early-warning system. Pick the ones you recognise.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {TRIGGERS.map((item) => {
                const active = triggers.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTriggers((list) => toggle(list, item.id))}
                    className={cn(
                      'rounded-full border px-4 py-2 text-sm font-medium transition-all',
                      active
                        ? 'border-forest-600 bg-mint text-forest-900 dark:border-mint dark:bg-forest-600 dark:text-cream'
                        : 'border-forest-900/15 hover:border-forest-900/30 dark:border-cream/15 dark:hover:border-cream/30'
                    )}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </section>
        ) : null}

        {step === 4 ? (
          <section className="surface p-6">
            <h1 className="font-display text-2xl font-semibold">What is the goal?</h1>
            <p className="muted mt-1 text-sm">
              And the reason — write it for the version of you at 1am.
            </p>

            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {[
                { id: 'quit', label: 'Quit completely', hint: 'Hard mode, no negotiation' },
                { id: 'reduce', label: 'Cut down', hint: 'Fewer, and with limits' }
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setGoal(item.id as 'quit' | 'reduce')}
                  className={cn(
                    'rounded-xl border p-4 text-left transition-all',
                    goal === item.id
                      ? 'border-forest-600 bg-mint/40 dark:border-mint dark:bg-forest-700'
                      : 'border-forest-900/10 hover:border-forest-900/25 dark:border-cream/10 dark:hover:border-cream/25'
                  )}
                >
                  <p className="text-sm font-semibold">{item.label}</p>
                  <p className="muted text-xs">{item.hint}</p>
                </button>
              ))}
            </div>

            <div className="mt-5 max-w-xs">
              <Label htmlFor="start">Start date</Label>
              <Input
                id="start"
                type="date"
                value={startDate}
                max={dayKey()}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="mt-4">
              <Label htmlFor="reason">Your reason</Label>
              <Textarea
                id="reason"
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Because I want to be present with my family instead of sneaking away."
                maxLength={300}
              />
              <p className="muted mt-1 text-xs">{reason.length}/300</p>
            </div>
          </section>
        ) : null}
      </motion.div>

      <div className="mt-6 flex items-center justify-between">
        <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>

        {step < STEPS.length - 1 ? (
          <Button onClick={() => setStep((s) => s + 1)} disabled={!canContinue()}>
            Continue <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={finish} disabled={!canContinue()}>
            Start my plan <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
