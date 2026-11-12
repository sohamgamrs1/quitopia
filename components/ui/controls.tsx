'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export function Switch({
  checked,
  onCheckedChange,
  label,
  disabled
}: {
  checked: boolean;
  onCheckedChange: (value: boolean) => void;
  label?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        'relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-50',
        checked ? 'bg-forest-600 dark:bg-mint' : 'bg-forest-900/20 dark:bg-cream/20'
      )}
    >
      <span
        className={cn(
          'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
          checked ? 'translate-x-[22px]' : 'translate-x-0.5'
        )}
      />
    </button>
  );
}

export function Slider({
  value,
  onChange,
  min = 1,
  max = 10,
  step = 1,
  label
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
}) {
  const percent = ((value - min) / (max - min)) * 100;
  return (
    <div className="w-full">
      <input
        aria-label={label}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full outline-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-forest-700 [&::-webkit-slider-thumb]:shadow dark:[&::-webkit-slider-thumb]:bg-mint"
        style={{
          background: `linear-gradient(to right, rgb(31 107 79) 0%, rgb(31 107 79) ${percent}%, rgba(15,61,46,0.12) ${percent}%, rgba(15,61,46,0.12) 100%)`
        }}
      />
    </div>
  );
}

export function Badge({
  children,
  tone = 'mint',
  className
}: {
  children: React.ReactNode;
  tone?: 'mint' | 'cream' | 'outline' | 'danger';
  className?: string;
}) {
  const tones: Record<string, string> = {
    mint: 'bg-mint text-forest-900 dark:bg-forest-600 dark:text-cream',
    cream: 'bg-cream-deep text-forest-900 dark:bg-forest-700 dark:text-cream',
    outline: 'border border-forest-900/15 text-forest-900 dark:border-cream/20 dark:text-cream',
    danger: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-200'
  };
  return <span className={cn('pill', tones[tone], className)}>{children}</span>;
}

export function Progress({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn('h-2 w-full overflow-hidden rounded-full bg-forest-900/10 dark:bg-cream/10', className)}>
      <div
        className="h-full rounded-full bg-forest-600 transition-all duration-500 dark:bg-mint"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export function Separator({ className }: { className?: string }) {
  return <div className={cn('h-px w-full bg-forest-900/10 dark:bg-cream/10', className)} />;
}

export function Tabs({
  tabs,
  value,
  onChange,
  className
}: {
  tabs: { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
  className?: string;
}) {
  return (
    <div
      role="tablist"
      className={cn(
        'inline-flex flex-wrap gap-1 rounded-full bg-forest-900/5 p-1 dark:bg-cream/10',
        className
      )}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={value === tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'rounded-full px-4 py-2 text-sm font-medium transition-colors',
            value === tab.id
              ? 'bg-white text-forest-900 shadow-sm dark:bg-forest-700 dark:text-cream'
              : 'text-forest-900/60 hover:text-forest-900 dark:text-cream/60 dark:hover:text-cream'
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
