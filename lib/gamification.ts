import { BADGES } from '@/data/badges';
import { CheckIn } from './storage';

export interface LevelDef {
  name: string;
  minXp: number;
  emoji: string;
}

export const LEVELS: LevelDef[] = [
  { name: 'Seedling', minXp: 0, emoji: '🌱' },
  { name: 'Sprout', minXp: 100, emoji: '🌿' },
  { name: 'Warrior', minXp: 300, emoji: '⚔️' },
  { name: 'Master', minXp: 700, emoji: '🛡️' },
  { name: 'Legend', minXp: 1500, emoji: '👑' }
];

export interface LevelInfo {
  name: string;
  emoji: string;
  index: number;
  next: LevelDef | null;
  progress: number;
  toNext: number;
}

export function levelFor(xp: number): LevelInfo {
  let index = 0;
  for (let i = 0; i < LEVELS.length; i++) {
    if (xp >= LEVELS[i].minXp) index = i;
  }
  const current = LEVELS[index];
  const next = LEVELS[index + 1] ?? null;
  const progress = next
    ? Math.min(100, Math.round(((xp - current.minXp) / (next.minXp - current.minXp)) * 100))
    : 100;
  return {
    name: current.name,
    emoji: current.emoji,
    index,
    next,
    progress,
    toNext: next ? Math.max(0, next.minXp - xp) : 0
  };
}

export function evaluateBadges(
  streakDays: number,
  urgesDefeated: number,
  checkins: CheckIn[]
): string[] {
  const earned = new Set<string>();

  for (const badge of BADGES) {
    if (badge.streakDays !== null && streakDays >= badge.streakDays) earned.add(badge.id);
  }
  if (urgesDefeated >= 10) earned.add('urge-slayer');

  const early = checkins.filter((c) => {
    if (!c.clean || !c.at) return false;
    return new Date(c.at).getHours() < 9;
  });
  if (early.length >= 5) earned.add('early-riser');

  return Array.from(earned);
}
