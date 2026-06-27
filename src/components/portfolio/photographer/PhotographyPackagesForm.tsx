import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, X, Loader2, Star, Camera, Check, Pencil } from "lucide-react";

interface PhotoPackage {
  id: string;
  title: string;
  tagline: string | null;
  description: string | null;
  price: string | null;
  duration: string | null;
  featured: boolean | null;
  features: string[] | null;
  display_order: number | null;
}

interface Props {
  services: any[];
  userId: string;
  onUpdate: () => void;
  onSuccess: (m: string) => void;
  onError: (m: string) => void;
}

const emptyDraft = {
  title: "",
  tagline: "",
  price: "",
  duration: "",
  featured: false,
  features: [""],
  description: "",
};

export function PhotographyPackagesForm({ services, userId, onUpdate, onSuccess, onError }: Props) {
  const [draft, setDraft] = useState<typeof emptyDraft>(emptyDraft);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const packages: PhotoPackage[] = (services || []).map((s: any) => ({
    id: s.id,
    title: s.title,
    tagline: s.tagline ?? null,
    description: s.description ?? null,
    price: s.price ?? null,
    duration: s.duration ?? null,
    featured: !!s.featured,
    features: Array.isArray(s.features) ? s.features : [],
    display_order: s.display_order ?? 0,
  }));

  const reset = () => { setDraft(emptyDraft); setEditingId(null); };

  const startEdit = (p: PhotoPackage) => {
    setEditingId(p.id);
    setDraft({
      title: p.title || "",
      tagline: p.tagline || "",
      price: p.price || "",
      duration: p.duration || "",
      featured: !!p.featured,
      features: p.features && p.features.length ? p.features : [""],
      description: p.description || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSave = async () => {
    if (!draft.title.trim()) { onError("Package title required"); return; }
    setSaving(true);
    const cleanFeatures = draft.features.map(f => f.trim()).filter(Boolean);
    const payload: any = {
      title: draft.title.trim(),
      tagline: draft.tagline.trim() || null,
      description: draft.description.trim() || null,
      price: draft.price.trim() || null,
      duration: draft.duration.trim() || null,
      featured: !!draft.featured,
      features: cleanFeatures,
      icon: "camera",
    };
    let error;
    if (editingId) {
      ({ error } = await (supabase as any).from("services").update(payload).eq("id", editingId));
    } else {
      payload.user_id = userId;
      payload.display_order = packages.length;
      ({ error } = await (supabase as any).from("services").insert(payload));
    }
    setSaving(false);
    if (error) onError("Failed to save package");
    else {
      onSuccess(editingId ? "Package updated" : "Package added");
      reset();
      onUpdate();
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const { error } = await (supabase as any).from("services").delete().eq("id", id);
    setDeletingId(null);
    if (error) onError("Failed to delete");
    else { onSuccess("Package removed"); onUpdate(); if (editingId === id) reset(); }
  };

  const toggleFeatured = async (p: PhotoPackage) => {
    // Only one featured at a time — clear others if turning on
    if (!p.featured) {
      await (supabase as any).from("services").update({ featured: false }).eq("user_id", userId);
    }
    await (supabase as any).from("services").update({ featured: !p.featured }).eq("id", p.id);
    onUpdate();
  };

  const updateFeature = (i: number, val: string) => {
    setDraft(d => ({ ...d, features: d.features.map((f, idx) => idx === i ? val : f) }));
  };
  const addFeatureRow = () => setDraft(d => ({ ...d, features: [...d.features, ""] }));
  const removeFeatureRow = (i: number) =>
    setDraft(d => ({ ...d, features: d.features.length > 1 ? d.features.filter((_, idx) => idx !== i) : [""] }));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" /> {editingId ? "Edit Package" : "Add Photography Package"}
          </CardTitle>
          <CardDescription>
            Each package shows as a pricing card (Essential / Signature / Cinematic style). Mark one as "Most Booked" to highlight it.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Package Name *</Label>
              <Input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="Signature" />
            </div>
            <div className="space-y-1.5">
              <Label>Tagline / Shoot Type</Label>
              <Input value={draft.tagline} onChange={(e) => setDraft({ ...draft, tagline: e.target.value })} placeholder="Pre-Wedding / Couple / Bridal" />
            </div>
            <div className="space-y-1.5">
              <Label>Price</Label>
              <Input value={draft.price} onChange={(e) => setDraft({ ...draft, price: e.target.value })} placeholder="$499 or ৳25,000" />
            </div>
            <div className="space-y-1.5">
              <Label>Duration</Label>
              <Input value={draft.duration} onChange={(e) => setDraft({ ...draft, duration: e.target.value })} placeholder="Half-Day Coverage" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Short Description (optional)</Label>
            <Textarea value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} rows={2} placeholder="One-line summary shown under the tagline." />
          </div>

          <div className="space-y-2">
            <Label>What's Included (bullet list)</Label>
            <div className="space-y-2">
              {draft.features.map((f, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary shrink-0" />
                  <Input
                    value={f}
                    onChange={(e) => updateFeature(i, e.target.value)}
                    placeholder={`Feature ${i + 1} (e.g. 80+ edited photos)`}
                  />
                  <Button size="icon" variant="ghost" onClick={() => removeFeatureRow(i)} className="shrink-0">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button size="sm" variant="outline" onClick={addFeatureRow}>
              <Plus className="w-3.5 h-3.5 mr-1" /> Add Feature
            </Button>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <Label className="text-sm">Mark as "Most Booked"</Label>
              <p className="text-xs text-muted-foreground">Highlights this package with a featured badge.</p>
            </div>
            <Switch checked={!!draft.featured} onCheckedChange={(v) => setDraft({ ...draft, featured: v })} />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={saving} className="gradient-primary">
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : (editingId ? <Pencil className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />)}
              {editingId ? "Update Package" : "Add Package"}
            </Button>
            {editingId && <Button variant="ghost" onClick={reset}>Cancel</Button>}
          </div>
        </CardContent>
      </Card>

      {packages.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-10 text-center">
            <Camera className="w-10 h-10 mx-auto text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground">No packages yet. Add Essential, Signature, Cinematic — your choice.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {packages.map((p) => (
            <Card key={p.id} className={p.featured ? "border-primary ring-1 ring-primary/40" : ""}>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-semibold truncate">{p.title}</h4>
                      {p.featured && (
                        <span className="text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded bg-primary text-primary-foreground font-semibold flex items-center gap-1">
                          <Star className="w-2.5 h-2.5" /> Most Booked
                        </span>
                      )}
                    </div>
                    {p.tagline && <p className="text-xs text-muted-foreground">{p.tagline}</p>}
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  {p.price && <span className="text-lg font-bold">{p.price}</span>}
                  {p.duration && <span className="text-xs text-muted-foreground">· {p.duration}</span>}
                </div>
                {p.features && p.features.length > 0 && (
                  <ul className="text-xs text-muted-foreground space-y-0.5 pt-1">
                    {p.features.slice(0, 4).map((f, i) => (
                      <li key={i} className="flex gap-1.5"><Check className="w-3 h-3 text-primary shrink-0 mt-0.5" />{f}</li>
                    ))}
                    {p.features.length > 4 && <li className="text-[11px] italic">+{p.features.length - 4} more</li>}
                  </ul>
                )}
                <div className="flex gap-1 pt-2">
                  <Button size="sm" variant="outline" onClick={() => startEdit(p)} className="flex-1">
                    <Pencil className="w-3 h-3 mr-1" /> Edit
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => toggleFeatured(p)} title="Toggle featured">
                    <Star className={`w-3.5 h-3.5 ${p.featured ? "fill-primary text-primary" : ""}`} />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(p.id)} disabled={deletingId === p.id} className="text-destructive">
                    {deletingId === p.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <X className="w-3.5 h-3.5" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
