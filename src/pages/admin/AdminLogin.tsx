import { useState, useEffect, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Terminal, Lock, Mail, Eye, EyeOff } from "lucide-react";
import { BinaryBackground, TerminalWindow, NeonButton } from "@/components/terminal";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { signIn, user, isAdmin, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [terminalLines, setTerminalLines] = useState([
    "ADMIN TERMINAL v2.0",
    "-------------------",
    "Secure authentication required.",
    "",
  ]);

  // Redirect once isAdmin is confirmed (after checkAdmin resolves)
  useEffect(() => {
    if (!isLoading && user && isAdmin) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [isLoading, user, isAdmin, navigate]);

  // Don't render login form while checking auth state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="font-mono text-sm text-muted-foreground animate-pulse">Verifying session...</p>
      </div>
    );
  }

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTerminalLines((prev) => [
      ...prev,
      `> Authenticating user: ${credentials.email}`,
      "Verifying credentials...",
    ]);

    const { error } = await signIn(credentials.email, credentials.password);

    if (error) {
      setTerminalLines((prev) => [
        ...prev,
        "[ERROR] Authentication failed",
        error.message,
      ]);
      toast.error(error.message);
    } else {
      setTerminalLines((prev) => [
        ...prev,
        "[OK] Authentication successful",
        "[OK] Session established",
        "Redirecting to dashboard...",
      ]);
      toast.success("Login successful!");
    }
    setIsSubmitting(false);  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      <BinaryBackground opacity={0.04} />
      <div className="absolute inset-0 grid-bg opacity-20" />

      <div className="w-full max-w-md mx-4 relative z-10">
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

        <TerminalWindow title="admin_login.sh" variant="floating">
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

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="font-mono text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Mail className="w-3 h-3" />
                Email
              </label>
              <input
                type="email"
                required
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                placeholder="admin@example.com"
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

            <NeonButton
              type="submit"
              variant="green"
              size="lg"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? (
                <span className="animate-pulse">Authenticating...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Login
                </>
              )}
            </NeonButton>

            <button
              type="button"
              onClick={async () => {
                if (!credentials.email) {
                  toast.error("Enter your email first");
                  return;
                }
                const { error } = await supabase.auth.resetPasswordForEmail(credentials.email, {
                  redirectTo: `${window.location.origin}/reset-password`,
                });
                if (error) {
                  toast.error(error.message);
                } else {
                  toast.success("Password reset link sent to your email!");
                  setTerminalLines((prev) => [...prev, `[OK] Reset link sent to ${credentials.email}`]);
                }
              }}
              className="w-full font-mono text-xs text-muted-foreground hover:text-neon-green transition-colors mt-2"
            >
              Forgot password?
            </button>
          </form>
        </TerminalWindow>

        <div className="text-center mt-6">
          <a
            href="/"
            className="font-mono text-sm text-muted-foreground hover:text-neon-green transition-colors"
          >
            ← Back to portfolio
          </a>
        </div>
      </div>

      <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-neon-green/30" />
      <div className="absolute top-4 right-4 w-16 h-16 border-r-2 border-t-2 border-neon-green/30" />
      <div className="absolute bottom-4 left-4 w-16 h-16 border-l-2 border-b-2 border-neon-green/30" />
      <div className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-neon-green/30" />
    </div>
  );
};

export default AdminLogin;
