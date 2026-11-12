'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  Clock,
  HeartHandshake,
  Lock,
  ShieldCheck,
  Sparkles,
  Timer,
  TrendingUp,
  Wind
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/controls';

const FEATURES = [
  {
    icon: ShieldCheck,
    title: 'A blocker that holds',
    body: 'Blocklists for porn, gambling, social and gaming, plus your own URLs and keywords. Hard-lock it for an hour or ninety days.'
  },
  {
    icon: Wind,
    title: 'An SOS that actually helps',
    body: 'A ten-minute urge delay, guided box breathing, and five things to do instead — designed for the ninety seconds that matter.'
  },
  {
    icon: TrendingUp,
    title: 'Progress you can see',
    body: 'Clean streak, urges defeated, money saved, time reclaimed, and a year-long heatmap that makes the invisible visible.'
  },
  {
    icon: Lock,
    title: 'Nothing leaves this browser',
    body: 'No account, no server, no analytics. Your data lives in localStorage on this device and nowhere else. Export it whenever you want.'
  },
  {
    icon: HeartHandshake,
    title: 'A partner, without a cloud',
    body: 'Add someone you trust and generate a weekly summary to send them. Accountability without giving anyone your data.'
  },
  {
    icon: BookOpen,
    title: 'Honest reading',
    body: 'Short pieces on the science of urges, rebuilding focus, and knowing when this is bigger than an app.'
  }
];

const TIMELINE = [
  { day: 'Day 1', title: 'The decision', body: 'The urge peaks and passes. You only have to notice that.' },
  { day: 'Day 7', title: 'One week', body: 'Sleep and mood start to settle. The habit is loud, but no longer constant.' },
  { day: 'Day 14', title: 'Two weeks', body: 'The cue-response loop weakens. Most people get their first easy day here.' },
  { day: 'Day 30', title: 'One month', body: 'New routines hold on their own. Baseline mood is measurably better.' },
  { day: 'Day 90', title: 'Ninety days', body: 'The marker most people aim for. Not the finish line — the new normal.' }
];

