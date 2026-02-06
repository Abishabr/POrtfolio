import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Download, Github, Linkedin, ExternalLink } from "lucide-react";
import { MainLayout } from "@/components/layout";
import { BootScreen } from "@/components/sections/BootScreen";
import { TerminalWindow, TypingText, NeonButton, StatusBar } from "@/components/terminal";
import { cn } from "@/lib/utils";

const Home = () => {
  const [showBoot, setShowBoot] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Check if boot was already shown in this session
    const bootShown = sessionStorage.getItem("bootShown");
    if (bootShown) {
      setShowBoot(false);
      setShowContent(true);
    }
  }, []);

  const handleBootComplete = () => {
    sessionStorage.setItem("bootShown", "true");
    setShowBoot(false);
    setTimeout(() => setShowContent(true), 100);
  };

  if (showBoot) {
    return <BootScreen onComplete={handleBootComplete} />;
  }

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="min-h-[90vh] flex items-center relative overflow-hidden">
        {/* Decorative grid */}
        <div className="absolute inset-0 grid-bg opacity-30" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className={cn("space-y-8", showContent && "animate-slide-up")}>
              {/* Status Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neon-green/30 bg-neon-green/5">
                <span className="w-2 h-2 bg-status-online rounded-full animate-pulse" />
                <span className="font-mono text-xs text-neon-green">Available for hire</span>
              </div>

              {/* Heading */}
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="text-muted-foreground font-mono text-lg block mb-2">
                    <span className="neon-text-cyan">$</span> whoami
                  </span>
                  <span className="text-gradient-neon">Full-Stack</span>
                  <br />
                  <span className="text-foreground">Developer</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-lg font-mono">
                  Building digital experiences with clean code, modern tech, and a passion for performance.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <Link to="/projects">
                  <NeonButton variant="green" size="lg" className="group">
                    View Projects
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </NeonButton>
                </Link>
                <NeonButton variant="outline" size="lg">
                  <Download className="w-4 h-4 mr-2" />
                  Download CV
                </NeonButton>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-4 pt-4">
                <span className="font-mono text-sm text-muted-foreground">Connect:</span>
                <a href="#" className="p-2 hover:text-neon-green transition-colors">
                  <Github className="w-5 h-5" />
                </a>
                <a href="#" className="p-2 hover:text-neon-cyan transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Right Terminal */}
            <div className={cn("hidden lg:block", showContent && "animate-fade-in")} style={{ animationDelay: "0.3s" }}>
              <TerminalWindow title="developer_info.sh" variant="floating">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="neon-text-green">guest@portfolio</span>
                    <span className="text-muted-foreground">:</span>
                    <span className="neon-text-cyan">~</span>
                    <span className="text-muted-foreground">$</span>
                    <TypingText text="cat developer_info.json" speed={40} showCursor={false} />
                  </div>
                  
                  <div className="pl-4 space-y-1 text-sm">
                    <p><span className="text-neon-cyan">"name"</span>: <span className="text-foreground">"John Developer"</span>,</p>
                    <p><span className="text-neon-cyan">"role"</span>: <span className="text-foreground">"Full-Stack Developer"</span>,</p>
                    <p><span className="text-neon-cyan">"location"</span>: <span className="text-foreground">"San Francisco, CA"</span>,</p>
                    <p><span className="text-neon-cyan">"experience"</span>: <span className="text-neon-green">5</span>,</p>
                    <p><span className="text-neon-cyan">"skills"</span>: [</p>
                    <p className="pl-4"><span className="text-foreground">"React", "Node.js", "TypeScript",</span></p>
                    <p className="pl-4"><span className="text-foreground">"Python", "PostgreSQL", "AWS"</span></p>
                    <p>],</p>
                    <p><span className="text-neon-cyan">"status"</span>: <span className="text-status-online">"online"</span></p>
                  </div>

                  <div className="border-t border-terminal-border pt-4 mt-4 space-y-2">
                    <StatusBar label="Current Workload" value={35} variant="gradient" size="sm" />
                    <StatusBar label="Coffee Level" value={85} variant="cyan" size="sm" />
                  </div>
                </div>
              </TerminalWindow>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-float">
          <div className="flex flex-col items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground">scroll</span>
            <div className="w-px h-8 bg-gradient-to-b from-neon-green to-transparent" />
          </div>
        </div>
      </section>

      {/* Quick Stats Section */}
      <section className="py-20 border-t border-terminal-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Years Experience", value: "5+" },
              { label: "Projects Completed", value: "50+" },
              { label: "Technologies", value: "20+" },
              { label: "Coffee Consumed", value: "∞" },
            ].map((stat, index) => (
              <div
                key={stat.label}
                className={cn(
                  "text-center p-6 rounded-lg border border-terminal-border",
                  "bg-card/50 backdrop-blur-sm",
                  "hover:border-neon-green/50 transition-all duration-300",
                  "hover:shadow-[0_0_20px_hsl(156_100%_50%_/_0.1)]"
                )}
              >
                <p className="text-3xl font-bold neon-text-green mb-2">{stat.value}</p>
                <p className="font-mono text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects Preview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <p className="font-mono text-sm neon-text-cyan mb-2">
                <span className="text-muted-foreground">$</span> ls projects/ --featured
              </p>
              <h2 className="text-3xl font-bold">Featured Projects</h2>
            </div>
            <Link to="/projects">
              <NeonButton variant="ghost" size="sm">
                View All <ExternalLink className="w-4 h-4 ml-1" />
              </NeonButton>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "E-Commerce Platform", tech: ["React", "Node.js", "PostgreSQL"], status: "completed" },
              { name: "AI Dashboard", tech: ["Python", "TensorFlow", "React"], status: "running" },
              { name: "Mobile Banking App", tech: ["React Native", "GraphQL"], status: "completed" },
            ].map((project, index) => (
              <div
                key={project.name}
                className={cn(
                  "terminal-window group cursor-pointer",
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
                  <span className="ml-4 font-mono text-xs text-muted-foreground truncate">
                    project_{index + 1}.exe
                  </span>
                </div>
                <div className="p-6 space-y-4">
                  <div className="aspect-video bg-muted/30 rounded flex items-center justify-center">
                    <span className="font-mono text-sm text-muted-foreground">preview.png</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg group-hover:text-neon-green transition-colors">
                      {project.name}
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {project.tech.map((t) => (
                        <span key={t} className="px-2 py-1 text-xs font-mono bg-muted rounded">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className={cn(
                      "w-2 h-2 rounded-full",
                      project.status === "running" ? "bg-status-online animate-pulse" : "bg-neon-cyan"
                    )} />
                    <span className="font-mono text-muted-foreground">{project.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Home;
