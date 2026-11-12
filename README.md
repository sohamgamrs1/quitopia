# Quitopia

A calm, **local-only** self-control app for quitting porn, gambling, doomscrolling and other
habits. Built with Next.js 14, TypeScript, Tailwind and Zustand. No backend, no account, no
payments, no environment variables.

Everything a user enters lives in `localStorage` under the key `quitopia_profile`.

---

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
```

Node 18.17+ is required (Node 20 recommended).

## Deploy to Vercel

### From GitHub

```bash
git init
git add .
git commit -m "Quitopia"
git branch -M main
git remote add origin https://github.com/<you>/quitopia.git
git push -u origin main
```

Then on [vercel.com](https://vercel.com): **Add New → Project → Import** the repo. Vercel
detects Next.js automatically — leave the build command and output directory at their defaults.
Add your domain in **Settings → Domains**.

### From the CLI

```bash
npm i -g vercel
vercel          # preview
vercel --prod   # production
```

`vercel.json` only sets the framework and a no-cache header for the service worker.

## Pages

| Route | What it does |
|---|---|
| `/` | Landing page: hero, how it works, features, recovery timeline, FAQ |
| `/onboarding` | Five-step local profile: name, addictions, frequency, triggers, goal + reason |
| `/dashboard` | Live clean timer, stats, recovery timeline, daily check-in, daily task, year heatmap, slip flow |
| `/blocker` | Blocklist / allowlist / focus-hours modes, custom URL-keyword-app rules, hard lock, safe search, Pomodoro, live URL tester |
| `/sos` | Urge SOS: 10-minute delay timer, box breathing, four alternatives, +50 XP on completion |
| `/journal` | Prompted journal, trigger log, and a computed insight about your riskiest window |
| `/community` | Anonymous stories stored in this browser, with local report/hide |
| `/learn` | Six offline articles plus your generated 7-day plan |
| `/stats` | Recharts line/bar/area/pie charts, badges, money-saved calculator, JSON + PDF export |
| `/accountability` | Partner details and a generated weekly report to copy, WhatsApp or email |
| `/settings` | Profile, addictions, triggers, theme, reminders, PIN, export/import/reset |

## Stack

- **Next.js 14** (App Router) + React 18 + TypeScript
- **Tailwind CSS** with a calm forest/mint/cream palette and class-based dark mode
- **Zustand** with `persist` middleware for all state and `localStorage`
- **Framer Motion** for the small amount of motion there is
- **Recharts** for the stats charts
- **Lucide** icons
- **shadcn-style UI primitives** in `components/ui` (cva + tailwind-merge + Radix Slot), written
  out rather than pulled from a generator, so there is no `components.json` step
- **PWA**: `public/manifest.json`, generated icons, and a small service worker for offline use

## Project layout

```
app/                 routes (App Router) + globals.css
components/          app shell, charts, breathing, block screen, heatmap, UI primitives
lib/                 storage (Zustand + localStorage), blocklists, gamification, insights, plan
data/                articles, quotes, badges
public/              manifest, service worker, icons
extension/           Chrome MV3 blocker (see extension/README.md)
```

## How the "blocker" works here

Two pieces, both local:

1. **In-app tester** (`/blocker`) evaluates any URL you type against your rules and shows the
   real block screen with a 60-second delay. It makes no network request.
2. **Chrome extension** (`extension/`) applies the same domain list and keyword list to actual
   browsing using `declarativeNetRequest`, and enforces safe search on Google.

A web page cannot block other tabs or other apps. That is a browser sandbox boundary, not a
missing feature — which is why the extension exists.

## Data and privacy

- No cookies, no analytics, no third-party requests except Google Fonts (swap to a local font
  if you want zero third-party calls).
- Export a JSON backup from **Settings → Your data**. Import it on another device.
- **Reset all data** erases the profile, streak, journal, rules and posts from this browser.
- This is not a medical treatment. The Learn section says so in plain language.

## What is deliberately not here

No AI coach, no pricing page, no admin panel, no auth, no Supabase/Firebase, no payments, no
env variables. If you add any of those later, the privacy copy in `app/page.tsx` and the
Settings page must change with it.
