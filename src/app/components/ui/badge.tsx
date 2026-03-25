import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none transition-all duration-200",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-sm",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm",
        outline:
          "border-2 border-border text-foreground bg-card hover:bg-muted",
        success:
          "bg-[var(--color-success)] text-white shadow-sm",
        warning:
          "bg-[var(--color-warning)] text-white shadow-sm",
        info:
          "bg-[var(--color-info)] text-white shadow-sm",
        subtle:
          "bg-muted text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };