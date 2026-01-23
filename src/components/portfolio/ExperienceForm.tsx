import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, X, Loader2, Briefcase } from "lucide-react";
import type { Experience } from "@/pages/PortfolioEdit";

interface ExperienceFormProps {
  experiences: Experience[];
  userId: string;
  onUpdate: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

const emptyExperience = {
  company: "",
  position: "",
  description: "",
  start_date: "",
  end_date: "",
  is_current: false,
};

export function ExperienceForm({ experiences, userId, onUpdate, onSuccess, onError }: ExperienceFormProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [formData, setFormData] = useState(emptyExperience);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const openNewDialog = () => {
    setEditingExp(null);
    setFormData(emptyExperience);
    setDialogOpen(true);
  };

  const openEditDialog = (exp: Experience) => {
    setEditingExp(exp);
    setFormData({
      company: exp.company,
      position: exp.position,
      description: exp.description || "",
      start_date: exp.start_date || "",
      end_date: exp.end_date || "",
      is_current: exp.is_current || false,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.company.trim() || !formData.position.trim()) {
      onError("Please fill in company and position");
      return;
    }

    setSaving(true);

    const data = {
      company: formData.company,
      position: formData.position,
      description: formData.description,
      start_date: formData.start_date || null,
      end_date: formData.is_current ? null : (formData.end_date || null),
      is_current: formData.is_current,
    };

    if (editingExp) {
      const { error } = await supabase.from("experiences").update(data).eq("id", editingExp.id);
      setSaving(false);
      if (error) {
        onError("Failed to update experience");
      } else {
        onSuccess("Experience updated");
        setDialogOpen(false);
        onUpdate();
      }
    } else {
      const { error } = await supabase.from("experiences").insert({
        ...data,
        user_id: userId,
        display_order: experiences.length,
      });
      setSaving(false);
      if (error) {
        onError("Failed to add experience");
      } else {
        onSuccess("Experience added");
        setDialogOpen(false);
        onUpdate();
      }
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const { error } = await supabase.from("experiences").delete().eq("id", id);
    setDeletingId(null);
    if (error) {
      onError("Failed to delete experience");
    } else {
      onSuccess("Experience removed");
      onUpdate();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Work Experience</h2>
          <p className="text-muted-foreground">Your professional journey</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNewDialog} className="gradient-primary">
              <Plus className="w-4 h-4 mr-2" />
              Add Experience
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingExp ? "Edit Experience" : "Add Experience"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Company *</Label>
                <Input
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Google, Meta, etc."
                />
              </div>

              <div className="space-y-2">
                <Label>Position *</Label>
                <Input
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  placeholder="Software Engineer"
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your role and achievements..."
                  rows={3}
                />
              </div>

              <div className="grid gap-4 grid-cols-2">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    disabled={formData.is_current}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="is_current"
                  checked={formData.is_current}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_current: checked as boolean })
                  }
                />
                <Label htmlFor="is_current" className="cursor-pointer">
                  I currently work here
                </Label>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleSave} disabled={saving} className="gradient-primary flex-1">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
                </Button>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Experience List */}
      <div className="space-y-4">
        {experiences.map((exp) => (
          <Card key={exp.id}>
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Briefcase className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{exp.position}</h3>
                      <p className="text-muted-foreground">{exp.company}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => openEditDialog(exp)}>
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => handleDelete(exp.id)}
                        disabled={deletingId === exp.id}
                      >
                        {deletingId === exp.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <X className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {exp.start_date && new Date(exp.start_date).toLocaleDateString("en-US", { year: "numeric", month: "short" })}
                    {" - "}
                    {exp.is_current ? "Present" : exp.end_date && new Date(exp.end_date).toLocaleDateString("en-US", { year: "numeric", month: "short" })}
                  </p>
                  {exp.description && (
                    <p className="text-sm mt-2">{exp.description}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {experiences.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Briefcase className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-medium mb-2">No experience added</h3>
            <p className="text-sm text-muted-foreground">
              Add your work experience
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}