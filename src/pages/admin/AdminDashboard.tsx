import { AdminLayout } from "@/components/admin/AdminLayout";
import { TerminalWindow, StatusBar, NeonButton } from "@/components/terminal";
import { 
  FolderKanban, 
  Eye, 
  MessageSquare, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  { 
    label: "Total Projects", 
    value: "12", 
    change: "+2", 
    trend: "up", 
    icon: FolderKanban,
    color: "neon-green" 
  },
  { 
    label: "Page Views", 
    value: "2.4k", 
    change: "+18%", 
    trend: "up", 
    icon: Eye,
    color: "neon-cyan" 
  },
  { 
    label: "Messages", 
    value: "8", 
    change: "+3", 
    trend: "up", 
    icon: MessageSquare,
    color: "neon-purple" 
  },
  { 
    label: "Engagement", 
    value: "89%", 
    change: "-2%", 
    trend: "down", 
    icon: TrendingUp,
    color: "neon-pink" 
  },
];

const recentMessages = [
  { from: "john@company.com", subject: "Project Inquiry", time: "2h ago", unread: true },
  { from: "sarah@startup.io", subject: "Collaboration Offer", time: "5h ago", unread: true },
  { from: "mike@agency.com", subject: "Re: Portfolio Feedback", time: "1d ago", unread: false },
];

const recentProjects = [
  { name: "E-Commerce Platform", status: "completed", views: 342 },
  { name: "AI Dashboard", status: "running", views: 156 },
  { name: "Mobile Banking App", status: "completed", views: 289 },
];

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Welcome */}
        <div className="mb-8">
          <p className="font-mono text-sm text-muted-foreground">
            Welcome back, <span className="neon-text-green">Admin</span>
          </p>
          <p className="text-2xl font-bold mt-1">Dashboard Overview</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={cn(
                "p-6 rounded-lg border border-terminal-border",
                "bg-card/50 backdrop-blur-sm",
                "hover:border-neon-green/30 transition-all duration-300"
              )}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={cn(
                  "p-2 rounded-lg",
                  stat.color === "neon-green" && "bg-neon-green/10",
                  stat.color === "neon-cyan" && "bg-neon-cyan/10",
                  stat.color === "neon-purple" && "bg-neon-purple/10",
                  stat.color === "neon-pink" && "bg-neon-pink/10"
                )}>
                  <stat.icon className={cn(
                    "w-5 h-5",
                    stat.color === "neon-green" && "text-neon-green",
                    stat.color === "neon-cyan" && "text-neon-cyan",
                    stat.color === "neon-purple" && "text-neon-purple",
                    stat.color === "neon-pink" && "text-neon-pink"
                  )} />
                </div>
                <span className={cn(
                  "flex items-center gap-1 text-xs font-mono",
                  stat.trend === "up" ? "text-status-online" : "text-status-error"
                )}>
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3" />
                  )}
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="font-mono text-xs text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Messages */}
          <TerminalWindow title="recent_messages.log" variant="floating">
            <div className="space-y-3">
              {recentMessages.map((msg, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg",
                    "border border-terminal-border hover:border-neon-green/30",
                    "transition-all cursor-pointer",
                    msg.unread && "bg-neon-green/5"
                  )}
                >
                  {msg.unread && (
                    <span className="w-2 h-2 bg-neon-green rounded-full flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-sm truncate">{msg.from}</p>
                    <p className="text-xs text-muted-foreground truncate">{msg.subject}</p>
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">{msg.time}</span>
                </div>
              ))}
              <NeonButton variant="ghost" size="sm" className="w-full mt-2">
                View All Messages
              </NeonButton>
            </div>
          </TerminalWindow>

          {/* Recent Projects */}
          <TerminalWindow title="project_activity.stat" variant="floating">
            <div className="space-y-3">
              {recentProjects.map((project, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border border-terminal-border"
                >
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "w-2 h-2 rounded-full",
                      project.status === "running" ? "bg-status-online animate-pulse" : "bg-neon-cyan"
                    )} />
                    <div>
                      <p className="font-mono text-sm">{project.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{project.status}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-sm neon-text-green">{project.views}</p>
                    <p className="text-xs text-muted-foreground">views</p>
                  </div>
                </div>
              ))}
              <NeonButton variant="ghost" size="sm" className="w-full mt-2">
                Manage Projects
              </NeonButton>
            </div>
          </TerminalWindow>
        </div>

        {/* System Status */}
        <TerminalWindow title="system_status.sh" variant="floating">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatusBar label="Server Uptime" value={99.9} variant="green" />
            <StatusBar label="API Response" value={95} variant="cyan" />
            <StatusBar label="Storage Used" value={42} variant="gradient" />
            <StatusBar label="Memory Usage" value={68} variant="green" />
          </div>
          <div className="mt-6 pt-4 border-t border-terminal-border">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-status-online" />
              <span className="font-mono text-sm text-status-online">All systems operational</span>
            </div>
          </div>
        </TerminalWindow>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
