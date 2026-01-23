import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Plus, X, Loader2 } from "lucide-react";
import type { Skill } from "@/pages/PortfolioEdit";

interface SkillsFormProps {
  skills: Skill[];
  userId: string;
  onUpdate: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

const SKILL_CATEGORIES = ["Frontend", "Backend", "Database", "DevOps", "Design", "Other"];

export function SkillsForm({ skills, userId, onUpdate, onSuccess, onError }: SkillsFormProps) {
  const [newSkill, setNewSkill] = useState({ name: "", category: "Other", proficiency: 80 });
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleAddSkill = async () => {
    if (!newSkill.name.trim()) {
      onError("Please enter a skill name");
      return;
    }

    setAdding(true);

    const { error } = await supabase.from("skills").insert({
      user_id: userId,
      name: newSkill.name.trim(),
      category: newSkill.category,
      proficiency: newSkill.proficiency,
    });

    setAdding(false);

    if (error) {
      onError("Failed to add skill");
    } else {
      onSuccess("Skill added");
      setNewSkill({ name: "", category: "Other", proficiency: 80 });
      onUpdate();
    }
  };

  const handleDeleteSkill = async (id: string) => {
    setDeletingId(id);

    const { error } = await supabase.from("skills").delete().eq("id", id);

    setDeletingId(null);

    if (error) {
      onError("Failed to delete skill");
    } else {
      onSuccess("Skill removed");
      onUpdate();
    }
  };

  const groupedSkills = skills.reduce((acc, skill) => {
    const category = skill.category || "Other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div className="space-y-6">
      {/* Add Skill Card */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Skill</CardTitle>
          <CardDescription>Showcase your technical abilities</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Skill Name</Label>
              <Input
                value={newSkill.name}
                onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                placeholder="React, Python, etc."
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <div className="flex flex-wrap gap-2">
                {SKILL_CATEGORIES.map((cat) => (
                  <Badge
                    key={cat}
                    variant={newSkill.category === cat ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setNewSkill({ ...newSkill, category: cat })}
                  >
                    {cat}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Proficiency: {newSkill.proficiency}%</Label>
            <Slider
              value={[newSkill.proficiency]}
              onValueChange={([value]) => setNewSkill({ ...newSkill, proficiency: value })}
              max={100}
              step={5}
            />
          </div>

          <Button onClick={handleAddSkill} disabled={adding} className="gradient-primary">
            {adding ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Plus className="w-4 h-4 mr-2" />
            )}
            Add Skill
          </Button>
        </CardContent>
      </Card>

      {/* Skills List */}
      {Object.entries(groupedSkills).map(([category, categorySkills]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="text-lg">{category}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {categorySkills.map((skill) => (
                <div
                  key={skill.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {skill.proficiency}%
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full gradient-primary rounded-full transition-all"
                        style={{ width: `${skill.proficiency}%` }}
                      />
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-4 text-destructive hover:text-destructive"
                    onClick={() => handleDeleteSkill(skill.id)}
                    disabled={deletingId === skill.id}
                  >
                    {deletingId === skill.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <X className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {skills.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Plus className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-medium mb-2">No skills added yet</h3>
            <p className="text-sm text-muted-foreground">
              Add your technical skills to showcase your expertise
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}