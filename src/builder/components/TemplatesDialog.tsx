import { useState } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TEMPLATES, cloneTemplate, type TemplateDef } from "../templates";
import { useBuilderStore } from "../store";
import { toast } from "sonner";

export function TemplatesDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const replaceContent = useBuilderStore((s) => s.replaceContent);
  const hasBlocks = useBuilderStore((s) => s.content.blocks.length > 0);
  const [cat, setCat] = useState<string>("All");

  const categories = ["All", ...Array.from(new Set(TEMPLATES.map((t) => t.category)))];
  const list = cat === "All" ? TEMPLATES : TEMPLATES.filter((t) => t.category === cat);

  const apply = (t: TemplateDef) => {
    if (hasBlocks && t.id !== "blank") {
      if (!confirm("This will replace your current page. Continue?")) return;
    }
    replaceContent(cloneTemplate(t));
    toast.success(`Applied: ${t.name}`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>Choose a template</DialogTitle>
          <DialogDescription>Start with a fully-designed page you can customize.</DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 mb-2 flex-wrap">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={cn(
                "px-3 py-1.5 text-xs rounded-full border transition",
                cat === c ? "bg-red-600 text-white border-red-600" : "bg-transparent text-foreground/70 border-border hover:bg-muted"
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto pr-1">
          {list.map((t) => (
            <motion.button
              key={t.id}
              whileHover={{ y: -3 }}
              onClick={() => apply(t)}
              className="text-left rounded-xl overflow-hidden border border-border bg-card hover:border-red-500/50 transition group"
            >
              <div className="aspect-video bg-muted overflow-hidden">
                {t.id === "blank" ? (
                  <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-400 text-sm">
                    Blank canvas
                  </div>
                ) : (
                  <img src={t.preview} alt={t.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                )}
              </div>
              <div className="p-3">
                <p className="text-sm font-semibold">{t.name}</p>
                <p className="text-[11px] text-muted-foreground">{t.category}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
