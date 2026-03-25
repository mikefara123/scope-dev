import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SubscriptionTier } from "@/types";

interface PlanCardProps {
  tier: SubscriptionTier;
  name: string;
  price: string;
  period?: string;
  licenses: string;
  highlight?: string;
  isSelected: boolean;
  isPopular?: boolean;
  onSelect: () => void;
}

export function PlanCard({
  name,
  price,
  period = "/mo",
  licenses,
  highlight,
  isSelected,
  isPopular,
  onSelect,
}: PlanCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "relative flex flex-1 flex-col items-center rounded-2xl border-2 px-3 py-5 text-center transition-all",
        isSelected
          ? "border-secondary bg-secondary/5 shadow-sm ring-2 ring-secondary/20"
          : "border-border bg-white hover:border-border-strong hover:shadow-xs"
      )}
    >
      {isPopular && (
        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-semibold text-secondary-foreground">
          Popular
        </span>
      )}

      {/* Radio indicator */}
      <div className="mb-3">
        {isSelected ? (
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary">
            <Check className="h-3 w-3 text-white" />
          </div>
        ) : (
          <Circle className="h-5 w-5 text-border" />
        )}
      </div>

      <p className="text-sm font-semibold text-foreground">{name}</p>

      <div className="mt-2">
        <span className="text-xl font-bold text-foreground">{price}</span>
        {price !== "Custom" && (
          <span className="text-xs text-muted-foreground">{period}</span>
        )}
      </div>

      <p className="mt-1.5 text-[11px] text-muted-foreground">{licenses}</p>

      {highlight && (
        <p className="mt-2.5 rounded-md bg-muted px-2 py-1 text-[10px] font-medium text-muted-foreground">
          {highlight}
        </p>
      )}
    </button>
  );
}
