import type { ReactNode } from "react";
import { BrandPanel } from "./BrandPanel";

interface AuthLayoutProps {
  children: ReactNode;
  brandHeadline?: React.ReactNode;
  brandSubtitle?: string;
  brandPills?: string[];
  brandTestimonial?: {
    quote: string;
    name: string;
    title: string;
    initials: string;
  };
}

export function AuthLayout({
  children,
  brandHeadline,
  brandSubtitle,
  brandPills,
  brandTestimonial,
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <BrandPanel
        headline={brandHeadline}
        subtitle={brandSubtitle}
        pills={brandPills}
        testimonial={brandTestimonial}
      />

      <div className="flex flex-1 flex-col bg-[#fafbfc]">
        {/* Mobile header */}
        <div className="flex items-center gap-3 p-6 lg:hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
            <span className="text-sm font-bold text-primary-foreground">S</span>
          </div>
          <span className="text-base font-semibold text-foreground">Scope</span>
        </div>

        {/* Form area */}
        <div className="flex flex-1 items-center justify-center px-6 py-8">
          <div className="w-full max-w-[420px]">{children}</div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 text-center text-[12px] text-muted-foreground/50">
          &copy; {new Date().getFullYear()} Scope. All rights reserved.
        </div>
      </div>
    </div>
  );
}
