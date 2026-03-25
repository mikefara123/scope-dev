import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      {steps.map((label, i) => {
        const stepNum = i + 1;
        const isCompleted = stepNum < currentStep;
        const isCurrent = stepNum === currentStep;

        return (
          <div key={label} className="flex items-center gap-2">
            {/* Step circle */}
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-all",
                  isCompleted && "bg-secondary text-secondary-foreground",
                  isCurrent && "bg-primary text-primary-foreground ring-4 ring-primary/10",
                  !isCompleted && !isCurrent && "bg-border text-muted-foreground"
                )}
              >
                {isCompleted ? <Check className="h-3.5 w-3.5" /> : stepNum}
              </div>
              <span
                className={cn(
                  "hidden text-xs font-medium sm:block",
                  isCurrent ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {label}
              </span>
            </div>

            {/* Connector line */}
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "h-px w-8 transition-colors",
                  isCompleted ? "bg-secondary" : "bg-border"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
