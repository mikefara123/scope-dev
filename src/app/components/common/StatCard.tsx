import { cn } from '@/app/components/ui/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning';
  className?: string;
}

export function StatCard({ 
  label, 
  value, 
  icon,
  description, 
  trend, 
  variant = 'default',
  className 
}: StatCardProps) {
  const variantClasses = {
    default: 'bg-card border',
    primary: 'bg-primary text-primary-foreground',
    secondary: 'bg-secondary text-secondary-foreground',
    success: 'bg-[var(--color-success)] text-white',
    warning: 'bg-[var(--color-warning)] text-white',
  };

  return (
    <div className={cn(
      'rounded-lg p-4',
      variantClasses[variant],
      className
    )}>
      <div className="flex items-center justify-between mb-2">
        <p className={cn(
          'text-sm',
          variant === 'default' ? 'text-muted-foreground' : 'opacity-90'
        )}>
          {label}
        </p>
        {icon && <div className="opacity-70">{icon}</div>}
      </div>
      <div className="flex items-center gap-2">
        <p className="text-2xl font-bold">{value}</p>
        {trend && (
          <span className={cn(
            'text-xs px-1.5 py-0.5 rounded',
            trend.isPositive 
              ? 'bg-[var(--color-success)]/20 text-[var(--color-success)]' 
              : 'bg-destructive/20 text-destructive'
          )}>
            {trend.isPositive ? '+' : ''}{trend.value}%
          </span>
        )}
      </div>
      {description && (
        <p className={cn(
          'text-xs mt-1',
          variant === 'default' ? 'text-muted-foreground' : 'opacity-75'
        )}>
          {description}
        </p>
      )}
    </div>
  );
}

interface StatCardCompactProps {
  value: string | number;
  label: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'info';
  className?: string;
}

export function StatCardCompact({ 
  value, 
  label, 
  variant = 'primary',
  className 
}: StatCardCompactProps) {
  const variantClasses = {
    primary: 'bg-primary text-white',
    secondary: 'bg-secondary text-white',
    success: 'bg-[var(--color-success)] text-white',
    warning: 'bg-[var(--color-warning)] text-white',
    info: 'bg-blue-500 text-white',
  };

  return (
    <div className={cn(
      'rounded-lg p-2 text-center',
      variantClasses[variant],
      className
    )}>
      <div className="text-lg font-bold">{value}</div>
      <div className="text-xs">{label}</div>
    </div>
  );
}