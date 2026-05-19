import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Plus, FileEdit, Trash2, ExternalLink, Globe, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Page {
  id: string;
  name: string;
  slug: string;
  is_published: boolean;
  updated_at: string;
}

export default function BuilderList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  const load = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from("builder_pages")
      .select("id,name,slug,is_published,updated_at")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });
    setPages((data as any) || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const slugify = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48);

  const createPage = async () => {
    if (!user) return;
    const finalSlug = slugify(slug || name || `page-${Date.now()}`);
    if (!finalSlug) {
      toast.error("Invalid slug");
      return;
    }
    setCreating(true);
    const { data, error } = await supabase
      .from("builder_pages")
      .insert({
        user_id: user.id,
        name: name || "Untitled",
        slug: finalSlug,
        content: { blocks: [] } as any,
      })
      .select()
      .single();
    setCreating(false);
    if (error) {
      toast.error(error.message.includes("duplicate") ? "Slug already used" : "Failed to create");
      return;
    }
    setOpen(false);
    setName("");
    setSlug("");
    navigate(`/dashboard/builder/${data.id}`);
  };

  const removePage = async (id: string) => {
    if (!confirm("Delete this page?")) return;
    const { error } = await supabase.from("builder_pages").delete().eq("id", id);
    if (error) return toast.error("Delete failed");
    toast.success("Deleted");
    load();
  };

  return (
    <div className="space-y-6 text-white">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Page Builder</h1>
          <p className="text-sm text-white/50 mt-1">
            Drag-and-drop visual builder for custom pages.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-white text-black hover:bg-white/90 gap-2">
              <Plus className="w-4 h-4" /> New Page
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create new page</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <div>
                <Label className="text-xs">Page name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Landing page" />
              </div>
              <div>
                <Label className="text-xs">Slug (URL)</Label>
                <Input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="my-page"
                />
                <p className="text-[11px] text-muted-foreground mt-1">
                  Public URL: <code>/p/{slugify(slug || name) || "your-slug"}</code>
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={createPage} disabled={creating}>
                {creating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Create & Edit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-white/40" />
        </div>
      ) : pages.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-white/10 rounded-xl">
          <FileEdit className="w-10 h-10 text-white/40 mx-auto mb-3" />
          <p className="font-medium text-white">No pages yet</p>
          <p className="text-sm text-white/50 mt-1">Create your first page to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pages.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="group p-5 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/20 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="min-w-0">
                  <h3 className="font-semibold truncate text-white">{p.name}</h3>
                  <p className="text-xs text-white/50 truncate">/p/{p.slug}</p>
                </div>
                <span className={`text-[10px] font-medium uppercase tracking-wide px-2 py-0.5 rounded-full border ${
                  p.is_published ? "border-white/30 text-white" : "border-white/10 text-white/50"
                }`}>
                  {p.is_published ? "Live" : "Draft"}
                </span>
              </div>
              <p className="text-[11px] text-white/40 mb-4">
                Updated {new Date(p.updated_at).toLocaleDateString()}
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1 gap-1.5 bg-white text-black hover:bg-white/90"
                  onClick={() => navigate(`/dashboard/builder/${p.id}`)}
                >
                  <FileEdit className="w-3.5 h-3.5" /> Edit
                </Button>
                {p.is_published && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-transparent border-white/15 text-white hover:bg-white/5 hover:text-white"
                    onClick={() => window.open(`/p/${p.slug}`, "_blank")}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-transparent border-white/15 text-white hover:bg-white/5 hover:text-white"
                  onClick={() => removePage(p.id)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="text-xs text-white/40 border-t border-white/10 pt-4 flex items-center gap-2">
        <Globe className="w-3.5 h-3.5" />
        Pages auto-save every 8 seconds. Publish to make them publicly accessible.
      </div>
    </div>
  );
}
