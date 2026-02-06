import { cn } from "@/lib/utils";

interface Process {
  pid: number;
  name: string;
  status: "running" | "stopped" | "completed" | "pending";
  cpu?: number;
  memory?: number;
  description?: string;
}

interface ProcessListProps {
  processes: Process[];
  className?: string;
  onProcessClick?: (process: Process) => void;
}

export const ProcessList = ({
  processes,
  className,
  onProcessClick,
}: ProcessListProps) => {
  const statusColors = {
    running: "text-status-online",
    stopped: "text-status-error",
    completed: "text-neon-cyan",
    pending: "text-status-warning",
  };

  const statusIcons = {
    running: "●",
    stopped: "○",
    completed: "✓",
    pending: "◐",
  };

  return (
    <div className={cn("font-mono text-sm", className)}>
      {/* Header */}
      <div className="grid grid-cols-12 gap-2 text-muted-foreground text-xs uppercase tracking-wider border-b border-terminal-border pb-2 mb-2">
        <span className="col-span-1">PID</span>
        <span className="col-span-4">Name</span>
        <span className="col-span-2">Status</span>
        <span className="col-span-2 text-right">CPU</span>
        <span className="col-span-2 text-right">MEM</span>
        <span className="col-span-1" />
      </div>

      {/* Process Rows */}
      <div className="space-y-1">
        {processes.map((process) => (
          <div
            key={process.pid}
            onClick={() => onProcessClick?.(process)}
            className={cn(
              "grid grid-cols-12 gap-2 py-2 px-1 rounded",
              "hover:bg-muted/30 transition-colors cursor-pointer",
              "group"
            )}
          >
            <span className="col-span-1 text-muted-foreground">
              {process.pid}
            </span>
            <span className="col-span-4 neon-text-green truncate">
              {process.name}
            </span>
            <span className={cn("col-span-2 flex items-center gap-1", statusColors[process.status])}>
              <span className="animate-pulse">{statusIcons[process.status]}</span>
              {process.status}
            </span>
            <span className="col-span-2 text-right text-muted-foreground">
              {process.cpu ?? "-"}%
            </span>
            <span className="col-span-2 text-right text-muted-foreground">
              {process.memory ?? "-"}MB
            </span>
            <span className="col-span-1 text-right opacity-0 group-hover:opacity-100 transition-opacity neon-text-cyan">
              →
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
