import { Github, Linkedin, Twitter, Mail, Terminal } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const socialLinks = [
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Mail, href: "#", label: "Email" },
];

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-terminal-border bg-card/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 group">
              <Terminal className="w-5 h-5 text-neon-green" />
              <span className="font-mono font-bold">
                <span className="neon-text-green">dev</span>
                <span className="text-muted-foreground">@</span>
                <span className="neon-text-cyan">portfolio</span>
              </span>
            </Link>
            <p className="font-mono text-sm text-muted-foreground">
              Full-stack developer crafting digital experiences with clean code and modern technologies.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-mono text-sm neon-text-green uppercase tracking-wider">
              Quick Access
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {["home", "about", "projects", "skills", "contact"].map((item) => (
                <Link
                  key={item}
                  to={item === "home" ? "/" : `/${item}`}
                  className="font-mono text-sm text-muted-foreground hover:text-neon-green transition-colors"
                >
                  <span className="text-neon-cyan mr-1">&gt;</span>
                  {item}
                </Link>
              ))}
            </div>
          </div>

          {/* Social */}
          <div className="space-y-4">
            <h4 className="font-mono text-sm neon-text-green uppercase tracking-wider">
              Connect
            </h4>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "p-2 rounded border border-terminal-border",
                    "text-muted-foreground hover:text-neon-green hover:border-neon-green/50",
                    "transition-all duration-300",
                    "hover:shadow-[0_0_10px_hsl(156_100%_50%_/_0.2)]"
                  )}
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-terminal-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-mono text-xs text-muted-foreground">
            <span className="neon-text-cyan">©</span> {currentYear} All rights reserved.
          </p>
          <p className="font-mono text-xs text-muted-foreground">
            <span className="text-neon-green">STATUS:</span> <span className="text-status-online">● ONLINE</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