const FAQ = [
  {
    q: 'Where is my data stored?',
    a: 'In your browser, in localStorage under the key quitopia_profile. There is no backend, no account and no sync. Clearing site data erases it, so export a JSON backup from Settings if you care about it.'
  },
  {
    q: 'Does the blocker actually block things?',
    a: 'Inside this app, yes: the blocker page evaluates any URL against your rules and shows the block screen. For real browser-wide blocking, install the bundled Chrome extension from the extension/ folder in the repo — it uses the same lists.'
  },
  {
    q: 'Is this a medical treatment?',
    a: 'No. Quitopia is a barrier and a journal. If the behaviour is affecting your work, sleep or relationships, a qualified professional is the right next step.'
  },
  {
    q: 'Will it work offline?',
    a: 'Yes. Once the page has loaded once, a service worker keeps it available offline. Nothing it does requires a network connection.'
  },
  {
    q: 'Do I need to pay for anything?',
    a: 'No. There is no pricing page, no subscription and no ads, because there is nothing to run on a server.'
  }
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <div className="flex items-center gap-2 font-display text-lg font-semibold">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-forest-700 text-cream">🌿</span>
          Quitopia
        </div>
        <div className="flex items-center gap-2">
          <Link href="/onboarding">
            <Button size="sm">Start free</Button>
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 pb-16 pt-10 sm:pt-16">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <Badge tone="cream" className="mb-4">
              <Sparkles className="h-3.5 w-3.5" /> Local-only · no account
            </Badge>
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="font-display text-4xl font-semibold leading-[1.08] sm:text-5xl lg:text-6xl"
            >
              Reclaim your focus.
              <br />
              Reclaim your life.
            </motion.h1>
            <p className="muted mt-5 max-w-xl text-base sm:text-lg">
              A calm, private self-control app for quitting porn, gambling, doomscrolling and
              whatever else has your attention. Block it, ride out the urge, and watch the streak
              grow.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/onboarding">
                <Button size="lg">
                  Start your 7-day plan <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="#how">
                <Button size="lg" variant="outline">
                  How it works
                </Button>
              </Link>
            </div>
            <div className="muted mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs">
              <span className="flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5" /> Data stays in your browser
              </span>
              <span className="flex items-center gap-1.5">
                <Timer className="h-3.5 w-3.5" /> Works offline
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" /> Setup takes two minutes
              </span>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative"
          >
            <div className="surface mx-auto max-w-sm p-6">
              <p className="text-xs font-medium uppercase tracking-wider text-forest-900/50 dark:text-cream/50">
                Current streak
              </p>
              <div className="mt-2 grid grid-cols-4 gap-2">
                {[
                  { v: '23', l: 'days' },
                  { v: '14', l: 'hrs' },
                  { v: '07', l: 'min' },
                  { v: '42', l: 'sec' }
                ].map((cell) => (
                  <div key={cell.l} className="rounded-xl bg-forest-700/5 py-3 text-center dark:bg-cream/5">
                    <div className="font-display text-xl font-semibold tabular-nums">{cell.v}</div>
                    <div className="text-[10px] uppercase tracking-wider text-forest-900/50 dark:text-cream/50">
                      {cell.l}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 space-y-3">
                {[
                  { label: 'Money saved', value: '₹4,200' },
                  { label: 'Time reclaimed', value: '18h 30m' },
                  { label: 'Urges defeated', value: '31' }
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between text-sm">
                    <span className="muted">{row.label}</span>
                    <span className="font-semibold">{row.value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-xl bg-mint/40 p-3 text-xs leading-relaxed dark:bg-forest-700">
                “The urge peaks and passes. This is the passing part.”
              </div>
            </div>
            <div className="absolute -bottom-4 -right-2 hidden rotate-3 rounded-2xl bg-forest-700 px-4 py-3 text-xs font-medium text-cream shadow-lift sm:block">
              Day 23 · Warrior
            </div>
          </motion.div>
        </div>
      </section>

      <section id="how" className="border-y border-forest-900/10 bg-white/50 py-16 dark:border-cream/10 dark:bg-forest-800/40">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="font-display text-3xl font-semibold">How it works</h2>
          <p className="muted mt-2 max-w-2xl">
            Three things, in this order. No gamified nonsense you have to keep feeding.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                step: '01',
                title: 'Tell it what you are quitting',
                body: 'A four-step quiz builds your profile and a seven-day plan. No email, no password.'
              },
              {
                step: '02',
                title: 'Block the route to it',
                body: 'Pick blocklists, add your own URLs and keywords, lock the settings, and set focus hours.'
              },
              {
                step: '03',
                title: 'Ride out the urge',
                body: 'When it hits, the SOS page buys you ten minutes and gives you five things to do instead.'
              }
            ].map((item) => (
              <div key={item.step} className="surface p-6">
                <span className="font-display text-3xl font-semibold text-mint-deep dark:text-mint">
                  {item.step}
                </span>
                <h3 className="mt-3 font-display text-lg font-semibold">{item.title}</h3>
                <p className="muted mt-1.5 text-sm">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="font-display text-3xl font-semibold">What is inside</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <div key={title} className="surface p-5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-mint/50 text-forest-800 dark:bg-forest-700 dark:text-mint">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-3 font-display text-base font-semibold">{title}</h3>
              <p className="muted mt-1.5 text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-forest-900/10 bg-white/50 py-16 dark:border-cream/10 dark:bg-forest-800/40">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="font-display text-3xl font-semibold">The recovery timeline</h2>
          <p className="muted mt-2 max-w-2xl">
            Not a promise — a map. This is roughly what the first ninety days feel like for most
            people.
          </p>
          <div className="mt-10 space-y-4">
            {TIMELINE.map((item, i) => (
              <div key={item.day} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-forest-700 text-xs font-semibold text-cream dark:bg-mint dark:text-forest-900">
                    {i + 1}
                  </span>
                  {i < TIMELINE.length - 1 ? (
                    <span className="mt-1 h-full w-px flex-1 bg-forest-900/15 dark:bg-cream/15" />
                  ) : null}
                </div>
                <div className="pb-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-base font-semibold">{item.title}</h3>
                    <Badge tone="outline">{item.day}</Badge>
                  </div>
                  <p className="muted mt-1 text-sm">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-16">
        <h2 className="font-display text-3xl font-semibold">Questions</h2>
        <div className="mt-6 divide-y divide-forest-900/10 dark:divide-cream/10">
          {FAQ.map((item) => (
            <details key={item.q} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                {item.q}
                <span className="text-forest-900/40 transition-transform group-open:rotate-45 dark:text-cream/40">
                  +
                </span>
              </summary>
              <p className="muted mt-2 text-sm leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 pb-20">
        <div className="rounded-3xl bg-forest-700 p-8 text-center text-cream sm:p-12">
          <h2 className="font-display text-3xl font-semibold">Start with today.</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-cream/80">
            Two minutes of setup, a seven-day plan, and a streak that starts the moment you finish.
            No account, no email, no card.
          </p>
          <Link href="/onboarding" className="mt-6 inline-block">
            <Button size="lg" variant="secondary">
              Begin onboarding <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-forest-900/10 py-8 text-center text-xs text-forest-900/50 dark:border-cream/10 dark:text-cream/50">
        Quitopia · local-only · for adults 18+ · not a medical treatment
      </footer>
    </div>
  );
}
