import * as React from 'react';
import { cn } from '@/lib/utils';

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'h-11 w-full rounded-xl border border-forest-900/15 bg-white px-4 text-sm text-forest-900 placeholder:text-forest-900/40 focus:border-teal focus:outline-none dark:border-cream/15 dark:bg-forest-800 dark:text-cream dark:placeholder:text-cream/40',
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
      'w-full rounded-xl border border-forest-900/15 bg-white p-4 text-sm leading-relaxed text-forest-900 placeholder:text-forest-900/40 focus:border-teal focus:outline-none dark:border-cream/15 dark:bg-forest-800 dark:text-cream dark:placeholder:text-cream/40',
      className
    )}
    {...props}
  />
));
Textarea.displayName = 'Textarea';

export const Label = ({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) => (
  <label className={cn('mb-1.5 block text-sm font-medium', className)} {...props} />
);
