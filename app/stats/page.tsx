'use client';

import { useState } from 'react';
import { Download, Printer, Wallet } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { CleanVsSlipChart, MoodAreaChart, UrgeTrendChart, WeeklyUrgeBars } from '@/components/charts';
import { BadgeCard } from '@/components/badge-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input, Label } from '@/components/ui/input';
import { StatCard } from '@/components/stat-card';
import { ADDICTIONS } from '@/lib/addictions';
import { levelFor } from '@/lib/gamification';
import { dailySpendTotal, totalCleanDays, useStore } from '@/lib/storage';
import { formatCurrency, formatDuration, dayKey } from '@/lib/utils';

export default function StatsPage() {
  const store = useStore();
  const { profile, checkins, slips, game, settings } = store;
  const [tab, setTab] = useState<'charts' | 'money'>('charts');

  const cleanDays = totalCleanDays(store);
  const spend = dailySpendTotal(store);
  const level = levelFor(game.xp);

  const exportJson = () => {
    const data = {
      profile,
      checkins,
      slips,
      journal: store.journal,
      triggers: store.triggers,
      game,
      settings,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quitopia-${dayKey()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Stats"
        subtitle="Every number here is computed from your own local data. Nothing is estimated by a server."
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              <Printer className="h-4 w-4" /> PDF
            </Button>
            <Button variant="outline" size="sm" onClick={exportJson}>
              <Download className="h-4 w-4" /> JSON
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Clean days" value={String(cleanDays)} />
        <StatCard label="Urges defeated" value={String(game.urgesDefeated)} />
        <StatCard label="XP" value={String(game.xp)} hint={level.name} />
        <StatCard label="Slips logged" value={String(slips.length)} />
      </div>

      <div className="flex gap-2">
        <Button variant={tab === 'charts' ? 'default' : 'outline'} size="sm" onClick={() => setTab('charts')}>
          Charts
        </Button>
        <Button variant={tab === 'money' ? 'default' : 'outline'} size="sm" onClick={() => setTab('money')}>
          Money saved
        </Button>
      </div>

      {tab === 'charts' ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Urge intensity over time</CardTitle>
              <CardDescription>Last 21 check-ins. Lower is easier.</CardDescription>
            </CardHeader>
            <CardContent>
              <UrgeTrendChart checkins={checkins} />
            </CardContent>
          </Card>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Clean vs slip days</CardTitle>
                <CardDescription>All time.</CardDescription>
              </CardHeader>
              <CardContent>
                <CleanVsSlipChart checkins={checkins} slips={slips} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Which days are hardest</CardTitle>
                <CardDescription>Average urge by weekday.</CardDescription>
              </CardHeader>
              <CardContent>
                <WeeklyUrgeBars checkins={checkins} />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Mood</CardTitle>
              <CardDescription>Last 30 check-ins.</CardDescription>
            </CardHeader>
            <CardContent>
              <MoodAreaChart checkins={checkins} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Badges</CardTitle>
              <CardDescription>{game.badges.length} of 9 earned.</CardDescription>
            </CardHeader>
            <CardContent>
              <BadgeCard earnedIds={game.badges} />
            </CardContent>
          </Card>
        </>
      ) : null}

      {tab === 'money' ? (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-4 w-4" /> What this habit was costing
              </CardTitle>
              <CardDescription>
                Set a rough daily spend per habit. It is only used for this calculation and stays on
                this device.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {(profile?.addictions ?? []).map((id) => {
                const def = ADDICTIONS.find((a) => a.id === id);
                return (
                  <div key={id} className="flex items-center justify-between gap-3">
                    <Label htmlFor={`spend-${id}`} className="mb-0 flex-1">
                      {def?.label ?? id}
                    </Label>
                    <Input
                      id={`spend-${id}`}
                      type="number"
                      min={0}
                      className="w-32"
                      value={settings.dailySpend[id] ?? def?.defaultDailySpend ?? 0}
                      onChange={(e) => store.setSpend(id, Number(e.target.value))}
                    />
                  </div>
                );
              })}
              {(profile?.addictions.length ?? 0) === 0 ? (
                <p className="muted text-sm">Add an addiction in Settings to use this calculator.</p>
              ) : null}
            </CardContent>
          </Card>

          <div className="grid gap-3 sm:grid-cols-3">
            <StatCard label="Per day" value={formatCurrency(spend)} />
            <StatCard label="Saved so far" value={formatCurrency(spend * cleanDays)} tone="mint" />
            <StatCard label="Saved per year" value={formatCurrency(spend * 365)} />
          </div>

          <Card>
            <CardContent className="pt-5 text-sm">
              <p className="muted leading-relaxed">
                Time reclaimed:{' '}
                <span className="font-semibold text-forest-900 dark:text-cream">
                  {formatDuration(
                    (profile?.addictions.reduce((sum, id) => {
                      const def = ADDICTIONS.find((a) => a.id === id);
                      return sum + (def?.defaultMinutesPerDay ?? 0);
                    }, 0) ?? 0) * cleanDays
                  )}
                </span>{' '}
                across {cleanDays} clean days.
              </p>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
