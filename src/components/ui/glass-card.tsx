import * as React from "react";
import { cn } from "@/lib/utils";

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "premium" | "subtle";
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variants = {
      default: "bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] shadow-elegant",
      premium: "bg-gradient-primary/10 backdrop-blur-xl border border-primary/20 shadow-glow",
      subtle: "bg-card/60 backdrop-blur-md border border-border/30",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl transition-all duration-300",
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);
GlassCard.displayName = "GlassCard";

export { GlassCard };
