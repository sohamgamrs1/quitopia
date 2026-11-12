import { Profile } from './storage';
import { addictionLabel } from './addictions';

export interface PlanDay {
  day: number;
  title: string;
  task: string;
}

/**
 * A seven-day plan built from the quiz answers. Deliberately boring: one small action a
 * day beats a dramatic regimen nobody follows.
 */
export function generatePlan(profile: Profile): PlanDay[] {
  const habit = addictionLabel(profile.addictions[0] ?? 'custom', profile.customAddiction);
  const nightTrigger = profile.triggers.includes('night');
  const stressTrigger = profile.triggers.includes('stress');
  const phoneTrigger = profile.triggers.includes('phone');
  const lonelyTrigger = profile.triggers.includes('loneliness');

  return [
    {
      day: 1,
      title: 'Name it out loud',
      task: `Write one sentence in the journal: what ${habit.toLowerCase()} actually gives you, and what it costs. Both halves matter.`
    },
    {
      day: 2,
      title: nightTrigger ? 'Change the night routine' : 'Remove one cue',
      task: nightTrigger
        ? 'Charge your phone outside the bedroom tonight. Not on silent — in another room.'
        : 'Find the one object or app that starts the habit and move it somewhere inconvenient.'
    },
    {
      day: 3,
      title: 'Practise the pause',
      task: 'Open the SOS page and run one full breathing round while you are calm. You are rehearsing, not rescuing.'
    },
    {
      day: 4,
      title: phoneTrigger ? 'Make the phone boring' : 'Fill the gap',
      task: phoneTrigger
        ? 'Move the two apps you open without thinking off the home screen. Friction is enough.'
        : 'Pick one thing you will do instead at your riskiest hour. Decide it now, not then.'
    },
    {
      day: 5,
      title: lonelyTrigger || stressTrigger ? 'Tell one person' : 'Add one person',
      task: 'Send one message to somebody real about this. A witness changes the odds more than any app can.'
    },
    {
      day: 6,
      title: 'Review the week honestly',
      task: 'Open Stats. Look at the urge chart without judgement. Note the day with the highest number and what was happening.'
    },
    {
      day: 7,
      title: 'Set the next seven',
      task: 'Add one block rule for the site or app that caught you out, and set the Focus Hours schedule for your risk window.'
    }
  ];
}

export function todayTask(plan: PlanDay[], startDate: string): PlanDay {
  const days = Math.max(0, Math.floor((Date.now() - new Date(startDate).getTime()) / 86_400_000));
  return plan[days % plan.length];
}
