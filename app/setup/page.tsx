'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, Copy, Globe, Laptop, MonitorSmartphone, Router, ShieldCheck, Smartphone } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { Badge } from '@/components/ui/controls';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const DNS_PROVIDERS = [
  {
    name: 'Cloudflare for Families',
    host: 'family.cloudflare-dns.com',
    note: 'Lightest option. Malware and adult content. Everything else stays normal.'
  },
  {
    name: 'AdGuard Family',
    host: 'family.adguard-dns.com',
    note: 'Also blocks ads and trackers, and turns on safe search where the site supports it.'
  },
  {
    name: 'CleanBrowsing Family',
    host: 'family-filter-dns.cleanbrowsing.org',
    note: 'Strictest. Also blocks proxy and VPN domains, and forces Google, Bing and YouTube safe mode.'
  }
];

const LEVELS = [
  {
    title: 'Browser extension',
    reach: 'This browser, every tab',
    effort: '2 minutes',
    covers: 'Chrome, Edge, Brave',
    icon: Globe
  },
  {
    title: 'Private DNS on the phone',
    reach: 'Every browser and app on that device',
    effort: '30 seconds',
    covers: 'Android 9+',
    icon: Smartphone
  },
  {
    title: 'DNS on the router',
    reach: 'Every device on your network',
    effort: '5 minutes',
    covers: 'Everything at home',
    icon: Router
  }
];

function CopyRow({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1600);
        } catch {
          /* clipboard can be blocked; the text is selectable anyway */
        }
      }}
      className="group flex w-full items-center justify-between gap-3 rounded-xl border border-forest-900/10 bg-white/60 px-3.5 py-2.5 text-left transition-colors hover:border-forest-900/20 dark:border-cream-100/10 dark:bg-forest-900/40"
    >
      <code className="truncate font-mono text-[12.5px] text-forest-900 dark:text-cream-100">{value}</code>
      <span className="flex shrink-0 items-center gap-1 text-[11px] font-semibold text-forest-900/45 dark:text-cream-100/45">
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? 'copied' : 'copy'}
      </span>
    </button>
  );
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-forest-900 text-[11px] font-bold text-cream-50 dark:bg-mint-300 dark:text-forest-950">
        {n}
      </span>
      <span className="text-[13.5px] leading-relaxed text-forest-900/75 dark:text-cream-100/75">{children}</span>
    </li>
  );
}

