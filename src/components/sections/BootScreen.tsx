import { useState, useEffect } from "react";
import { TypingText } from "@/components/terminal";
import { cn } from "@/lib/utils";

interface BootScreenProps {
  onComplete?: () => void;
  duration?: number;
}

const bootSequence = [
  { text: "INITIALIZING SYSTEM...", delay: 0 },
  { text: "[OK] Loading kernel modules", delay: 800 },
  { text: "[OK] Mounting file systems", delay: 1200 },
  { text: "[OK] Starting network services", delay: 1600 },
  { text: "[OK] Loading portfolio data", delay: 2000 },
  { text: "[OK] Initializing UI components", delay: 2400 },
  { text: "SYSTEM READY", delay: 2800 },
];

export const BootScreen = ({ onComplete, duration = 4000 }: BootScreenProps) => {
  const [currentLine, setCurrentLine] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (currentLine < bootSequence.length) {
      const timer = setTimeout(() => {
        setCurrentLine((prev) => prev + 1);
      }, 400);
      return () => clearTimeout(timer);
    } else {
      setTimeout(() => {
        setIsComplete(true);
        setTimeout(() => {
          setFadeOut(true);
          setTimeout(() => {
            onComplete?.();
          }, 500);
        }, 800);
      }, 500);
    }
  }, [currentLine, onComplete]);

  return (
    <div
      className={cn(
        "fixed inset-0 bg-background z-50 flex items-center justify-center",
        "transition-opacity duration-500",
        fadeOut && "opacity-0 pointer-events-none"
      )}
    >
      <div className="w-full max-w-2xl px-6">
        <div className="terminal-window">
          <div className="terminal-header">
            <div className="flex items-center gap-2">
              <div className="terminal-dot bg-status-error" />
              <div className="terminal-dot bg-status-warning" />
              <div className="terminal-dot bg-status-online" />
            </div>
            <span className="ml-4 font-mono text-xs text-muted-foreground">
              system_boot.sh
            </span>
          </div>
          <div className="terminal-body space-y-2 min-h-[300px]">
            {bootSequence.slice(0, currentLine).map((line, index) => (
              <div
                key={index}
                className={cn(
                  "font-mono text-sm animate-fade-in",
                  index === 0 && "neon-text-cyan font-bold",
                  index === bootSequence.length - 1 && "neon-text-green font-bold text-lg mt-4"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {line.text}
              </div>
            ))}
            {!isComplete && (
              <div className="flex items-center gap-2 mt-4">
                <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
                <span className="font-mono text-sm text-muted-foreground">
                  Processing...
                </span>
              </div>
            )}
            {isComplete && (
              <div className="mt-6 text-center animate-fade-in">
                <p className="font-mono text-sm text-muted-foreground">
                  Press any key or wait to continue...
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-6 space-y-2">
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-neon-green to-neon-cyan transition-all duration-300"
              style={{
                width: `${(currentLine / bootSequence.length) * 100}%`,
              }}
            />
          </div>
          <p className="font-mono text-xs text-center text-muted-foreground">
            {Math.round((currentLine / bootSequence.length) * 100)}% complete
          </p>
        </div>
      </div>
    </div>
  );
};
