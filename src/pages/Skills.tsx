import { MainLayout } from "@/components/layout";
import { TerminalWindow, StatusBar } from "@/components/terminal";
import { cn } from "@/lib/utils";

interface Skill {
  name: string;
  level: number;
  category: string;
  icon?: string;
}

const skills: Skill[] = [
  // Frontend
  { name: "React / Next.js", level: 95, category: "frontend" },
  { name: "TypeScript", level: 90, category: "frontend" },
  { name: "Vue.js", level: 75, category: "frontend" },
  { name: "HTML5 / CSS3", level: 95, category: "frontend" },
  { name: "Tailwind CSS", level: 90, category: "frontend" },
  
  // Backend
  { name: "Node.js", level: 92, category: "backend" },
  { name: "Python", level: 85, category: "backend" },
  { name: "Go", level: 70, category: "backend" },
  { name: "GraphQL", level: 82, category: "backend" },
  { name: "REST APIs", level: 95, category: "backend" },
  
  // Database
  { name: "PostgreSQL", level: 88, category: "database" },
  { name: "MongoDB", level: 85, category: "database" },
  { name: "Redis", level: 78, category: "database" },
  { name: "Prisma ORM", level: 85, category: "database" },
  
  // DevOps
  { name: "Docker", level: 85, category: "devops" },
  { name: "AWS", level: 80, category: "devops" },
  { name: "CI/CD", level: 82, category: "devops" },
  { name: "Kubernetes", level: 65, category: "devops" },
  
  // Tools
  { name: "Git / GitHub", level: 95, category: "tools" },
  { name: "Linux", level: 85, category: "tools" },
  { name: "VS Code", level: 95, category: "tools" },
  { name: "Figma", level: 70, category: "tools" },
];

const categories = [
  { id: "frontend", name: "Frontend", color: "neon-green", icon: "💻" },
  { id: "backend", name: "Backend", color: "neon-cyan", icon: "⚙️" },
  { id: "database", name: "Database", color: "neon-purple", icon: "🗄️" },
  { id: "devops", name: "DevOps", color: "neon-pink", icon: "🚀" },
  { id: "tools", name: "Tools", color: "neon-green", icon: "🔧" },
];

const Skills = () => {
  return (
    <MainLayout>
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12">
            <p className="font-mono text-sm neon-text-cyan mb-2">
              <span className="text-muted-foreground">$</span> top -o %CPU
            </p>
            <h1 className="text-4xl font-bold mb-4">Technical Skills</h1>
            <p className="text-muted-foreground max-w-2xl">
              A comprehensive overview of my technical capabilities, displayed as system resource metrics.
            </p>
          </div>

          {/* System Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { label: "CPU (Languages)", value: "8 Cores", usage: 85 },
              { label: "RAM (Frameworks)", value: "32GB", usage: 78 },
              { label: "DISK (Projects)", value: "50+ TB", usage: 65 },
              { label: "NETWORK (APIs)", value: "1Gbps", usage: 92 },
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

          {/* Skills by Category */}
          <div className="grid lg:grid-cols-2 gap-8">
            {categories.map((category) => (
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
            ))}
          </div>

          {/* Technologies Grid */}
          <div className="mt-16">
            <p className="font-mono text-sm neon-text-cyan mb-6">
              <span className="text-muted-foreground">$</span> neofetch --tech-stack
            </p>

            <TerminalWindow title="tech_stack.config" variant="floating">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {[
                  "React", "Next.js", "TypeScript", "Node.js", "Python", "Go",
                  "PostgreSQL", "MongoDB", "Redis", "GraphQL", "Docker", "AWS",
                  "Kubernetes", "Git", "Linux", "Tailwind", "Prisma", "Jest",
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

          {/* Certifications */}
          <div className="mt-16">
            <p className="font-mono text-sm neon-text-cyan mb-6">
              <span className="text-muted-foreground">$</span> ls certificates/
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { name: "AWS Solutions Architect", issuer: "Amazon Web Services", year: "2024" },
                { name: "Professional Cloud Developer", issuer: "Google Cloud", year: "2023" },
                { name: "Meta Frontend Developer", issuer: "Meta", year: "2023" },
              ].map((cert) => (
                <div
                  key={cert.name}
                  className={cn(
                    "p-6 rounded-lg border border-terminal-border",
                    "bg-card/50 backdrop-blur-sm",
                    "hover:border-neon-green/50 transition-all duration-300",
                    "hover:shadow-[0_0_20px_hsl(156_100%_50%_/_0.1)]"
                  )}
                >
                  <div className="w-12 h-12 rounded-full bg-neon-green/10 border border-neon-green/30 flex items-center justify-center mb-4">
                    <span className="text-xl">🏆</span>
                  </div>
                  <h3 className="font-bold mb-1">{cert.name}</h3>
                  <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                  <p className="font-mono text-xs text-neon-green mt-2">{cert.year}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Skills;
