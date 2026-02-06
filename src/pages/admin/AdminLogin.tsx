import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Terminal, Lock, User, Eye, EyeOff } from "lucide-react";
import { BinaryBackground, TerminalWindow, TypingText, NeonButton } from "@/components/terminal";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [terminalLines, setTerminalLines] = useState([
    "ADMIN TERMINAL v2.0",
    "-------------------",
    "Secure authentication required.",
    "",
  ]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTerminalLines((prev) => [
      ...prev,
      `> Authenticating user: ${credentials.username}`,
      "Verifying credentials...",
    ]);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock authentication (in real app, this would call an API)
    if (credentials.username && credentials.password) {
      setTerminalLines((prev) => [
        ...prev,
        "[OK] Authentication successful",
        "[OK] Session established",
        "Redirecting to dashboard...",
      ]);
      
      toast.success("Login successful!");
      
      await new Promise((resolve) => setTimeout(resolve, 1000));
      navigate("/admin/dashboard");
    } else {
      setTerminalLines((prev) => [
        ...prev,
        "[ERROR] Authentication failed",
        "Invalid credentials. Please try again.",
      ]);
      toast.error("Invalid credentials");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      <BinaryBackground opacity={0.04} />

      {/* Grid overlay */}
      <div className="absolute inset-0 grid-bg opacity-20" />

      <div className="w-full max-w-md mx-4 relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-neon-green/10 border border-neon-green/30 mb-4">
            <Terminal className="w-8 h-8 text-neon-green" />
          </div>
          <h1 className="text-2xl font-bold mb-2">
            <span className="neon-text-green">Admin</span>
            <span className="text-muted-foreground"> / </span>
            <span className="neon-text-cyan">Login</span>
          </h1>
          <p className="font-mono text-sm text-muted-foreground">
            Secure access to portfolio management
          </p>
        </div>

        {/* Login Terminal */}
        <TerminalWindow title="admin_login.sh" variant="floating">
          {/* Terminal Output */}
          <div className="h-24 overflow-y-auto mb-6 space-y-1">
            {terminalLines.map((line, index) => (
              <p
                key={index}
                className={cn(
                  "font-mono text-xs",
                  line.startsWith("[OK]") && "text-status-online",
                  line.startsWith("[ERROR]") && "text-status-error",
                  line.startsWith(">") && "neon-text-green",
                  line.startsWith("---") && "text-muted-foreground"
                )}
              >
                {line}
              </p>
            ))}
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="font-mono text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <User className="w-3 h-3" />
                Username
              </label>
              <input
                type="text"
                required
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                placeholder="admin"
                className={cn(
                  "w-full px-4 py-3 bg-muted/30 border border-terminal-border rounded",
                  "font-mono text-sm focus:outline-none focus:border-neon-green/50",
                  "placeholder:text-muted-foreground/50"
                )}
              />
            </div>

            <div className="space-y-2">
              <label className="font-mono text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Lock className="w-3 h-3" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  placeholder="••••••••"
                  className={cn(
                    "w-full px-4 py-3 bg-muted/30 border border-terminal-border rounded",
                    "font-mono text-sm focus:outline-none focus:border-neon-green/50",
                    "placeholder:text-muted-foreground/50 pr-12"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-terminal-border" />
                <span className="font-mono text-xs text-muted-foreground">Remember me</span>
              </label>
              <a href="#" className="font-mono text-xs neon-text-cyan hover:underline">
                Forgot password?
              </a>
            </div>

            <NeonButton
              type="submit"
              variant="green"
              size="lg"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <span className="animate-pulse">Authenticating...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Login
                </>
              )}
            </NeonButton>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-terminal-border text-center">
            <p className="font-mono text-xs text-muted-foreground">
              <span className="text-neon-green">TIP:</span> Use demo/demo for testing
            </p>
          </div>
        </TerminalWindow>

        {/* Back Link */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="font-mono text-sm text-muted-foreground hover:text-neon-green transition-colors"
          >
            ← Back to portfolio
          </a>
        </div>
      </div>

      {/* Decorative corners */}
      <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-neon-green/30" />
      <div className="absolute top-4 right-4 w-16 h-16 border-r-2 border-t-2 border-neon-green/30" />
      <div className="absolute bottom-4 left-4 w-16 h-16 border-l-2 border-b-2 border-neon-green/30" />
      <div className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-neon-green/30" />
    </div>
  );
};

export default AdminLogin;
