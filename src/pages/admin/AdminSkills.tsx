import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { TerminalWindow, StatusBar, NeonButton } from "@/components/terminal";
import { Plus, Edit2, Trash2, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Skill = Tables<"skills">;

const categories = ["frontend", "backend", "database", "tools"];

const AdminSkills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [formData, setFormData] = useState({ name: "", category: "frontend", proficiency: 50 });

  const fetchSkills = async () => {
    const { data } = await supabase.from("skills").select("*").order("display_order");
    if (data) setSkills(data);
    setLoading(false);
  };

  useEffect(() => { fetchSkills(); }, []);

  const filteredSkills = activeCategory === "all" ? skills : skills.filter((s) => s.category === activeCategory);

  const handleDelete = async (id: string) => {
    await supabase.from("skills").delete().eq("id", id);
    setSkills(skills.filter((s) => s.id !== id));
    toast.success("Skill deleted");
  };

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setFormData({ name: skill.name, category: skill.category, proficiency: skill.proficiency || 50 });
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingSkill(null);
    setFormData({ name: "", category: "frontend", proficiency: 50 });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    const payload = { name: formData.name, category: formData.category, proficiency: formData.proficiency };
    if (editingSkill) {
      await supabase.from("skills").update(payload).eq("id", editingSkill.id);
      toast.success("Skill updated");
    } else {
      await supabase.from("skills").insert(payload);
      toast.success("Skill created");
    }
    fetchSkills();
    setIsModalOpen(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <p className="font-mono text-sm text-muted-foreground">Manage your technical skills</p>
          <NeonButton variant="green" onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" /> Add Skill
          </NeonButton>
        </div>

        <div className="flex gap-2 flex-wrap">
          {["all", ...categories].map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={cn("px-3 py-1.5 font-mono text-xs rounded border transition-all",
                activeCategory === cat ? "border-neon-green bg-neon-green/10 text-neon-green"
                  : "border-terminal-border text-muted-foreground hover:border-neon-green/50")}>
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-center py-8 font-mono text-sm text-muted-foreground animate-pulse">Loading...</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {categories.filter(c => activeCategory === "all" || c === activeCategory).map((category) => {
              const categorySkills = filteredSkills.filter((s) => s.category === category);
              if (categorySkills.length === 0 && activeCategory !== "all") return null;
              return (
                <TerminalWindow key={category} title={`${category}_skills.config`} variant="floating">
                  <div className="space-y-4">
                    <p className="font-mono text-xs neon-text-cyan uppercase tracking-wider">{category}</p>
                    {categorySkills.map((skill) => (
                      <div key={skill.id} className="group flex items-center gap-3 p-3 rounded-lg border border-terminal-border hover:border-neon-green/30 transition-all">
                        <GripVertical className="w-4 h-4 text-muted-foreground" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-mono text-sm">{skill.name}</span>
                            <span className="font-mono text-xs neon-text-green">{skill.proficiency}%</span>
                          </div>
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-neon-green to-neon-cyan rounded-full" style={{ width: `${skill.proficiency}%` }} />
                          </div>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleEdit(skill)} className="p-1.5 text-muted-foreground hover:text-neon-cyan transition-colors">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDelete(skill.id)} className="p-1.5 text-muted-foreground hover:text-status-error transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {categorySkills.length === 0 && (
                      <p className="text-center py-4 text-muted-foreground font-mono text-sm">No skills in this category</p>
                    )}
                  </div>
                </TerminalWindow>
              );
            })}
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <TerminalWindow title={editingSkill ? "edit_skill.sh" : "new_skill.sh"} className="w-full max-w-md">
              <div className="space-y-4">
                <div>
                  <label className="font-mono text-xs text-muted-foreground uppercase">Skill Name</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full mt-1 px-4 py-2 bg-muted/30 border border-terminal-border rounded font-mono text-sm focus:outline-none focus:border-neon-green/50" />
                </div>
                <div>
                  <label className="font-mono text-xs text-muted-foreground uppercase">Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full mt-1 px-4 py-2 bg-muted/30 border border-terminal-border rounded font-mono text-sm focus:outline-none focus:border-neon-green/50">
                    {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-mono text-xs text-muted-foreground uppercase">Level: {formData.proficiency}%</label>
                  <input type="range" min="0" max="100" value={formData.proficiency}
                    onChange={(e) => setFormData({ ...formData, proficiency: parseInt(e.target.value) })}
                    className="w-full mt-2" />
                </div>
                <div className="flex gap-3 pt-4">
                  <NeonButton variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancel</NeonButton>
                  <NeonButton variant="green" className="flex-1" onClick={handleSave}>{editingSkill ? "Update" : "Create"}</NeonButton>
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