export default function SetupPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Real blocking"
        subtitle="A web page cannot block other tabs — that is a browser boundary, not a missing feature. These three setups actually stop the site from loading, and each one takes minutes."
      />

      {/* Levels */}
      <div className="grid gap-4 sm:grid-cols-3">
        {LEVELS.map(({ title, reach, effort, covers, icon: Icon }) => (
          <div key={title} className="surface p-5">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-mint-100 text-forest-700 dark:bg-mint-300/15 dark:text-mint-200">
              <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
            </span>
            <p className="mt-3 text-[15px] font-bold tracking-tight">{title}</p>
            <p className="muted mt-1 text-[12.5px] leading-relaxed">{reach}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <Badge tone="outline">{effort}</Badge>
              <Badge tone="cream">{covers}</Badge>
            </div>
          </div>
        ))}
      </div>

      {/* Extension */}
      <section className="surface p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-forest-900 text-mint-300">
              <Globe className="h-[18px] w-[18px]" strokeWidth={1.8} />
            </span>
            <div>
              <h2 className="text-[17px] font-bold tracking-tight">Chrome, Edge and Brave</h2>
              <p className="muted text-[12.5px]">The extension in this repo — real request-level blocking.</p>
            </div>
          </div>
          <Badge tone="mint">recommended on desktop</Badge>
        </div>

        <ol className="mt-5 space-y-3">
          <Step n={1}>Download the repo, then open <code className="font-mono text-[12.5px]">chrome://extensions</code> and switch on <b>Developer mode</b>.</Step>
          <Step n={2}>Click <b>Load unpacked</b> and select the <code className="font-mono text-[12.5px]">extension/</code> folder.</Step>
          <Step n={3}>Open the extension popup and press <b>Import from Quitopia (.json)</b>.</Step>
          <Step n={4}>In the app: <Link href="/blocker" className="font-semibold text-forest-700 underline-offset-4 hover:underline dark:text-mint-300">Blocker → Export for the extension</Link>, then pick that file.</Step>
          <Step n={5}>In the extension&apos;s details page, turn on <b>Allow in incognito</b> so private windows are covered too.</Step>
        </ol>

        <div className="mt-5 rounded-2xl bg-cream-200/60 p-4 dark:bg-forest-800/60">
          <p className="text-[12.5px] leading-relaxed text-forest-900/70 dark:text-cream-100/70">
            This is the only setup that shows the full block screen with the 60-second pause.
            Everything below is enforced by the network and fails silently instead.
          </p>
        </div>
      </section>

      {/* Android DNS */}
      <section className="surface p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-mint-100 text-forest-700 dark:bg-mint-300/15 dark:text-mint-200">
              <Smartphone className="h-[18px] w-[18px]" strokeWidth={1.8} />
            </span>
            <div>
              <h2 className="text-[17px] font-bold tracking-tight">Android — Private DNS</h2>
              <p className="muted text-[12.5px]">Covers every browser and app on the phone, on Wi-Fi and mobile data.</p>
            </div>
          </div>
          <Badge tone="mint">30 seconds</Badge>
        </div>

        <ol className="mt-5 space-y-3">
          <Step n={1}>Settings → <b>Network &amp; internet</b> → <b>Private DNS</b>. (Samsung: Connections → More connection settings → Private DNS.)</Step>
          <Step n={2}>Choose <b>Private DNS provider hostname</b>.</Step>
          <Step n={3}>Paste one of the hostnames below and tap <b>Save</b>.</Step>
          <Step n={4}>Open a blocked site in any browser to confirm it fails to load.</Step>
        </ol>

        <div className="mt-5 space-y-2">
          {DNS_PROVIDERS.map((provider) => (
            <div key={provider.host}>
              <div className="mb-1.5 flex items-center gap-2">
                <p className="text-[13px] font-semibold">{provider.name}</p>
              </div>
              <CopyRow value={provider.host} />
              <p className="muted mt-1.5 text-[11.5px] leading-relaxed">{provider.note}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-2xl bg-cream-200/60 p-4 dark:bg-forest-800/60">
          <p className="text-[12.5px] leading-relaxed text-forest-900/70 dark:text-cream-100/70">
            A DNS filter fails silently — the page shows a network error instead of the Quitopia
            block screen. That is fine for most people, and it is the only way to cover apps as
            well as browsers.
          </p>
        </div>
      </section>

      {/* iOS + desktop */}
      <div className="grid gap-5 lg:grid-cols-2">
        <section className="surface p-6">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-mint-100 text-forest-700 dark:bg-mint-300/15 dark:text-mint-200">
              <MonitorSmartphone className="h-[18px] w-[18px]" strokeWidth={1.8} />
            </span>
            <div>
              <h2 className="text-[17px] font-bold tracking-tight">iPhone and iPad</h2>
              <p className="muted text-[12.5px]">A DNS profile, installed once.</p>
            </div>
          </div>
          <ol className="mt-4 space-y-3">
            <Step n={1}>Download the DNS profile from your chosen provider (CleanBrowsing and AdGuard both publish a <code className="font-mono text-[12px]">.mobileconfig</code> for their family filters).</Step>
            <Step n={2}>Open it, then Settings → <b>Profile Downloaded</b> → Install.</Step>
            <Step n={3}>Settings → General → VPN &amp; Device Management to confirm it is active.</Step>
          </ol>
        </section>

        <section className="surface p-6">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-mint-100 text-forest-700 dark:bg-mint-300/15 dark:text-mint-200">
              <Laptop className="h-[18px] w-[18px]" strokeWidth={1.8} />
            </span>
            <div>
              <h2 className="text-[17px] font-bold tracking-tight">Windows and macOS</h2>
              <p className="muted text-[12.5px]">Extension first, DNS as the backstop.</p>
            </div>
          </div>
          <ol className="mt-4 space-y-3">
            <Step n={1}>Install the extension in Chrome, Edge or Brave — that covers most browsing.</Step>
            <Step n={2}>For the rest of the system, set the DNS in your network settings to a family resolver, or point your router at one.</Step>
            <Step n={3}>Windows: Settings → Network → Wi-Fi → Hardware properties → DNS server assignment → Manual.</Step>
          </ol>
        </section>
      </div>

      {/* Router */}
      <section className="surface p-6">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-mint-100 text-forest-700 dark:bg-mint-300/15 dark:text-mint-200">
            <Router className="h-[18px] w-[18px]" strokeWidth={1.8} />
          </span>
          <div>
            <h2 className="text-[17px] font-bold tracking-tight">Router — the one that covers everything</h2>
            <p className="muted text-[12.5px]">One setting, every device in the house, including guests and TVs.</p>
          </div>
        </div>
        <ol className="mt-4 space-y-3">
          <Step n={1}>Open your router admin page (usually <code className="font-mono text-[12px]">192.168.1.1</code>) and find the DNS settings.</Step>
          <Step n={2}>Set the primary DNS to a family resolver IP: Cloudflare <code className="font-mono text-[12px]">1.1.1.3</code>, AdGuard <code className="font-mono text-[12px]">94.140.14.15</code>, or CleanBrowsing <code className="font-mono text-[12px]">185.228.168.168</code>.</Step>
          <Step n={3}>Save and reboot the router. Test on a device that has never seen the blocklist.</Step>
        </ol>
      </section>

      {/* Honest limits */}
      <section className="surface border-amber-300/60 bg-amber-50/70 p-6 dark:border-amber-500/25 dark:bg-amber-500/10">
        <h2 className="flex items-center gap-2 text-[17px] font-bold tracking-tight">
          <ShieldCheck className="h-4 w-4" /> What none of this stops
        </h2>
        <ul className="muted mt-3 space-y-2 text-[13px] leading-relaxed">
          <li>• Turning the setting off — Private DNS and extensions are one toggle away, which is what the in-app cooldown exists for.</li>
          <li>• A VPN or a browser with its own DNS resolver.</li>
          <li>• Mobile data if the phone&apos;s Private DNS is disabled (router DNS only covers your home network).</li>
          <li>• A second device or someone else&apos;s phone.</li>
        </ul>
        <p className="muted mt-3 text-[12.5px] leading-relaxed">
          Every blocker has these holes. The difference is whether the app tells you about them.
        </p>
      </section>

      <div className="flex flex-wrap gap-2 pb-4">
        <Link href="/blocker">
          <Button variant="outline" size="sm">Back to the blocker</Button>
        </Link>
        <Link href="/settings">
          <Button variant="ghost" size="sm">Settings</Button>
        </Link>
      </div>
    </div>
  );
}
