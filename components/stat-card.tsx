import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from './ui/controls';

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  progress,
  tone = 'default',
  className
}: {
  label: string;
  value: string;
  hint?: string;
  icon?: LucideIcon;
  progress?: number;
  tone?: 'default' | 'mint' | 'danger';
  className?: string;
}) {
  return (
    <div
      className={cn(
        'surface flex flex-col justify-between p-5',
        tone === 'mint' && 'bg-mint-100/70 dark:bg-forest-800/70',
        tone === 'danger' && 'border-red-200/70 bg-red-50/70 dark:border-red-500/20 dark:bg-red-500/10',
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-forest-900/45 dark:text-cream-100/45">
          {label}
        </p>
        {Icon ? (
          <span className="grid h-8 w-8 place-items-center rounded-full bg-forest-900/[0.05] text-forest-700 dark:bg-cream-100/10 dark:text-mint-300">
            <Icon className="h-4 w-4" strokeWidth={1.8} />
          </span>
        ) : null}
      </div>
      <p className="display-number mt-3 text-[26px] leading-none text-forest-900 dark:text-cream-50">
        {value}
      </p>
      {hint ? <p className="muted mt-1.5 text-[11.5px]">{hint}</p> : null}
      {typeof progress === 'number' ? <Progress value={progress} className="mt-3" /> : null}
    </div>
  );
}
