import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Mail, Phone, MapPin, Globe, MessageCircle, Send, Github, Linkedin,
  Twitter, Facebook, Instagram, Youtube, Briefcase, Image as ImageIcon,
  Calendar, Link2, Plus, Trash2, GripVertical, Loader2,
} from "lucide-react";
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Portfolio } from "@/pages/PortfolioEdit";

export interface ContactItem {
  id: string;
  type: string;
  label: string | null;
  value: string;
  url: string | null;
  icon: string | null;
  display_order: number;
}

interface Props {
  portfolio: Portfolio | null;
  contactItems: ContactItem[];
  userId: string;
  onUpdate: () => void;
  onSuccess: (m: string) => void;
  onError: (m: string) => void;
}

const TYPES = [
  { value: "email", label: "Email", icon: Mail, placeholder: "name@example.com" },
  { value: "phone", label: "Phone", icon: Phone, placeholder: "+1 555 123 4567" },
  { value: "whatsapp", label: "WhatsApp", icon: MessageCircle, placeholder: "+1 555 123 4567" },
  { value: "telegram", label: "Telegram", icon: Send, placeholder: "@username" },
  { value: "discord", label: "Discord", icon: MessageCircle, placeholder: "username#0000" },
  { value: "linkedin", label: "LinkedIn", icon: Linkedin, placeholder: "https://linkedin.com/in/…" },
  { value: "facebook", label: "Facebook", icon: Facebook, placeholder: "https://facebook.com/…" },
  { value: "instagram", label: "Instagram", icon: Instagram, placeholder: "https://instagram.com/…" },
  { value: "twitter", label: "Twitter / X", icon: Twitter, placeholder: "https://x.com/…" },
  { value: "github", label: "GitHub", icon: Github, placeholder: "https://github.com/…" },
  { value: "youtube", label: "YouTube", icon: Youtube, placeholder: "https://youtube.com/@…" },
  { value: "behance", label: "Behance", icon: ImageIcon, placeholder: "https://behance.net/…" },
  { value: "dribbble", label: "Dribbble", icon: ImageIcon, placeholder: "https://dribbble.com/…" },
  { value: "website", label: "Portfolio Website", icon: Globe, placeholder: "https://…" },
  { value: "location", label: "Location", icon: MapPin, placeholder: "City, Country" },
  { value: "calendly", label: "Booking / Calendly", icon: Calendar, placeholder: "https://calendly.com/…" },
  { value: "fiverr", label: "Fiverr", icon: Briefcase, placeholder: "https://fiverr.com/…" },
  { value: "upwork", label: "Upwork", icon: Briefcase, placeholder: "https://upwork.com/…" },
  { value: "custom", label: "Custom Field", icon: Link2, placeholder: "Anything" },
];

const typeMeta = (t: string) => TYPES.find((x) => x.value === t) || TYPES[TYPES.length - 1];

function SortableRow({
  item, onChange, onRemove,
}: { item: ContactItem; onChange: (patch: Partial<ContactItem>) => void; onRemove: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.6 : 1 };
  const meta = typeMeta(item.type);
  const Icon = meta.icon;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group flex items-start gap-2 rounded-lg border border-white/10 bg-white/[0.02] p-3"
    >
      <button
        type="button"
        className="mt-2 text-white/30 hover:text-white/70 cursor-grab active:cursor-grabbing"
        {...attributes}
        {...listeners}
        aria-label="Reorder"
      >
        <GripVertical className="w-4 h-4" />
      </button>
      <div className="mt-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white/5 text-white/80">
        <Icon className="w-4 h-4" />
      </div>
      <div className="grid flex-1 gap-2 sm:grid-cols-[140px_1fr_1fr]">
        <Select value={item.type} onValueChange={(v) => onChange({ type: v })}>
          <SelectTrigger className="h-9 bg-transparent border-white/10 text-white/90"><SelectValue /></SelectTrigger>
          <SelectContent>
            {TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                <div className="flex items-center gap-2"><t.icon className="w-4 h-4" />{t.label}</div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          placeholder="Label (optional)"
          value={item.label ?? ""}
          onChange={(e) => onChange({ label: e.target.value })}
          className="h-9 bg-transparent border-white/10 text-white/90"
        />
        <Input
          placeholder={meta.placeholder}
          value={item.value}
          onChange={(e) => onChange({ value: e.target.value })}
          className="h-9 bg-transparent border-white/10 text-white/90"
        />
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onRemove}
        className="mt-1 text-white/40 hover:text-red-400 hover:bg-red-500/10"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}

