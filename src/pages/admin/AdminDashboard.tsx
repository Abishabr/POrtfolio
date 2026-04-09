import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { TerminalWindow, StatusBar, NeonButton } from "@/components/terminal";
import { FolderKanban, MessageSquare, Wrench, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ projects: 0, messages: 0, unread: 0, skills: 0 });
  const [recentMessages, setRecentMessages] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      const [projectsRes, messagesRes, unreadRes, skillsRes, recentRes] = await Promise.all([
        supabase.from("projects").select("id", { count: "exact", head: true }),
        supabase.from("contact_messages").select("id", { count: "exact", head: true }),
        supabase.from("contact_messages").select("id", { count: "exact", head: true }).eq("is_read", false),
        supabase.from("skills").select("id", { count: "exact", head: true }),
        supabase.from("contact_messages").select("*").order("created_at", { ascending: false }).limit(3),
      ]);
      setStats({
        projects: projectsRes.count || 0,
        messages: messagesRes.count || 0,
        unread: unreadRes.count || 0,
        skills: skillsRes.count || 0,
      });
      if (recentRes.data) setRecentMessages(recentRes.data);
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: "Projects", value: stats.projects, icon: FolderKanban, color: "neon-green" },
    { label: "Messages", value: stats.messages, icon: MessageSquare, color: "neon-cyan" },
    { label: "Unread", value: stats.unread, icon: MessageSquare, color: "neon-purple" },
    { label: "Skills", value: stats.skills, icon: Wrench, color: "neon-pink" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="mb-8">
          <p className="font-mono text-sm text-muted-foreground">
            Welcome back, <span className="neon-text-green">Admin</span>
          </p>
          <p className="text-2xl font-bold mt-1">Dashboard Overview</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat) => (
            <div key={stat.label} className={cn("p-6 rounded-lg border border-terminal-border bg-card/50 backdrop-blur-sm hover:border-neon-green/30 transition-all duration-300")}>
              <div className="flex items-center justify-between mb-4">
                <div className={cn("p-2 rounded-lg",
                  stat.color === "neon-green" && "bg-neon-green/10",
                  stat.color === "neon-cyan" && "bg-neon-cyan/10",
                  stat.color === "neon-purple" && "bg-neon-purple/10",
                  stat.color === "neon-pink" && "bg-neon-pink/10"
                )}>
                  <stat.icon className={cn("w-5 h-5",
                    stat.color === "neon-green" && "text-neon-green",
                    stat.color === "neon-cyan" && "text-neon-cyan",
                    stat.color === "neon-purple" && "text-neon-purple",
                    stat.color === "neon-pink" && "text-neon-pink"
                  )} />
                </div>
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="font-mono text-xs text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <TerminalWindow title="recent_messages.log" variant="floating">
            <div className="space-y-3">
              {recentMessages.map((msg) => (
                <div key={msg.id} className={cn("flex items-center gap-3 p-3 rounded-lg border border-terminal-border hover:border-neon-green/30 transition-all cursor-pointer", !msg.is_read && "bg-neon-green/5")}
                  onClick={() => navigate("/admin/messages")}>
                  {!msg.is_read && <span className="w-2 h-2 bg-neon-green rounded-full flex-shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-sm truncate">{msg.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{msg.subject}</p>
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">
                    {new Date(msg.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
              {recentMessages.length === 0 && (
                <p className="text-center py-4 font-mono text-sm text-muted-foreground">No messages yet</p>
              )}
              <NeonButton variant="ghost" size="sm" className="w-full mt-2" onClick={() => navigate("/admin/messages")}>
                View All Messages
              </NeonButton>
            </div>
          </TerminalWindow>

          <TerminalWindow title="system_status.sh" variant="floating">
            <div className="grid sm:grid-cols-2 gap-6">
              <StatusBar label="Projects" value={Math.min(stats.projects * 20, 100)} variant="green" />
              <StatusBar label="Skills" value={Math.min(stats.skills * 10, 100)} variant="cyan" />
              <StatusBar label="Messages" value={Math.min(stats.messages * 10, 100)} variant="gradient" />
              <StatusBar label="Response Rate" value={stats.messages > 0 ? Math.round(((stats.messages - stats.unread) / stats.messages) * 100) : 100} variant="green" />
            </div>
            <div className="mt-6 pt-4 border-t border-terminal-border">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-status-online" />
                <span className="font-mono text-sm text-status-online">All systems operational</span>
              </div>
            </div>
          </TerminalWindow>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
