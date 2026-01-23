import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, X, Loader2, GraduationCap } from "lucide-react";
import type { Education } from "@/pages/PortfolioEdit";

interface EducationFormProps {
  education: Education[];
  userId: string;
  onUpdate: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

const emptyEducation = {
  institution: "",
  degree: "",
  field_of_study: "",
  start_date: "",
  end_date: "",
  is_current: false,
};

export function EducationForm({ education, userId, onUpdate, onSuccess, onError }: EducationFormProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEdu, setEditingEdu] = useState<Education | null>(null);
  const [formData, setFormData] = useState(emptyEducation);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const openNewDialog = () => {
    setEditingEdu(null);
    setFormData(emptyEducation);
    setDialogOpen(true);
  };

  const openEditDialog = (edu: Education) => {
    setEditingEdu(edu);
    setFormData({
      institution: edu.institution,
      degree: edu.degree,
      field_of_study: edu.field_of_study || "",
      start_date: edu.start_date || "",
      end_date: edu.end_date || "",
      is_current: edu.is_current || false,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.institution.trim() || !formData.degree.trim()) {
      onError("Please fill in institution and degree");
      return;
    }

    setSaving(true);

    const data = {
      institution: formData.institution,
      degree: formData.degree,
      field_of_study: formData.field_of_study,
      start_date: formData.start_date || null,
      end_date: formData.is_current ? null : (formData.end_date || null),
      is_current: formData.is_current,
    };

    if (editingEdu) {
      const { error } = await supabase.from("education").update(data).eq("id", editingEdu.id);
      setSaving(false);
      if (error) {
        onError("Failed to update education");
      } else {
        onSuccess("Education updated");
        setDialogOpen(false);
        onUpdate();
      }
    } else {
      const { error } = await supabase.from("education").insert({
        ...data,
        user_id: userId,
        display_order: education.length,
      });
      setSaving(false);
      if (error) {
        onError("Failed to add education");
      } else {
        onSuccess("Education added");
        setDialogOpen(false);
        onUpdate();
      }
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const { error } = await supabase.from("education").delete().eq("id", id);
    setDeletingId(null);
    if (error) {
      onError("Failed to delete education");
    } else {
      onSuccess("Education removed");
      onUpdate();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Education</h2>
          <p className="text-muted-foreground">Your academic background</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNewDialog} className="gradient-primary">
              <Plus className="w-4 h-4 mr-2" />
              Add Education
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingEdu ? "Edit Education" : "Add Education"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Institution *</Label>
                <Input
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  placeholder="MIT, Stanford, etc."
                />
              </div>

              <div className="space-y-2">
                <Label>Degree *</Label>
                <Input
                  value={formData.degree}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                  placeholder="Bachelor of Science"
                />
              </div>

              <div className="space-y-2">
                <Label>Field of Study</Label>
                <Input
                  value={formData.field_of_study}
                  onChange={(e) => setFormData({ ...formData, field_of_study: e.target.value })}
                  placeholder="Computer Science"
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
                  id="edu_is_current"
                  checked={formData.is_current}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_current: checked as boolean })
                  }
                />
                <Label htmlFor="edu_is_current" className="cursor-pointer">
                  Currently studying here
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

      {/* Education List */}
      <div className="space-y-4">
        {education.map((edu) => (
          <Card key={edu.id}>
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-6 h-6 text-secondary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{edu.degree}</h3>
                      <p className="text-muted-foreground">{edu.institution}</p>
                      {edu.field_of_study && (
                        <p className="text-sm text-muted-foreground">{edu.field_of_study}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => openEditDialog(edu)}>
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => handleDelete(edu.id)}
                        disabled={deletingId === edu.id}
                      >
                        {deletingId === edu.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <X className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {edu.start_date && new Date(edu.start_date).toLocaleDateString("en-US", { year: "numeric", month: "short" })}
                    {" - "}
                    {edu.is_current ? "Present" : edu.end_date && new Date(edu.end_date).toLocaleDateString("en-US", { year: "numeric", month: "short" })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {education.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
              <GraduationCap className="w-8 h-8 text-secondary" />
            </div>
            <h3 className="font-medium mb-2">No education added</h3>
            <p className="text-sm text-muted-foreground">
              Add your educational background
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}