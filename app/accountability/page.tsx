'use client';

import { useMemo, useState } from 'react';
import { Check, Copy, Mail, MessageCircle, Users } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input, Label } from '@/components/ui/input';
import { StatCard } from '@/components/stat-card';
import { currentStreakDays, totalCleanDays, useStore } from '@/lib/storage';
import { formatDate } from '@/lib/utils';

export default function AccountabilityPage() {
  const store = useStore();
  const { settings, checkins, slips, game, profile } = store;

  const [name, setName] = useState(settings.partnerName);
  const [contact, setContact] = useState(settings.partnerContact);
  const [copied, setCopied] = useState(false);

  const streak = currentStreakDays(store);
  const cleanDays = totalCleanDays(store);
  const week = checkins.slice(-7);

  const report = useMemo(() => {
    const lines = [
      `Quitopia weekly summary — ${formatDate(new Date())}`,
      '',
      `Name: ${profile?.name || 'Anonymous'}`,
      `Current streak: ${streak} day${streak === 1 ? '' : 's'}`,
      `Clean days total: ${cleanDays}`,
      `Urges defeated: ${game.urgesDefeated}`,
      `Slips logged: ${slips.length}`,
      `Check-ins this week: ${week.length}`,
      '',
      week.length
        ? `Average urge this week: ${(
            week.reduce((sum, c) => sum + c.urge, 0) / week.length
          ).toFixed(1)}/10`
        : 'No check-ins this week yet.',
      '',
      'Sent from Quitopia. No browsing data is included — this is generated on my device.'
    ];
    return lines.join('\n');
  }, [streak, cleanDays, game.urgesDefeated, slips.length, week, profile]);

  const save = () => store.setPartner(name.trim(), contact.trim());

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(report);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard may be blocked; the textarea is still selectable */
    }
  };

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(report)}`;
  const mailHref = `mailto:${encodeURIComponent(contact)}?subject=${encodeURIComponent(
    'My Quitopia weekly summary'
  )}&body=${encodeURIComponent(report)}`;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Accountability"
        subtitle="One person who knows changes the odds more than any feature in this app. There is no sync — you share the report yourself."
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Streak" value={`${streak}d`} />
        <StatCard label="Clean days" value={String(cleanDays)} />
        <StatCard label="Urges beaten" value={String(game.urgesDefeated)} />
        <StatCard label="Slips" value={String(slips.length)} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-4 w-4" /> Your partner
          </CardTitle>
          <CardDescription>
            Stored on this device only. Quitopia never contacts them — you do.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="partner-name">Their name</Label>
              <Input
                id="partner-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Riya"
                maxLength={40}
              />
            </div>
            <div>
              <Label htmlFor="partner-contact">Email or phone</Label>
              <Input
                id="partner-contact"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="riya@example.com"
                maxLength={80}
              />
            </div>
          </div>
          <Button onClick={save} disabled={name.trim().length === 0}>
            Save partner
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>This week&apos;s report</CardTitle>
          <CardDescription>Generated locally. Edit it before you send if you want.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <textarea
            readOnly
            value={report}
            rows={11}
            className="w-full rounded-xl border border-forest-900/15 bg-white p-4 font-mono text-xs leading-relaxed dark:border-cream/15 dark:bg-forest-800"
          />
          <div className="flex flex-wrap gap-2">
            <Button onClick={copy}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied' : 'Copy'}
            </Button>
            <a href={whatsappHref} target="_blank" rel="noreferrer">
              <Button variant="outline">
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </Button>
            </a>
            <a href={mailHref}>
              <Button variant="outline">
                <Mail className="h-4 w-4" /> Email
              </Button>
            </a>
          </div>
          <p className="muted text-xs">
            The report contains streaks, counts and averages. It never includes the sites you visited
            or anything you wrote in the journal.
          </p>
        </CardContent>
      </Card>
    </div>
  );
            }
