import { useState, useEffect, useRef } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { TerminalWindow, NeonButton } from "@/components/terminal";
import { Plus, Edit2, Trash2, Search, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Project = Tables<"projects">;

const AdminProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: "", description: "", status: "completed", tech: "",
    github_url: "", live_url: "", featured: false, image_url: "",
  });

  const fetchProjects = async () => {
    const { data } = await supabase.from("projects").select("*").order("display_order");
    if (data) setProjects(data);
    setLoading(false);
  };

  useEffect(() => { fetchProjects(); }, []);

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    await supabase.from("projects").delete().eq("id", id);
    setProjects(projects.filter((p) => p.id !== id));
    toast.success("Project deleted");
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      description: project.description || "",
      status: project.status,
      tech: (project.tech || []).join(", "),
      github_url: project.github_url || "",
      live_url: project.live_url || "",
      featured: project.featured || false,
      image_url: project.image_url || "",
    });
    setImageFile(null);
    setImagePreview(project.image_url || null);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingProject(null);
    setFormData({ name: "", description: "", status: "completed", tech: "", github_url: "", live_url: "", featured: false, image_url: "" });
    setImageFile(null);
    setImagePreview(null);
    setIsModalOpen(true);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadImage = async (projectName: string): Promise<string | null> => {
    if (!imageFile) return formData.image_url || null;

    const ext = imageFile.name.split(".").pop();
    const fileName = `${Date.now()}-${projectName.replace(/\s+/g, "-").toLowerCase()}.${ext}`;
    const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    setUploadProgress(0);
    await new Promise<void>((resolve) => {
      const xhr = new XMLHttpRequest();
      xhr.upload.onprogress = (ev) => {
        if (ev.lengthComputable) setUploadProgress(Math.round((ev.loaded / ev.total) * 100));
      };
      xhr.onload = () => resolve();
      xhr.onerror = () => resolve();
      xhr.open("POST", `https://${projectId}.supabase.co/storage/v1/object/project-images/${fileName}`);
      xhr.setRequestHeader("Authorization", `Bearer ${anonKey}`);
      xhr.setRequestHeader("Content-Type", imageFile.type);
      xhr.setRequestHeader("x-upsert", "true");
      xhr.send(imageFile);
    });

    const { data: urlData } = supabase.storage.from("project-images").getPublicUrl(fileName);
    return urlData.publicUrl;
  };

  const handleSave = async () => {
    setUploading(true);
    const imageUrl = await uploadImage(formData.name);

    const payload = {
      name: formData.name,
      description: formData.description,
      status: formData.status,
      tech: formData.tech.split(",").map((t) => t.trim()).filter(Boolean),
      github_url: formData.github_url || null,
      live_url: formData.live_url || null,
      featured: formData.featured,
      image_url: imageUrl,
    };

    if (editingProject) {
      const { error } = await supabase.from("projects").update(payload).eq("id", editingProject.id);
      if (!error) {
        toast.success("Project updated");
        fetchProjects();
      }
    } else {
      const { error } = await supabase.from("projects").insert(payload);
      if (!error) {
        toast.success("Project created");
        fetchProjects();
      }
    }
    setUploading(false);
    setIsModalOpen(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <p className="font-mono text-sm text-muted-foreground">Manage your portfolio projects</p>
          <NeonButton variant="green" onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" /> Add Project
          </NeonButton>
        </div>

        <div className="flex-1 relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text" placeholder="Search projects..." value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-muted/30 border border-terminal-border rounded font-mono text-sm focus:outline-none focus:border-neon-green/50"
          />
        </div>

        <TerminalWindow title="projects_table.db" variant="floating">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left font-mono text-xs text-muted-foreground uppercase tracking-wider border-b border-terminal-border">
                  <th className="pb-3 pr-4">Image</th>
                  <th className="pb-3 pr-4">Name</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3 pr-4">Featured</th>
                  <th className="pb-3 pr-4">Tech</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-terminal-border">
                {loading ? (
                  <tr><td colSpan={6} className="py-8 text-center font-mono text-sm text-muted-foreground animate-pulse">Loading...</td></tr>
                ) : filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-muted/20">
                    <td className="py-4 pr-4">
                      {project.image_url ? (
                        <img src={project.image_url} alt={project.name} className="w-12 h-12 rounded object-cover border border-terminal-border" />
                      ) : (
                        <div className="w-12 h-12 rounded bg-muted/30 border border-terminal-border flex items-center justify-center">
                          <span className="font-mono text-xs text-muted-foreground">N/A</span>
                        </div>
                      )}
                    </td>
                    <td className="py-4 pr-4">
                      <p className="font-medium">{project.name}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[200px]">{project.description}</p>
                    </td>
                    <td className="py-4 pr-4">
                      <span className={cn(
                        "inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-mono",
                        project.status === "completed" && "bg-neon-cyan/10 text-neon-cyan",
                        project.status === "running" && "bg-status-online/10 text-status-online",
                        project.status === "pending" && "bg-status-warning/10 text-status-warning"
                      )}>
                        {project.status}
                      </span>
                    </td>
                    <td className="py-4 pr-4">
                      <span className={cn("text-xs font-mono", project.featured ? "neon-text-green" : "text-muted-foreground")}>
                        {project.featured ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="py-4 pr-4">
                      <div className="flex flex-wrap gap-1">
                        {(project.tech || []).slice(0, 3).map((t) => (
                          <span key={t} className="px-1.5 py-0.5 text-xs font-mono bg-muted rounded">{t}</span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleEdit(project)} className="p-2 text-muted-foreground hover:text-neon-cyan transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(project.id)} className="p-2 text-muted-foreground hover:text-status-error transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TerminalWindow>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <TerminalWindow title={editingProject ? "edit_project.sh" : "new_project.sh"} className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="space-y-4">
                {/* Image Upload */}
                <div>
                  <label className="font-mono text-xs text-muted-foreground uppercase">Project Image</label>
                  <div className="mt-1 flex items-center gap-4">
                    {imagePreview ? (
                      <div className="relative">
                        <img src={imagePreview} alt="Preview" className="w-20 h-20 rounded object-cover border border-terminal-border" />
                        <button
                          type="button"
                          onClick={() => { setImageFile(null); setImagePreview(null); setFormData({ ...formData, image_url: "" }); }}
                          className="absolute -top-2 -right-2 p-1 bg-status-error rounded-full text-background"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-20 h-20 rounded border-2 border-dashed border-terminal-border hover:border-neon-green/50 flex flex-col items-center justify-center gap-1 transition-colors"
                      >
                        <Upload className="w-5 h-5 text-muted-foreground" />
                        <span className="font-mono text-[10px] text-muted-foreground">Upload</span>
                      </button>
                    )}
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
                    {!imagePreview && (
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Or paste image URL..."
                          value={formData.image_url}
                          onChange={(e) => { setFormData({ ...formData, image_url: e.target.value }); setImagePreview(e.target.value || null); }}
                          className="w-full px-4 py-2 bg-muted/30 border border-terminal-border rounded font-mono text-sm focus:outline-none focus:border-neon-green/50"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="font-mono text-xs text-muted-foreground uppercase">Name</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full mt-1 px-4 py-2 bg-muted/30 border border-terminal-border rounded font-mono text-sm focus:outline-none focus:border-neon-green/50" />
                </div>
                <div>
                  <label className="font-mono text-xs text-muted-foreground uppercase">Description</label>
                  <textarea rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full mt-1 px-4 py-2 bg-muted/30 border border-terminal-border rounded font-mono text-sm focus:outline-none focus:border-neon-green/50 resize-none" />
                </div>
                <div>
                  <label className="font-mono text-xs text-muted-foreground uppercase">Tech (comma separated)</label>
                  <input type="text" value={formData.tech} onChange={(e) => setFormData({ ...formData, tech: e.target.value })}
                    className="w-full mt-1 px-4 py-2 bg-muted/30 border border-terminal-border rounded font-mono text-sm focus:outline-none focus:border-neon-green/50" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-mono text-xs text-muted-foreground uppercase">GitHub URL</label>
                    <input type="text" value={formData.github_url} onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                      className="w-full mt-1 px-4 py-2 bg-muted/30 border border-terminal-border rounded font-mono text-sm focus:outline-none focus:border-neon-green/50" />
                  </div>
                  <div>
                    <label className="font-mono text-xs text-muted-foreground uppercase">Live URL</label>
                    <input type="text" value={formData.live_url} onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
                      className="w-full mt-1 px-4 py-2 bg-muted/30 border border-terminal-border rounded font-mono text-sm focus:outline-none focus:border-neon-green/50" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-mono text-xs text-muted-foreground uppercase">Status</label>
                    <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full mt-1 px-4 py-2 bg-muted/30 border border-terminal-border rounded font-mono text-sm focus:outline-none focus:border-neon-green/50">
                      <option value="pending">Pending</option>
                      <option value="running">Running</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <div className="flex items-end pb-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={formData.featured} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        className="rounded border-terminal-border" />
                      <span className="font-mono text-xs text-muted-foreground">Featured</span>
                    </label>
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <NeonButton variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancel</NeonButton>
                  <NeonButton variant="green" className="flex-1" onClick={handleSave} disabled={uploading}>
                    {uploading ? `Uploading ${uploadProgress}%` : editingProject ? "Update" : "Create"}
                  </NeonButton>
                </div>
                {uploading && imageFile && (
                  <div className="space-y-1">
                    <div className="flex justify-between font-mono text-xs text-muted-foreground">
                      <span>Uploading image...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-neon-green to-neon-cyan transition-all duration-200"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </TerminalWindow>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminProjects;
