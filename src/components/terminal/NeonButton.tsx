import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "green" | "cyan" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  glow?: boolean;
}

export const NeonButton = forwardRef<HTMLButtonElement, NeonButtonProps>(
  ({ className, variant = "green", size = "md", glow = true, children, ...props }, ref) => {
    const sizeClasses = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base",
    };

    const variantClasses = {
      green: cn(
        "bg-neon-green text-primary-foreground",
        "hover:bg-neon-green/90",
        glow && "shadow-[0_0_20px_hsl(156_100%_50%_/_0.3)] hover:shadow-[0_0_30px_hsl(156_100%_50%_/_0.5)]"
      ),
      cyan: cn(
        "bg-neon-cyan text-secondary-foreground",
        "hover:bg-neon-cyan/90",
        glow && "shadow-[0_0_20px_hsl(186_100%_50%_/_0.3)] hover:shadow-[0_0_30px_hsl(186_100%_50%_/_0.5)]"
      ),
      outline: cn(
        "border border-neon-green bg-transparent text-neon-green",
        "hover:bg-neon-green/10",
        glow && "shadow-[0_0_10px_hsl(156_100%_50%_/_0.2)] hover:shadow-[0_0_20px_hsl(156_100%_50%_/_0.3)]"
      ),
      ghost: cn(
        "bg-transparent text-neon-green",
        "hover:bg-neon-green/10"
      ),
    };

    return (
      <button
        ref={ref}
        className={cn(
          "font-mono font-medium rounded transition-all duration-300",
          "focus:outline-none focus:ring-2 focus:ring-neon-green/50",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

NeonButton.displayName = "NeonButton";
