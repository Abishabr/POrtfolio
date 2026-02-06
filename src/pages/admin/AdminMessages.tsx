import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { TerminalWindow, NeonButton } from "@/components/terminal";
import { Mail, Trash2, Reply, Archive, Star, Search, Filter, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Message {
  id: number;
  from: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
  starred: boolean;
}

const initialMessages: Message[] = [
  {
    id: 1,
    from: "John Smith",
    email: "john@company.com",
    subject: "Project Inquiry - E-commerce Platform",
    message: "Hi, I'm interested in discussing a potential e-commerce project. We're looking for a full-stack developer to help us build a modern online store with payment integration.",
    date: "2024-01-15 10:30",
    read: false,
    starred: true,
  },
  {
    id: 2,
    from: "Sarah Johnson",
    email: "sarah@startup.io",
    subject: "Collaboration Opportunity",
    message: "Hello! I came across your portfolio and was impressed by your work. Would you be interested in collaborating on an AI-powered dashboard project?",
    date: "2024-01-15 08:15",
    read: false,
    starred: false,
  },
  {
    id: 3,
    from: "Mike Davis",
    email: "mike@agency.com",
    subject: "Re: Portfolio Feedback",
    message: "Thank you for your response. The updates you made to the portfolio look great. Let's schedule a call to discuss next steps.",
    date: "2024-01-14 16:45",
    read: true,
    starred: false,
  },
  {
    id: 4,
    from: "Emily Chen",
    email: "emily@techcorp.com",
    subject: "Job Opportunity - Senior Developer",
    message: "We have an exciting opportunity for a senior full-stack developer position. Your experience with React and Node.js would be a great fit for our team.",
    date: "2024-01-14 11:20",
    read: true,
    starred: true,
  },
];

const AdminMessages = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "starred">("all");

  const filteredMessages = messages.filter((m) => {
    const matchesSearch = m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.from.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === "all" || 
      (filter === "unread" && !m.read) || 
      (filter === "starred" && m.starred);
    return matchesSearch && matchesFilter;
  });

  const handleDelete = (id: number) => {
    setMessages(messages.filter((m) => m.id !== id));
    if (selectedMessage?.id === id) setSelectedMessage(null);
    toast.success("Message deleted");
  };

  const handleToggleStar = (id: number) => {
    setMessages(messages.map((m) => 
      m.id === id ? { ...m, starred: !m.starred } : m
    ));
  };

  const handleMarkRead = (id: number) => {
    setMessages(messages.map((m) => 
      m.id === id ? { ...m, read: true } : m
    ));
  };

  const selectMessage = (message: Message) => {
    setSelectedMessage(message);
    handleMarkRead(message.id);
  };

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <p className="font-mono text-sm text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} unread messages` : "All caught up!"}
            </p>
          </div>
        </div>

        {/* Search & Filters */}
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
            {(["all", "unread", "starred"] as const).map((f) => (
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
          {/* Message List */}
          <TerminalWindow title="inbox.log" variant="floating">
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {filteredMessages.map((message) => (
                <div
                  key={message.id}
                  onClick={() => selectMessage(message)}
                  className={cn(
                    "p-4 rounded-lg border cursor-pointer transition-all",
                    selectedMessage?.id === message.id
                      ? "border-neon-green bg-neon-green/5"
                      : "border-terminal-border hover:border-neon-green/30",
                    !message.read && "bg-neon-green/5"
                  )}
                >
                  <div className="flex items-start gap-3">
                    {!message.read && (
                      <span className="w-2 h-2 bg-neon-green rounded-full mt-2 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm truncate">{message.from}</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleStar(message.id);
                            }}
                            className={cn(
                              "p-1 transition-colors",
                              message.starred ? "text-status-warning" : "text-muted-foreground hover:text-status-warning"
                            )}
                          >
                            <Star className={cn("w-3.5 h-3.5", message.starred && "fill-current")} />
                          </button>
                          <span className="font-mono text-xs text-muted-foreground">
                            {message.date.split(" ")[0]}
                          </span>
                        </div>
                      </div>
                      <p className="font-mono text-sm truncate">{message.subject}</p>
                      <p className="text-xs text-muted-foreground truncate mt-1">{message.message}</p>
                    </div>
                  </div>
                </div>
              ))}

              {filteredMessages.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="font-mono text-sm">No messages found</p>
                </div>
              )}
            </div>
          </TerminalWindow>

          {/* Message Detail */}
          <TerminalWindow
            title={selectedMessage ? "message_view.txt" : "select_message.txt"}
            variant="floating"
          >
            {selectedMessage ? (
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-lg">{selectedMessage.subject}</h3>
                    <p className="font-mono text-sm text-muted-foreground mt-1">
                      From: <span className="neon-text-cyan">{selectedMessage.from}</span>
                    </p>
                    <p className="font-mono text-xs text-muted-foreground">
                      {selectedMessage.email}
                    </p>
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">
                    {selectedMessage.date}
                  </span>
                </div>

                <div className="pt-4 border-t border-terminal-border">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>

                <div className="flex gap-2 pt-4 border-t border-terminal-border">
                  <NeonButton variant="green" size="sm" className="flex-1">
                    <Reply className="w-4 h-4 mr-2" />
                    Reply
                  </NeonButton>
                  <NeonButton variant="outline" size="sm">
                    <Archive className="w-4 h-4" />
                  </NeonButton>
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
