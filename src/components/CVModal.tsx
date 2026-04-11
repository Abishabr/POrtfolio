import { useState, useEffect } from "react";
import { X, Download, FileText } from "lucide-react";
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl bg-card border border-terminal-border rounded-lg overflow-hidden flex flex-col"
        style={{ height: "90vh" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-terminal-border bg-muted/30">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-neon-green" />
            <span className="font-mono text-sm neon-text-green">resume.pdf</span>
          </div>
          <div className="flex items-center gap-2">
            {cvUrl && (
              <a href={cvUrl} download target="_blank" rel="noopener noreferrer">
                <NeonButton variant="green" size="sm">
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </NeonButton>
              </a>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <p className="font-mono text-sm text-muted-foreground animate-pulse">Loading CV...</p>
            </div>
          ) : cvUrl ? (
            <iframe
              src={cvUrl}
              title="CV"
              className="w-full h-full border-0"
            />
          ) : (
            <div className="h-full flex flex-col items-center justify-center gap-4 text-muted-foreground">
              <FileText className="w-16 h-16 opacity-30" />
              <p className="font-mono text-sm">No CV uploaded yet.</p>
              <p className="font-mono text-xs">Admin can upload one in Settings.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
