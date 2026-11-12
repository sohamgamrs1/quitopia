'use client';

import { useRef, useState } from 'react';
import { Download, Moon, RotateCcw, Sun, Upload, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator, Switch } from '@/components/ui/controls';
import { Input, Label } from '@/components/ui/input';
import { ADDICTIONS, TRIGGERS } from '@/lib/addictions';
import { AddictionIcon } from '@/components/icons';
import { useStore } from '@/lib/storage';
import { cn, dayKey } from '@/lib/utils';

export default function SettingsPage() {
  const store = useStore();
  const { profile, settings } = store;

  const [name, setName] = useState(profile?.name ?? '');
  const [reason, setReason] = useState(profile?.reason ?? '');
  const [pin, setPin] = useState(settings.pin ?? '');
  const [message, setMessage] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const toggleAddiction = (id: string) => {
    if (!profile) return;
    const next = profile.addictions.includes(id)
      ? profile.addictions.filter((a) => a !== id)
      : [...profile.addictions, id];
    store.updateProfile({ addictions: next.length ? next : profile.addictions });
  };

  const toggleTrigger = (id: string) => {
    if (!profile) return;
    const next = profile.triggers.includes(id)
      ? profile.triggers.filter((t) => t !== id)
      : [...profile.triggers, id];
    store.updateProfile({ triggers: next });
  };

  const exportData = () => {
    const data = {
      profile,
      checkins: store.checkins,
      slips: store.slips,
      journal: store.journal,
      triggers: store.triggers,
      posts: store.posts,
      blocker: store.blocker,
      game: store.game,
      settings: store.settings,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quitopia-backup-${dayKey()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMessage('Backup downloaded.');
  };

  const importData = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const ok = store.importData(String(reader.result));
      setMessage(ok ? 'Data imported.' : 'That file could not be read.');
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        subtitle="Everything here is stored in this browser. Clearing site data erases it — export a backup if it matters."
      />

      {message ? (
        <div className="rounded-xl bg-mint/40 px-4 py-3 text-sm dark:bg-forest-700">{message}</div>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Used for greetings and your plan. Nothing is uploaded.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                maxLength={40}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => name.trim() && store.updateProfile({ name: name.trim() })}
              />
            </div>
            <div>
              <Label htmlFor="start">Start date</Label>
              <Input
                id="start"
                type="date"
                value={profile?.startDate ?? dayKey()}
                onChange={(e) => store.updateProfile({ startDate: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="reason">Your reason</Label>
            <textarea
              id="reason"
              rows={2}
              maxLength={300}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              onBlur={() => store.updateProfile({ reason: reason.trim() })}
              className="w-full rounded-xl border border-forest-900/15 bg-white p-3 text-sm dark:border-cream/15 dark:bg-forest-800"
            />
          </div>

          <div>
            <Label>Addictions</Label>
            <div className="flex flex-wrap gap-2">
              {ADDICTIONS.map((item) => {
                const active = profile?.addictions.includes(item.id) ?? false;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleAddiction(item.id)}
                    className={cn(
                      'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                      active
                        ? 'border-forest-600 bg-mint text-forest-900 dark:border-mint dark:bg-forest-600 dark:text-cream'
                        : 'border-forest-900/15 dark:border-cream/15'
                    )}
                  >
                    <AddictionIcon id={item.id} className="mr-1.5 inline h-3.5 w-3.5" /> {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <Label>Triggers</Label>
            <div className="flex flex-wrap gap-2">
              {TRIGGERS.map((item) => {
                const active = profile?.triggers.includes(item.id) ?? false;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleTrigger(item.id)}
                    className={cn(
                      'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                      active
                        ? 'border-forest-600 bg-mint text-forest-900 dark:border-mint dark:bg-forest-600 dark:text-cream'
                        : 'border-forest-900/15 dark:border-cream/15'
                    )}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Appearance & notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Theme</p>
              <p className="muted text-xs">Calm in both modes.</p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={settings.theme === 'light' ? 'default' : 'outline'}
                onClick={() => store.setTheme('light')}
              >
                <Sun className="h-4 w-4" /> Light
              </Button>
              <Button
                size="sm"
                variant={settings.theme === 'dark' ? 'default' : 'outline'}
                onClick={() => store.setTheme('dark')}
              >
                <Moon className="h-4 w-4" /> Dark
              </Button>
            </div>
          </div>
          <Separator />
          <label className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Reminders</p>
              <p className="muted text-xs">
                Local only. No push server exists — this just controls in-app nudges.
              </p>
            </div>
            <Switch
              checked={settings.notifications}
              onCheckedChange={store.setNotifications}
              label="Reminders"
            />
          </label>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>App lock</CardTitle>
          <CardDescription>A four-digit PIN to open Quitopia on this device.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-end gap-3">
          <div className="w-40">
            <Label htmlFor="pin">PIN</Label>
            <Input
              id="pin"
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              placeholder="••••"
            />
          </div>
          <Button
            onClick={() => {
              store.setPin(pin.length === 4 ? pin : null);
              setMessage(pin.length === 4 ? 'PIN saved.' : 'PIN removed.');
            }}
          >
            {pin.length === 4 ? 'Save PIN' : 'Remove PIN'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your data</CardTitle>
          <CardDescription>Export, import, or erase everything.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={exportData}>
              <Download className="h-4 w-4" /> Export JSON
            </Button>
            <Button variant="outline" onClick={() => fileRef.current?.click()}>
              <Upload className="h-4 w-4" /> Import JSON
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) importData(file);
                e.target.value = '';
              }}
            />
          </div>
          <Separator />
          <div>
            <p className="text-sm font-medium text-red-600 dark:text-red-300">Danger zone</p>
            <p className="muted mt-1 text-xs">
              Deletes your profile, streak, journal, rules and posts from this browser. It cannot be
              undone.
            </p>
            <Button
              variant="danger"
              className="mt-3"
              onClick={() => {
                if (window.confirm('Erase everything on this device? This cannot be undone.')) {
                  store.resetAll();
                  setMessage('Everything erased.');
                }
              }}
            >
              <Trash2 className="h-4 w-4" /> Reset all data
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center justify-between pt-5 text-xs">
          <span className="muted">Quitopia v1.0 · local-only build</span>
          <span className="muted flex items-center gap-1">
            <RotateCcw className="h-3 w-3" /> No server, no account
          </span>
        </CardContent>
      </Card>
    </div>
  );
}
