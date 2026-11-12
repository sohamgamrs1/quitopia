export interface BadgeDef {
  id: string;
  label: string;
  description: string;
  emoji: string;
  /** null means it is earned by something other than a streak length. */
  streakDays: number | null;
}

export const BADGES: BadgeDef[] = [
  { id: 'day-1', label: 'First Day', description: 'You started. That is the hardest part.', emoji: '🌱', streakDays: 1 },
  { id: 'day-3', label: 'Three Days', description: 'The first hump is behind you.', emoji: '🌿', streakDays: 3 },
  { id: 'day-7', label: 'One Week', description: 'A full week clean.', emoji: '🌳', streakDays: 7 },
  { id: 'day-14', label: 'Two Weeks', description: 'The cue loop is weakening.', emoji: '⭐', streakDays: 14 },
  { id: 'day-30', label: 'One Month', description: 'New routines are holding on their own.', emoji: '🏅', streakDays: 30 },
  { id: 'day-90', label: 'Ninety Days', description: 'The marker most people aim for.', emoji: '🏆', streakDays: 90 },
  { id: 'day-365', label: 'One Year', description: 'A different life, honestly.', emoji: '👑', streakDays: 365 },
  { id: 'urge-slayer', label: 'Urge Slayer', description: 'Defeated ten urges.', emoji: '🛡️', streakDays: null },
  { id: 'early-riser', label: 'Early Riser', description: 'Checked in before 9am five times.', emoji: '🌅', streakDays: null }
];
