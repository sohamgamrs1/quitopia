export interface AddictionDef {
  id: string;
  label: string;
  emoji: string;
  /** Typical daily spend in rupees, used as the default for the money-saved calculator. */
  defaultDailySpend: number;
  /** Typical minutes lost per day, used for the time-saved estimate. */
  defaultMinutesPerDay: number;
  /** Copy shown on the recovery timeline. */
  recovery: { day: number; title: string; body: string }[];
}

const genericRecovery = [
  { day: 1, title: 'The first day', body: 'The urge peaks and passes whether or not you act on it. Today you only have to notice that.' },
  { day: 7, title: 'One week', body: 'Sleep and mood usually start to settle. The habit is still loud, but it is no longer constant.' },
  { day: 14, title: 'Two weeks', body: 'The cue-response loop weakens. Most people report the first genuinely easy day around here.' },
  { day: 30, title: 'One month', body: 'New routines are starting to hold on their own. Your baseline mood is measurably better.' },
  { day: 90, title: 'Ninety days', body: 'This is the marker most people use for a rewired habit. It is not the finish line, it is the new normal.' }
];

export const ADDICTIONS: AddictionDef[] = [
  {
    id: 'porn',
    label: 'Pornography',
    emoji: '🌱',
    defaultDailySpend: 0,
    defaultMinutesPerDay: 45,
    recovery: genericRecovery
  },
  {
    id: 'masturbation',
    label: 'Compulsive masturbation',
    emoji: '🌿',
    defaultDailySpend: 0,
    defaultMinutesPerDay: 30,
    recovery: genericRecovery
  },
  {
    id: 'social',
    label: 'Social media',
    emoji: '📱',
    defaultDailySpend: 0,
    defaultMinutesPerDay: 120,
    recovery: genericRecovery
  },
  {
    id: 'gaming',
    label: 'Gaming',
    emoji: '🎮',
    defaultDailySpend: 50,
    defaultMinutesPerDay: 150,
    recovery: genericRecovery
  },
  {
    id: 'smoking',
    label: 'Smoking / vaping',
    emoji: '🚭',
    defaultDailySpend: 120,
    defaultMinutesPerDay: 40,
    recovery: [
      { day: 1, title: 'Twenty minutes in', body: 'Heart rate and blood pressure begin to drop back towards normal.' },
      { day: 7, title: 'One week', body: 'Carbon monoxide is largely cleared. Taste and smell start returning.' },
      { day: 14, title: 'Two weeks', body: 'Circulation improves and ordinary exertion gets easier.' },
      { day: 30, title: 'One month', body: 'Coughing and shortness of breath noticeably reduce for most people.' },
      { day: 90, title: 'Ninety days', body: 'Lung function is meaningfully better. The cravings are now occasional rather than constant.' }
    ]
  },
  {
    id: 'alcohol',
    label: 'Alcohol',
    emoji: '🍃',
    defaultDailySpend: 300,
    defaultMinutesPerDay: 60,
    recovery: [
      { day: 1, title: 'The first day', body: 'If you have been drinking heavily, stopping suddenly can be dangerous. Speak to a doctor.' },
      { day: 7, title: 'One week', body: 'Sleep starts to reorganise. It usually feels worse before it feels better.' },
      { day: 14, title: 'Two weeks', body: 'Hydration, mood and morning energy improve for most people.' },
      { day: 30, title: 'One month', body: 'Liver enzymes begin to normalise. Concentration improves.' },
      { day: 90, title: 'Ninety days', body: 'Blood pressure and sleep quality are usually measurably better.' }
    ]
  },
  {
    id: 'gambling',
    label: 'Gambling / betting',
    emoji: '🎲',
    defaultDailySpend: 500,
    defaultMinutesPerDay: 90,
    recovery: genericRecovery
  },
  {
    id: 'junkfood',
    label: 'Junk food',
    emoji: '🍩',
    defaultDailySpend: 200,
    defaultMinutesPerDay: 30,
    recovery: genericRecovery
  },
  {
    id: 'shopping',
    label: 'Compulsive shopping',
    emoji: '🛍️',
    defaultDailySpend: 400,
    defaultMinutesPerDay: 45,
    recovery: genericRecovery
  },
  {
    id: 'procrastination',
    label: 'Procrastination',
    emoji: '⏳',
    defaultDailySpend: 0,
    defaultMinutesPerDay: 120,
    recovery: genericRecovery
  }
];

export const FREQUENCIES = [
  { id: 'multiple-daily', label: 'Several times a day' },
  { id: 'daily', label: 'Once a day' },
  { id: 'few-week', label: 'A few times a week' },
  { id: 'weekly', label: 'Weekly' },
  { id: 'occasionally', label: 'Occasionally' }
];

export const TRIGGERS = [
  { id: 'boredom', label: 'Boredom' },
  { id: 'stress', label: 'Stress' },
  { id: 'loneliness', label: 'Loneliness' },
  { id: 'night', label: 'Late at night' },
  { id: 'phone', label: 'Phone in hand' },
  { id: 'conflict', label: 'After a fight' },
  { id: 'tiredness', label: 'Tiredness' }
];

export function addictionById(id: string): AddictionDef | undefined {
  return ADDICTIONS.find((a) => a.id === id);
}

export function addictionLabel(id: string, custom?: string): string {
  if (id === 'custom') return custom?.trim() || 'My habit';
  return addictionById(id)?.label ?? id;
}
