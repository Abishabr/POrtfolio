import { MainLayout } from "@/components/layout";
import { TerminalWindow, TypingText, StatusBar } from "@/components/terminal";
import { MapPin, Calendar, Award, Code2, Coffee, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

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
                    <span className="neon-text-green">guest@portfolio</span>
                    <span className="text-muted-foreground">$</span>
                    <TypingText text="cat biography.txt" speed={30} showCursor={false} />
                  </div>

                  <div className="space-y-4 text-sm leading-relaxed">
                    <p>
                      Hello! I'm a passionate full-stack developer with 5+ years of 
                      experience building production-ready web applications for startups 
                      and enterprises worldwide.
                    </p>
                    <p>
                      I specialize in React ecosystems, Node.js backends, and cloud-native 
                      architectures. My focus is on creating performant, accessible, and 
                      maintainable codebases that scale with your business needs.
                    </p>
                    <p>
                      As a remote-first developer, I've collaborated with distributed teams 
                      across different time zones, delivering projects ranging from MVP 
                      prototypes to high-traffic production systems serving millions of users.
                    </p>
                    <p>
                      I'm passionate about clean architecture, developer experience, and 
                      mentoring junior developers. When not coding, I contribute to open-source 
                      projects and write technical content on modern web development practices.
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
                  { icon: MapPin, label: "Location", value: "Remote Worldwide" },
                  { icon: Calendar, label: "Experience", value: "5+ Years" },
                  { icon: Award, label: "Projects", value: "50+ Shipped" },
                  { icon: Coffee, label: "Timezone", value: "Flexible" },
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
                    { year: "2024", role: "Senior Full-Stack Developer", company: "Tech Corp", current: true },
                    { year: "2022", role: "Full-Stack Developer", company: "StartupXYZ" },
                    { year: "2020", role: "Frontend Developer", company: "WebAgency" },
                    { year: "2019", role: "Junior Developer", company: "CodeSchool" },
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
