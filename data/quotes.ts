export const QUOTES: { text: string; author: string }[] = [
  { text: 'You are not starting over. You are continuing from further along than last time.', author: 'Quitopia' },
  { text: 'The urge is a wave. Waves do not need to be fought, they need to be waited out.', author: 'Quitopia' },
  { text: 'Discipline is remembering what you actually want.', author: 'Quitopia' },
  { text: 'Nothing you have built disappears because of one bad hour.', author: 'Quitopia' },
  { text: 'The first hour is the whole fight. The rest of the day is just the day.', author: 'Quitopia' },
  { text: 'Small and boring beats big and abandoned.', author: 'Quitopia' },
  { text: 'You have already done the hardest version of today.', author: 'Quitopia' },
  { text: 'Change the room, not the willpower.', author: 'Quitopia' },
  { text: 'A slip is data. Shame is not.', author: 'Quitopia' },
  { text: 'Being a little better than yesterday is the whole plan.', author: 'Quitopia' }
];

export function quoteOfTheDay(): { text: string; author: string } {
  const index = Math.floor(Date.now() / 86_400_000) % QUOTES.length;
  return QUOTES[index];
}
