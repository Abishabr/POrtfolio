import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { TerminalWindow, NeonButton } from "@/components/terminal";
import { Mail, Trash2, Reply, Archive, Star, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Message = Tables<"contact_messages">;

const AdminMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setMessages(data);
    setLoading(false);
  };

  useEffect(() => { fetchMessages(); }, []);

  const filteredMessages = messages.filter((m) => {
    const matchesSearch = (m.subject || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === "all" ||
      (filter === "unread" && !m.is_read) ||
      (filter === "read" && m.is_read);
    return matchesSearch && matchesFilter;
  });

  const handleDelete = async (id: string) => {
    await supabase.from("contact_messages").delete().eq("id", id);
    setMessages(messages.filter((m) => m.id !== id));
    if (selectedMessage?.id === id) setSelectedMessage(null);
    toast.success("Message deleted");
  };

  const handleMarkRead = async (id: string) => {
    await supabase.from("contact_messages").update({ is_read: true }).eq("id", id);
    setMessages(messages.map((m) => m.id === id ? { ...m, is_read: true } : m));
  };

  const selectMessage = (message: Message) => {
    setSelectedMessage(message);
    if (!message.is_read) handleMarkRead(message.id);
  };

  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <p className="font-mono text-sm text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} unread messages` : "All caught up!"}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-muted/30 border border-terminal-border rounded font-mono text-sm focus:outline-none focus:border-neon-green/50"
            />
          </div>
          <div className="flex gap-2">
            {(["all", "unread", "read"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-3 py-1.5 font-mono text-xs rounded border transition-all",
                  filter === f
                    ? "border-neon-green bg-neon-green/10 text-neon-green"
                    : "border-terminal-border text-muted-foreground hover:border-neon-green/50"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <TerminalWindow title="inbox.log" variant="floating">
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {loading ? (
                <p className="text-center py-8 font-mono text-sm text-muted-foreground animate-pulse">Loading...</p>
              ) : filteredMessages.map((message) => (
                <div
                  key={message.id}
                  onClick={() => selectMessage(message)}
                  className={cn(
                    "p-4 rounded-lg border cursor-pointer transition-all",
                    selectedMessage?.id === message.id
                      ? "border-neon-green bg-neon-green/5"
                      : "border-terminal-border hover:border-neon-green/30",
                    !message.is_read && "bg-neon-green/5"
                  )}
                >
                  <div className="flex items-start gap-3">
                    {!message.is_read && <span className="w-2 h-2 bg-neon-green rounded-full mt-2 flex-shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm truncate">{message.name}</span>
                        <span className="font-mono text-xs text-muted-foreground">
                          {new Date(message.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="font-mono text-sm truncate">{message.subject}</p>
                      <p className="text-xs text-muted-foreground truncate mt-1">{message.message}</p>
                    </div>
                  </div>
                </div>
              ))}
              {!loading && filteredMessages.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="font-mono text-sm">No messages found</p>
                </div>
              )}
            </div>
          </TerminalWindow>

          <TerminalWindow title={selectedMessage ? "message_view.txt" : "select_message.txt"} variant="floating">
            {selectedMessage ? (
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-lg">{selectedMessage.subject}</h3>
                    <p className="font-mono text-sm text-muted-foreground mt-1">
                      From: <span className="neon-text-cyan">{selectedMessage.name}</span>
                    </p>
                    <p className="font-mono text-xs text-muted-foreground">{selectedMessage.email}</p>
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">
                    {new Date(selectedMessage.created_at).toLocaleString()}
                  </span>
                </div>
                <div className="pt-4 border-t border-terminal-border">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
                <div className="flex gap-2 pt-4 border-t border-terminal-border">
                  <a href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`} className="flex-1">
                    <NeonButton variant="green" size="sm" className="w-full">
                      <Reply className="w-4 h-4 mr-2" />
                      Reply
                    </NeonButton>
                  </a>
                  <NeonButton
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="hover:border-status-error hover:text-status-error"
                  >
                    <Trash2 className="w-4 h-4" />
                  </NeonButton>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="font-mono text-sm">Select a message to view</p>
              </div>
            )}
          </TerminalWindow>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminMessages;
