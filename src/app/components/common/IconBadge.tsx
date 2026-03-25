import { LucideIcon } from 'lucide-react';
import { cn } from '@/app/components/ui/utils';

interface IconBadgeProps {
  icon: LucideIcon;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'muted';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function IconBadge({ 
  icon: Icon, 
  variant = 'primary', 
  size = 'md',
  className 
}: IconBadgeProps) {
  const variantClasses = {
    primary: 'bg-primary text-primary-foreground',
    secondary: 'bg-secondary text-secondary-foreground',
    success: 'bg-[var(--color-success)] text-white',
    warning: 'bg-[var(--color-warning)] text-white',
    danger: 'bg-destructive text-destructive-foreground',
    muted: 'bg-muted text-muted-foreground',
  };

  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  const iconSizes = {
    sm: 'h-3.5 w-3.5',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
    xl: 'h-8 w-8',
  };

  return (
    <div
      className={cn(
        'rounded-lg flex items-center justify-center flex-shrink-0',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      <Icon className={iconSizes[size]} />
    </div>
  );
}