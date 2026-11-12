'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowUpRight,
  Bell,
  Clock,
  Flame,
  Info,
  Leaf,
  Settings2,
  ShieldCheck,
  Sparkles,
  Target,
  Wallet
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge, Progress } from '@/components/ui/controls';
import { CheckInCard } from '@/components/checkin-card';
import { StatCard } from '@/components/stat-card';
import { StreakRing, BotanicalFlourish } from '@/components/streak-ring';
import { StreakHeatmap } from '@/components/streak-heatmap';
import { LevelIcon } from '@/components/icons';
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
  const nextMilestone = [7, 14, 30, 90, 180, 365].find((m) => streak < m) ?? 365;
  const milestoneProgress = Math.min(100, Math.round((streak / nextMilestone) * 100));

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
      {/* ---------- Page header ---------- */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[30px] font-extrabold leading-tight tracking-tightest sm:text-[38px]">
            {greeting()}, {profile.name || 'friend'}
          </h1>
          <p className="muted mt-1 text-[15px]">
            {streak > 0
              ? "You're doing great — calm and steady today."
              : 'Today is day one. That is enough for now.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-1.5 rounded-full bg-mint-200/60 px-3.5 py-1.5 text-[12.5px] font-semibold text-forest-800 sm:inline-flex dark:bg-mint-300/15 dark:text-mint-200">
            <Leaf className="h-3.5 w-3.5" /> Zen mode
          </span>
          <div className="flex items-center gap-1 rounded-full border border-forest-900/[0.07] bg-white/60 p-1 dark:border-cream-100/10 dark:bg-forest-900/50">
            {[Bell, Info].map((Icon, i) => (
              <span
                key={i}
                className="grid h-8 w-8 place-items-center rounded-full text-forest-900/45 dark:text-cream-100/45"
              >
                <Icon className="h-4 w-4" strokeWidth={1.8} />
              </span>
            ))}
            <Link
              href="/settings"
              className="grid h-8 w-8 place-items-center rounded-full text-forest-900/45 hover:bg-forest-900/[0.05] hover:text-forest-900 dark:text-cream-100/45 dark:hover:bg-cream-100/10"
            >
              <Settings2 className="h-4 w-4" strokeWidth={1.8} />
            </Link>
          </div>
        </div>
      </div>

      {/* ---------- Main grid ---------- */}
      <div className="grid gap-5 lg:grid-cols-[1.55fr_1fr]">
        <section className="surface relative overflow-hidden p-6 sm:p-8">
          <BotanicalFlourish className="absolute -right-6 bottom-0 h-40 w-56 opacity-70" />
          <div className="relative flex flex-col items-center">
            <StreakRing days={streak} startedAt={anchor} />
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <span className="pill bg-mint-100 text-forest-800 dark:bg-mint-300/15 dark:text-mint-200">
                <ShieldCheck className="h-3.5 w-3.5" /> {pluralise(streak, 'day')} clean
              </span>
              <span className="pill border border-forest-900/10 text-forest-900/60 dark:border-cream-100/15 dark:text-cream-100/60">
                <LevelIcon name={level.name} className="h-3.5 w-3.5" /> {level.name}
              </span>
              <span className="pill border border-forest-900/10 text-forest-900/60 dark:border-cream-100/15 dark:text-cream-100/60">
                {game.xp} XP
              </span>
            </div>
          </div>
        </section>

        <div className="flex flex-col gap-5">
          <CheckInCard />

          <div className="surface p-6">
            <h3 className="text-[17px] font-bold tracking-tight">Growing journey</h3>
            <p className="muted mt-1 text-[13px]">
              Next milestone: {nextMilestone} days · {Math.max(0, nextMilestone - streak)} to go
            </p>
            <div className="mt-4 flex items-center justify-between text-[12px] font-semibold">
              <span className="muted">Progress</span>
              <span className="tabular-nums">{milestoneProgress}%</span>
            </div>
            <Progress value={milestoneProgress} className="mt-2" />
            <div className="mt-4 flex items-center gap-2 rounded-2xl bg-cream-200/60 p-3 dark:bg-forest-800/60">
              <Leaf className="h-4 w-4 shrink-0 text-forest-600 dark:text-mint-300" strokeWidth={1.8} />
              <p className="text-[12.5px] leading-relaxed text-forest-900/70 dark:text-cream-100/70">
                {quote.text}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Stat row ---------- */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Money saved"
          value={formatCurrency(moneySaved)}
          hint={`${formatCurrency(spendPerDay)} a day · ${cleanDays} clean days`}
          icon={Wallet}
        />
        <StatCard
          label="Time reclaimed"
          value={formatDuration(minutesSaved)}
          hint={`${formatDuration(minutesPerDay)} a day`}
          icon={Clock}
        />
        <StatCard
          label="Urges defeated"
          value={String(game.urgesDefeated)}
          hint="Each one is a rep for the new habit"
          icon={Flame}
          tone="mint"
        />
      </div>

      {/* ---------- Today + timeline ---------- */}
      <div className="grid gap-5 lg:grid-cols-2">
        <section className="surface flex flex-col p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-[17px] font-bold tracking-tight">Today&apos;s task</h3>
            <Badge tone="outline">Day {task?.day ?? 1} of 7</Badge>
          </div>
          {task ? (
            <>
              <p className="mt-3 text-[15px] font-semibold">{task.title}</p>
              <p className="muted mt-1.5 text-[13.5px] leading-relaxed">{task.task}</p>
            </>
          ) : null}
          <div className="mt-auto pt-5">
            <Link href="/learn">
              <Button variant="outline" size="sm">
                See the full plan <ArrowUpRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </section>

        <section className="surface p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-[17px] font-bold tracking-tight">Recovery timeline</h3>
            <Sparkles className="h-4 w-4 text-forest-900/30 dark:text-cream-100/30" />
          </div>
          <ol className="mt-4 space-y-4">
            {recovery.map((stage) => {
              const reached = streak >= stage.day;
              return (
                <li key={stage.day} className="flex gap-3">
                  <span
                    className={`mt-1.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] font-bold ${
                      reached
                        ? 'bg-forest-900 text-cream-50 dark:bg-mint-300 dark:text-forest-950'
                        : 'bg-forest-900/[0.07] text-forest-900/40 dark:bg-cream-100/10 dark:text-cream-100/40'
                    }`}
                  >
                    {stage.day}
                  </span>
                  <div>
                    <p className="text-[14px] font-semibold">{stage.title}</p>
                    <p className="muted mt-0.5 text-[12.5px] leading-relaxed">{stage.body}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>
      </div>

      {/* ---------- Heatmap ---------- */}
      <section className="surface p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="text-[17px] font-bold tracking-tight">Your year</h3>
            <p className="muted text-[12.5px]">Every check-in, one square.</p>
          </div>
          <Link href="/stats" className="text-[12.5px] font-semibold text-forest-700 hover:underline dark:text-mint-300">
            All insights
          </Link>
        </div>
        <StreakHeatmap checkins={checkins} slips={slips} />
      </section>

      {/* ---------- Quick actions ---------- */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { href: '/sos', label: 'Urge right now?', hint: 'Open SOS', icon: Sparkles },
          { href: '/blocker', label: 'Blocker', hint: 'Rules and focus hours', icon: ShieldCheck },
          { href: '/accountability', label: 'Partner report', hint: 'Weekly summary', icon: Target }
        ].map(({ href, label, hint, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="surface group flex items-center gap-3 p-4 transition-transform duration-200 hover:-translate-y-0.5"
          >
            <span className="grid h-10 w-10 place-items-center rounded-full bg-forest-900/[0.05] text-forest-700 dark:bg-cream-100/10 dark:text-mint-300">
              <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[14px] font-semibold">{label}</p>
              <p className="muted truncate text-[12px]">{hint}</p>
            </div>
            <ArrowUpRight className="ml-auto h-4 w-4 shrink-0 text-forest-900/25 transition-transform group-hover:-translate-y-0.5 dark:text-cream-100/25" />
          </Link>
        ))}
      </div>

      <div className="flex flex-col items-center gap-2 pb-4">
        <button
          type="button"
          onClick={() => setShowSlip(true)}
          className="text-[12px] font-medium text-forest-900/35 underline-offset-4 hover:underline dark:text-cream-100/35"
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-forest-950/60 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: 18, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 10, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 26 }}
              className="w-full max-w-md rounded-3xl border border-forest-900/10 bg-cream-50 p-7 shadow-lift dark:border-cream-100/10 dark:bg-forest-900"
            >
              <h3 className="text-[22px] font-extrabold tracking-tight">That is okay.</h3>
              <p className="muted mt-2 text-[13.5px] leading-relaxed">
                A slip is data, not a verdict. Your streak resets — your best streak, your clean
                days and everything you learned do not.
              </p>
              <textarea
                value={slipNote}
                onChange={(e) => setSlipNote(e.target.value)}
                rows={3}
                maxLength={200}
                placeholder="What was happening right before? (optional)"
                className="mt-4 w-full rounded-2xl border border-forest-900/12 bg-white/80 p-3 text-sm dark:border-cream-100/12 dark:bg-forest-800"
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
