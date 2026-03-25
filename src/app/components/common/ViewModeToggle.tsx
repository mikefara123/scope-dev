import { Button } from '@/app/components/ui/button';
import { cn } from '@/app/components/ui/utils';

type ViewMode = string;

interface ViewModeToggleProps<T extends ViewMode> {
  modes: Array<{
    value: T;
    label: string;
    icon: React.ReactNode;
  }>;
  currentMode: T;
  onChange: (mode: T) => void;
  className?: string;
}

export function ViewModeToggle<T extends ViewMode>({ 
  modes, 
  currentMode, 
  onChange,
  className 
}: ViewModeToggleProps<T>) {
  return (
    <div className={cn('flex items-center gap-2 bg-muted p-1 rounded-lg', className)}>
      {modes.map((mode) => (
        <Button
          key={mode.value}
          variant={currentMode === mode.value ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onChange(mode.value)}
          className="h-8 gap-1.5"
        >
          {mode.icon}
          <span className="hidden sm:inline">{mode.label}</span>
        </Button>
      ))}
    </div>
  );
}