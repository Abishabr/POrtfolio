import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout";
import { TerminalWindow, ProcessList, NeonButton } from "@/components/terminal";
import { ExternalLink, Github, Filter, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/hooks/use-scroll-reveal";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

// Fallback images
import ecommerceDashboard from "@/assets/projects/ecommerce-dashboard.jpg";
import realtimeChat from "@/assets/projects/realtime-chat.jpg";
import aiCodeAssistant from "@/assets/projects/ai-code-assistant.jpg";
import cryptoTracker from "@/assets/projects/crypto-tracker.jpg";
import taskManager from "@/assets/projects/task-manager.jpg";
import hutmcWebsite from "@/assets/projects/hutmc-website.jpg";

type DBProject = Tables<"projects">;

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

const fallbackImages: Record<string, string> = {
  "HUTMC Website": hutmcWebsite,
  "E-Commerce Dashboard": ecommerceDashboard,
  "Real-Time Chat App": realtimeChat,
  "AI Code Assistant": aiCodeAssistant,
  "Crypto Portfolio Tracker": cryptoTracker,
  "Task Manager Pro": taskManager,
};

const ensureAbsoluteUrl = (url: string | undefined): string | undefined => {
  if (!url) return undefined;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://${url}`;
};

const mapDBProject = (p: DBProject, idx: number): Project => ({
  pid: 1001 + idx,
  name: p.name,
  status: (p.status as Project["status"]) || "completed",
  description: p.description || "",
  tech: p.tech || [],
  links: {
    github: ensureAbsoluteUrl(p.github_url || undefined),
    live: ensureAbsoluteUrl(p.live_url || undefined),
  },
  image: p.image_url || fallbackImages[p.name],
  featured: p.featured || false,
});

const filters = ["all", "running", "completed", "pending"];

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data } = await supabase.from("projects").select("*").order("display_order");
      if (data) setProjects(data.map(mapDBProject));
      setLoading(false);
    };
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter((p) => {
    const matchesFilter = activeFilter === "all" || p.status === activeFilter;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tech.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <MainLayout>
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="mb-12">
              <p className="font-mono text-sm neon-text-cyan mb-2">
                <span className="text-muted-foreground">$</span> ls -la projects/
              </p>
              <h1 className="text-4xl font-bold mb-4">Projects</h1>
              <p className="text-muted-foreground max-w-2xl">
                A curated collection of full-stack applications, open-source tools, and production systems I've built.
              </p>
            </div>
          </ScrollReveal>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-4 h-4 text-muted-foreground" />
              {filters.map((filter) => (
                <button key={filter} onClick={() => setActiveFilter(filter)}
                  className={cn("px-3 py-1 font-mono text-xs rounded border transition-all",
                    activeFilter === filter ? "border-neon-green bg-neon-green/10 text-neon-green"
                      : "border-terminal-border text-muted-foreground hover:border-neon-green/50")}>
                  {filter}
                </button>
              ))}
            </div>
            <div className="flex-1 relative max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="text" placeholder="Search projects..." value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-muted/30 border border-terminal-border rounded font-mono text-sm focus:outline-none focus:border-neon-green/50" />
            </div>
          </div>

          {loading ? (
            <p className="text-center py-12 font-mono text-sm text-muted-foreground animate-pulse">Loading projects...</p>
          ) : (
            <>
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <ScrollReveal delay={100}>
                    <TerminalWindow title="ps aux --projects" variant="floating">
                      <ProcessList processes={filteredProjects} onProcessClick={(p) => setSelectedProject(p as Project)} />
                    </TerminalWindow>
                  </ScrollReveal>
                </div>

                <div className="lg:col-span-1">
                  <ScrollReveal delay={200}>
                    <TerminalWindow
                      title={selectedProject ? `${selectedProject.name.toLowerCase().replace(/\s+/g, '_')}.info` : "select_project.txt"}
                      variant="floating">
                      {selectedProject ? (
                        <div className="space-y-4">
                          {selectedProject.image && (
                            <div className="aspect-video rounded overflow-hidden border border-terminal-border">
                              <img src={selectedProject.image} alt={selectedProject.name} className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <span className={cn("w-2 h-2 rounded-full",
                              selectedProject.status === "running" ? "bg-status-online animate-pulse" :
                              selectedProject.status === "completed" ? "bg-neon-cyan" :
                              selectedProject.status === "pending" ? "bg-status-warning" : "bg-status-error")} />
                            <span className="font-mono text-xs text-muted-foreground uppercase">{selectedProject.status}</span>
                            {selectedProject.featured && (
                              <span className="px-2 py-0.5 text-xs bg-neon-green/10 text-neon-green rounded font-mono">featured</span>
                            )}
                          </div>
                          <h3 className="text-xl font-bold neon-text-green">{selectedProject.name}</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">{selectedProject.description}</p>
                          <div>
                            <p className="font-mono text-xs text-muted-foreground mb-2">TECHNOLOGIES</p>
                            <div className="flex flex-wrap gap-2">
                              {selectedProject.tech.map((t) => (
                                <span key={t} className="px-2 py-1 text-xs font-mono bg-muted rounded border border-terminal-border">{t}</span>
                              ))}
                            </div>
                          </div>
                          <div className="flex gap-2 pt-4">
                            {selectedProject.links.github && (
                              <a href={selectedProject.links.github} target="_blank" rel="noopener noreferrer" className="flex-1">
                                <NeonButton variant="outline" size="sm" className="w-full">
                                  <Github className="w-4 h-4 mr-1" /> Code
                                </NeonButton>
                              </a>
                            )}
                            {selectedProject.links.live && (
                              <a href={selectedProject.links.live} target="_blank" rel="noopener noreferrer" className="flex-1">
                                <NeonButton variant="green" size="sm" className="w-full">
                                  <ExternalLink className="w-4 h-4 mr-1" /> Live
                                </NeonButton>
                              </a>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <p className="font-mono text-sm">Select a process from the list</p>
                          <p className="font-mono text-xs mt-2">to view project details</p>
                        </div>
                      )}
                    </TerminalWindow>
                  </ScrollReveal>
                </div>
              </div>

              <ScrollReveal>
                <div className="mt-16">
                  <h2 className="font-mono text-lg neon-text-cyan mb-6">
                    <span className="text-muted-foreground">$</span> ls --featured
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.filter(p => p.featured).map((project, index) => (
                      <ScrollReveal key={project.pid} delay={index * 150}>
                        <div onClick={() => setSelectedProject(project)}
                          className={cn("bg-card border border-terminal-border rounded-sm cursor-pointer group overflow-hidden",
                            "hover:shadow-[0_0_30px_hsl(156_100%_50%_/_0.15)] transition-all duration-300")}>
                          <div className="flex items-center justify-between px-3 py-1.5 bg-muted/50 border-b border-terminal-border">
                            <span className="font-mono text-xs text-muted-foreground truncate max-w-[180px]">
                              {project.name.toLowerCase().replace(/\s+/g, '_')}.exe
                            </span>
                            <div className="flex items-center">
                              <div className="px-2 py-0.5 hover:bg-muted transition-colors"><span className="text-muted-foreground text-xs">─</span></div>
                              <div className="px-2 py-0.5 hover:bg-muted transition-colors"><span className="text-muted-foreground text-xs">□</span></div>
                              <div className="px-2 py-0.5 hover:bg-status-error/80 transition-colors group/close">
                                <span className="text-muted-foreground group-hover/close:text-foreground text-xs">✕</span>
                              </div>
                            </div>
                          </div>
                          <div className="p-6">
                            <div className="aspect-video bg-muted/30 rounded mb-4 overflow-hidden border border-terminal-border">
                              {project.image ? (
                                <img src={project.image} alt={project.name} loading="lazy"
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <span className="font-mono text-xs text-muted-foreground">screenshot.png</span>
                                </div>
                              )}
                            </div>
                            <h3 className="font-bold mb-2 group-hover:text-neon-green transition-colors">{project.name}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{project.description}</p>
                            <div className="flex flex-wrap gap-1">
                              {project.tech.slice(0, 3).map((t) => (
                                <span key={t} className="px-2 py-0.5 text-xs font-mono bg-muted rounded">{t}</span>
                              ))}
                              {project.tech.length > 3 && (
                                <span className="px-2 py-0.5 text-xs font-mono text-muted-foreground">+{project.tech.length - 3}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </ScrollReveal>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            </>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default Projects;
