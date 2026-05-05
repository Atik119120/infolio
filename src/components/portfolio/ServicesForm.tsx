import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X, Loader2, Briefcase } from "lucide-react";
import { ServiceIcon, SERVICE_ICON_KEYS } from "@/lib/serviceIcons";

export interface Service {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
  price: string | null;
  display_order: number | null;
}

interface ServicesFormProps {
  services: Service[];
  userId: string;
  onUpdate: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

const ICON_CHOICES = ["✨","🎨","💼","📈","📷","🎬","💻","🚀","🎯","💡","📱","🛠️"];

export function ServicesForm({ services, userId, onUpdate, onSuccess, onError }: ServicesFormProps) {
  const [draft, setDraft] = useState({ title: "", description: "", icon: "✨", price: "" });
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleAdd = async () => {
    if (!draft.title.trim()) {
      onError("Service title is required");
      return;
    }
    setAdding(true);
    const { error } = await (supabase as any).from("services").insert({
      user_id: userId,
      title: draft.title.trim(),
      description: draft.description.trim() || null,
      icon: draft.icon,
      price: draft.price.trim() || null,
      display_order: services.length,
    });
    setAdding(false);
    if (error) onError("Failed to add service");
    else {
      onSuccess("Service added");
      setDraft({ title: "", description: "", icon: "✨", price: "" });
      onUpdate();
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const { error } = await (supabase as any).from("services").delete().eq("id", id);
    setDeletingId(null);
    if (error) onError("Failed to delete service");
    else { onSuccess("Service removed"); onUpdate(); }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Service</CardTitle>
          <CardDescription>List the services you offer to clients</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="Brand Identity Design" />
            </div>
            <div className="space-y-2">
              <Label>Price (optional)</Label>
              <Input value={draft.price} onChange={(e) => setDraft({ ...draft, price: e.target.value })} placeholder="$500 or Starting at ৳5000" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} placeholder="Short description of what this service includes" rows={3} />
          </div>
          <div className="space-y-2">
            <Label>Icon</Label>
            <div className="flex flex-wrap gap-2">
              {ICON_CHOICES.map((ic) => (
                <button key={ic} type="button" onClick={() => setDraft({ ...draft, icon: ic })}
                  className={`w-10 h-10 rounded-lg text-xl border-2 transition ${draft.icon === ic ? "border-primary bg-primary/10" : "border-muted hover:border-primary/50"}`}>
                  {ic}
                </button>
              ))}
            </div>
          </div>
          <Button onClick={handleAdd} disabled={adding} className="gradient-primary">
            {adding ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
            Add Service
          </Button>
        </CardContent>
      </Card>

      {services.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Briefcase className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-medium mb-2">No services added yet</h3>
            <p className="text-sm text-muted-foreground">Add the services you offer to clients.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {services.map((s) => (
            <Card key={s.id}>
              <CardContent className="p-4 flex items-start gap-3">
                <div className="text-2xl">{s.icon || "✨"}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-semibold truncate">{s.title}</h4>
                    {s.price && <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary">{s.price}</span>}
                  </div>
                  {s.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{s.description}</p>}
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(s.id)} disabled={deletingId === s.id} className="text-destructive">
                  {deletingId === s.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
