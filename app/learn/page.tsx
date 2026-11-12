'use client';

import { useMemo, useState } from 'react';
import { ArrowLeft, BookOpen, Clock } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge, Separator, Tabs } from '@/components/ui/controls';
import { ARTICLES } from '@/data/articles';
import { generatePlan } from '@/lib/plan';
import { useStore } from '@/lib/storage';
import { cn } from '@/lib/utils';

export default function LearnPage() {
  const profile = useStore((s) => s.profile);
  const [tab, setTab] = useState('library');
  const [openId, setOpenId] = useState<string | null>(null);

  const plan = useMemo(() => (profile ? generatePlan(profile) : []), [profile]);
  const open = ARTICLES.find((a) => a.id === openId);

  if (open) {
    return (
      <div className="mx-auto max-w-2xl space-y-5">
        <Button variant="ghost" onClick={() => setOpenId(null)}>
          <ArrowLeft className="h-4 w-4" /> Back to library
        </Button>
        <div>
          <Badge tone="cream">{open.category}</Badge>
          <h1 className="mt-3 font-display text-3xl font-semibold">{open.title}</h1>
          <p className="muted mt-1 flex items-center gap-1.5 text-sm">
            <Clock className="h-3.5 w-3.5" /> {open.minutes} min read
          </p>
        </div>
        <Separator />
        <div className="space-y-4">
          {open.body.map((paragraph, i) => (
            <p key={i} className="text-[15px] leading-relaxed text-forest-900/85 dark:text-cream/85">
              {paragraph}
            </p>
          ))}
        </div>
        <div className="rounded-2xl bg-mint/30 p-4 text-sm dark:bg-forest-700">
          <p className="font-medium">One thing to do now</p>
          <p className="muted mt-1 text-xs leading-relaxed">
            Pick the single sentence from this piece that felt true, and put it in your journal.
            Reading changes nothing; writing it down changes a little.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Learn"
        subtitle="Six short pieces. No video, no course upsell, no account — they work offline."
      />

      <Tabs
        tabs={[
          { id: 'library', label: 'Library' },
          { id: 'plan', label: 'Your 7-day plan' }
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === 'library' ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {ARTICLES.map((article) => (
            <button
              key={article.id}
              type="button"
              onClick={() => setOpenId(article.id)}
              className={cn('surface p-5 text-left transition-transform hover:-translate-y-0.5')}
            >
              <div className="flex items-center justify-between">
                <Badge tone="outline">{article.category}</Badge>
                <span className="muted flex items-center gap-1 text-xs">
                  <Clock className="h-3 w-3" /> {article.minutes} min
                </span>
              </div>
              <h3 className="mt-3 font-display text-base font-semibold leading-snug">
                {article.title}
              </h3>
              <p className="muted mt-1.5 text-sm leading-relaxed">{article.summary}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-forest-600 dark:text-mint">
                Read <BookOpen className="h-3 w-3" />
              </span>
            </button>
          ))}
        </div>
      ) : null}

      {tab === 'plan' ? (
        <div className="space-y-3">
          <Card>
            <CardHeader>
              <CardTitle>Built from your answers</CardTitle>
              <CardDescription>
                Seven days, one action each. Rebuilt whenever you change your profile.
              </CardDescription>
            </CardHeader>
          </Card>
          {plan.map((day) => (
            <Card key={day.day}>
              <CardContent className="flex gap-4 pt-5">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-forest-700 text-xs font-semibold text-cream dark:bg-mint dark:text-forest-900">
                  {day.day}
                </span>
                <div>
                  <p className="font-medium">{day.title}</p>
                  <p className="muted mt-1 text-sm leading-relaxed">{day.task}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}
    </div>
  );
}
