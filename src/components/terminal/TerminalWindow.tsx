import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TerminalWindowProps {
  title?: string;
  children: ReactNode;
  className?: string;
  showControls?: boolean;
  variant?: "default" | "minimal" | "floating";
}

export const TerminalWindow = ({
  title = "terminal",
  children,
  className,
  showControls = true,
  variant = "default",
}: TerminalWindowProps) => {
  return (
    <div
      className={cn(
        "terminal-window",
        variant === "floating" && "shadow-2xl shadow-neon-green/20",
        variant === "minimal" && "border-0 bg-transparent",
        className
      )}
    >
      {showControls && (
        <div className="terminal-header">
          <div className="flex items-center gap-2">
            <div className="terminal-dot bg-status-error" />
            <div className="terminal-dot bg-status-warning" />
            <div className="terminal-dot bg-status-online" />
          </div>
          <span className="ml-4 font-mono text-xs text-muted-foreground">
            {title}
          </span>
        </div>
      )}
      <div className="terminal-body">{children}</div>
    </div>
  );
};
