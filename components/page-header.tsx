import { cn } from '@/lib/utils';

export function PageHeader({
  title,
  subtitle,
  action,
  className
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('mb-6 flex flex-wrap items-start justify-between gap-3', className)}>
      <div>
        <h1 className="font-display text-2xl font-semibold sm:text-3xl">{title}</h1>
        {subtitle ? <p className="muted mt-1 max-w-2xl text-sm">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}
