import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = 'default'
}: {
  label: string;
  value: string;
  hint?: string;
  icon?: LucideIcon;
  tone?: 'default' | 'mint' | 'danger';
}) {
  const tones = {
    default: 'surface',
    mint: 'rounded-2xl border border-forest-900/10 bg-mint/50 dark:border-cream/10 dark:bg-forest-700',
    danger: 'rounded-2xl border border-red-200 bg-red-50 dark:border-red-500/30 dark:bg-red-500/10'
  } as const;

  return (
    <div className={cn(tones[tone], 'p-4 sm:p-5')}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-forest-900/50 dark:text-cream/50">
          {label}
        </p>
        {Icon ? <Icon className="h-4 w-4 text-forest-900/40 dark:text-cream/40" /> : null}
      </div>
      <p className="mt-2 font-display text-2xl font-semibold sm:text-3xl">{value}</p>
      {hint ? <p className="muted mt-1 text-xs">{hint}</p> : null}
    </div>
  );
}
