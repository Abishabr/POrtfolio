import { useState } from "react";
import { MainLayout } from "@/components/layout";
import { TerminalWindow, ProcessList, NeonButton } from "@/components/terminal";
import { ExternalLink, Github, Filter, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface Project {
  pid: number;
  name: string;
  status: "running" | "stopped" | "completed" | "pending";
  cpu: number;
  memory: number;
  description: string;
  tech: string[];
  links: { github?: string; live?: string };
  image?: string;
  featured?: boolean;
}

const projects: Project[] = [
  {
    pid: 1001,
    name: "E-Commerce Platform",
    status: "completed",
    cpu: 12,
    memory: 256,
    description: "A full-featured e-commerce platform with payment processing, inventory management, and analytics dashboard.",
    tech: ["React", "Node.js", "PostgreSQL", "Stripe", "AWS"],
    links: { github: "#", live: "#" },
    featured: true,
  },
  {
    pid: 1002,
    name: "AI Content Generator",
    status: "running",
    cpu: 45,
    memory: 512,
    description: "An AI-powered content generation tool using GPT models for blog posts, social media, and marketing copy.",
    tech: ["Python", "FastAPI", "OpenAI", "React", "Redis"],
    links: { github: "#", live: "#" },
    featured: true,
  },
  {
    pid: 1003,
    name: "Real-Time Chat App",
    status: "completed",
    cpu: 8,
    memory: 128,
    description: "A real-time messaging application with WebSocket support, file sharing, and end-to-end encryption.",
    tech: ["React", "Socket.io", "MongoDB", "Express"],
    links: { github: "#" },
  },
  {
    pid: 1004,
    name: "DevOps Dashboard",
    status: "running",
    cpu: 22,
    memory: 384,
    description: "A comprehensive DevOps monitoring dashboard with CI/CD pipeline visualization and alerts.",
    tech: ["Vue.js", "Go", "Kubernetes", "Prometheus"],
    links: { github: "#", live: "#" },
    featured: true,
  },
  {
    pid: 1005,
    name: "Mobile Banking App",
    status: "completed",
    cpu: 5,
    memory: 96,
    description: "A secure mobile banking application with biometric authentication and transaction history.",
    tech: ["React Native", "GraphQL", "PostgreSQL"],
    links: { live: "#" },
  },
  {
    pid: 1006,
    name: "Portfolio CMS",
    status: "pending",
    cpu: 0,
    memory: 0,
    description: "A headless CMS designed specifically for developer portfolios with Markdown support.",
    tech: ["Next.js", "Prisma", "MDX", "Tailwind"],
    links: { github: "#" },
  },
];

const filters = ["all", "running", "completed", "pending"];

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

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
          {/* Header */}
          <div className="mb-12">
            <p className="font-mono text-sm neon-text-cyan mb-2">
              <span className="text-muted-foreground">$</span> ls -la projects/
            </p>
            <h1 className="text-4xl font-bold mb-4">Projects</h1>
            <p className="text-muted-foreground max-w-2xl">
              A collection of projects I've built, from full-stack applications to open-source tools.
            </p>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-4 h-4 text-muted-foreground" />
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={cn(
                    "px-3 py-1 font-mono text-xs rounded border transition-all",
                    activeFilter === filter
                      ? "border-neon-green bg-neon-green/10 text-neon-green"
                      : "border-terminal-border text-muted-foreground hover:border-neon-green/50"
                  )}
                >
                  {filter}
                </button>
              ))}
            </div>
            <div className="flex-1 relative max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-muted/30 border border-terminal-border rounded font-mono text-sm focus:outline-none focus:border-neon-green/50"
              />
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Process List View */}
            <div className="lg:col-span-2">
              <TerminalWindow title="ps aux --projects" variant="floating">
                <ProcessList
                  processes={filteredProjects}
                  onProcessClick={(p) => setSelectedProject(p as Project)}
                />
              </TerminalWindow>
            </div>

            {/* Selected Project Details */}
            <div className="lg:col-span-1">
              <TerminalWindow
                title={selectedProject ? `${selectedProject.name.toLowerCase().replace(/\s+/g, '_')}.info` : "select_project.txt"}
                variant="floating"
              >
                {selectedProject ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "w-2 h-2 rounded-full",
                        selectedProject.status === "running" ? "bg-status-online animate-pulse" :
                        selectedProject.status === "completed" ? "bg-neon-cyan" :
                        selectedProject.status === "pending" ? "bg-status-warning" : "bg-status-error"
                      )} />
                      <span className="font-mono text-xs text-muted-foreground uppercase">
                        {selectedProject.status}
                      </span>
                      {selectedProject.featured && (
                        <span className="px-2 py-0.5 text-xs bg-neon-green/10 text-neon-green rounded font-mono">
                          featured
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold neon-text-green">{selectedProject.name}</h3>
                    
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {selectedProject.description}
                    </p>

                    <div>
                      <p className="font-mono text-xs text-muted-foreground mb-2">TECHNOLOGIES</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.tech.map((t) => (
                          <span key={t} className="px-2 py-1 text-xs font-mono bg-muted rounded border border-terminal-border">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-terminal-border space-y-2">
                      <div className="flex justify-between font-mono text-xs">
                        <span className="text-muted-foreground">CPU Usage</span>
                        <span className="neon-text-green">{selectedProject.cpu}%</span>
                      </div>
                      <div className="flex justify-between font-mono text-xs">
                        <span className="text-muted-foreground">Memory</span>
                        <span className="neon-text-cyan">{selectedProject.memory}MB</span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                      {selectedProject.links.github && (
                        <NeonButton variant="outline" size="sm" className="flex-1">
                          <Github className="w-4 h-4 mr-1" />
                          Code
                        </NeonButton>
                      )}
                      {selectedProject.links.live && (
                        <NeonButton variant="green" size="sm" className="flex-1">
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Live
                        </NeonButton>
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
            </div>
          </div>

          {/* Grid View for Featured */}
          <div className="mt-16">
            <h2 className="font-mono text-lg neon-text-cyan mb-6">
              <span className="text-muted-foreground">$</span> ls --featured
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.filter(p => p.featured).map((project) => (
                <div
                  key={project.pid}
                  onClick={() => setSelectedProject(project)}
                  className={cn(
                    "terminal-window cursor-pointer group",
                    "hover:shadow-[0_0_30px_hsl(156_100%_50%_/_0.15)]",
                    "transition-all duration-300"
                  )}
                >
                  <div className="terminal-header">
                    <div className="flex items-center gap-2">
                      <div className="terminal-dot bg-status-error" />
                      <div className="terminal-dot bg-status-warning" />
                      <div className="terminal-dot bg-status-online" />
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="aspect-video bg-muted/30 rounded mb-4 flex items-center justify-center border border-terminal-border">
                      <span className="font-mono text-xs text-muted-foreground">screenshot.png</span>
                    </div>
                    <h3 className="font-bold mb-2 group-hover:text-neon-green transition-colors">
                      {project.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {project.tech.slice(0, 3).map((t) => (
                        <span key={t} className="px-2 py-0.5 text-xs font-mono bg-muted rounded">
                          {t}
                        </span>
                      ))}
                      {project.tech.length > 3 && (
                        <span className="px-2 py-0.5 text-xs font-mono text-muted-foreground">
                          +{project.tech.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Projects;
