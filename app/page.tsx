'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  Clock,
  HeartHandshake,
  Leaf,
  Lock,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wind
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LeafMark } from '@/components/icons';

const FEATURES = [
  {
    icon: ShieldCheck,
    title: 'A blocker that holds',
    body: 'Blocklists for porn, gambling, social and gaming, plus your own URLs and keywords. Hard-lock it for an hour or ninety days.'
  },
  {
    icon: Wind,
    title: 'An SOS that actually helps',
    body: 'A ten-minute urge delay, guided box breathing, and four things to do instead — built for the ninety seconds that matter.'
  },
  {
    icon: TrendingUp,
    title: 'Progress you can see',
    body: 'Clean streak, urges defeated, money saved, time reclaimed, and a year-long heatmap that makes the invisible visible.'
  },
  {
    icon: Lock,
    title: 'Nothing leaves this browser',
    body: 'No account, no server, no analytics. Your data lives in localStorage on this device and nowhere else.'
  },
  {
    icon: HeartHandshake,
    title: 'A partner, without a cloud',
    body: 'Add someone you trust and generate a weekly summary to send them. Accountability without handing over your data.'
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
    a: 'In your browser, in localStorage under the key quitopia_profile. There is no backend, no account and no sync. Clearing site data erases it, so export a JSON backup from Settings if it matters.'
  },
  {
    q: 'Does the blocker actually block things?',
    a: 'Inside this app, yes: the blocker page evaluates any URL against your rules and shows the block screen. For real browser-wide blocking, install the bundled Chrome extension from the extension/ folder — it uses the same lists.'
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
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6">
        <div className="flex items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-forest-900 text-mint-300">
            <LeafMark className="h-5 w-5" />
          </span>
          <span className="text-[19px] font-extrabold tracking-tightest">Quitopia</span>
        </div>
        <Link href="/onboarding">
          <Button size="sm">Start free</Button>
        </Link>
      </header>

      {/* ---------- Hero ---------- */}
      <section className="mx-auto max-w-6xl px-5 pb-20 pt-8 sm:pt-14">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <span className="pill bg-mint-100 text-forest-800 dark:bg-mint-300/15 dark:text-mint-200">
              <Leaf className="h-3.5 w-3.5" /> Local only · no account
            </span>
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
              className="mt-5 text-[42px] font-extrabold leading-[1.03] tracking-tightest sm:text-[58px] lg:text-[64px]"
            >
              Reclaim your focus.
              <br />
              <span className="text-forest-600 dark:text-mint-300">Reclaim your life.</span>
            </motion.h1>
            <p className="muted mt-6 max-w-xl text-[16px] leading-relaxed">
              A calm, private self-control app for quitting porn, gambling, doomscrolling and
              whatever else has your attention. Block it, ride out the urge, and watch the streak
              grow.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
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
            <div className="muted mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[12.5px]">
              <span className="flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5" strokeWidth={1.8} /> Data stays in your browser
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" strokeWidth={1.8} /> Works offline
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" strokeWidth={1.8} /> Two-minute setup
              </span>
            </div>
          </div>

          {/* Product preview */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative"
          >
            <div className="surface relative overflow-hidden p-7">
              <div className="flex items-start justify-between">
                <div>
                  <p className="eyebrow">Current streak</p>
                  <p className="mt-1 text-[15px] font-bold tracking-tight">Alex · Warrior</p>
                </div>
                <span className="pill bg-mint-100 text-forest-800 dark:bg-mint-300/15 dark:text-mint-200">
                  <ShieldCheck className="h-3 w-3" /> on
                </span>
              </div>

              <div className="relative mt-4 flex items-center justify-center">
                <svg viewBox="0 0 280 280" className="h-[210px] w-[210px]">
                  <defs>
                    <linearGradient id="lpRing" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#7FD8BC" />
                      <stop offset="100%" stopColor="#0B3B2E" />
                    </linearGradient>
                  </defs>
                  <circle cx="140" cy="140" r="118" fill="none" stroke="#0B3B2E" strokeOpacity="0.08" strokeWidth="16" />
                  <circle
                    cx="140"
                    cy="140"
                    r="118"
                    fill="none"
                    stroke="url(#lpRing)"
                    strokeWidth="16"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 118 * 0.34} ${2 * Math.PI * 118}`}
                    transform="rotate(-90 140 140)"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="display-number text-[54px] leading-none">24</span>
                  <span className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-forest-900/45 dark:text-cream-100/45">
                    Days clean
                  </span>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2">
                {[
                  { label: 'Saved', value: '₹4,200' },
                  { label: 'Time', value: '18h' },
                  { label: 'Urges', value: '31' }
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl bg-forest-900/[0.04] px-2 py-3 text-center dark:bg-cream-100/[0.06]">
                    <p className="display-number text-[15px]">{item.value}</p>
                    <p className="mt-0.5 text-[10.5px] uppercase tracking-wider text-forest-900/40 dark:text-cream-100/40">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute -bottom-4 -right-2 hidden rounded-2xl bg-forest-900 px-4 py-3 text-[11.5px] font-semibold text-cream-50 shadow-lift sm:block">
              “The urge peaks and passes.”
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---------- How it works ---------- */}
      <section id="how" className="border-y border-forest-900/[0.07] bg-white/45 py-20 dark:border-cream-100/10 dark:bg-forest-900/40">
        <div className="mx-auto max-w-6xl px-5">
          <p className="eyebrow">How it works</p>
          <h2 className="mt-3 max-w-2xl text-[30px] font-extrabold leading-tight tracking-tightest sm:text-[38px]">
            Three things, in this order.
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
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
                body: 'When it hits, the SOS page buys you ten minutes and gives you four things to do instead.'
              }
            ].map((item) => (
              <div key={item.step} className="surface p-7">
                <span className="display-number text-[34px] text-mint-500/70 dark:text-mint-300/50">
                  {item.step}
                </span>
                <h3 className="mt-3 text-[17px] font-bold tracking-tight">{item.title}</h3>
                <p className="muted mt-2 text-[13.5px] leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Features ---------- */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <p className="eyebrow">What is inside</p>
        <h2 className="mt-3 text-[30px] font-extrabold leading-tight tracking-tightest sm:text-[38px]">
          Built to be quiet.
        </h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <div key={title} className="surface p-6">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-mint-100 text-forest-700 dark:bg-mint-300/15 dark:text-mint-200">
                <Icon className="h-[19px] w-[19px]" strokeWidth={1.8} />
              </span>
              <h3 className="mt-4 text-[16px] font-bold tracking-tight">{title}</h3>
              <p className="muted mt-2 text-[13.5px] leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Timeline ---------- */}
      <section className="border-y border-forest-900/[0.07] bg-white/45 py-20 dark:border-cream-100/10 dark:bg-forest-900/40">
        <div className="mx-auto max-w-3xl px-5">
          <p className="eyebrow">The recovery timeline</p>
          <h2 className="mt-3 text-[30px] font-extrabold leading-tight tracking-tightest sm:text-[38px]">
            What the first ninety days feel like.
          </h2>
          <p className="muted mt-3 max-w-xl text-[14.5px] leading-relaxed">
            Not a promise — a map. This is roughly what most people report.
          </p>
          <ol className="mt-10 space-y-0">
            {TIMELINE.map((item, i) => (
              <li key={item.day} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-forest-900 text-[11px] font-bold text-cream-50 dark:bg-mint-300 dark:text-forest-950">
                    {i + 1}
                  </span>
                  {i < TIMELINE.length - 1 ? (
                    <span className="my-1 w-px flex-1 bg-forest-900/10 dark:bg-cream-100/15" />
                  ) : null}
                </div>
                <div className="pb-8">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-[16px] font-bold tracking-tight">{item.title}</h3>
                    <span className="pill border border-forest-900/10 text-forest-900/50 dark:border-cream-100/15 dark:text-cream-100/50">
                      {item.day}
                    </span>
                  </div>
                  <p className="muted mt-1.5 text-[13.5px] leading-relaxed">{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="mx-auto max-w-3xl px-5 py-20">
        <p className="eyebrow">Questions</p>
        <h2 className="mt-3 text-[30px] font-extrabold leading-tight tracking-tightest sm:text-[38px]">
          Before you install.
        </h2>
        <div className="mt-8 divide-y divide-forest-900/[0.07] dark:divide-cream-100/10">
          {FAQ.map((item) => (
            <details key={item.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-semibold tracking-tight">
                {item.q}
                <span className="text-forest-900/30 transition-transform duration-200 group-open:rotate-45 dark:text-cream-100/30">
                  +
                </span>
              </summary>
              <p className="muted mt-2.5 text-[13.5px] leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="mx-auto max-w-5xl px-5 pb-24">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-forest-900 px-8 py-14 text-center text-cream-50 sm:px-14">
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-mint-300/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-sand/10 blur-2xl" />
          <h2 className="relative text-[32px] font-extrabold leading-tight tracking-tightest sm:text-[42px]">
            Start with today.
          </h2>
          <p className="relative mx-auto mt-4 max-w-lg text-[14.5px] leading-relaxed text-cream-100/70">
            Two minutes of setup, a seven-day plan, and a streak that starts the moment you finish.
            No account, no email, no card.
          </p>
          <Link href="/onboarding" className="relative mt-8 inline-block">
            <Button size="lg" variant="secondary">
              Begin onboarding <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-forest-900/[0.07] py-10 text-center text-[12px] text-forest-900/40 dark:border-cream-100/10 dark:text-cream-100/40">
        Quitopia · local only · for adults 18+ · not a medical treatment
      </footer>
    </div>
  );
}
