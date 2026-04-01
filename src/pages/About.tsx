import { MainLayout } from "@/components/layout";
import { TerminalWindow, TypingText, StatusBar } from "@/components/terminal";
import { MapPin, Calendar, Award, Code2, Coffee, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import profileAvatar from "@/assets/profile-avatar.png";

const About = () => {
  return (
    <MainLayout>
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12">
            <p className="font-mono text-sm neon-text-cyan mb-2">
              <span className="text-muted-foreground">$</span> cat about.md
            </p>
            <h1 className="text-4xl font-bold">About Me</h1>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Bio Terminal */}
            <div className="space-y-6">
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

              {/* Personal Info Cards */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: MapPin, label: "Location", value: "Ethiopia" },
                  { icon: Calendar, label: "Education", value: "3rd Year IT" },
                  { icon: Award, label: "University", value: "Haramaya" },
                  { icon: Coffee, label: "Status", value: "Learning" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={cn(
                      "p-4 rounded-lg border border-terminal-border",
                      "bg-card/50 backdrop-blur-sm",
                      "hover:border-neon-green/30 transition-colors"
                    )}
                  >
                    <item.icon className="w-5 h-5 text-neon-cyan mb-2" />
                    <p className="font-mono text-xs text-muted-foreground">{item.label}</p>
                    <p className="font-semibold text-sm">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Timeline */}
              <TerminalWindow title="career_timeline.log">
                <div className="space-y-2 text-sm">
                  <p className="neon-text-cyan">--- CAREER TIMELINE ---</p>
                  
                  {[
                    { year: "2023-Now", role: "IT Student (3rd Year)", company: "Haramaya University", current: true },
                    { year: "2023", role: "Self-taught Web Developer", company: "Online Courses" },
                    { year: "2022", role: "Started Programming", company: "JavaScript & Web" },
                  ].map((job, index) => (
                    <div key={index} className="flex gap-4 py-2 border-l-2 border-terminal-border pl-4 relative">
                      <div className={cn(
                        "absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full",
                        job.current ? "bg-status-online animate-pulse" : "bg-muted"
                      )} />
                      <div className="flex-1">
                        <p className="font-mono text-neon-green">{job.year}</p>
                        <p className="font-medium">{job.role}</p>
                        <p className="text-muted-foreground text-xs">@ {job.company}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TerminalWindow>

              {/* Core Values */}
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

              {/* Fun Stats */}
              <div className="p-6 rounded-lg border border-terminal-border bg-card/50">
                <p className="font-mono text-sm neon-text-cyan mb-4">// System Stats</p>
                <div className="space-y-4">
                  <StatusBar label="Problem Solving" value={95} variant="green" />
                  <StatusBar label="Code Quality" value={90} variant="cyan" />
                  <StatusBar label="Team Collaboration" value={88} variant="gradient" />
                  <StatusBar label="Learning New Tech" value={92} variant="green" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default About;
