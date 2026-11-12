'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  Clock,
  Flame,
  ShieldCheck,
  Sparkles,
  Target,
  Wallet,
  Wind
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge, Progress } from '@/components/ui/controls';
import { CheckInCard } from '@/components/checkin-card';
import { StatCard } from '@/components/stat-card';
import { StreakCounter } from '@/components/streak-counter';
import { StreakHeatmap } from '@/components/streak-heatmap';
import { addictionById, addictionLabel } from '@/lib/addictions';
import { evaluateBadges, levelFor } from '@/lib/gamification';
import { generatePlan, todayTask } from '@/lib/plan';
import { quoteOfTheDay } from '@/data/quotes';
import {
  currentStreakDays,
  dailyMinutesTotal,
  dailySpendTotal,
  totalCleanDays,
  useStore
} from '@/lib/storage';
import { formatCurrency, formatDuration, pluralise } from '@/lib/utils';

export default function DashboardPage() {
  const store = useStore();
  const { profile, checkins, slips, game } = store;

  const [showSlip, setShowSlip] = useState(false);
  const [slipNote, setSlipNote] = useState('');

  const streak = currentStreakDays(store);
  const cleanDays = totalCleanDays(store);
  const spendPerDay = dailySpendTotal(store);
  const minutesPerDay = dailyMinutesTotal(store);
  const moneySaved = spendPerDay * cleanDays;
  const minutesSaved = minutesPerDay * cleanDays;
  const level = levelFor(game.xp);

  const plan = useMemo(() => (profile ? generatePlan(profile) : []), [profile]);
  const task = profile && plan.length ? todayTask(plan, profile.startDate) : null;
  const quote = quoteOfTheDay();

  const anchor = slips.length > 0 ? slips[0].at : profile?.startDate ?? new Date().toISOString();

  // Badges are derived, never awarded twice.
  useEffect(() => {
    if (!profile) return;
    const earned = evaluateBadges(streak, game.urgesDefeated, checkins);
    const changed =
      earned.length !== game.badges.length || earned.some((id) => !game.badges.includes(id));
    if (changed) store.setBadges(earned);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streak, game.urgesDefeated, checkins.length, profile]);

  if (!profile) return null;

  const primary = addictionById(profile.addictions[0] ?? '');
  const recovery = primary?.recovery ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="muted text-sm">
            {greeting()}, {profile.name || 'friend'}
          </p>
          <h1 className="font-display text-2xl font-semibold sm:text-3xl">
            {streak > 0 ? `${pluralise(streak, 'day')} clean` : 'Today is day one'}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Badge tone="cream">
            {level.emoji} {level.name}
          </Badge>
          <Badge tone="outline">{game.xp} XP</Badge>
        </div>
      </div>

      <section className="surface p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-forest-900/50 dark:text-cream/50">
              Current streak
            </p>
            <p className="muted mt-0.5 text-xs">
              Quitting{' '}
              {profile.addictions
                .map((id) => addictionLabel(id, profile.customAddiction))
                .join(', ')}
            </p>
          </div>
          <Flame className="h-5 w-5 text-forest-600 dark:text-mint" />
        </div>
        <StreakCounter since={anchor} />
        <div className="mt-4">
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="muted">
              {level.next ? `${level.toNext} XP to ${level.next.name}` : 'Top level reached'}
            </span>
            <span className="muted">{level.progress}%</span>
          </div>
          <Progress value={level.progress} />
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Money saved"
          value={formatCurrency(moneySaved)}
          hint={`${formatCurrency(spendPerDay)}/day`}
          icon={Wallet}
        />
        <StatCard
          label="Time reclaimed"
          value={formatDuration(minutesSaved)}
          hint={`${formatDuration(minutesPerDay)}/day`}
          icon={Clock}
        />
        <StatCard
          label="Urges defeated"
          value={String(game.urgesDefeated)}
          hint="+50 XP each"
          icon={ShieldCheck}
        />
        <StatCard
          label="Clean days"
          value={String(cleanDays)}
          hint={`${slips.length} slip${slips.length === 1 ? '' : 's'} total`}
          icon={Target}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <CheckInCard />

        <div className="surface flex flex-col p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-semibold">Today&apos;s task</h3>
            <Badge tone="mint">Day {task?.day ?? 1} of 7</Badge>
          </div>
          {task ? (
            <>
              <p className="mt-3 font-medium">{task.title}</p>
              <p className="muted mt-1 text-sm leading-relaxed">{task.task}</p>
            </>
          ) : null}
          <div className="mt-auto pt-4">
            <Link href="/learn">
              <Button variant="outline" size="sm">
                See the full plan <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <section className="surface p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-base font-semibold">Your recovery timeline</h3>
          <Sparkles className="h-4 w-4 text-forest-900/40 dark:text-cream/40" />
        </div>
        <div className="mt-4 space-y-3">
          {recovery.map((stage) => {
            const reached = streak >= stage.day;
            return (
              <div key={stage.day} className="flex gap-3">
                <div
                  className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
                    reached ? 'bg-forest-600 dark:bg-mint' : 'bg-forest-900/15 dark:bg-cream/15'
                  }`}
                />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium">{stage.title}</p>
                    <span className="muted text-xs">Day {stage.day}</span>
                    {reached ? <Badge tone="mint">reached</Badge> : null}
                  </div>
                  <p className="muted mt-0.5 text-xs leading-relaxed">{stage.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="surface p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-base font-semibold">The year so far</h3>
          <Link href="/stats" className="text-xs font-medium text-forest-600 hover:underline dark:text-mint">
            All stats
          </Link>
        </div>
        <StreakHeatmap checkins={checkins} slips={slips} />
      </section>

      <div className="grid gap-3 sm:grid-cols-3">
        <Link href="/sos" className="surface flex items-center gap-3 p-4 transition-transform hover:-translate-y-0.5">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-300">
            <Wind className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-semibold">Urge right now?</p>
            <p className="muted text-xs">Open SOS</p>
          </div>
        </Link>
        <Link href="/blocker" className="surface flex items-center gap-3 p-4 transition-transform hover:-translate-y-0.5">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-mint/60 text-forest-800 dark:bg-forest-700 dark:text-mint">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-semibold">Blocker</p>
            <p className="muted text-xs">Rules and focus hours</p>
          </div>
        </Link>
        <Link href="/accountability" className="surface flex items-center gap-3 p-4 transition-transform hover:-translate-y-0.5">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-cream-deep text-forest-800 dark:bg-forest-700 dark:text-mint">
            <Target className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-semibold">Partner report</p>
            <p className="muted text-xs">Weekly summary</p>
          </div>
        </Link>
      </div>

      <div className="flex flex-col items-center gap-3 pb-4 text-center">
        <p className="muted max-w-md text-sm italic">“{quote.text}”</p>
        <button
          type="button"
          onClick={() => setShowSlip(true)}
          className="text-xs font-medium text-forest-900/40 underline-offset-4 hover:underline dark:text-cream/40"
        >
          I slipped — log it honestly
        </button>
      </div>

      <AnimatePresence>
        {showSlip ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-forest-900/70 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 8, opacity: 0 }}
              className="w-full max-w-md rounded-3xl bg-cream p-6 dark:bg-forest-800"
            >
              <h3 className="font-display text-xl font-semibold">That is okay.</h3>
              <p className="muted mt-2 text-sm leading-relaxed">
                A slip is data, not a verdict. Your streak resets — your best streak, your clean
                days and everything you learned do not.
              </p>
              <textarea
                value={slipNote}
                onChange={(e) => setSlipNote(e.target.value)}
                rows={3}
                maxLength={200}
                placeholder="What was happening right before? (optional)"
                className="mt-4 w-full rounded-xl border border-forest-900/15 bg-white p-3 text-sm dark:border-cream/15 dark:bg-forest-700"
              />
              <div className="mt-4 flex flex-col gap-2">
                <Button
                  onClick={() => {
                    store.recordSlip(slipNote.trim() || undefined);
                    setSlipNote('');
                    setShowSlip(false);
                  }}
                >
                  Log it and keep going
                </Button>
                <Button variant="ghost" onClick={() => setShowSlip(false)}>
                  Actually, I am fine
                </Button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}
