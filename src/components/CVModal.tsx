import { useState, useEffect } from "react";
import { X, Download, FileText, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { NeonButton } from "@/components/terminal";

interface CVModalProps {
  onClose: () => void;
}

export const CVModal = ({ onClose }: CVModalProps) => {
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCvUrl = async () => {
      const { data } = await (supabase.from("settings" as never) as any)
        .select("value")
        .eq("key", "cv_url")
        .single();
      if (data?.value) setCvUrl(data.value);
      setLoading(false);
    };
    fetchCvUrl();
  }, []);

  // Close on backdrop click
  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={handleBackdrop}
    >
      <div className="relative w-full max-w-lg bg-card border border-terminal-border rounded-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-terminal-border bg-muted/30">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-neon-green" />
            <span className="font-mono text-sm neon-text-green">resume.pdf</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 flex flex-col items-center gap-6">
          {loading ? (
            <p className="font-mono text-sm text-muted-foreground animate-pulse">Loading CV...</p>
          ) : cvUrl ? (
            <>
              <div className="w-20 h-20 rounded-2xl bg-neon-green/10 border border-neon-green/30 flex items-center justify-center">
                <FileText className="w-10 h-10 text-neon-green" />
              </div>
              <div className="text-center space-y-1">
                <p className="font-mono text-sm text-foreground">Abrham Habtamu — Resume</p>
                <p className="font-mono text-xs text-muted-foreground">PDF Document</p>
              </div>
              <div className="flex gap-3 w-full">
                <a href={cvUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <NeonButton variant="outline" className="w-full">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View PDF
                  </NeonButton>
                </a>
                <a href={cvUrl} download target="_blank" rel="noopener noreferrer" className="flex-1">
                  <NeonButton variant="green" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </NeonButton>
                </a>
              </div>
            </>
          ) : (
            <>
              <div className="w-20 h-20 rounded-2xl bg-muted/30 border border-terminal-border flex items-center justify-center">
                <FileText className="w-10 h-10 text-muted-foreground opacity-40" />
              </div>
              <div className="text-center space-y-1">
                <p className="font-mono text-sm text-muted-foreground">No CV uploaded yet</p>
                <p className="font-mono text-xs text-muted-foreground">Admin can upload one in Settings</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
