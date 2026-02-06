import { useState, KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

interface CommandLineProps {
  prompt?: string;
  placeholder?: string;
  onSubmit?: (command: string) => void;
  className?: string;
  disabled?: boolean;
}

export const CommandLine = ({
  prompt = "guest@portfolio",
  placeholder = "type a command...",
  onSubmit,
  className,
  disabled = false,
}: CommandLineProps) => {
  const [input, setInput] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input.trim()) {
      onSubmit?.(input.trim());
      setInput("");
    }
  };

  return (
    <div
      className={cn(
        "flex items-center gap-2 font-mono text-sm",
        className
      )}
    >
      <span className="neon-text-green whitespace-nowrap">{prompt}</span>
      <span className="neon-text-cyan">:</span>
      <span className="text-muted-foreground">~</span>
      <span className="neon-text-cyan">$</span>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          "flex-1 bg-transparent border-none outline-none",
          "text-foreground placeholder:text-muted-foreground/50",
          "focus:ring-0"
        )}
      />
      <span className="w-2 h-4 bg-primary animate-blink" />
    </div>
  );
};
