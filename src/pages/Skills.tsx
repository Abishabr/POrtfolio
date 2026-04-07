import { MainLayout } from "@/components/layout";
import { TerminalWindow, StatusBar } from "@/components/terminal";
import { ScrollReveal } from "@/hooks/use-scroll-reveal";
import { cn } from "@/lib/utils";

interface Skill {
  name: string;
  level: number;
  category: string;
  icon?: string;
}

const skills: Skill[] = [
  // Frontend
  { name: "React", level: 80, category: "frontend" },
  { name: "JavaScript", level: 85, category: "frontend" },
  { name: "HTML5 / CSS3", level: 90, category: "frontend" },
  
  // Backend
  { name: "Node.js", level: 78, category: "backend" },
  { name: "Express", level: 75, category: "backend" },
  { name: "REST APIs", level: 80, category: "backend" },
  
  // Database
  { name: "PostgreSQL", level: 75, category: "database" },
  { name: "MySQL", level: 75, category: "database" },
  
  // Tools
  { name: "Git / GitHub", level: 80, category: "tools" },
  { name: "VS Code", level: 90, category: "tools" },
];

const categories = [
  { id: "frontend", name: "Frontend", color: "neon-green", icon: "💻" },
  { id: "backend", name: "Backend", color: "neon-cyan", icon: "⚙️" },
  { id: "database", name: "Database", color: "neon-purple", icon: "🗄️" },
  { id: "tools", name: "Tools", color: "neon-green", icon: "🔧" },
];

const Skills = () => {
  return (
    <MainLayout>
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <ScrollReveal>
            <div className="mb-12">
              <p className="font-mono text-sm neon-text-cyan mb-2">
                <span className="text-muted-foreground">$</span> top -o %CPU
              </p>
              <h1 className="text-4xl font-bold mb-4">Technical Skills</h1>
              <p className="text-muted-foreground max-w-2xl">
                A comprehensive overview of my technical capabilities, displayed as system resource metrics.
              </p>
            </div>
          </ScrollReveal>

          {/* System Stats Overview */}
          <ScrollReveal delay={100}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {[
                { label: "Languages", value: "JavaScript", usage: 85 },
                { label: "Frameworks", value: "React + Express", usage: 78 },
                { label: "Databases", value: "MySQL + PG", usage: 75 },
                { label: "Tools", value: "Git + VS Code", usage: 80 },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="p-4 rounded-lg border border-terminal-border bg-card/50"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-mono text-xs text-muted-foreground">{stat.label}</span>
                    <span className="font-mono text-xs neon-text-green">{stat.usage}%</span>
                  </div>
                  <p className="font-bold text-lg mb-2">{stat.value}</p>
                  <div className="h-1 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-neon-green to-neon-cyan"
                      style={{ width: `${stat.usage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>

          {/* Skills by Category */}
          <div className="grid lg:grid-cols-2 gap-8">
            {categories.map((category) => (
              <ScrollReveal delay={200 + categories.indexOf(category) * 100}>
              <TerminalWindow
                key={category.id}
                title={`${category.name.toLowerCase()}_skills.stat`}
                variant="floating"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl">{category.icon}</span>
                    <span className="font-mono text-sm neon-text-cyan uppercase tracking-wider">
                      {category.name}
                    </span>
                  </div>

                  {skills
                    .filter((s) => s.category === category.id)
                    .map((skill) => (
                      <StatusBar
                        key={skill.name}
                        label={skill.name}
                        value={skill.level}
                        variant={skill.level > 85 ? "green" : skill.level > 70 ? "gradient" : "cyan"}
                        size="md"
                      />
                    ))}
                </div>
              </TerminalWindow>
              </ScrollReveal>
            ))}
          </div>

          {/* Technologies Grid */}
          <ScrollReveal delay={400}>
            <div className="mt-16">
              <p className="font-mono text-sm neon-text-cyan mb-6">
                <span className="text-muted-foreground">$</span> neofetch --tech-stack
              </p>

              <TerminalWindow title="tech_stack.config" variant="floating">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {[
                    "JavaScript", "React", "Node.js", "Express",
                    "HTML5", "CSS3", "MySQL", "PostgreSQL",
                    "Git", "GitHub", "VS Code", "REST APIs",
                  ].map((tech) => (
                    <div
                      key={tech}
                      className={cn(
                        "px-3 py-2 text-center font-mono text-sm",
                        "border border-terminal-border rounded",
                        "bg-muted/20 hover:bg-neon-green/10",
                        "hover:border-neon-green/50 hover:text-neon-green",
                        "transition-all duration-200 cursor-default"
                      )}
                    >
                      {tech}
                    </div>
                  ))}
                </div>
              </TerminalWindow>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </MainLayout>
  );
};

export default Skills;
