import { LucideIcon } from 'lucide-react';
import { cn } from '@/app/components/ui/utils';

interface SectionHeaderProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function SectionHeader({ 
  icon: Icon, 
  title, 
  description, 
  action,
  className 
}: SectionHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between', className)}>
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-brand-secondary" />
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

interface SectionHeaderCompactProps {
  icon: LucideIcon;
  title: string;
  badge?: React.ReactNode;
  className?: string;
}

export function SectionHeaderCompact({ 
  icon: Icon, 
  title, 
  badge,
  className 
}: SectionHeaderCompactProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="h-6 w-6 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
        <Icon className="h-3.5 w-3.5 text-white" />
      </div>
      <div className="flex-1 flex items-center gap-2">
        <span className="text-sm font-semibold text-slate-900">{title}</span>
        {badge}
      </div>
    </div>
  );
}