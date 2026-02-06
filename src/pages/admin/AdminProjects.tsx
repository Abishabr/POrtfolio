import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { TerminalWindow, NeonButton, StatusBar } from "@/components/terminal";
import { Plus, Edit2, Trash2, ExternalLink, Github, Search, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Project {
  id: number;
  name: string;
  description: string;
  tech: string[];
  status: "running" | "completed" | "pending";
  featured: boolean;
  views: number;
}

const initialProjects: Project[] = [
  { id: 1, name: "E-Commerce Platform", description: "Full-featured e-commerce with payments", tech: ["React", "Node.js", "PostgreSQL"], status: "completed", featured: true, views: 342 },
  { id: 2, name: "AI Content Generator", description: "AI-powered content generation tool", tech: ["Python", "FastAPI", "OpenAI"], status: "running", featured: true, views: 156 },
  { id: 3, name: "Real-Time Chat App", description: "Messaging app with WebSocket support", tech: ["React", "Socket.io", "MongoDB"], status: "completed", featured: false, views: 289 },
  { id: 4, name: "DevOps Dashboard", description: "CI/CD pipeline monitoring dashboard", tech: ["Vue.js", "Go", "Kubernetes"], status: "running", featured: true, views: 198 },
];

const AdminProjects = () => {
  const [projects, setProjects] = useState(initialProjects);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: number) => {
    setProjects(projects.filter((p) => p.id !== id));
    toast.success("Project deleted successfully");
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (editingProject) {
      // Update existing
      setProjects(projects.map((p) => (p.id === editingProject.id ? editingProject : p)));
      toast.success("Project updated successfully");
    } else {
      // Add new
      const newProject: Project = {
        id: Math.max(...projects.map((p) => p.id)) + 1,
        name: "New Project",
        description: "Project description",
        tech: ["React"],
        status: "pending",
        featured: false,
        views: 0,
      };
      setProjects([...projects, newProject]);
      toast.success("Project created successfully");
    }
    setIsModalOpen(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <p className="font-mono text-sm text-muted-foreground">
              Manage your portfolio projects
            </p>
          </div>
          <NeonButton variant="green" onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </NeonButton>
        </div>

        {/* Search & Filters */}
        <div className="flex gap-4">
          <div className="flex-1 relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-muted/30 border border-terminal-border rounded font-mono text-sm focus:outline-none focus:border-neon-green/50"
            />
          </div>
        </div>

        {/* Projects Table */}
        <TerminalWindow title="projects_table.db" variant="floating">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left font-mono text-xs text-muted-foreground uppercase tracking-wider border-b border-terminal-border">
                  <th className="pb-3 pr-4">ID</th>
                  <th className="pb-3 pr-4">Name</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3 pr-4">Featured</th>
                  <th className="pb-3 pr-4">Views</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-terminal-border">
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-muted/20">
                    <td className="py-4 pr-4 font-mono text-sm text-muted-foreground">
                      #{project.id}
                    </td>
                    <td className="py-4 pr-4">
                      <p className="font-medium">{project.name}</p>
                      <p className="text-xs text-muted-foreground">{project.description}</p>
                    </td>
                    <td className="py-4 pr-4">
                      <span className={cn(
                        "inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-mono",
                        project.status === "completed" && "bg-neon-cyan/10 text-neon-cyan",
                        project.status === "running" && "bg-status-online/10 text-status-online",
                        project.status === "pending" && "bg-status-warning/10 text-status-warning"
                      )}>
                        <span className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          project.status === "completed" && "bg-neon-cyan",
                          project.status === "running" && "bg-status-online animate-pulse",
                          project.status === "pending" && "bg-status-warning"
                        )} />
                        {project.status}
                      </span>
                    </td>
                    <td className="py-4 pr-4">
                      <span className={cn(
                        "text-xs font-mono",
                        project.featured ? "neon-text-green" : "text-muted-foreground"
                      )}>
                        {project.featured ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="py-4 pr-4 font-mono text-sm">{project.views}</td>
                    <td className="py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(project)}
                          className="p-2 text-muted-foreground hover:text-neon-cyan transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(project.id)}
                          className="p-2 text-muted-foreground hover:text-status-error transition-colors"
                        >
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

        {/* Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <TerminalWindow
              title={editingProject ? "edit_project.sh" : "new_project.sh"}
              className="w-full max-w-lg"
            >
              <div className="space-y-4">
                <div>
                  <label className="font-mono text-xs text-muted-foreground uppercase">
                    Project Name
                  </label>
                  <input
                    type="text"
                    defaultValue={editingProject?.name || ""}
                    className="w-full mt-1 px-4 py-2 bg-muted/30 border border-terminal-border rounded font-mono text-sm focus:outline-none focus:border-neon-green/50"
                  />
                </div>
                <div>
                  <label className="font-mono text-xs text-muted-foreground uppercase">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    defaultValue={editingProject?.description || ""}
                    className="w-full mt-1 px-4 py-2 bg-muted/30 border border-terminal-border rounded font-mono text-sm focus:outline-none focus:border-neon-green/50 resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-mono text-xs text-muted-foreground uppercase">
                      Status
                    </label>
                    <select
                      defaultValue={editingProject?.status || "pending"}
                      className="w-full mt-1 px-4 py-2 bg-muted/30 border border-terminal-border rounded font-mono text-sm focus:outline-none focus:border-neon-green/50"
                    >
                      <option value="pending">Pending</option>
                      <option value="running">Running</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-mono text-xs text-muted-foreground uppercase">
                      Featured
                    </label>
                    <select
                      defaultValue={editingProject?.featured ? "yes" : "no"}
                      className="w-full mt-1 px-4 py-2 bg-muted/30 border border-terminal-border rounded font-mono text-sm focus:outline-none focus:border-neon-green/50"
                    >
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <NeonButton variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </NeonButton>
                  <NeonButton variant="green" className="flex-1" onClick={handleSave}>
                    {editingProject ? "Update" : "Create"}
                  </NeonButton>
                </div>
              </div>
            </TerminalWindow>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminProjects;
