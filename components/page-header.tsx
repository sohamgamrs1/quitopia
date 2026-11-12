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
    <div className={cn('mb-6 flex flex-wrap items-start justify-between gap-4', className)}>
      <div>
        <h1 className="text-[28px] font-extrabold leading-tight tracking-tightest sm:text-[34px]">
          {title}
        </h1>
        {subtitle ? <p className="muted mt-1.5 max-w-2xl text-[14px] leading-relaxed">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}
