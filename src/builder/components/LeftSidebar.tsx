import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { BLOCK_DEFS } from "../blocks/defaults";
import { createBlock } from "../blocks/defaults";
import { useBuilderStore } from "../store";

export function LeftSidebar() {
  const addBlock = useBuilderStore((s) => s.addBlock);

  const layout = BLOCK_DEFS.filter((b) => b.category === "layout");
  const sections = BLOCK_DEFS.filter((b) => b.category === "section");
  const elements = BLOCK_DEFS.filter((b) => b.category === "element");

  const Item = ({ def }: { def: (typeof BLOCK_DEFS)[number] }) => {
    const Icon = (Icons as any)[def.icon] || Icons.Square;
    return (
      <motion.button
        whileHover={{ scale: 1.03, y: -2 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => addBlock(createBlock(def.preset || def.type))}
        className="group flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/40 transition-all"
      >
        <Icon className="w-5 h-5 text-white/70 group-hover:text-red-400" />
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
      <div className="p-4 border-b border-white/10">
        <h2 className="text-sm font-semibold tracking-tight">Elements</h2>
        <p className="text-[11px] text-white/50 mt-0.5">Click to add to canvas</p>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-5">
        <Group title="Layout" items={layout} />
        <Group title="Sections" items={sections} />
        <Group title="Elements" items={elements} />
      </div>
    </div>
  );
}
