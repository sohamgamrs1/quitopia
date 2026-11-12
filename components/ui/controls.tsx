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
        'relative h-[26px] w-[46px] shrink-0 rounded-full transition-colors duration-200 disabled:opacity-50',
        checked ? 'bg-forest-700 dark:bg-mint-300' : 'bg-forest-900/15 dark:bg-cream-100/20'
      )}
    >
      <span
        className={cn(
          'absolute top-[3px] h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200',
          checked ? 'translate-x-[23px]' : 'translate-x-[3px]'
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
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full outline-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-forest-700 [&::-webkit-slider-thumb]:shadow-md dark:[&::-webkit-slider-thumb]:bg-mint-300"
        style={{
          background: `linear-gradient(to right, #14584A 0%, #14584A ${percent}%, rgba(11,59,46,0.12) ${percent}%, rgba(11,59,46,0.12) 100%)`
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
  tone?: 'mint' | 'cream' | 'outline' | 'danger' | 'forest';
  className?: string;
}) {
  const tones: Record<string, string> = {
    mint: 'bg-mint-100 text-forest-800 dark:bg-mint-300/20 dark:text-mint-200',
    cream: 'bg-cream-200/80 text-forest-800 dark:bg-cream-100/10 dark:text-cream-100',
    outline: 'border border-forest-900/12 text-forest-900/70 dark:border-cream-100/15 dark:text-cream-100/70',
    danger: 'bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-200',
    forest: 'bg-forest-900 text-cream-50 dark:bg-forest-700 dark:text-cream-100'
  };
  return <span className={cn('pill', tones[tone], className)}>{children}</span>;
}

export function Progress({
  value,
  className,
  tone = 'forest'
}: {
  value: number;
  className?: string;
  tone?: 'forest' | 'mint' | 'danger';
}) {
  const fills = {
    forest: 'bg-forest-700 dark:bg-mint-300',
    mint: 'bg-mint-400',
    danger: 'bg-red-500'
  };
  return (
    <div className={cn('h-1.5 w-full overflow-hidden rounded-full bg-forest-900/[0.08] dark:bg-cream-100/10', className)}>
      <div
        className={cn('h-full rounded-full transition-all duration-700', fills[tone])}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export function Separator({ className }: { className?: string }) {
  return <div className={cn('h-px w-full bg-forest-900/[0.07] dark:bg-cream-100/10', className)} />;
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
        'inline-flex flex-wrap gap-1 rounded-full border border-forest-900/[0.07] bg-white/60 p-1 dark:border-cream-100/10 dark:bg-forest-900/50',
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
            'rounded-full px-4 py-1.5 text-[13px] font-semibold tracking-tight transition-all duration-200',
            value === tab.id
              ? 'bg-forest-900 text-cream-50 shadow-sm dark:bg-mint-300 dark:text-forest-950'
              : 'text-forest-900/55 hover:text-forest-900 dark:text-cream-100/55 dark:hover:text-cream-100'
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
