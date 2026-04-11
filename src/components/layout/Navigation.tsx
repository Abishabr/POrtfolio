import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";
import { NeonButton } from "@/components/terminal";

const navItems = [
  { name: "home", path: "/", command: "cd ~" },
  { name: "about", path: "/about", command: "cat about.md" },
  { name: "projects", path: "/projects", command: "ls projects/" },
  { name: "skills", path: "/skills", command: "top" },
  { name: "contact", path: "/contact", command: "mail -s" },
];

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b border-terminal-border">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <Terminal className="w-6 h-6 text-neon-green group-hover:animate-pulse" />
            <span className="font-mono font-bold text-lg">
              <span className="neon-text-green">abrham</span>
              <span className="text-muted-foreground">@</span>
              <span className="neon-text-cyan">habtamu</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "px-3 py-2 font-mono text-sm rounded transition-all duration-200",
                  "hover:bg-muted/50 group relative",
                  location.pathname === item.path
                    ? "text-neon-green"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <span className="opacity-50 mr-1">&gt;</span>
                {item.name}
                {location.pathname === item.path && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-neon-green" />
                )}
              </Link>
            ))}
          </div>

          {/* Spacer for layout balance */}
          <div className="hidden md:flex items-center gap-4" />

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden absolute top-16 left-0 right-0 bg-background/95 backdrop-blur-md border-b border-terminal-border",
          "transition-all duration-300 overflow-hidden",
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-4 py-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={cn(
                "block px-4 py-3 font-mono text-sm rounded transition-all duration-200",
                "border border-transparent",
                location.pathname === item.path
                  ? "bg-neon-green/10 border-neon-green/30 text-neon-green"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              <span className="text-neon-cyan mr-2">$</span>
              {item.command}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};
