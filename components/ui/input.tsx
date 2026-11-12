import * as React from 'react';
import { cn } from '@/lib/utils';

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'h-11 w-full rounded-2xl border border-forest-900/12 bg-white/70 px-4 text-sm text-forest-900 placeholder:text-forest-900/35 transition-colors focus:border-forest-500/50 focus:bg-white dark:border-cream-100/12 dark:bg-forest-900/60 dark:text-cream-100 dark:placeholder:text-cream-100/35',
        className
      )}
      {...props}
    />
  )
);
Input.displayName = 'Input';

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      'w-full rounded-2xl border border-forest-900/12 bg-white/70 p-4 text-sm leading-relaxed text-forest-900 placeholder:text-forest-900/35 transition-colors focus:border-forest-500/50 focus:bg-white dark:border-cream-100/12 dark:bg-forest-900/60 dark:text-cream-100 dark:placeholder:text-cream-100/35',
      className
    )}
    {...props}
  />
));
Textarea.displayName = 'Textarea';

export const Label = ({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) => (
  <label
    className={cn(
      'mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.08em] text-forest-900/45 dark:text-cream-100/45',
      className
    )}
    {...props}
  />
);
