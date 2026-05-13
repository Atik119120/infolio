import { useState, useRef } from "react";
import { usePlan } from "@/hooks/usePlan";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, X, Loader2, ExternalLink, Github, Upload, Star, Image } from "lucide-react";
import { compressImage } from "@/lib/imageCompression";
import type { Project } from "@/pages/PortfolioEdit";

interface ProjectsFormProps {
  projects: Project[];
  userId: string;
  onUpdate: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

const emptyProject = {
  title: "",
  description: "",
  tech_stack: [] as string[],
  live_url: "",
  github_url: "",
  image_url: "",
  featured: false,
};

export function ProjectsForm({ projects, userId, onUpdate, onSuccess, onError }: ProjectsFormProps) {
  const { perFileLimitBytes, isPro, plan } = usePlan();
  const imageCap = isPro ? 30 : 6;
  const imagesUsed = projects.filter((p) => !!p.image_url).length;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState(emptyProject);
  const [techInput, setTechInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openNewProjectDialog = () => {
    setEditingProject(null);
    setFormData(emptyProject);
    setDialogOpen(true);
  };

  const openEditDialog = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description || "",
      tech_stack: project.tech_stack || [],
      live_url: project.live_url || "",
      github_url: project.github_url || "",
      image_url: project.image_url || "",
      featured: project.featured || false,
    });
    setDialogOpen(true);
  };

  const handleAddTech = () => {
    if (techInput.trim() && !formData.tech_stack.includes(techInput.trim())) {
      setFormData({ ...formData, tech_stack: [...formData.tech_stack, techInput.trim()] });
      setTechInput("");
    }
  };

  const handleRemoveTech = (tech: string) => {
    setFormData({ ...formData, tech_stack: formData.tech_stack.filter((t) => t !== tech) });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      onError("Please upload an image file");
      return;
    }

    // 1MB limit
    if (file.size > perFileLimitBytes) {
      onError(`Image must be less than ${Math.round(perFileLimitBytes/1024/1024)}MB${isPro ? "" : " (upgrade to Pro for 5MB)"}`);
      return;
    }

    // Image count cap (free: 6, pro: 30). Replacing an existing project image doesn't count as new.
    const replacingExisting = !!editingProject?.image_url;
    if (!replacingExisting && imagesUsed >= imageCap) {
      onError(`Image limit reached (${imageCap} for ${plan} plan)${isPro ? "" : " — upgrade to Pro for more"}`);
      return;
    }

    // Auto-delete previous image (this project's old image) before uploading the new one.
    const oldUrl = formData.image_url || editingProject?.image_url;
    if (oldUrl && oldUrl.includes("/projects/")) {
      const path = oldUrl.split("/projects/")[1]?.split("?")[0];
      if (path) {
        await supabase.storage.from("projects").remove([path]).catch(() => {});
      }
    }

    setUploading(true);

    try {
      // Compress image before upload
      const compressedFile = await compressImage(file, {
        maxWidth: 1200,
        maxHeight: 800,
        quality: 0.8,
        maxSizeKB: 300,
      });

      const fileName = `${userId}/${Date.now()}.jpg`;

      const { error: uploadError } = await supabase.storage
        .from("projects")
        .upload(fileName, compressedFile);

      if (uploadError) {
        throw uploadError;
      }

      const { data: urlData } = supabase.storage.from("projects").getPublicUrl(fileName);
      setFormData({ ...formData, image_url: urlData.publicUrl });
      onSuccess("Image compressed and uploaded!");
    } catch (err) {
      console.error("Upload error:", err);
      onError("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      onError("Please enter a project title");
      return;
    }

    setSaving(true);

    if (editingProject) {
      const { error } = await supabase
        .from("projects")
        .update({
          title: formData.title,
          description: formData.description,
          tech_stack: formData.tech_stack,
          live_url: formData.live_url,
          github_url: formData.github_url,
          image_url: formData.image_url,
          featured: formData.featured,
        })
        .eq("id", editingProject.id);

      setSaving(false);

      if (error) {
        onError("Failed to update project");
      } else {
        onSuccess("Project updated");
        setDialogOpen(false);
        onUpdate();
      }
    } else {
      const { error } = await supabase.from("projects").insert({
        user_id: userId,
        title: formData.title,
        description: formData.description,
        tech_stack: formData.tech_stack,
        live_url: formData.live_url,
        github_url: formData.github_url,
        image_url: formData.image_url,
        featured: formData.featured,
        display_order: projects.length,
      });

      setSaving(false);

      if (error) {
        onError("Failed to add project");
      } else {
        onSuccess("Project added");
        setDialogOpen(false);
        onUpdate();
      }
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);

    // Find the project to get its image URL
    const project = projects.find((p) => p.id === id);
    
    // Delete from database first
    const { error } = await supabase.from("projects").delete().eq("id", id);

    if (error) {
      setDeletingId(null);
      onError("Failed to delete project");
      return;
    }

    // If project had an image, delete it from storage
    if (project?.image_url) {
      try {
        // Extract file path from URL
        const url = new URL(project.image_url);
        const pathMatch = url.pathname.match(/\/projects\/(.+)$/);
        if (pathMatch) {
          const filePath = decodeURIComponent(pathMatch[1]);
          await supabase.storage.from("projects").remove([filePath]);
          console.log("Deleted image from storage:", filePath);
        }
      } catch (err) {
        console.error("Failed to delete image from storage:", err);
        // Don't fail the operation if storage delete fails
      }
    }

    setDeletingId(null);
    onSuccess("Project and image removed");
    onUpdate();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Projects</h2>
          <p className="text-muted-foreground">Showcase your best work</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNewProjectDialog} className="gradient-primary">
              <Plus className="w-4 h-4 mr-2" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProject ? "Edit Project" : "Add New Project"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Project Image</Label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
                >
                  {formData.image_url ? (
                    <img
                      src={formData.image_url}
                      alt="Project"
                      className="max-h-48 mx-auto rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-muted-foreground">
                      {uploading ? (
                        <Loader2 className="w-8 h-8 animate-spin" />
                      ) : (
                        <>
                          <Image className="w-8 h-8 mb-2" />
                          <span>Click to upload project image</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="My Awesome Project"
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your project..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Tech Stack</Label>
                <div className="flex gap-2">
                  <Input
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    placeholder="React, Node.js, etc."
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTech())}
                  />
                  <Button type="button" variant="outline" onClick={handleAddTech}>
                    Add
                  </Button>
                </div>
                {formData.tech_stack.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tech_stack.map((tech) => (
                      <Badge key={tech} variant="secondary" className="gap-1">
                        {tech}
                        <X
                          className="w-3 h-3 cursor-pointer"
                          onClick={() => handleRemoveTech(tech)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Live URL</Label>
                  <Input
                    value={formData.live_url}
                    onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
                    placeholder="https://myproject.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>GitHub URL</Label>
                  <Input
                    value={formData.github_url}
                    onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                    placeholder="https://github.com/..."
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="featured" className="cursor-pointer flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Featured Project
                </Label>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleSave} disabled={saving} className="gradient-primary flex-1">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Project"}
                </Button>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <Card key={project.id} className="overflow-hidden group">
            {project.image_url && (
              <div className="relative h-48 overflow-hidden">
                <img
                  src={project.image_url}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {project.featured && (
                  <Badge className="absolute top-3 right-3 bg-warning">
                    <Star className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                )}
              </div>
            )}
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
              {project.description && (
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {project.description}
                </p>
              )}
              {project.tech_stack && project.tech_stack.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {project.tech_stack.slice(0, 4).map((tech) => (
                    <Badge key={tech} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                  {project.tech_stack.length > 4 && (
                    <Badge variant="secondary" className="text-xs">
                      +{project.tech_stack.length - 4}
                    </Badge>
                  )}
                </div>
              )}
              <div className="flex items-center gap-2">
                {project.live_url && (
                  <Button size="sm" variant="outline" asChild>
                    <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Live
                    </a>
                  </Button>
                )}
                {project.github_url && (
                  <Button size="sm" variant="outline" asChild>
                    <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                      <Github className="w-3 h-3 mr-1" />
                      Code
                    </a>
                  </Button>
                )}
                <div className="flex-1" />
                <Button size="sm" variant="ghost" onClick={() => openEditDialog(project)}>
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-destructive"
                  onClick={() => handleDelete(project.id)}
                  disabled={deletingId === project.id}
                >
                  {deletingId === project.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <X className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {projects.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Plus className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-medium mb-2">No projects yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add your projects to showcase your work
            </p>
            <Button onClick={openNewProjectDialog} className="gradient-primary">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Project
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}