import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default:
          'bg-forest-700 text-cream shadow-soft hover:bg-forest-600 dark:bg-mint dark:text-forest-900 dark:hover:bg-mint-soft',
        secondary:
          'bg-mint text-forest-900 hover:bg-mint-soft dark:bg-forest-600 dark:text-cream dark:hover:bg-forest-500',
        outline:
          'border border-forest-900/15 bg-transparent text-forest-900 hover:bg-forest-900/5 dark:border-cream/20 dark:text-cream dark:hover:bg-cream/10',
        ghost:
          'bg-transparent text-forest-900 hover:bg-forest-900/5 dark:text-cream dark:hover:bg-cream/10',
        danger: 'bg-red-600 text-white hover:bg-red-500',
        sos: 'bg-red-600 text-white shadow-lift hover:bg-red-500'
      },
      size: {
        sm: 'h-9 px-4 text-xs',
        default: 'h-11 px-6',
        lg: 'h-14 px-8 text-base',
        icon: 'h-10 w-10'
      }
    },
    defaultVariants: { variant: 'default', size: 'default' }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
