import { useState } from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { BLOCK_DEFS } from "../blocks/defaults";
import { createBlock } from "../blocks/defaults";
import { useBuilderStore } from "../store";
import { SectionsLibrary } from "./SectionsLibrary";
import { TemplatesDialog } from "./TemplatesDialog";
import { MarketplaceDialog } from "./MarketplaceDialog";
import { BlockInspector } from "./BlockInspector";
import { cn } from "@/lib/utils";

type Tab = "blocks" | "library";

export function LeftSidebar() {
  const { addBlock, selectedId, content } = useBuilderStore();
  const [tab, setTab] = useState<Tab>("blocks");
  const [tplOpen, setTplOpen] = useState(false);

  // Find selected block recursively
  const findBlock = (blocks: any[], id: string): any => {
    for (const b of blocks) {
      if (b.id === id) return b;
      if (b.children) {
        const f = findBlock(b.children, id);
        if (f) return f;
      }
    }
    return null;
  };
  const allRoots = [
    ...(content.header ? [content.header] : []),
    ...content.blocks,
    ...(content.footer ? [content.footer] : []),
  ];
  const selected = selectedId ? findBlock(allRoots, selectedId) : null;

  if (selected) {
    return (
      <div className="h-full bg-slate-950/95 backdrop-blur-xl border-r border-white/10 text-white">
        <BlockInspector block={selected} />
      </div>
    );
  }

  const layout = BLOCK_DEFS.filter((b) => b.category === "layout");
  const sections = BLOCK_DEFS.filter((b) => b.category === "section");
  const elements = BLOCK_DEFS.filter((b) => b.category === "element");

  const Item = ({ def }: { def: (typeof BLOCK_DEFS)[number] }) => {
    const Icon = (Icons as any)[def.icon] || Icons.Square;
    return (
      <motion.button
        whileHover={{ scale: 1.04, y: -2 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => addBlock(createBlock(def.preset || def.type))}
        className="group flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-white/5 hover:bg-pink-500/10 border border-white/10 hover:border-pink-500/40 transition-all"
      >
        <Icon className="w-5 h-5 text-white/70 group-hover:text-pink-400" />
        <span className="text-[11px] font-medium text-white/80">{def.label}</span>
      </motion.button>
    );
  };

  const Group = ({ title, items }: { title: string; items: typeof BLOCK_DEFS }) => (
    <div>
      <p className="text-[10px] uppercase tracking-widest text-white/40 px-1 mb-2">{title}</p>
      <div className="grid grid-cols-2 gap-2">
        {items.map((d) => (
          <Item key={`${d.type}-${d.preset || d.label}`} def={d} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="h-full bg-slate-950/95 backdrop-blur-xl border-r border-white/10 flex flex-col text-white">
      <div className="px-3 py-2.5 border-b border-white/10 flex items-center gap-2">
        <Icons.Grid3x3 className="w-3.5 h-3.5 text-pink-400" />
        <h3 className="text-sm font-semibold">Widgets</h3>
      </div>
      <div className="p-3 border-b border-white/10 space-y-2">
        <button
          onClick={() => setTplOpen(true)}
          className="w-full flex items-center justify-center gap-2 h-9 rounded-lg bg-gradient-to-r from-pink-600 to-fuchsia-600 text-white text-xs font-semibold hover:brightness-110 transition shadow-lg shadow-pink-600/20"
        >
          <Icons.LayoutTemplate className="w-3.5 h-3.5" />
          Browse templates
        </button>
        <div className="grid grid-cols-2 gap-1 bg-white/5 p-0.5 rounded-lg">
          {(["blocks", "library"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "h-7 rounded-md text-[11px] font-medium capitalize transition",
                tab === t ? "bg-pink-600 text-white" : "text-white/60 hover:text-white"
              )}
            >
              {t === "library" ? "My library" : "Blocks"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-5">
        {tab === "blocks" ? (
          <>
            <Group title="Layout" items={layout} />
            <Group title="Sections" items={sections} />
            <Group title="Elements" items={elements} />
          </>
        ) : (
          <SectionsLibrary />
        )}
      </div>

      <TemplatesDialog open={tplOpen} onOpenChange={setTplOpen} />
    </div>
  );
}
