import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Plus, Trash2, Loader2, Github, Linkedin, Twitter, Globe, Youtube, Instagram,
  Facebook, GripVertical, Send, MessageCircle, Image as ImageIcon, Briefcase,
} from "lucide-react";
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy, arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { SocialLink } from "@/pages/PortfolioEdit";

interface SocialLinksFormProps {
  socialLinks: SocialLink[];
  userId: string;
  onUpdate: () => void;
  onSuccess: (m: string) => void;
  onError: (m: string) => void;
}

const PLATFORMS = [
  { value: "github", label: "GitHub", icon: Github },
  { value: "linkedin", label: "LinkedIn", icon: Linkedin },
  { value: "twitter", label: "Twitter / X", icon: Twitter },
  { value: "youtube", label: "YouTube", icon: Youtube },
  { value: "instagram", label: "Instagram", icon: Instagram },
  { value: "facebook", label: "Facebook", icon: Facebook },
  { value: "telegram", label: "Telegram", icon: Send },
  { value: "discord", label: "Discord", icon: MessageCircle },
  { value: "behance", label: "Behance", icon: ImageIcon },
  { value: "dribbble", label: "Dribbble", icon: ImageIcon },
  { value: "fiverr", label: "Fiverr", icon: Briefcase },
  { value: "upwork", label: "Upwork", icon: Briefcase },
  { value: "website", label: "Website", icon: Globe },
  { value: "other", label: "Other", icon: Globe },
];

const platformIcon = (p: string) => PLATFORMS.find((x) => x.value === p.toLowerCase())?.icon || Globe;

function SortableRow({
  link, onChange, onRemove,
}: { link: SocialLink & { label?: string | null }; onChange: (patch: Partial<SocialLink & { label: string | null }>) => void; onRemove: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: link.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.6 : 1 };
  const Icon = platformIcon(link.platform);
  return (
    <div ref={setNodeRef} style={style}
      className="flex items-start gap-2 rounded-lg border border-white/10 bg-white/[0.02] p-3">
      <button type="button" className="mt-2 text-white/30 hover:text-white/70 cursor-grab active:cursor-grabbing"
        {...attributes} {...listeners} aria-label="Reorder">
        <GripVertical className="w-4 h-4" />
      </button>
      <div className="mt-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white/5 text-white/80">
        <Icon className="w-4 h-4" />
      </div>
      <div className="grid flex-1 gap-2 sm:grid-cols-[140px_1fr_1fr]">
        <Select value={link.platform} onValueChange={(v) => onChange({ platform: v })}>
          <SelectTrigger className="h-9 bg-transparent border-white/10 text-white/90"><SelectValue /></SelectTrigger>
          <SelectContent>
            {PLATFORMS.map((p) => (
              <SelectItem key={p.value} value={p.value}>
                <div className="flex items-center gap-2"><p.icon className="w-4 h-4" />{p.label}</div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input placeholder="Label (optional)" value={(link as any).label ?? ""}
          onChange={(e) => onChange({ label: e.target.value })}
          className="h-9 bg-transparent border-white/10 text-white/90" />
        <Input placeholder="https://…" value={link.url}
          onChange={(e) => onChange({ url: e.target.value })}
          className="h-9 bg-transparent border-white/10 text-white/90" />
      </div>
      <Button type="button" variant="ghost" size="icon" onClick={onRemove}
        className="mt-1 text-white/40 hover:text-red-400 hover:bg-red-500/10">
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}

export function SocialLinksForm({ socialLinks, userId, onUpdate, onSuccess, onError }: SocialLinksFormProps) {
  const [items, setItems] = useState<SocialLink[]>(socialLinks);
  const [draft, setDraft] = useState<Record<string, Partial<SocialLink & { label: string | null }>>>({});

  useEffect(() => { setItems(socialLinks); }, [socialLinks]);

  useEffect(() => {
    const ids = Object.keys(draft);
    if (!ids.length) return;
    const t = setTimeout(async () => {
      await Promise.all(ids.map((id) => supabase.from("social_links").update(draft[id] as any).eq("id", id)));
      setDraft({});
      onUpdate();
    }, 500);
    return () => clearTimeout(t);
  }, [draft]);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  const add = async (platform: string) => {
    if (!userId) return;
    const { data, error } = await supabase.from("social_links")
      .insert({ user_id: userId, platform, url: "", display_order: items.length })
      .select().single();
    if (error || !data) return onError(error?.message || "Failed to add");
    setItems((prev) => [...prev, data as SocialLink]);
    onUpdate();
  };

  const liveChange = (id: string, patch: Partial<SocialLink & { label: string | null }>) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...(i as any), ...patch } : i)));
    if ("platform" in patch) {
      supabase.from("social_links").update({ platform: patch.platform }).eq("id", id).then(({ error }) => {
        if (error) onError(error.message); else onUpdate();
      });
    } else {
      setDraft((d) => ({ ...d, [id]: { ...(d[id] || {}), ...patch } }));
    }
  };

  const remove = async (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    const { error } = await supabase.from("social_links").delete().eq("id", id);
    if (error) onError(error.message);
    else { onSuccess("Removed"); onUpdate(); }
  };

  const onDragEnd = async (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    const next = arrayMove(items, oldIndex, newIndex).map((it, idx) => ({ ...it, display_order: idx }));
    setItems(next);
    await Promise.all(next.map((it) => supabase.from("social_links").update({ display_order: it.display_order }).eq("id", it.id)));
    onUpdate();
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/[0.02] border-white/10">
        <CardContent className="space-y-3 pt-6">
          <div>
            <h3 className="text-sm font-medium text-white/90">Social Links</h3>
            <p className="text-xs text-white/40">Unlimited. Drag to reorder.</p>
          </div>

          {items.length === 0 ? (
            <div className="rounded-lg border border-dashed border-white/10 px-4 py-8 text-center text-sm text-white/40">
              No social links yet.
            </div>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
              <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                  {items.map((l) => (
                    <SortableRow key={l.id} link={l as any}
                      onChange={(patch) => liveChange(l.id, patch)}
                      onRemove={() => remove(l.id)} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}

          <div className="pt-2">
            <Select onValueChange={(v) => add(v)}>
              <SelectTrigger className="h-10 w-auto gap-2 bg-white text-black border-0 hover:bg-white/90 font-medium">
                <Plus className="w-4 h-4" />
                <span>Add Social Link</span>
              </SelectTrigger>
              <SelectContent>
                {PLATFORMS.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    <div className="flex items-center gap-2"><p.icon className="w-4 h-4" />{p.label}</div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
