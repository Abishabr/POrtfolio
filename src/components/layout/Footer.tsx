import { Github, Linkedin, Mail, Terminal } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

const socialLinks = [
  { icon: Github, href: "https://github.com/Abishabr", label: "GitHub" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/abrham-habtamu-24a329310/", label: "LinkedIn" },
  { icon: Mail, href: "mailto:abrhamhabtamu52@gmail.com", label: "Email" },
  { icon: TelegramIcon, href: "https://t.me/B_arch", label: "Telegram" },
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
                <span className="neon-text-green">abrham</span>
                <span className="text-muted-foreground">@</span>
                <span className="neon-text-cyan">habtamu</span>
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
