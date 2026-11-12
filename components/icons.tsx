import {
  Award,
  Clock,
  Cookie,
  Crown,
  Dices,
  EyeOff,
  Gamepad2,
  Heart,
  Leaf,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sprout,
  Star,
  Sunrise,
  Sword,
  TreePine,
  Trophy,
  Wine,
  Cigarette,
  type LucideIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

/** The Quitopia mark: a leaf inside a ring, drawn rather than emoji. */
export function LeafMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={cn('h-6 w-6', className)} aria-hidden="true">
      <circle cx="16" cy="16" r="14.5" stroke="currentColor" strokeOpacity="0.55" strokeWidth="1.4" />
      <path
        d="M21.5 10.5c0 5.6-3.4 9.2-8.4 9.9-1.3.2-2.2-.1-2.6-.5-.4-.4-.6-1.3-.4-2.5.7-5 4.4-8.4 11.4-6.9Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M9.8 22.4c2.2-4.6 5.1-7.6 9-9.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

const ADDICTION_ICONS: Record<string, LucideIcon> = {
  porn: EyeOff,
  masturbation: Heart,
  social: Smartphone,
  gaming: Gamepad2,
  smoking: Cigarette,
  alcohol: Wine,
  gambling: Dices,
  junkfood: Cookie,
  shopping: ShoppingBag,
  procrastination: Clock,
  custom: Sprout
};

export function AddictionIcon({ id, className }: { id: string; className?: string }) {
  const Icon = ADDICTION_ICONS[id] ?? Sprout;
  return <Icon className={cn('h-[18px] w-[18px]', className)} strokeWidth={1.7} />;
}

const BADGE_ICONS: Record<string, LucideIcon> = {
  'day-1': Sprout,
  'day-3': Leaf,
  'day-7': TreePine,
  'day-14': Star,
  'day-30': Award,
  'day-90': Trophy,
  'day-365': Crown,
  'urge-slayer': ShieldCheck,
  'early-riser': Sunrise
};

export function BadgeIcon({ id, className }: { id: string; className?: string }) {
  const Icon = BADGE_ICONS[id] ?? Star;
  return <Icon className={cn('h-5 w-5', className)} strokeWidth={1.7} />;
}

const LEVEL_ICONS: Record<string, LucideIcon> = {
  Seedling: Sprout,
  Sprout: Leaf,
  Warrior: Sword,
  Master: ShieldCheck,
  Legend: Crown
};

export function LevelIcon({ name, className }: { name: string; className?: string }) {
  const Icon = LEVEL_ICONS[name] ?? Sprout;
  return <Icon className={cn('h-4 w-4', className)} strokeWidth={1.8} />;
}
