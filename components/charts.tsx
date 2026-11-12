'use client';

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import type { CheckIn, Slip } from '@/lib/storage';
import { dayKey } from '@/lib/utils';

const axisStyle = { fontSize: 11, fill: 'currentColor', opacity: 0.6 };

export function UrgeTrendChart({ checkins }: { checkins: CheckIn[] }) {
  const data = [...checkins]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-21)
    .map((c) => ({
      date: new Date(c.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      urge: c.urge,
      mood: c.mood
    }));

  if (data.length === 0) {
    return <EmptyChart label="Log a few check-ins to see the trend." />;
  }

  return (
    <div className="h-56 w-full text-forest-900 dark:text-cream">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
          <XAxis dataKey="date" tick={axisStyle} tickLine={false} axisLine={false} />
          <YAxis domain={[0, 10]} tick={axisStyle} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{ borderRadius: 12, border: 'none', fontSize: 12 }}
            labelStyle={{ fontSize: 12 }}
          />
          <Line
            type="monotone"
            dataKey="urge"
            name="Urge"
            stroke="#2F8767"
            strokeWidth={2.5}
            dot={{ r: 2 }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="mood"
            name="Mood"
            stroke="#A8E6CF"
            strokeWidth={2.5}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CleanVsSlipChart({ checkins, slips }: { checkins: CheckIn[]; slips: Slip[] }) {
  const slipDays = new Set(slips.map((s) => dayKey(s.at)));
  const clean = checkins.filter((c) => c.clean && !slipDays.has(c.date)).length;
  const slipped = slipDays.size;

  const data = [
    { name: 'Clean days', value: clean, fill: '#2F8767' },
    { name: 'Slip days', value: slipped, fill: '#E57373' }
  ];

  if (clean + slipped === 0) {
    return <EmptyChart label="Your first check-in will start this chart." />;
  }

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={45}
            outerRadius={75}
            paddingAngle={3}
            stroke="none"
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.fill} />
            ))}
          </Pie>
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            formatter={(value) => <span className="text-xs">{value}</span>}
          />
          <Tooltip contentStyle={{ borderRadius: 12, border: 'none', fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function WeeklyUrgeBars({ checkins }: { checkins: CheckIn[] }) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const totals = new Array(7).fill(0);
  const counts = new Array(7).fill(0);

  for (const c of checkins) {
    const index = (new Date(c.date).getDay() + 6) % 7;
    totals[index] += c.urge;
    counts[index] += 1;
  }

  const data = days.map((day, i) => ({
    day,
    urge: counts[i] ? Math.round((totals[i] / counts[i]) * 10) / 10 : 0
  }));

  return (
    <div className="h-52 w-full text-forest-900 dark:text-cream">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} vertical={false} />
          <XAxis dataKey="day" tick={axisStyle} tickLine={false} axisLine={false} />
          <YAxis domain={[0, 10]} tick={axisStyle} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={{ borderRadius: 12, border: 'none', fontSize: 12 }} />
          <Bar dataKey="urge" name="Average urge" radius={[6, 6, 0, 0]} fill="#2F8767" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MoodAreaChart({ checkins }: { checkins: CheckIn[] }) {
  const data = [...checkins]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-30)
    .map((c) => ({
      date: new Date(c.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      mood: c.mood
    }));

  if (data.length < 2) return <EmptyChart label="Two check-ins and this chart comes alive." />;

  return (
    <div className="h-52 w-full text-forest-900 dark:text-cream">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
          <defs>
            <linearGradient id="moodFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#A8E6CF" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#A8E6CF" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
          <XAxis dataKey="date" tick={axisStyle} tickLine={false} axisLine={false} />
          <YAxis domain={[1, 5]} tick={axisStyle} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={{ borderRadius: 12, border: 'none', fontSize: 12 }} />
          <Area
            type="monotone"
            dataKey="mood"
            name="Mood"
            stroke="#4FB3A2"
            strokeWidth={2}
            fill="url(#moodFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function EmptyChart({ label }: { label: string }) {
  return (
    <div className="grid h-56 place-items-center rounded-2xl border border-dashed border-forest-900/15 text-center text-sm text-forest-900/50 dark:border-cream/15 dark:text-cream/50">
      {label}
    </div>
  );
}