export function ContactInfoForm({ portfolio, contactItems, userId, onUpdate, onSuccess, onError }: Props) {
  const [legacy, setLegacy] = useState({
    phone: portfolio?.phone || "",
    location: portfolio?.location || "",
    website: portfolio?.website || "",
  });
  const [items, setItems] = useState<ContactItem[]>(contactItems);
  const [savingLegacy, setSavingLegacy] = useState(false);

  useEffect(() => {
    setLegacy({
      phone: portfolio?.phone || "",
      location: portfolio?.location || "",
      website: portfolio?.website || "",
    });
  }, [portfolio?.phone, portfolio?.location, portfolio?.website]);

  useEffect(() => { setItems(contactItems); }, [contactItems]);

  // Debounced legacy save
  useEffect(() => {
    const t = setTimeout(async () => {
      if (!userId) return;
      const dirty =
        legacy.phone !== (portfolio?.phone || "") ||
        legacy.location !== (portfolio?.location || "") ||
        legacy.website !== (portfolio?.website || "");
      if (!dirty) return;
      setSavingLegacy(true);
      const { error } = await supabase
        .from("portfolios")
        .update({
          phone: legacy.phone || null,
          location: legacy.location || null,
          website: legacy.website || null,
        })
        .eq("user_id", userId);
      setSavingLegacy(false);
      if (error) onError(error.message);
      else onUpdate();
    }, 600);
    return () => clearTimeout(t);
  }, [legacy.phone, legacy.location, legacy.website]);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  const addItem = async (type: string) => {
    if (!userId) return;
    const display_order = items.length;
    const meta = typeMeta(type);
    const { data, error } = await supabase
      .from("contact_items")
      .insert({ user_id: userId, type, label: type === "custom" ? "" : meta.label, value: "", display_order })
      .select()
      .single();
    if (error || !data) return onError(error?.message || "Failed to add");
    setItems((prev) => [...prev, data as ContactItem]);
    onUpdate();
  };

  const patchItem = async (id: string, patch: Partial<ContactItem>) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));
    const { error } = await supabase.from("contact_items").update(patch).eq("id", id);
    if (error) onError(error.message);
    else onUpdate();
  };

  const removeItem = async (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    const { error } = await supabase.from("contact_items").delete().eq("id", id);
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
    await Promise.all(
      next.map((it) => supabase.from("contact_items").update({ display_order: it.display_order }).eq("id", it.id)),
    );
    onUpdate();
  };

  // Debounce value/label updates while typing
  const [draft, setDraft] = useState<Record<string, Partial<ContactItem>>>({});
  useEffect(() => {
    const ids = Object.keys(draft);
    if (!ids.length) return;
    const t = setTimeout(async () => {
      await Promise.all(
        ids.map((id) => supabase.from("contact_items").update(draft[id]).eq("id", id)),
      );
      setDraft({});
      onUpdate();
    }, 500);
    return () => clearTimeout(t);
  }, [draft]);

  const liveChange = (id: string, patch: Partial<ContactItem>) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));
    setDraft((d) => ({ ...d, [id]: { ...(d[id] || {}), ...patch } }));
  };

  return (
    <div className="space-y-6">
      {/* Quick contact (legacy fields) */}
      <Card className="bg-white/[0.02] border-white/10">
        <CardContent className="space-y-4 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-white/90">Quick Contact</h3>
              <p className="text-xs text-white/40">Shown by all existing themes</p>
            </div>
            {savingLegacy && <Loader2 className="w-3.5 h-3.5 animate-spin text-white/40" />}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs text-white/60">Phone</Label>
              <Input value={legacy.phone} onChange={(e) => setLegacy({ ...legacy, phone: e.target.value })}
                placeholder="+1 555 123 4567" className="h-11 bg-transparent border-white/10 text-white/90" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-white/60">Location</Label>
              <Input value={legacy.location} onChange={(e) => setLegacy({ ...legacy, location: e.target.value })}
                placeholder="City, Country" className="h-11 bg-transparent border-white/10 text-white/90" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs text-white/60">Website</Label>
              <Input value={legacy.website} onChange={(e) => setLegacy({ ...legacy, website: e.target.value })}
                placeholder="https://…" className="h-11 bg-transparent border-white/10 text-white/90" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dynamic contact items */}
      <Card className="bg-white/[0.02] border-white/10">
        <CardContent className="space-y-3 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-white/90">Contact Methods</h3>
              <p className="text-xs text-white/40">Unlimited. Drag to reorder.</p>
            </div>
          </div>

          {items.length === 0 ? (
            <div className="rounded-lg border border-dashed border-white/10 px-4 py-8 text-center text-sm text-white/40">
              No contact methods yet. Add one below.
            </div>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
              <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                  {items.map((it) => (
                    <SortableRow
                      key={it.id}
                      item={it}
                      onChange={(patch) => {
                        if ("type" in patch) patchItem(it.id, patch);
                        else liveChange(it.id, patch);
                      }}
                      onRemove={() => removeItem(it.id)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}

          <div className="flex flex-wrap gap-2 pt-2">
            <Select onValueChange={(v) => addItem(v)}>
              <SelectTrigger className="h-10 w-auto gap-2 bg-white text-black border-0 hover:bg-white/90 font-medium">
                <Plus className="w-4 h-4" />
                <span>Add Contact Method</span>
              </SelectTrigger>
              <SelectContent>
                {TYPES.filter((t) => t.value !== "custom").map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    <div className="flex items-center gap-2"><t.icon className="w-4 h-4" />{t.label}</div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              variant="outline"
              onClick={() => addItem("custom")}
              className="h-10 bg-transparent border-white/15 text-white/90 hover:bg-white/5"
            >
              <Plus className="w-4 h-4 mr-1.5" /> Add Custom Field
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
