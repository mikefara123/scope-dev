import { LucideIcon } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { ReactNode } from 'react';

interface EmptyStateProps {
  icon: LucideIcon | ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  action?: ReactNode;
  variant?: 'card' | 'inline';
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  action,
  variant = 'card',
}: EmptyStateProps) {
  const Icon = typeof icon === 'function' ? icon : null;
  
  const content = (
    <div className="text-center">
      <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
        {Icon ? <Icon className="h-8 w-8 text-muted-foreground" /> : icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6">{description}</p>
      {action || (actionLabel && onAction && (
        <Button onClick={onAction}>{actionLabel}</Button>
      ))}
    </div>
  );

  if (variant === 'inline') {
    return <div className="py-12">{content}</div>;
  }

  return (
    <Card className="p-12">
      {content}
    </Card>
  );
}