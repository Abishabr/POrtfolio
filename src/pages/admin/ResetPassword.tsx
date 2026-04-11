import { useState, useEffect, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Terminal, Lock, Eye, EyeOff } from "lucide-react";
import { BinaryBackground, TerminalWindow, NeonButton } from "@/components/terminal";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);
  const [terminalLines, setTerminalLines] = useState([
    "PASSWORD RESET TERMINAL",
    "------------------------",
    "Checking recovery token...",
    "",
  ]);

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const type = hashParams.get("type");
    if (type === "recovery") {
      setIsRecovery(true);
      setTerminalLines((prev) => [...prev, "[OK] Recovery token verified", "Enter your new password below."]);
    } else {
      // Also listen for auth state change for recovery
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
        if (event === "PASSWORD_RECOVERY") {
          setIsRecovery(true);
          setTerminalLines((prev) => [...prev, "[OK] Recovery session active", "Enter your new password below."]);
        }
      });
      return () => subscription.unsubscribe();
    }
  }, []);

  const handleReset = async (e: FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setIsSubmitting(true);
    setTerminalLines((prev) => [...prev, "> Updating password..."]);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setTerminalLines((prev) => [...prev, `[ERROR] ${error.message}`]);
      toast.error(error.message);
    } else {
      setTerminalLines((prev) => [...prev, "[OK] Password updated successfully", "Redirecting to login..."]);
      toast.success("Password updated! You can now log in.");
      setTimeout(() => navigate("/admin"), 1500);
    }
    setIsSubmitting(false);
  };

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
            <span className="neon-text-green">Reset</span>
            <span className="text-muted-foreground"> / </span>
            <span className="neon-text-cyan">Password</span>
          </h1>
          <p className="font-mono text-sm text-muted-foreground">
            Set a new password for your account
          </p>
        </div>

        <TerminalWindow title="reset_password.sh" variant="floating">
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

          {isRecovery ? (
            <form onSubmit={handleReset} className="space-y-4">
              <div className="space-y-2">
                <label className="font-mono text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <Lock className="w-3 h-3" />
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

              <div className="space-y-2">
                <label className="font-mono text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <Lock className="w-3 h-3" />
                  Confirm Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className={cn(
                    "w-full px-4 py-3 bg-muted/30 border border-terminal-border rounded",
                    "font-mono text-sm focus:outline-none focus:border-neon-green/50",
                    "placeholder:text-muted-foreground/50"
                  )}
                />
              </div>

              <NeonButton type="submit" variant="green" size="lg" disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                  <span className="animate-pulse">Updating...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Update Password
                  </>
                )}
              </NeonButton>
            </form>
          ) : (
            <p className="font-mono text-sm text-muted-foreground text-center py-4">
              Invalid or expired recovery link. Please request a new one.
            </p>
          )}
        </TerminalWindow>

        <div className="text-center mt-6">
          <a href="/admin" className="font-mono text-sm text-muted-foreground hover:text-neon-green transition-colors">
            ← Back to login
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

export default ResetPassword;
