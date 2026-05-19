import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown, Layers, Eye, EyeOff, Copy, Trash2 } from "lucide-react";
import { useBuilderStore } from "../store";
import { cn } from "@/lib/utils";

export function Navigator() {
  const [open, setOpen] = useState(false);
  const { content, selectedId, setSelected, removeBlock, duplicateBlock, updateBlockStyle } =
    useBuilderStore();

  return (
    <div className="absolute bottom-0 left-0 right-0 z-30 pointer-events-none">
      <div className="pointer-events-auto mx-auto max-w-md">
        <button
          onClick={() => setOpen((o) => !o)}
          className="mx-auto flex items-center gap-2 px-4 py-1.5 bg-slate-900/95 border border-white/10 border-b-0 rounded-t-lg text-xs text-white/80 hover:text-white shadow-xl"
        >
          <Layers className="w-3.5 h-3.5" />
          Navigator
          <span className="text-white/40">({content.blocks.length})</span>
          {open ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ y: 240, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 240, opacity: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 30 }}
            className="pointer-events-auto bg-slate-950/98 backdrop-blur-xl border-t border-white/10 max-h-64 overflow-y-auto"
          >
            {content.blocks.length === 0 ? (
              <p className="text-center text-xs text-white/40 py-6">No blocks yet</p>
            ) : (
              <ul className="py-1">
                {content.blocks.map((b, idx) => {
                  const isSel = b.id === selectedId;
                  const hidden = b.style.hideDesktop;
                  const label = b.content.text || b.content.headline || b.content.title || b.type;
                  return (
                    <li
                      key={b.id}
                      onClick={() => setSelected(b.id)}
                      className={cn(
                        "group flex items-center gap-2 px-4 py-1.5 text-xs cursor-pointer border-l-2",
                        isSel
                          ? "bg-red-500/10 border-red-500 text-white"
                          : "border-transparent text-white/70 hover:bg-white/5"
                      )}
                    >
                      <span className="text-white/30 w-5">{idx + 1}</span>
                      <span className="uppercase tracking-wider text-[10px] text-white/40 w-16">
                        {b.type}
                      </span>
                      <span className="flex-1 truncate">{String(label).slice(0, 60)}</span>
                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateBlockStyle(b.id, { hideDesktop: !hidden });
                          }}
                          className="p-1 hover:bg-white/10 rounded"
                          title="Toggle visibility"
                        >
                          {hidden ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            duplicateBlock(b.id);
                          }}
                          className="p-1 hover:bg-white/10 rounded"
                          title="Duplicate"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeBlock(b.id);
                          }}
                          className="p-1 hover:bg-red-500/30 rounded text-red-300"
                          title="Delete"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
