import { useState, FormEvent } from "react";
import { MainLayout } from "@/components/layout";
import { TerminalWindow, CommandLine, NeonButton } from "@/components/terminal";
import { ScrollReveal } from "@/hooks/use-scroll-reveal";
import { Send, Mail, MapPin, Phone, Github, Linkedin, Twitter } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    "// Contact Terminal v1.0",
    "// Type 'help' for available commands",
    "",
  ]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTerminalOutput((prev) => [
      ...prev,
      `> Sending message from ${formData.email}...`,
      "Connecting to server...",
    ]);

    const { error } = await supabase.from("contact_messages").insert({
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
    });

    if (error) {
      setTerminalOutput((prev) => [...prev, "[ERROR] Failed to send message", ""]);
      toast.error("Failed to send message. Please try again.");
    } else {
      setTerminalOutput((prev) => [
        ...prev,
        "[OK] Message sent successfully!",
        `[INFO] Subject: ${formData.subject}`,
        "",
      ]);
      toast.success("Message sent successfully!");
      setFormData({ name: "", email: "", subject: "", message: "" });
    }

    setIsSubmitting(false);
  };

  const handleCommand = (command: string) => {
    const commands: Record<string, string[]> = {
      help: [
        "Available commands:",
        "  email    - Show email address",
        "  social   - Show social links",
        "  location - Show location",
        "  clear    - Clear terminal",
      ],
      email: ["Email: abrhamhabtamu52@gmail.com"],
      social: [
        "Social Links:",
        "  GitHub:   github.com/Abishabr",
        "  LinkedIn: linkedin.com/in/abrham-habtamu-24a329310",
        "  Telegram: @barch",
      ],
      location: ["Location: Ethiopia", "University: Haramaya University"],
      clear: [],
    };

    if (command === "clear") {
      setTerminalOutput(["// Terminal cleared", ""]);
    } else {
      setTerminalOutput((prev) => [
        ...prev,
        `> ${command}`,
        ...(commands[command] || [`Command not found: ${command}. Type 'help' for available commands.`]),
        "",
      ]);
    }
  };

  return (
    <MainLayout>
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <ScrollReveal>
            <div className="mb-12">
              <p className="font-mono text-sm neon-text-cyan mb-2">
                <span className="text-muted-foreground">$</span> mail -s "Hello"
              </p>
              <h1 className="text-4xl font-bold mb-4">Get In Touch</h1>
              <p className="text-muted-foreground max-w-2xl">
                Have a project in mind? Let's collaborate and build something amazing together.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <ScrollReveal delay={100}>
              <TerminalWindow title="compose_message.sh" variant="floating">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                      className={cn(
                        "w-full px-4 py-3 bg-muted/30 border border-terminal-border rounded",
                        "font-mono text-sm focus:outline-none focus:border-neon-green/50",
                        "placeholder:text-muted-foreground/50"
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@example.com"
                      className={cn(
                        "w-full px-4 py-3 bg-muted/30 border border-terminal-border rounded",
                        "font-mono text-sm focus:outline-none focus:border-neon-green/50",
                        "placeholder:text-muted-foreground/50"
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                      Subject *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Project Inquiry"
                      className={cn(
                        "w-full px-4 py-3 bg-muted/30 border border-terminal-border rounded",
                        "font-mono text-sm focus:outline-none focus:border-neon-green/50",
                        "placeholder:text-muted-foreground/50"
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                      Message *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell me about your project..."
                      className={cn(
                        "w-full px-4 py-3 bg-muted/30 border border-terminal-border rounded",
                        "font-mono text-sm focus:outline-none focus:border-neon-green/50",
                        "placeholder:text-muted-foreground/50 resize-none"
                      )}
                    />
                  </div>

                  <NeonButton
                    type="submit"
                    variant="green"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-pulse">Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </NeonButton>
                </form>
              </TerminalWindow>
            </ScrollReveal>

            {/* Contact Info & Terminal */}
            <ScrollReveal delay={200} className="space-y-6">
              {/* Contact Info Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: Mail, label: "Email", value: "abrhamhabtamu52@gmail.com", href: "mailto:abrhamhabtamu52@gmail.com" },
                  { icon: MapPin, label: "Location", value: "Ethiopia" },
                  { icon: Phone, label: "Phone", value: "+251 922 111 347", href: "tel:+251922111347" },
                  { icon: Github, label: "GitHub", value: "@Abishabr", href: "https://github.com/Abishabr" },
                ].map((item) => (
                  <a
                    key={item.label}
                    href={item.href || "#"}
                    className={cn(
                      "p-4 rounded-lg border border-terminal-border",
                      "bg-card/50 backdrop-blur-sm",
                      "hover:border-neon-green/50 transition-all duration-300",
                      "hover:shadow-[0_0_15px_hsl(156_100%_50%_/_0.1)]",
                      "group"
                    )}
                  >
                    <item.icon className="w-5 h-5 text-neon-cyan mb-2 group-hover:text-neon-green transition-colors" />
                    <p className="font-mono text-xs text-muted-foreground">{item.label}</p>
                    <p className="font-medium text-sm group-hover:text-neon-green transition-colors">{item.value}</p>
                  </a>
                ))}
              </div>

              {/* Interactive Terminal */}
              <TerminalWindow title="contact_terminal.sh" variant="floating">
                <div className="h-64 overflow-y-auto mb-4 space-y-1">
                  {terminalOutput.map((line, index) => (
                    <p
                      key={index}
                      className={cn(
                        "font-mono text-sm",
                        line.startsWith("[OK]") && "text-status-online",
                        line.startsWith("[INFO]") && "neon-text-cyan",
                        line.startsWith("[ERROR]") && "text-status-error",
                        line.startsWith("//") && "text-muted-foreground",
                        line.startsWith(">") && "neon-text-green"
                      )}
                    >
                      {line}
                    </p>
                  ))}
                </div>
                <CommandLine
                  prompt="guest@contact"
                  placeholder="type 'help' for commands..."
                  onSubmit={handleCommand}
                />
              </TerminalWindow>

              {/* Social Links */}
              <div className="p-6 rounded-lg border border-terminal-border bg-card/50">
                <p className="font-mono text-sm neon-text-cyan mb-4">// Connect with me</p>
                <div className="flex gap-3">
                  {[
                    { icon: Github, href: "https://github.com/Abishabr", label: "GitHub" },
                    { icon: Linkedin, href: "https://www.linkedin.com/in/abrham-habtamu-24a329310/", label: "LinkedIn" },
                    { icon: Mail, href: "mailto:abrhamhabtamu52@gmail.com", label: "Email" },
                  ].map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      className={cn(
                        "p-3 rounded-lg border border-terminal-border",
                        "text-muted-foreground hover:text-neon-green hover:border-neon-green/50",
                        "transition-all duration-300",
                        "hover:shadow-[0_0_15px_hsl(156_100%_50%_/_0.2)]"
                      )}
                      aria-label={social.label}
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Contact;
