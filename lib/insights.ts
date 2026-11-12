import { CheckIn, TriggerLog } from './storage';

export interface Insight {
  headline: string;
  detail: string;
  riskiestHour: string | null;
  riskiestDay: string | null;
  topEmotion: string | null;
  sampleSize: number;
}

function hourBucket(date: Date): string {
  const h = date.getHours();
  if (h >= 22 || h < 1) return '11pm – 1am';
  if (h < 6) return '1am – 6am';
  if (h < 12) return '6am – 12pm';
  if (h < 17) return '12pm – 5pm';
  if (h < 22) return '5pm – 11pm';
  return 'late evening';
}

function mostCommon(values: string[]): string | null {
  if (values.length === 0) return null;
  const counts = new Map<string, number>();
  for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1);
  return Array.from(counts.entries()).sort((a, b) => b[1] - a[1])[0][0];
}

export function analyse(triggers: TriggerLog[], checkins: CheckIn[]): Insight {
  const sample = triggers.length + checkins.length;
  if (sample < 3) {
    return {
      headline: 'Not enough data yet',
      detail: 'Log three urges or check-ins and this panel starts telling you when you are most at risk.',
      riskiestHour: null,
      riskiestDay: null,
      topEmotion: null,
      sampleSize: sample
    };
  }

  const hours = triggers.map((t) => hourBucket(new Date(t.at)));
  const days = triggers.map((t) => new Date(t.at).toLocaleDateString('en-IN', { weekday: 'long' }));
  const emotions = triggers.map((t) => t.emotion).filter(Boolean);

  const riskiestHour = mostCommon(hours);
  const riskiestDay = mostCommon(days);
  const topEmotion = mostCommon(emotions);

  const parts: string[] = [];
  if (riskiestHour) parts.push(`your riskiest window is ${riskiestHour}`);
  if (riskiestDay) parts.push(`${riskiestDay}s are the hardest day`);
  if (topEmotion) parts.push(`${topEmotion.toLowerCase()} shows up most often before an urge`);

  const highUrge = checkins.filter((c) => c.urge >= 7).length;

  return {
    headline: riskiestHour ? `Your riskiest time is ${riskiestHour}` : 'Your pattern is forming',
    detail: `${parts.join(', ')}. ${highUrge > 0 ? `${highUrge} of your ${checkins.length} check-ins were high-urge days.` : ''}`.trim(),
    riskiestHour,
    riskiestDay,
    topEmotion,
    sampleSize: sample
  };
}

export function weeklySummary(cleanDays: number, urges: number, slips: number): string {
  if (slips === 0) {
    return `Seven days, ${cleanDays} clean, ${urges} urges held off. Nothing dramatic happened, and that is exactly what progress looks like.`;
  }
  return `A hard week: ${slips} slip${slips === 1 ? '' : 's'}, ${urges} urges resisted, ${cleanDays} clean days. The streak resets. Everything else you built does not.`;
}
