import * as React from "react"
import { cn } from "./utils"

export interface TextInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-secondary selection:text-white border-border flex h-10 w-full min-w-0 rounded-lg border bg-card px-4 py-2 text-sm transition-all outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          "focus:border-ring focus:ring-2 focus:ring-ring/20 hover:border-muted-foreground/30",
          "aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

TextInput.displayName = "TextInput"
