import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout";
import { TerminalWindow, StatusBar } from "@/components/terminal";
import { ScrollReveal } from "@/hooks/use-scroll-reveal";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Skill = Tables<"skills">;

const categories = [
  { id: "frontend", name: "Frontend", color: "neon-green", icon: "💻" },
  { id: "backend",  name: "Backend",  color: "neon-cyan",   icon: "⚙️" },
  { id: "database", name: "Database", color: "neon-purple", icon: "🗄️" },
  { id: "tools",    name: "Tools",    color: "neon-green",  icon: "🔧" },
];

const Skills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSkills = async () => {
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) {
        setError(error.message);
      } else {
        setSkills(data ?? []);
      }
      setLoading(false);
    };

    fetchSkills();
  }, []);

  // Derive stat cards dynamically from fetched skills
  const statCards = categories.map((cat) => {
    const catSkills = skills.filter((s) => s.category === cat.id);
    const top = catSkills.reduce<Skill | null>(
      (best, s) => (best === null || (s.proficiency ?? 0) > (best.proficiency ?? 0) ? s : best),
      null
    );
    return {
      label: cat.name,
      value: top ? top.name : "—",
      usage: top?.proficiency ?? 0,
    };
  });

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

          {error && (
            <p className="font-mono text-sm text-status-error mb-8">[ERROR] {error}</p>
          )}

          {/* System Stats Overview */}
          <ScrollReveal delay={100}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {statCards.map((stat) => (
                <div key={stat.label} className="p-4 rounded-lg border border-terminal-border bg-card/50">
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
          {loading ? (
            <p className="text-center py-12 font-mono text-sm text-muted-foreground animate-pulse">
              Loading skills...
            </p>
          ) : (
            <>
              <div className="grid lg:grid-cols-2 gap-8">
                {categories.map((category, idx) => (
                  <ScrollReveal key={category.id} delay={200 + idx * 100}>
                    <TerminalWindow
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
                              key={skill.id}
                              label={skill.name}
                              value={skill.proficiency ?? 0}
                              variant={(skill.proficiency ?? 0) > 85 ? "green" : (skill.proficiency ?? 0) > 70 ? "gradient" : "cyan"}
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
                      {skills.map((skill) => (
                        <div
                          key={skill.id}
                          className={cn(
                            "px-3 py-2 text-center font-mono text-sm",
                            "border border-terminal-border rounded",
                            "bg-muted/20 hover:bg-neon-green/10",
                            "hover:border-neon-green/50 hover:text-neon-green",
                            "transition-all duration-200 cursor-default"
                          )}
                        >
                          {skill.name}
                        </div>
                      ))}
                    </div>
                  </TerminalWindow>
                </div>
              </ScrollReveal>
            </>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default Skills;
