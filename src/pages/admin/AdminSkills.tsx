import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { TerminalWindow, StatusBar, NeonButton } from "@/components/terminal";
import { Plus, Edit2, Trash2, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Skill {
  id: number;
  name: string;
  level: number;
  category: string;
}

const categories = ["frontend", "backend", "database", "devops", "tools"];

const initialSkills: Skill[] = [
  { id: 1, name: "React / Next.js", level: 95, category: "frontend" },
  { id: 2, name: "TypeScript", level: 90, category: "frontend" },
  { id: 3, name: "Node.js", level: 92, category: "backend" },
  { id: 4, name: "Python", level: 85, category: "backend" },
  { id: 5, name: "PostgreSQL", level: 88, category: "database" },
  { id: 6, name: "Docker", level: 85, category: "devops" },
  { id: 7, name: "AWS", level: 80, category: "devops" },
  { id: 8, name: "Git / GitHub", level: 95, category: "tools" },
];

const AdminSkills = () => {
  const [skills, setSkills] = useState(initialSkills);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredSkills = activeCategory === "all" 
    ? skills 
    : skills.filter((s) => s.category === activeCategory);

  const handleDelete = (id: number) => {
    setSkills(skills.filter((s) => s.id !== id));
    toast.success("Skill deleted successfully");
  };

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingSkill(null);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (editingSkill) {
      setSkills(skills.map((s) => (s.id === editingSkill.id ? editingSkill : s)));
      toast.success("Skill updated successfully");
    } else {
      const newSkill: Skill = {
        id: Math.max(...skills.map((s) => s.id)) + 1,
        name: "New Skill",
        level: 50,
        category: "frontend",
      };
      setSkills([...skills, newSkill]);
      toast.success("Skill created successfully");
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
              Manage your technical skills
            </p>
          </div>
          <NeonButton variant="green" onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Add Skill
          </NeonButton>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setActiveCategory("all")}
            className={cn(
              "px-3 py-1.5 font-mono text-xs rounded border transition-all",
              activeCategory === "all"
                ? "border-neon-green bg-neon-green/10 text-neon-green"
                : "border-terminal-border text-muted-foreground hover:border-neon-green/50"
            )}
          >
            all
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-3 py-1.5 font-mono text-xs rounded border transition-all",
                activeCategory === cat
                  ? "border-neon-green bg-neon-green/10 text-neon-green"
                  : "border-terminal-border text-muted-foreground hover:border-neon-green/50"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {categories.filter(c => activeCategory === "all" || c === activeCategory).map((category) => {
            const categorySkills = filteredSkills.filter((s) => s.category === category);
            if (categorySkills.length === 0 && activeCategory !== "all") return null;

            return (
              <TerminalWindow
                key={category}
                title={`${category}_skills.config`}
                variant="floating"
              >
                <div className="space-y-4">
                  <p className="font-mono text-xs neon-text-cyan uppercase tracking-wider">
                    {category}
                  </p>

                  {categorySkills.map((skill) => (
                    <div
                      key={skill.id}
                      className="group flex items-center gap-3 p-3 rounded-lg border border-terminal-border hover:border-neon-green/30 transition-all"
                    >
                      <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono text-sm">{skill.name}</span>
                          <span className="font-mono text-xs neon-text-green">{skill.level}%</span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-neon-green to-neon-cyan rounded-full"
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(skill)}
                          className="p-1.5 text-muted-foreground hover:text-neon-cyan transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(skill.id)}
                          className="p-1.5 text-muted-foreground hover:text-status-error transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {categorySkills.length === 0 && (
                    <p className="text-center py-4 text-muted-foreground font-mono text-sm">
                      No skills in this category
                    </p>
                  )}
                </div>
              </TerminalWindow>
            );
          })}
        </div>

        {/* Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <TerminalWindow
              title={editingSkill ? "edit_skill.sh" : "new_skill.sh"}
              className="w-full max-w-md"
            >
              <div className="space-y-4">
                <div>
                  <label className="font-mono text-xs text-muted-foreground uppercase">
                    Skill Name
                  </label>
                  <input
                    type="text"
                    defaultValue={editingSkill?.name || ""}
                    className="w-full mt-1 px-4 py-2 bg-muted/30 border border-terminal-border rounded font-mono text-sm focus:outline-none focus:border-neon-green/50"
                  />
                </div>
                <div>
                  <label className="font-mono text-xs text-muted-foreground uppercase">
                    Category
                  </label>
                  <select
                    defaultValue={editingSkill?.category || "frontend"}
                    className="w-full mt-1 px-4 py-2 bg-muted/30 border border-terminal-border rounded font-mono text-sm focus:outline-none focus:border-neon-green/50"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-mono text-xs text-muted-foreground uppercase">
                    Level: {editingSkill?.level || 50}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    defaultValue={editingSkill?.level || 50}
                    className="w-full mt-2"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <NeonButton variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </NeonButton>
                  <NeonButton variant="green" className="flex-1" onClick={handleSave}>
                    {editingSkill ? "Update" : "Create"}
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

export default AdminSkills;
