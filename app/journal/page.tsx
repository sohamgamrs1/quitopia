'use client';

import { useState } from 'react';
import { Lightbulb, PenLine, Plus, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge, Tabs } from '@/components/ui/controls';
import { Input, Label, Textarea } from '@/components/ui/input';
import { analyse } from '@/lib/insights';
import { useStore } from '@/lib/storage';
import { formatDate, formatTime } from '@/lib/utils';

const PROMPTS = [
  'What was happening right before the urge?',
  'What were you actually feeling — bored, lonely, stressed, tired?',
  'What did you want the habit to give you?',
  'What would you tell a friend in exactly this situation?',
  'What is one thing you did today that you are not proud of, and one that you are?'
];

const EMOTIONS = ['Bored', 'Stressed', 'Lonely', 'Tired', 'Angry', 'Anxious', 'Fine'];

export default function JournalPage() {
  const store = useStore();
  const { journal, triggers, checkins } = store;

  const [tab, setTab] = useState('write');
  const [prompt, setPrompt] = useState(PROMPTS[0]);
  const [text, setText] = useState('');

  const [place, setPlace] = useState('');
  const [emotion, setEmotion] = useState(EMOTIONS[0]);
  const [device, setDevice] = useState('Phone');
  const [before, setBefore] = useState('');

  const insight = analyse(triggers, checkins);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Journal"
        subtitle="Write it down, log the trigger, and let the app show you the pattern you cannot see yourself."
      />

      <Tabs
        tabs={[
          { id: 'write', label: 'Write' },
          { id: 'triggers', label: 'Triggers' },
          { id: 'insight', label: 'Insight' }
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === 'write' ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Today&apos;s entry</CardTitle>
              <CardDescription>Pick a prompt or ignore it and write whatever is true.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="prompt">Prompt</Label>
                <select
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="h-11 w-full rounded-xl border border-forest-900/15 bg-white px-3 text-sm dark:border-cream/15 dark:bg-forest-800"
                >
                  {PROMPTS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="entry">Your entry</Label>
                <Textarea
                  id="entry"
                  rows={6}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="No structure needed. One honest paragraph is enough."
                  maxLength={2000}
                />
              </div>
              <Button
                className="w-full"
                disabled={text.trim().length === 0}
                onClick={() => {
                  store.addJournal(prompt, text.trim());
                  store.addXp(15);
                  setText('');
                }}
              >
                <PenLine className="h-4 w-4" /> Save entry (+15 XP)
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Previous entries</CardTitle>
              <CardDescription>{journal.length} saved, on this device only.</CardDescription>
            </CardHeader>
            <CardContent>
              {journal.length === 0 ? (
                <p className="muted text-sm">Nothing yet. The first entry is the hardest.</p>
              ) : (
                <ul className="space-y-3">
                  {journal.slice(0, 12).map((entry) => (
                    <li key={entry.id} className="rounded-xl border border-forest-900/10 p-3 dark:border-cream/10">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-medium text-forest-900/60 dark:text-cream/60">
                          {formatDate(entry.at)} · {formatTime(entry.at)}
                        </p>
                        <button
                          onClick={() => store.removeJournal(entry.id)}
                          aria-label="Delete entry"
                          className="text-forest-900/30 hover:text-red-600 dark:text-cream/30"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="mt-1 text-xs italic text-forest-900/50 dark:text-cream/50">
                        {entry.prompt}
                      </p>
                      <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed">{entry.text}</p>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      ) : null}

      {tab === 'triggers' ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Log a trigger</CardTitle>
              <CardDescription>Thirty seconds, right after it happens.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="place">Where</Label>
                  <Input
                    id="place"
                    value={place}
                    onChange={(e) => setPlace(e.target.value)}
                    placeholder="Bedroom"
                  />
                </div>
                <div>
                  <Label htmlFor="device">Device</Label>
                  <select
                    id="device"
                    value={device}
                    onChange={(e) => setDevice(e.target.value)}
                    className="h-11 w-full rounded-xl border border-forest-900/15 bg-white px-3 text-sm dark:border-cream/15 dark:bg-forest-800"
                  >
                    {['Phone', 'Laptop', 'Tablet', 'TV'].map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <Label>Emotion</Label>
                <div className="flex flex-wrap gap-2">
                  {EMOTIONS.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setEmotion(item)}
                      className={
                        emotion === item
                          ? 'rounded-full bg-forest-600 px-3 py-1.5 text-xs font-medium text-cream dark:bg-mint dark:text-forest-900'
                          : 'rounded-full border border-forest-900/15 px-3 py-1.5 text-xs dark:border-cream/15'
                      }
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="before">What happened right before</Label>
                <Textarea
                  id="before"
                  rows={3}
                  value={before}
                  onChange={(e) => setBefore(e.target.value)}
                  placeholder="Argued with my brother, went to my room, picked up the phone."
                  maxLength={300}
                />
              </div>

              <Button
                className="w-full"
                disabled={before.trim().length === 0}
                onClick={() => {
                  store.addTrigger({ place: place.trim() || 'Unknown', emotion, device, before: before.trim() });
                  setBefore('');
                  setPlace('');
                }}
              >
                <Plus className="h-4 w-4" /> Save trigger
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Logged triggers</CardTitle>
              <CardDescription>{triggers.length} entries</CardDescription>
            </CardHeader>
            <CardContent>
              {triggers.length === 0 ? (
                <p className="muted text-sm">Nothing logged yet.</p>
              ) : (
                <ul className="space-y-2">
                  {triggers.slice(0, 15).map((t) => (
                    <li
                      key={t.id}
                      className="flex items-start justify-between gap-3 rounded-xl border border-forest-900/10 p-3 text-sm dark:border-cream/10"
                    >
                      <div>
                        <p className="font-medium">
                          {t.emotion} · {t.place} · {t.device}
                        </p>
                        <p className="muted mt-0.5 text-xs">{t.before}</p>
                        <p className="muted mt-1 text-[11px]">
                          {formatDate(t.at)} {formatTime(t.at)}
                        </p>
                      </div>
                      <button
                        onClick={() => store.removeTrigger(t.id)}
                        aria-label="Delete trigger"
                        className="text-forest-900/30 hover:text-red-600 dark:text-cream/30"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      ) : null}

      {tab === 'insight' ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" /> What your data says
            </CardTitle>
            <CardDescription>Calculated from {insight.sampleSize} local entries.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-display text-lg font-semibold">{insight.headline}</h3>
              <p className="muted mt-1 text-sm leading-relaxed">{insight.detail}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { label: 'Riskiest window', value: insight.riskiestHour ?? '—' },
                { label: 'Hardest day', value: insight.riskiestDay ?? '—' },
                { label: 'Top emotion', value: insight.topEmotion ?? '—' }
              ].map((item) => (
                <div key={item.label} className="rounded-xl bg-forest-900/5 p-3 dark:bg-cream/5">
                  <p className="text-[11px] uppercase tracking-wide text-forest-900/50 dark:text-cream/50">
                    {item.label}
                  </p>
                  <p className="mt-1 text-sm font-semibold">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="rounded-xl bg-mint/30 p-4 text-sm dark:bg-forest-700">
              <p className="font-medium">What to do with this</p>
              <p className="muted mt-1 text-xs leading-relaxed">
                Set your Focus Hours around {insight.riskiestHour ?? 'your riskiest window'}, and put
                one block rule on the site that catches you then. One change a week is enough.
              </p>
            </div>
            <Badge tone="outline">Everything here stays in this browser</Badge>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
                  }
