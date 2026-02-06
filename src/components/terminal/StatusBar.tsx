import { cn } from "@/lib/utils";

interface StatusBarProps {
  label: string;
  value: number;
  max?: number;
  variant?: "green" | "cyan" | "gradient";
  showPercentage?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const StatusBar = ({
  label,
  value,
  max = 100,
  variant = "gradient",
  showPercentage = true,
  className,
  size = "md",
}: StatusBarProps) => {
  const percentage = Math.min((value / max) * 100, 100);

  const sizeClasses = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  };

  const variantClasses = {
    green: "bg-neon-green",
    cyan: "bg-neon-cyan",
    gradient: "bg-gradient-to-r from-neon-green to-neon-cyan",
  };

  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex justify-between items-center font-mono text-xs">
        <span className="text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
        {showPercentage && (
          <span className="neon-text-green">{Math.round(percentage)}%</span>
        )}
      </div>
      <div
        className={cn(
          "status-bar",
          sizeClasses[size]
        )}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-1000 ease-out",
            variantClasses[variant]
          )}
          style={{ 
            width: `${percentage}%`,
            boxShadow: variant === "green" 
              ? "0 0 10px hsl(156 100% 50% / 0.5)" 
              : variant === "cyan"
              ? "0 0 10px hsl(186 100% 50% / 0.5)"
              : "0 0 10px hsl(156 100% 50% / 0.5)"
          }}
        />
      </div>
    </div>
  );
};
