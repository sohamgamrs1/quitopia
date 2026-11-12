'use client';

import { useState } from 'react';
import { Flag, Heart, Send, ShieldOff } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge, Tabs } from '@/components/ui/controls';
import { Textarea } from '@/components/ui/input';
import { useStore } from '@/lib/storage';
import { formatDate } from '@/lib/utils';

const SEED = [
  {
    id: 'seed-1',
    category: 'porn',
    author: 'Anonymous',
    text: 'Day 41. The thing nobody tells you is that the first two weeks are the whole fight. After that it is mostly just… quieter. I still get urges but they are 20 seconds now, not two hours.',
    at: new Date(Date.now() - 2 * 86_400_000).toISOString(),
    likes: 34
  },
  {
    id: 'seed-2',
    category: 'social',
    author: 'Anonymous',
    text: 'Deleted Instagram from my phone and kept the web login for work. Turns out I was not addicted to Instagram, I was addicted to having something to do with my hands.',
    at: new Date(Date.now() - 4 * 86_400_000).toISOString(),
    likes: 21
  },
  {
    id: 'seed-3',
    category: 'gambling',
    author: 'Anonymous',
    text: 'The hardest part was not the betting. It was telling my wife how much I had lost. Six months on, the money is still a problem but the lying has stopped, and that is what changed everything.',
    at: new Date(Date.now() - 7 * 86_400_000).toISOString(),
    likes: 58
  },
  {
    id: 'seed-4',
    category: 'smoking',
    author: 'Anonymous',
    text: 'Third attempt. The first two failed because I kept a pack "just in case". This time there is nothing in the house and it is boring and awful and it is working.',
    at: new Date(Date.now() - 9 * 86_400_000).toISOString(),
    likes: 17
  }
];

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'porn', label: 'Porn' },
  { id: 'social', label: 'Social' },
  { id: 'gambling', label: 'Gambling' },
  { id: 'gaming', label: 'Gaming' },
  { id: 'smoking', label: 'Smoking' }
];

export default function CommunityPage() {
  const store = useStore();
  const { posts } = store;
  const [category, setCategory] = useState('all');
  const [text, setText] = useState('');
  const [postCategory, setPostCategory] = useState('porn');

  const all = [...posts.filter((p) => !p.hidden), ...SEED];
  const visible = all.filter((p) => category === 'all' || p.category === category);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Community"
        subtitle="Anonymous stories, stored in this browser. Nothing is uploaded, nobody can message you."
        action={<Badge tone="outline">Local demo</Badge>}
      />

      <Card>
        <CardHeader>
          <CardTitle>Share something</CardTitle>
          <CardDescription>
            Posts are saved only on this device. They are not sent anywhere, ever.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setPostCategory(c.id)}
                className={
                  postCategory === c.id
                    ? 'rounded-full bg-forest-600 px-3 py-1.5 text-xs font-medium text-cream dark:bg-mint dark:text-forest-900'
                    : 'rounded-full border border-forest-900/15 px-3 py-1.5 text-xs dark:border-cream/15'
                }
              >
                {c.label}
              </button>
            ))}
          </div>
          <Textarea
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={500}
            placeholder="What is working for you? Be specific — that is what helps people."
          />
          <div className="flex items-center justify-between">
            <span className="muted text-xs">{text.length}/500</span>
            <Button
              disabled={text.trim().length === 0}
              onClick={() => {
                store.addPost(postCategory, text.trim());
                setText('');
                store.addXp(5);
              }}
            >
              <Send className="h-4 w-4" /> Post
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs
        tabs={CATEGORIES}
        value={category}
        onChange={setCategory}
      />

      <div className="space-y-3">
        {visible.length === 0 ? (
          <p className="muted text-sm">Nothing in this category yet.</p>
        ) : null}
        {visible.map((post) => (
          <Card key={post.id}>
            <CardContent className="pt-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-mint/50 text-xs font-semibold dark:bg-forest-700">
                    {post.author.slice(0, 1).toUpperCase()}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{post.author}</p>
                    <p className="muted text-[11px]">
                      {formatDate(post.at)} · {post.category}
                    </p>
                  </div>
                </div>
                <Badge tone="outline">{post.category}</Badge>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">{post.text}</p>
              <div className="mt-3 flex items-center gap-4 text-xs">
                <button
                  type="button"
                  onClick={() => store.likePost(post.id)}
                  className="flex items-center gap-1.5 text-forest-900/60 hover:text-forest-900 dark:text-cream/60 dark:hover:text-cream"
                >
                  <Heart className="h-3.5 w-3.5" /> {post.likes}
                </button>
                <button
                  type="button"
                  onClick={() => store.reportPost(post.id)}
                  className="flex items-center gap-1.5 text-forest-900/40 hover:text-amber-600 dark:text-cream/40"
                >
                  <Flag className="h-3.5 w-3.5" /> Report
                </button>
                <button
                  type="button"
                  onClick={() => store.hidePost(post.id)}
                  className="flex items-center gap-1.5 text-forest-900/40 hover:text-red-600 dark:text-cream/40"
                >
                  <ShieldOff className="h-3.5 w-3.5" /> Hide
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="muted pb-4 text-center text-xs">
        Reporting and hiding are local actions — there is no moderator, because there is no server.
      </p>
    </div>
  );
}
