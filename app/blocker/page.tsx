'use client';

import { useEffect, useState } from 'react';
import { Globe, KeyRound, Lock, Plus, Search, Shield, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { BlockScreen } from '@/components/block-screen';
import { Pomodoro } from '@/components/pomodoro';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge, Separator, Switch, Tabs } from '@/components/ui/controls';
import { Input, Label } from '@/components/ui/input';
import { BLOCKLISTS, evaluate, normaliseHost } from '@/lib/blocklists';
import { currentStreakDays, isHardLocked, useStore } from '@/lib/storage';
import { cn, dayKey } from '@/lib/utils';

const LOCK_OPTIONS = [
  { label: '1 hour', ms: 3_600_000 },
  { label: '6 hours', ms: 21_600_000 },
  { label: '24 hours', ms: 86_400_000 },
  { label: '7 days', ms: 604_800_000 },
  { label: '30 days', ms: 2_592_000_000 },
  { label: '90 days', ms: 7_776_000_000 }
];

export default function BlockerPage() {
  const store = useStore();
  const { blocker, profile } = store;

  const [ruleType, setRuleType] = useState<'url' | 'keyword' | 'app'>('url');
  const [ruleValue, setRuleValue] = useState('');
  const [testValue, setTestValue] = useState('');
  const [testResult, setTestResult] = useState<{ host: string; reason?: string } | null>(null);
  const [allowValue, setAllowValue] = useState('');
  const [pin, setPin] = useState('');
  const [tick, setTick] = useState(0);

  const locked = isHardLocked(blocker.hardLock);
  const streak = currentStreakDays(store);

  useEffect(() => {
    if (!locked) return;
    const id = window.setInterval(() => setTick((t) => t + 1), 1000);
    return () => window.clearInterval(id);
  }, [locked]);

  const lockRemaining = () => {
    if (blocker.hardLock.mode === 'pin') return 'until you enter your PIN';
    if (!blocker.hardLock.until) return '';
    const ms = blocker.hardLock.until - Date.now();
    if (ms <= 0) return 'expired';
    const h = Math.floor(ms / 3_600_000);
    const m = Math.floor((ms % 3_600_000) / 60_000);
    return h > 0 ? `${h}h ${m}m left` : `${m}m left`;
  };

  const runTest = () => {
    if (!testValue.trim()) return;
    const result = evaluate(testValue, {
      mode: blocker.mode,
      customRules: blocker.rules,
      allowlist: blocker.allowlist,
      schedule: blocker.schedule
    });
    if (result.blocked) {
      setTestResult({ host: normaliseHost(testValue), reason: result.reason });
    } else {
      setTestResult(null);
      store.addXp(1);
      alert(`${normaliseHost(testValue)} is not blocked by your current rules.`);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Blocker"
        subtitle="Rules that run in this app and in the bundled Chrome extension. Nothing is sent anywhere."
        action={
          <Badge tone={locked ? 'danger' : 'mint'}>
            {locked ? <Lock className="h-3 w-3" /> : <Shield className="h-3 w-3" />}
            {locked ? 'Locked' : 'Editable'}
          </Badge>
        }
      />

      {locked ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100">
          <p className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Settings are locked {lockRemaining()}. This is the point — decide once, not at midnight.
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              if (blocker.hardLock.mode === 'pin') {
                if (pin === store.settings.pin) {
                  store.endHardLock();
                  setPin('');
                } else {
                  alert('Wrong PIN.');
                }
              } else {
                alert('A time lock cannot be ended early. That is what makes it work.');
              }
            }}
          >
            {blocker.hardLock.mode === 'pin' ? 'Unlock with PIN' : 'Ended early?'}
          </Button>
        </div>
      ) : null}

      <div className={cn('space-y-6', locked && 'pointer-events-none opacity-60')}>
        <Card>
          <CardHeader>
            <CardTitle>Mode</CardTitle>
            <CardDescription>How the rules decide what to block.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs
              tabs={[
                { id: 'blocklist', label: 'Blocklist' },
                { id: 'allowlist', label: 'Allowlist' },
                { id: 'schedule', label: 'Focus hours' }
              ]}
              value={blocker.mode}
              onChange={(id) => store.setBlocker({ mode: id as typeof blocker.mode })}
            />
            <p className="muted text-sm">
              {blocker.mode === 'blocklist'
                ? 'Everything in your blocklists and custom rules is blocked. The rest of the internet stays open.'
                : blocker.mode === 'allowlist'
                  ? 'Everything is blocked except the sites on your allowlist. Strict, and effective.'
                  : 'Nothing is blocked except during your focus window — useful for late-night only.'}
            </p>

            {blocker.mode === 'schedule' ? (
              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <Label htmlFor="start">From</Label>
                  <Input
                    id="start"
                    type="time"
                    value={blocker.schedule.start}
                    onChange={(e) =>
                      store.setBlocker({ schedule: { ...blocker.schedule, start: e.target.value } })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="end">To</Label>
                  <Input
                    id="end"
                    type="time"
                    value={blocker.schedule.end}
                    onChange={(e) =>
                      store.setBlocker({ schedule: { ...blocker.schedule, end: e.target.value } })
                    }
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex h-11 w-full items-center justify-between rounded-xl border border-forest-900/15 px-4 text-sm dark:border-cream/15">
                    Enabled
                    <Switch
                      checked={blocker.schedule.enabled}
                      onCheckedChange={(v) =>
                        store.setBlocker({ schedule: { ...blocker.schedule, enabled: v } })
                      }
                      label="Focus hours enabled"
                    />
                  </label>
                </div>
              </div>
            ) : null}

            {blocker.mode === 'allowlist' ? (
              <div>
                <Label htmlFor="allow">Allow a site</Label>
                <div className="flex gap-2">
                  <Input
                    id="allow"
                    value={allowValue}
                    onChange={(e) => setAllowValue(e.target.value)}
                    placeholder="wikipedia.org"
                  />
                  <Button
                    onClick={() => {
                      if (!allowValue.trim()) return;
                      store.addAllowlist(normaliseHost(allowValue));
                      setAllowValue('');
                    }}
                  >
                    Add
                  </Button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {blocker.allowlist.map((host) => (
                    <button
                      key={host}
                      onClick={() => store.removeAllowlist(host)}
                      className="pill border border-forest-900/15 hover:border-red-400 hover:text-red-600 dark:border-cream/15"
                    >
                      {host} ×
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Safe search</CardTitle>
              <CardDescription>Applied by the extension at request time.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="flex items-center justify-between text-sm">
                Force safe search on Google, Bing, DuckDuckGo
                <Switch
                  checked={blocker.safeSearch}
                  onCheckedChange={(v) => store.setBlocker({ safeSearch: v })}
                  label="Safe search"
                />
              </label>
              <Separator />
              <label className="flex items-center justify-between text-sm">
                YouTube Restricted Mode
                <Switch
                  checked={blocker.youtubeRestricted}
                  onCheckedChange={(v) => store.setBlocker({ youtubeRestricted: v })}
                  label="YouTube restricted"
                />
              </label>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hard lock</CardTitle>
              <CardDescription>
                {locked
                  ? `Locked ${lockRemaining()}`
                  : 'Make the rules impossible to edit for a set time.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {LOCK_OPTIONS.map((option) => (
                  <Button
                    key={option.label}
                    variant="outline"
                    size="sm"
                    disabled={locked}
                    onClick={() =>
                      store.startHardLock('time', Date.now() + option.ms, null)
                    }
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
              <Separator />
              <div className="flex items-center gap-2">
                <Input
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  placeholder="4-digit PIN"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                />
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={locked || pin.length !== 4}
                  onClick={() => {
                    store.setPin(pin);
                    store.startHardLock('pin', null, pin);
                    setPin('');
                  }}
                >
                  <KeyRound className="h-4 w-4" /> Lock
                </Button>
              </div>
              {locked ? (
                <Button variant="outline" size="sm" className="w-full" onClick={() => store.endHardLock()}>
                  Force unlock (demo)
                </Button>
              ) : null}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your own rules</CardTitle>
            <CardDescription>URLs, keywords and apps. These beat the presets.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row">
              <Tabs
                tabs={[
                  { id: 'url', label: 'URL' },
                  { id: 'keyword', label: 'Keyword' },
                  { id: 'app', label: 'App' }
                ]}
                value={ruleType}
                onChange={(id) => setRuleType(id as typeof ruleType)}
              />
              <div className="flex flex-1 gap-2">
                <Input
                  value={ruleValue}
                  onChange={(e) => setRuleValue(e.target.value)}
                  placeholder={
                    ruleType === 'url' ? 'example.com' : ruleType === 'keyword' ? 'reels' : 'Instagram'
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && ruleValue.trim()) {
                      store.addRule(ruleType, ruleValue);
                      setRuleValue('');
                    }
                  }}
                />
                <Button
                  onClick={() => {
                    if (!ruleValue.trim()) return;
                    store.addRule(ruleType, ruleValue);
                    setRuleValue('');
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {blocker.rules.length === 0 ? (
              <p className="muted text-sm">No custom rules yet. The presets are doing the work.</p>
            ) : (
              <ul className="divide-y divide-forest-900/10 dark:divide-cream/10">
                {blocker.rules.map((rule) => (
                  <li key={rule.id} className="flex items-center justify-between py-2.5 text-sm">
                    <span className="flex items-center gap-2">
                      <Badge tone="outline">{rule.type}</Badge>
                      {rule.value}
                    </span>
                    <button
                      onClick={() => store.removeRule(rule.id)}
                      aria-label={`Remove ${rule.value}`}
                      className="text-forest-900/40 hover:text-red-600 dark:text-cream/40"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-4 lg:grid-cols-2">
          {BLOCKLISTS.map((list) => (
            <Card key={list.id}>
              <CardHeader className="flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-4 w-4" /> {list.label}
                  </CardTitle>
                  <CardDescription>{list.description}</CardDescription>
                </div>
                <Badge tone="mint">{list.domains.length}</Badge>
              </CardHeader>
              <CardContent>
                <p className="muted line-clamp-2 text-xs">{list.domains.slice(0, 8).join(' · ')}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Test a site</CardTitle>
          <CardDescription>
            Check how the rules treat a URL right now — no network request is made.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              value={testValue}
              onChange={(e) => setTestValue(e.target.value)}
              placeholder="pornhub.com or instagram.com/reels"
              onKeyDown={(e) => {
                if (e.key === 'Enter') runTest();
              }}
            />
            <Button onClick={runTest}>
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Pomodoro onComplete={() => store.addXp(20)} />

      <BlockScreen
        open={testResult !== null}
        host={testResult?.host ?? ''}
        streakDays={streak}
        reason={testResult?.reason}
        onLeave={() => setTestResult(null)}
      />

      <p className="muted pb-2 text-center text-xs">
        Demo evaluation runs locally on {dayKey()}. The extension applies the same rules to real
        browsing.
      </p>
    </div>
  );
              }
