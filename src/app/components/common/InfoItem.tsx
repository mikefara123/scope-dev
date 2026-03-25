import { LucideIcon } from 'lucide-react';
import { cn } from '@/app/components/ui/utils';

interface InfoItemProps {
  icon: LucideIcon;
  label: string;
  value: string | React.ReactNode;
  variant?: 'default' | 'muted';
  className?: string;
}

export function InfoItem({ 
  icon: Icon, 
  label, 
  value, 
  variant = 'default',
  className 
}: InfoItemProps) {
  return (
    <div className={cn(
      'flex items-center gap-2 text-sm',
      variant === 'muted' && 'text-muted-foreground',
      className
    )}>
      <Icon className="h-4 w-4" />
      <span>{label}:</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

interface InfoRowProps {
  icon: LucideIcon;
  label: string;
  value: string | React.ReactNode;
  className?: string;
}

export function InfoRow({ icon: Icon, label, value, className }: InfoRowProps) {
  return (
    <div className={cn('flex items-center justify-between', className)}>
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" />
        <span>{label}</span>
      </div>
      <span className="font-semibold">{value}</span>
    </div>
  );
}