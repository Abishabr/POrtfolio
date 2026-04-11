import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout";
import { TerminalWindow, NeonButton } from "@/components/terminal";
import { Download, Mail, Phone, Github, Linkedin, MapPin, GraduationCap, Code2, Send, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Skill = Tables<"skills">;

const CV = () => {
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    // Fetch CV URL from settings
    const fetchCvUrl = async () => {
      const { data } = await (supabase.from("settings" as never) as any)
        .select("value")
        .eq("key", "cv_url")
        .single();
      if (data?.value) setCvUrl(data.value);
    };

    // Fetch skills from Supabase
    const fetchSkills = async () => {
      const { data } = await supabase
        .from("skills")
        .select("*")
        .order("display_order", { ascending: true });
      setSkills(data ?? []);
    };

    fetchCvUrl();
    fetchSkills();
  }, []);

  // Group skills by category for CV display
  const skillGroups = ["frontend", "backend", "database", "tools"].map((cat) => ({
    category: cat.charAt(0).toUpperCase() + cat.slice(1),
    skills: skills.filter((s) => s.category === cat).map((s) => s.name),
  })).filter((g) => g.skills.length > 0);

  return (
    <MainLayout>
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-12">
            <div>
              <p className="font-mono text-sm neon-text-cyan mb-2">
                <span className="text-muted-foreground">$</span> cat resume.pdf
              </p>
              <h1 className="text-4xl font-bold">My CV</h1>
            </div>
            {cvUrl ? (
              <a href={cvUrl} target="_blank" rel="noopener noreferrer">
                <NeonButton variant="green" size="lg" className="print:hidden">
                  <Download className="w-4 h-4 mr-2" />
                  Download CV
                </NeonButton>
              </a>
            ) : (
              <NeonButton variant="green" size="lg" onClick={() => window.print()} className="print:hidden">
                <Download className="w-4 h-4 mr-2" />
                Print CV
              </NeonButton>
            )}
          </div>

          {/* PDF viewer if CV uploaded */}
          {cvUrl && (
            <TerminalWindow title="resume.pdf" variant="floating" className="mb-8">
              <div className="flex flex-col items-center gap-4 py-6">
                <FileText className="w-16 h-16 text-neon-green opacity-80" />
                <p className="font-mono text-sm text-muted-foreground">CV uploaded by admin</p>
                <a href={cvUrl} target="_blank" rel="noopener noreferrer">
                  <NeonButton variant="green">
                    <Download className="w-4 h-4 mr-2" />
                    Open / Download PDF
                  </NeonButton>
                </a>
              </div>
            </TerminalWindow>
          )}

          {/* CV Content — always shown as online version */}
          <div id="cv-content" className="space-y-8 print:text-black print:bg-white">
            {/* Name & Contact */}
            <TerminalWindow title="personal_info.json" variant="floating">
              <div className="text-center space-y-3 py-4">
                <h2 className="text-3xl font-bold text-gradient-neon">Abrham Habtamu</h2>
                <p className="font-mono text-lg text-muted-foreground">Full-Stack Web Developer</p>
                <div className="flex flex-wrap justify-center gap-4 text-sm">
                  <a href="mailto:abrhamhabtamu52@gmail.com" className="flex items-center gap-1 hover:text-neon-green transition-colors">
                    <Mail className="w-4 h-4" /> abrhamhabtamu52@gmail.com
                  </a>
                  <a href="tel:+251922111347" className="flex items-center gap-1 hover:text-neon-green transition-colors">
                    <Phone className="w-4 h-4" /> +251 922 111 347
                  </a>
                  <a href="https://github.com/Abishabr" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-neon-green transition-colors">
                    <Github className="w-4 h-4" /> Abishabr
                  </a>
                  <a href="https://www.linkedin.com/in/abrham-habtamu-24a329310/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-neon-green transition-colors">
                    <Linkedin className="w-4 h-4" /> Abrham Habtamu
                  </a>
                  <span className="flex items-center gap-1">
                    <Send className="w-4 h-4" /> @barch
                  </span>
                </div>
              </div>
            </TerminalWindow>

            {/* Summary */}
            <TerminalWindow title="summary.txt" variant="floating">
              <div className="space-y-2">
                <p className="font-mono text-sm neon-text-cyan mb-3"># Professional Summary</p>
                <p className="text-sm leading-relaxed">
                  Motivated 3rd year IT student at Haramaya University with strong skills in full-stack web development.
                  Experienced in building modern web applications using JavaScript, React, Node.js, Express, MySQL, and PostgreSQL.
                  Passionate about writing clean, efficient code and continuously learning new technologies.
                </p>
              </div>
            </TerminalWindow>

            {/* Education */}
            <TerminalWindow title="education.log" variant="floating">
              <div className="space-y-3">
                <p className="font-mono text-sm neon-text-cyan mb-3"># Education</p>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded bg-neon-green/10 border border-neon-green/20 mt-1">
                    <GraduationCap className="w-5 h-5 text-neon-green" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Bachelor of Science in Information Technology</h3>
                    <p className="text-muted-foreground text-sm">Haramaya University</p>
                    <p className="font-mono text-xs neon-text-green mt-1">3rd Year • Currently Enrolled</p>
                  </div>
                </div>
              </div>
            </TerminalWindow>

            {/* Skills — from Supabase */}
            <TerminalWindow title="skills.config" variant="floating">
              <div className="space-y-4">
                <p className="font-mono text-sm neon-text-cyan mb-3"># Technical Skills</p>
                {skillGroups.length > 0 ? (
                  <div className="space-y-3">
                    {skillGroups.map((group) => (
                      <div key={group.category} className="flex items-start gap-3">
                        <Code2 className="w-4 h-4 text-neon-cyan mt-1 flex-shrink-0" />
                        <div>
                          <span className="font-mono text-xs text-muted-foreground uppercase">{group.category}:</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {group.skills.map((skill) => (
                              <span
                                key={skill}
                                className={cn(
                                  "px-2 py-1 text-xs font-mono rounded",
                                  "border border-terminal-border bg-muted/20",
                                  "hover:border-neon-green/50 hover:text-neon-green transition-colors"
                                )}
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="font-mono text-xs text-muted-foreground">Loading skills...</p>
                )}
              </div>
            </TerminalWindow>

            {/* Contact */}
            <TerminalWindow title="contact.sh" variant="floating">
              <div className="space-y-3">
                <p className="font-mono text-sm neon-text-cyan mb-3"># Contact Information</p>
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  {[
                    { icon: Mail, label: "Email", value: "abrhamhabtamu52@gmail.com", href: "mailto:abrhamhabtamu52@gmail.com" },
                    { icon: Phone, label: "Phone", value: "+251 922 111 347", href: "tel:+251922111347" },
                    { icon: Github, label: "GitHub", value: "github.com/Abishabr", href: "https://github.com/Abishabr" },
                    { icon: Linkedin, label: "LinkedIn", value: "Abrham Habtamu", href: "https://www.linkedin.com/in/abrham-habtamu-24a329310/" },
                    { icon: Send, label: "Telegram", value: "@barch", href: "https://t.me/barch" },
                    { icon: MapPin, label: "Location", value: "Ethiopia" },
                  ].map((item) => (
                    <a
                      key={item.label}
                      href={item.href || "#"}
                      target={item.href?.startsWith("http") ? "_blank" : undefined}
                      rel={item.href?.startsWith("http") ? "noopener noreferrer" : undefined}
                      className={cn(
                        "flex items-center gap-2 p-3 rounded border border-terminal-border",
                        "hover:border-neon-green/50 hover:text-neon-green transition-colors"
                      )}
                    >
                      <item.icon className="w-4 h-4 text-neon-cyan flex-shrink-0" />
                      <div>
                        <p className="font-mono text-xs text-muted-foreground">{item.label}</p>
                        <p className="text-sm">{item.value}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </TerminalWindow>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default CV;
