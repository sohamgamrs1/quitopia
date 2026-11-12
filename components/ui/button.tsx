import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold tracking-tight transition-all duration-200 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-45 active:scale-[0.985]',
  {
    variants: {
      variant: {
        default:
          'bg-forest-900 text-cream-50 shadow-soft hover:bg-forest-800 dark:bg-mint-300 dark:text-forest-950 dark:hover:bg-mint-200',
        secondary:
          'bg-mint-300 text-forest-900 hover:bg-mint-200 dark:bg-forest-700 dark:text-cream-100 dark:hover:bg-forest-600',
        outline:
          'border border-forest-900/15 bg-white/50 text-forest-900 hover:border-forest-900/30 hover:bg-white dark:border-cream-100/20 dark:bg-transparent dark:text-cream-100 dark:hover:bg-cream-100/10',
        ghost:
          'bg-transparent text-forest-900/70 hover:bg-forest-900/[0.06] hover:text-forest-900 dark:text-cream-100/70 dark:hover:bg-cream-100/10',
        danger: 'bg-red-600 text-white hover:bg-red-500',
        sos: 'bg-red-600 text-white shadow-lift hover:bg-red-500'
      },
      size: {
        sm: 'h-9 px-4 text-[13px]',
        default: 'h-11 px-6 text-sm',
        lg: 'h-14 px-8 text-[15px]',
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
