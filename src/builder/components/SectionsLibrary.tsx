import { useEffect, useState, useCallback } from "react";
import { Loader2, Trash2, Library } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useBuilderStore } from "../store";
import type { Block } from "../types";

interface SavedSection {
  id: string;
  name: string;
  block: Block;
  preview_text: string | null;
}

const reassign = (b: Block): Block => ({
  ...b,
  id: crypto.randomUUID(),
  children: b.children?.map(reassign),
});

export function SectionsLibrary() {
  const { user } = useAuth();
  const addBlock = useBuilderStore((s) => s.addBlock);
  const [sections, setSections] = useState<SavedSection[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("builder_sections")
      .select("id,name,block,preview_text")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setLoading(false);
    if (error) return;
    setSections((data as any) || []);
  }, [user]);

  useEffect(() => { load(); }, [load]);

  // refresh when other components save
  useEffect(() => {
    const handler = () => load();
    window.addEventListener("builder:sections:refresh", handler);
    return () => window.removeEventListener("builder:sections:refresh", handler);
  }, [load]);

  const remove = async (id: string) => {
    if (!confirm("Delete this saved section?")) return;
    await supabase.from("builder_sections").delete().eq("id", id);
    setSections((s) => s.filter((x) => x.id !== id));
    toast.success("Removed");
  };

  if (loading) {
    return <div className="flex justify-center py-6"><Loader2 className="w-4 h-4 animate-spin text-white/50" /></div>;
  }

  if (sections.length === 0) {
    return (
      <div className="text-center py-6 px-3 text-white/40 text-xs">
        <Library className="w-5 h-5 mx-auto mb-2 opacity-60" />
        No saved sections yet. Right-click any block on canvas to save it here.
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {sections.map((s) => (
        <motion.div
          key={s.id}
          whileHover={{ x: 2 }}
          className="group flex items-center gap-2 p-2 rounded-lg bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/40 transition"
        >
          <button
            onClick={() => addBlock(reassign(s.block))}
            className="flex-1 text-left min-w-0"
          >
            <p className="text-xs font-medium text-white truncate">{s.name}</p>
            <p className="text-[10px] text-white/40 capitalize truncate">
              {s.block.type}{s.preview_text ? ` · ${s.preview_text}` : ""}
            </p>
          </button>
          <button
            onClick={() => remove(s.id)}
            className="opacity-0 group-hover:opacity-100 p-1 text-white/50 hover:text-red-400"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      ))}
    </div>
  );
}

export async function saveBlockAsSection(userId: string, block: Block, name?: string) {
  const previewText =
    block.content?.title || block.content?.text || block.content?.brand || null;
  const finalName = name || previewText || `${block.type} section`;
  const { error } = await supabase.from("builder_sections").insert({
    user_id: userId,
    name: finalName,
    block: block as any,
    preview_text: previewText,
  });
  if (error) {
    toast.error("Save failed");
    return false;
  }
  toast.success("Saved to library");
  window.dispatchEvent(new Event("builder:sections:refresh"));
  return true;
}
