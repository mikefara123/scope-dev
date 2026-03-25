import { cn } from '@/app/components/ui/utils';
import { ReactNode } from 'react';

interface InfoDisplayProps {
  label: string;
  value: string | ReactNode;
  className?: string;
}

export function InfoDisplay({ label, value, className }: InfoDisplayProps) {
  return (
    <div className={cn('space-y-1', className)}>
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="font-medium">{value}</div>
    </div>
  );
}
