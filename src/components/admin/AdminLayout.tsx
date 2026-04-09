import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Terminal, LayoutDashboard, FolderKanban, Wrench,
  MessageSquare, Settings, LogOut, Menu, X, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NeonButton } from "@/components/terminal";
import { useAuth } from "@/hooks/useAuth";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Projects", path: "/admin/projects", icon: FolderKanban },
  { name: "Skills", path: "/admin/skills", icon: Wrench },
  { name: "Messages", path: "/admin/messages", icon: MessageSquare },
  { name: "Settings", path: "/admin/settings", icon: Settings },
];

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, user } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate("/admin");
  };

  const currentPage = navItems.find((item) => item.path === location.pathname)?.name || "Dashboard";

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - Desktop */}
      <aside
        className={cn(
          "hidden md:flex flex-col border-r border-terminal-border bg-card/50",
          "transition-all duration-300",
          sidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-terminal-border">
          <Link to="/admin/dashboard" className="flex items-center gap-2">
            <Terminal className="w-6 h-6 text-neon-green" />
            {sidebarOpen && (
              <span className="font-mono font-bold">
                <span className="neon-text-green">Admin</span>
                <span className="text-muted-foreground">/</span>
                <span className="neon-text-cyan">Panel</span>
              </span>
            )}
          </Link>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 text-muted-foreground hover:text-foreground">
            <ChevronRight className={cn("w-4 h-4 transition-transform", !sidebarOpen && "rotate-180")} />
          </button>
        </div>

        <nav className="flex-1 py-4 space-y-1 px-3">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg font-mono text-sm transition-all duration-200",
                location.pathname === item.path
                  ? "bg-neon-green/10 text-neon-green border border-neon-green/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-terminal-border">
          {sidebarOpen && user && (
            <p className="font-mono text-xs text-muted-foreground mb-2 truncate px-3">{user.email}</p>
          )}
          <button
            onClick={handleLogout}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg font-mono text-sm w-full",
              "text-muted-foreground hover:text-status-error hover:bg-status-error/10 transition-all duration-200"
            )}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <div className={cn("fixed inset-0 z-50 md:hidden", mobileMenuOpen ? "visible" : "invisible")}>
        <div
          className={cn("absolute inset-0 bg-black/60 transition-opacity", mobileMenuOpen ? "opacity-100" : "opacity-0")}
          onClick={() => setMobileMenuOpen(false)}
        />
        <aside className={cn("absolute left-0 top-0 bottom-0 w-64 bg-card border-r border-terminal-border transition-transform duration-300", mobileMenuOpen ? "translate-x-0" : "-translate-x-full")}>
          <div className="h-16 flex items-center justify-between px-4 border-b border-terminal-border">
            <Link to="/admin/dashboard" className="flex items-center gap-2">
              <Terminal className="w-6 h-6 text-neon-green" />
              <span className="font-mono font-bold neon-text-green">Admin</span>
            </Link>
            <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-muted-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>
          <nav className="flex-1 py-4 space-y-1 px-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg font-mono text-sm",
                  location.pathname === item.path
                    ? "bg-neon-green/10 text-neon-green"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </aside>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b border-terminal-border bg-card/30 backdrop-blur-sm flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileMenuOpen(true)} className="md:hidden p-2 text-muted-foreground">
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <p className="font-mono text-xs text-muted-foreground">
                <span className="neon-text-cyan">$</span> admin/{currentPage.toLowerCase()}
              </p>
              <h1 className="font-bold">{currentPage}</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/"><NeonButton variant="ghost" size="sm">View Site</NeonButton></Link>
            <div className="w-8 h-8 rounded-full bg-neon-green/20 border border-neon-green/30 flex items-center justify-center">
              <span className="font-mono text-xs neon-text-green">AD</span>
            </div>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
};
