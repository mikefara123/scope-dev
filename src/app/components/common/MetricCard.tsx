import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { cn } from '@/app/components/ui/utils';
import { ReactNode } from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconBgColor: 'primary' | 'secondary' | 'success' | 'warning' | 'info';
  borderColor: 'primary' | 'secondary' | 'success' | 'warning' | 'info';
  badge?: {
    label: string;
    variant: 'default' | 'success' | 'warning' | 'info' | 'outline';
    icon?: LucideIcon;
  };
  description?: string;
  className?: string;
}

export function MetricCard({
  label,
  value,
  icon: Icon,
  iconBgColor,
  borderColor,
  badge,
  description,
  className,
}: MetricCardProps) {
  const iconBgClasses = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    success: 'bg-success',
    warning: 'bg-warning',
    info: 'bg-blue-500',
  };

  const borderClasses = {
    primary: 'border-l-primary',
    secondary: 'border-l-secondary',
    success: 'border-l-success',
    warning: 'border-l-warning',
    info: 'border-l-blue-500',
  };

  const BadgeIcon = badge?.icon;

  return (
    <Card className={cn(
      'hover:shadow-lg transition-all duration-300 border-l-4',
      borderClasses[borderColor],
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          {label}
        </CardTitle>
        <div className={cn(
          'h-12 w-12 rounded-xl flex items-center justify-center shadow-sm',
          iconBgClasses[iconBgColor]
        )}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <div className="text-4xl font-bold text-foreground">{value}</div>
          {badge && (
            <Badge variant={badge.variant} className="gap-1">
              {BadgeIcon && <BadgeIcon className="h-3 w-3" />}
              {badge.label}
            </Badge>
          )}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-2">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
