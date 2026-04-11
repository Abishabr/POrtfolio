import { MainLayout } from "@/components/layout";
import { TerminalWindow, TypingText, StatusBar } from "@/components/terminal";
import { MapPin, Calendar, Award, Code2, Coffee, Zap, Download, BookOpen, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/hooks/use-scroll-reveal";
import profileAvatar from "@/assets/profile-avatar.png";

const About = ({ onOpenCV }: { onOpenCV?: () => void }) => {
  return (
    <MainLayout>
      <section className="py-20">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <ScrollReveal>
            <div className="mb-12 flex items-center justify-between flex-wrap gap-6">
              <div className="flex items-center gap-6">
                <div className="w-32 h-32 rounded-full border-2 border-neon-green/50 overflow-hidden shadow-[0_0_30px_hsl(156_100%_50%_/_0.2)]">
                  <img src={profileAvatar} alt="Abrham Habtamu" width={512} height={512} loading="lazy" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-mono text-sm neon-text-cyan mb-2">
                    <span className="text-muted-foreground">$</span> cat about.md
                  </p>
                  <h1 className="text-4xl font-bold">About Me</h1>
                </div>
              </div>
              <button
                onClick={onOpenCV}
                className={cn(
                  "inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-mono text-sm",
                  "bg-neon-green/10 border border-neon-green/30 text-neon-green",
                  "hover:bg-neon-green/20 hover:border-neon-green/50 hover:shadow-[0_0_20px_hsl(156_100%_50%_/_0.15)]",
                  "transition-all duration-300"
                )}
              >
                <Download className="w-4 h-4" />
                Download CV
              </button>
            </div>
          </ScrollReveal>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Bio Terminal */}
            <div className="space-y-6">
              <ScrollReveal delay={100}>
                <TerminalWindow title="biography.txt" variant="floating">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="neon-text-green">abrham@habtamu</span>
                      <span className="text-muted-foreground">$</span>
                      <TypingText text="cat biography.txt" speed={30} showCursor={false} />
                    </div>

                    <div className="space-y-4 text-sm leading-relaxed">
                      <p>
                        Hello! I'm Abrham Habtamu, a passionate full-stack web developer 
                        and 3rd year IT student at Haramaya University, Ethiopia.
                      </p>
                      <p>
                        I specialize in JavaScript ecosystems including React for frontend 
                        and Node.js with Express for backend development. I work with both 
                        MySQL and PostgreSQL databases to build complete web applications.
                      </p>
                      <p>
                        As a student developer, I'm constantly learning and building projects 
                        to sharpen my skills. I'm passionate about writing clean, efficient 
                        code and creating user-friendly web experiences.
                      </p>
                      <p>
                        I'm actively looking for internships and collaboration opportunities 
                        to grow as a developer. When not coding, I explore new technologies 
                        and contribute to the developer community.
                      </p>
                    </div>

                    <div className="pt-4 border-t border-terminal-border">
                      <p className="text-xs text-muted-foreground">
                        <span className="text-neon-green">EOF</span> - End of file
                      </p>
                    </div>
                  </div>
                </TerminalWindow>
              </ScrollReveal>

              {/* Personal Info Cards */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: MapPin, label: "Location", value: "Ethiopia" },
                  { icon: Calendar, label: "Education", value: "3rd Year IT" },
                  { icon: Award, label: "University", value: "Haramaya" },
                  { icon: Coffee, label: "Status", value: "Learning" },
                ].map((item, index) => (
                  <ScrollReveal key={item.label} delay={200 + index * 80}>
                    <div
                      className={cn(
                        "p-4 rounded-lg border border-terminal-border",
                        "bg-card/50 backdrop-blur-sm",
                        "hover:border-neon-green/30 hover:scale-105 transition-all duration-300"
                      )}
                    >
                      <item.icon className="w-5 h-5 text-neon-cyan mb-2" />
                      <p className="font-mono text-xs text-muted-foreground">{item.label}</p>
                      <p className="font-semibold text-sm">{item.value}</p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Currently Learning */}
              <ScrollReveal delay={150}>
                <TerminalWindow title="currently_learning.sh">
                  <div className="space-y-3">
                    <p className="font-mono text-sm neon-text-cyan mb-3">
                      <Sparkles className="w-4 h-4 inline mr-2" />
                      # What I'm exploring now
                    </p>
                    {[
                      { name: "TypeScript", progress: 60, desc: "Adding type safety to my projects" },
                      { name: "Next.js", progress: 35, desc: "Server-side rendering & full-stack React" },
                      { name: "Docker", progress: 25, desc: "Containerizing applications" },
                      { name: "Tailwind CSS", progress: 70, desc: "Utility-first styling mastery" },
                    ].map((tech) => (
                      <div key={tech.name} className="space-y-1">
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-mono text-neon-green flex items-center gap-2">
                            <BookOpen className="w-3 h-3" />
                            {tech.name}
                          </span>
                          <span className="text-xs text-muted-foreground">{tech.progress}%</span>
                        </div>
                        <div className="h-1.5 bg-terminal-border rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-neon-cyan to-neon-green rounded-full transition-all duration-1000"
                            style={{ width: `${tech.progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">{tech.desc}</p>
                      </div>
                    ))}
                  </div>
                </TerminalWindow>
              </ScrollReveal>

              {/* Core Values */}
              <ScrollReveal delay={250}>
                <TerminalWindow title="core_values.config">
                  <div className="space-y-4">
                    <p className="font-mono text-sm neon-text-cyan mb-4"># Core Development Principles</p>
                    
                    {[
                      { icon: Code2, title: "Clean Code", desc: "Writing readable, maintainable code" },
                      { icon: Zap, title: "Performance", desc: "Optimizing for speed and efficiency" },
                      { icon: Award, title: "Quality", desc: "Delivering polished, tested solutions" },
                    ].map((value) => (
                      <div key={value.title} className="flex items-start gap-3">
                        <div className="p-2 rounded bg-neon-green/10 border border-neon-green/20">
                          <value.icon className="w-4 h-4 text-neon-green" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{value.title}</p>
                          <p className="text-xs text-muted-foreground">{value.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TerminalWindow>
              </ScrollReveal>

              {/* Realistic Stats */}
              <ScrollReveal delay={350}>
                <div className="p-6 rounded-lg border border-terminal-border bg-card/50">
                  <p className="font-mono text-sm neon-text-cyan mb-4">// Self-Assessment Stats</p>
                  <div className="space-y-4">
                    <StatusBar label="Problem Solving" value={75} variant="green" />
                    <StatusBar label="Code Quality" value={70} variant="cyan" />
                    <StatusBar label="Team Collaboration" value={80} variant="gradient" />
                    <StatusBar label="Learning Speed" value={85} variant="green" />
                    <StatusBar label="Frontend Skills" value={72} variant="cyan" />
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default About;
