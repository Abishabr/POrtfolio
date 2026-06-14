import { useEffect, useCallback } from "react";
import { X, Github, ExternalLink, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { NeonButton } from "@/components/terminal";

interface Project {
  pid: number;
  name: string;
  status: "running" | "stopped" | "completed" | "pending";
  description: string;
  tech: string[];
  links: { github?: string; live?: string };
  image?: string;
  featured?: boolean;
}

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

const statusConfig = {
  running:   { color: "bg-status-online",   label: "Running",   dot: "animate-pulse" },
  completed: { color: "bg-neon-cyan",        label: "Completed", dot: "" },
  pending:   { color: "bg-status-warning",   label: "Pending",   dot: "" },
  stopped:   { color: "bg-status-error",     label: "Stopped",   dot: "" },
};

export const ProjectModal = ({ project, onClose }: ProjectModalProps) => {
  // Close on Escape key
  const handleKey = useCallback(
    (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); },
    [onClose]
  );

  useEffect(() => {
    if (!project) return;
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [project, handleKey]);

  if (!project) return null;

  const status = statusConfig[project.status] ?? statusConfig.completed;

  return (
    // Backdrop
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6",
        "bg-black/70 backdrop-blur-md",
        "animate-in fade-in duration-200"
      )}
      onClick={onClose}
    >
      {/* Modal panel */}
      <div
        className={cn(
          "relative w-full max-w-3xl max-h-[90vh] overflow-y-auto",
          "rounded-2xl border border-white/10",
          "bg-[hsl(220_20%_6%_/_0.85)] backdrop-blur-xl",
          "shadow-[0_0_60px_hsl(156_100%_50%_/_0.12),0_25px_80px_hsl(0_0%_0%_/_0.6)]",
          "animate-in fade-in zoom-in-95 duration-300"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Terminal-style header bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-white/5 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-status-error/80" />
            <span className="w-3 h-3 rounded-full bg-status-warning/80" />
            <span className="w-3 h-3 rounded-full bg-status-online/80" />
          </div>
          <span className="font-mono text-xs text-muted-foreground">
            {project.name.toLowerCase().replace(/\s+/g, "_")}.info
          </span>
          <button
            onClick={onClose}
            className={cn(
              "flex items-center justify-center w-7 h-7 rounded-full",
              "text-muted-foreground hover:text-foreground",
              "bg-white/5 hover:bg-white/15 border border-white/10",
              "transition-all duration-150"
            )}
            aria-label="Close modal"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6">

          {/* Project image */}
          {project.image && (
            <div className="aspect-video w-full rounded-xl overflow-hidden border border-white/10 bg-muted/20">
              <img
                src={project.image}
                alt={project.name}
                className="w-full h-full object-cover"
              />
              {/* Neon glow overlay on image bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[hsl(220_20%_6%_/_0.7)] to-transparent pointer-events-none rounded-b-xl" />
            </div>
          )}

          {/* Title row */}
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className={cn("w-2 h-2 rounded-full", status.color, status.dot)} />
                <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
                  {status.label}
                </span>
                {project.featured && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-mono bg-neon/10 border border-neon-green/30 text-neon-green">
                    <Zap className="w-2.5 h-2.5" /> featured
                  </span>
                )}
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold neon-text-green leading-tight">
                {project.name}
              </h2>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-2">
              // description
            </p>
            <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Tech stack */}
          <div className="space-y-2">
            <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
              // tech_stack
            </p>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className={cn(
                    "px-3 py-1 text-xs font-mono rounded-full",
                    "bg-white/5 border border-white/10",
                    "text-neon-cyan",
                    "hover:bg-neon-cyan/10 hover:border-neon-cyan/30",
                    "transition-colors duration-150"
                  )}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/10" />

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {project.links.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <NeonButton variant="outline" size="sm" className="w-full gap-2 justify-center">
                  <Github className="w-4 h-4" />
                  View on GitHub
                </NeonButton>
              </a>
            )}
            {project.links.live && (
              <a
                href={project.links.live}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <NeonButton variant="green" size="sm" className="w-full gap-2 justify-center">
                  <ExternalLink className="w-4 h-4" />
                  Live Demo
                </NeonButton>
              </a>
            )}
            {!project.links.github && !project.links.live && (
              <p className="font-mono text-xs text-muted-foreground italic">
                // links not available yet
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
