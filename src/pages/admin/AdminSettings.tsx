import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { TerminalWindow, NeonButton } from "@/components/terminal";
import { Switch } from "@/components/ui/switch";
import { Save, RefreshCw, Palette, Zap, Eye, Code } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    binaryBackground: true,
    typingAnimation: true,
    scanlines: false,
    glitchEffect: false,
    particleEffects: true,
    smoothScrolling: true,
    darkMode: true,
    animationSpeed: "normal",
    primaryColor: "#00ff9c",
    secondaryColor: "#00eaff",
  });

  const handleSave = () => {
    toast.success("Settings saved successfully");
  };

  const handleReset = () => {
    setSettings({
      binaryBackground: true,
      typingAnimation: true,
      scanlines: false,
      glitchEffect: false,
      particleEffects: true,
      smoothScrolling: true,
      darkMode: true,
      animationSpeed: "normal",
      primaryColor: "#00ff9c",
      secondaryColor: "#00eaff",
    });
    toast.success("Settings reset to defaults");
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <p className="font-mono text-sm text-muted-foreground">
              Configure portfolio appearance and effects
            </p>
          </div>
          <div className="flex gap-2">
            <NeonButton variant="outline" onClick={handleReset}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset
            </NeonButton>
            <NeonButton variant="green" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </NeonButton>
          </div>
        </div>

        {/* Visual Effects */}
        <TerminalWindow title="visual_effects.config" variant="floating">
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Eye className="w-5 h-5 text-neon-cyan" />
              <span className="font-mono text-sm neon-text-cyan uppercase tracking-wider">
                Visual Effects
              </span>
            </div>

            <div className="grid gap-4">
              {[
                { key: "binaryBackground", label: "Binary Background", desc: "Animated binary code falling in the background" },
                { key: "typingAnimation", label: "Typing Animation", desc: "Typewriter effect for text content" },
                { key: "scanlines", label: "Scanlines Overlay", desc: "Retro CRT scanline effect" },
                { key: "glitchEffect", label: "Glitch Effect", desc: "Occasional glitch animation on headings" },
                { key: "particleEffects", label: "Particle Effects", desc: "Floating particle animations" },
                { key: "smoothScrolling", label: "Smooth Scrolling", desc: "Enable smooth scroll behavior" },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-4 rounded-lg border border-terminal-border hover:border-neon-green/30 transition-colors"
                >
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch
                    checked={settings[item.key as keyof typeof settings] as boolean}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, [item.key]: checked })
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </TerminalWindow>

        {/* Animation Speed */}
        <TerminalWindow title="animation_speed.config" variant="floating">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-neon-cyan" />
              <span className="font-mono text-sm neon-text-cyan uppercase tracking-wider">
                Animation Speed
              </span>
            </div>

            <div className="flex gap-3">
              {["slow", "normal", "fast"].map((speed) => (
                <button
                  key={speed}
                  onClick={() => setSettings({ ...settings, animationSpeed: speed })}
                  className={cn(
                    "flex-1 px-4 py-3 rounded-lg border font-mono text-sm transition-all",
                    settings.animationSpeed === speed
                      ? "border-neon-green bg-neon-green/10 text-neon-green"
                      : "border-terminal-border text-muted-foreground hover:border-neon-green/50"
                  )}
                >
                  {speed}
                </button>
              ))}
            </div>
          </div>
        </TerminalWindow>

        {/* Color Theme */}
        <TerminalWindow title="color_theme.config" variant="floating">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Palette className="w-5 h-5 text-neon-cyan" />
              <span className="font-mono text-sm neon-text-cyan uppercase tracking-wider">
                Color Theme
              </span>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="font-mono text-xs text-muted-foreground uppercase">
                  Primary Color (Neon Green)
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={settings.primaryColor}
                    onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                    className="w-12 h-10 rounded border border-terminal-border cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.primaryColor}
                    onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                    className="flex-1 px-4 py-2 bg-muted/30 border border-terminal-border rounded font-mono text-sm focus:outline-none focus:border-neon-green/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-mono text-xs text-muted-foreground uppercase">
                  Secondary Color (Cyan)
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={settings.secondaryColor}
                    onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                    className="w-12 h-10 rounded border border-terminal-border cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.secondaryColor}
                    onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                    className="flex-1 px-4 py-2 bg-muted/30 border border-terminal-border rounded font-mono text-sm focus:outline-none focus:border-neon-green/50"
                  />
                </div>
              </div>
            </div>

            {/* Color Preview */}
            <div className="mt-6 p-4 rounded-lg border border-terminal-border">
              <p className="font-mono text-xs text-muted-foreground mb-3">Preview</p>
              <div className="flex gap-4 items-center">
                <div
                  className="w-16 h-16 rounded-lg"
                  style={{ backgroundColor: settings.primaryColor }}
                />
                <div
                  className="w-16 h-16 rounded-lg"
                  style={{ backgroundColor: settings.secondaryColor }}
                />
                <div className="flex-1">
                  <p style={{ color: settings.primaryColor }} className="font-bold">
                    Primary Text
                  </p>
                  <p style={{ color: settings.secondaryColor }} className="font-mono text-sm">
                    Secondary Text
                  </p>
                </div>
              </div>
            </div>
          </div>
        </TerminalWindow>

        {/* Export Config */}
        <TerminalWindow title="export_config.sh" variant="floating">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Code className="w-5 h-5 text-neon-cyan" />
              <span className="font-mono text-sm neon-text-cyan uppercase tracking-wider">
                Configuration Export
              </span>
            </div>

            <pre className="p-4 bg-muted/30 rounded-lg overflow-x-auto">
              <code className="text-xs">
                {JSON.stringify(settings, null, 2)}
              </code>
            </pre>

            <NeonButton variant="outline" size="sm">
              Copy Configuration
            </NeonButton>
          </div>
        </TerminalWindow>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
