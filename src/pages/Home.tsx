import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Download, Github, Linkedin, ExternalLink } from "lucide-react";
import { MainLayout } from "@/components/layout";
import { BootScreen } from "@/components/sections/BootScreen";
import { TerminalWindow, TypingText, NeonButton, StatusBar } from "@/components/terminal";
import { cn } from "@/lib/utils";

// Import project images
import ecommerceDashboard from "@/assets/projects/ecommerce-dashboard.jpg";
import realtimeChat from "@/assets/projects/realtime-chat.jpg";
import cryptoTracker from "@/assets/projects/crypto-tracker.jpg";

const Home = () => {
  const [showBoot, setShowBoot] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
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

  const featuredProjects = [
    { 
      name: "E-Commerce Dashboard", 
      tech: ["React", "Node.js", "PostgreSQL"], 
      status: "completed",
      image: ecommerceDashboard
    },
    { 
      name: "Real-Time Chat App", 
      tech: ["Socket.io", "MongoDB", "Express"], 
      status: "running",
      image: realtimeChat
    },
    { 
      name: "Crypto Portfolio Tracker", 
      tech: ["React", "Web3.js", "GraphQL"], 
      status: "completed",
      image: cryptoTracker
    },
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="min-h-[90vh] flex items-center relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className={cn("space-y-8", showContent && "animate-slide-up")}>
              {/* Status Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neon-green/30 bg-neon-green/5">
                <span className="w-2 h-2 bg-status-online rounded-full animate-pulse" />
                <span className="font-mono text-xs text-neon-green">IT Student • Haramaya University</span>
              </div>

              {/* Heading */}
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="text-muted-foreground font-mono text-lg block mb-2">
                    <span className="neon-text-cyan">$</span> whoami
                  </span>
                  <span className="text-gradient-neon">Full-Stack</span>
                  <br />
                  <span className="text-foreground">Web Developer</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-lg font-mono">
                  IT student at Haramaya University building modern web applications 
                  with JavaScript, React, Node.js, and PostgreSQL.
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
                <Link to="/cv">
                  <NeonButton variant="outline" size="lg">
                    <Download className="w-4 h-4 mr-2" />
                    Download CV
                  </NeonButton>
                </Link>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-4 pt-4">
                <span className="font-mono text-sm text-muted-foreground">Connect:</span>
                <a href="https://github.com/Abishabr" target="_blank" rel="noopener noreferrer" className="p-2 hover:text-neon-green transition-colors">
                  <Github className="w-5 h-5" />
                </a>
                <a href="https://www.linkedin.com/in/abrham-habtamu-24a329310/" target="_blank" rel="noopener noreferrer" className="p-2 hover:text-neon-cyan transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Right Terminal */}
            <div className={cn("hidden lg:block", showContent && "animate-fade-in")} style={{ animationDelay: "0.3s" }}>
              <TerminalWindow title="developer_info.sh" variant="floating">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="neon-text-green">abrham@habtamu</span>
                    <span className="text-muted-foreground">:</span>
                    <span className="neon-text-cyan">~</span>
                    <span className="text-muted-foreground">$</span>
                    <TypingText text="cat developer_info.json" speed={40} showCursor={false} />
                  </div>
                  
                  <div className="pl-4 space-y-1 text-sm">
                    <p><span className="text-neon-cyan">"name"</span>: <span className="text-foreground">"Abrham Habtamu"</span>,</p>
                    <p><span className="text-neon-cyan">"role"</span>: <span className="text-foreground">"Full-Stack Web Developer"</span>,</p>
                    <p><span className="text-neon-cyan">"location"</span>: <span className="text-foreground">"Ethiopia"</span>,</p>
                    <p><span className="text-neon-cyan">"education"</span>: <span className="text-foreground">"IT @ Haramaya University"</span>,</p>
                    <p><span className="text-neon-cyan">"specialties"</span>: [</p>
                    <p className="pl-4"><span className="text-foreground">"JavaScript", "React", "Node.js",</span></p>
                    <p className="pl-4"><span className="text-foreground">"Express", "MySQL", "PostgreSQL"</span></p>
                    <p>],</p>
                    <p><span className="text-neon-cyan">"passions"</span>: [</p>
                    <p className="pl-4"><span className="text-foreground">"Clean Code", "Web Development",</span></p>
                    <p className="pl-4"><span className="text-foreground">"Open Source", "Learning"</span></p>
                    <p>],</p>
                    <p><span className="text-neon-cyan">"status"</span>: <span className="text-status-online">"online"</span></p>
                  </div>

                  <div className="border-t border-terminal-border pt-4 mt-4 space-y-2">
                    <StatusBar label="Availability" value={85} variant="gradient" size="sm" />
                    <StatusBar label="Code Quality" value={95} variant="cyan" size="sm" />
                  </div>
                </div>
              </TerminalWindow>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
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
              { label: "Year", value: "3rd" },
              { label: "Technologies", value: "6+" },
              { label: "Focus", value: "Full-Stack" },
              { label: "Status", value: "Learning" },
            ].map((stat) => (
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
            {featuredProjects.map((project, index) => (
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
                  <div className="aspect-video bg-muted/30 rounded overflow-hidden border border-terminal-border">
                    <img 
                      src={project.image} 
                      alt={project.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
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
