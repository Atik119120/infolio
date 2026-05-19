import { useState } from "react";
import { ChevronRight, Eye, EyeOff, Copy, Trash2, Layers } from "lucide-react";
import { useBuilderStore } from "../store";
import type { Block } from "../types";
import { cn } from "@/lib/utils";

function blockLabel(b: Block): string {
  const c: any = b.content || {};
  return String(c.text || c.title || c.headline || c.brand || b.type).slice(0, 40);
}

function TreeNode({ block, depth }: { block: Block; depth: number }) {
  const { selectedId, setSelected, removeBlock, duplicateBlock, updateBlockStyle } = useBuilderStore();
  const [open, setOpen] = useState(true);
  const hasChildren = !!block.children?.length;
  const isSel = block.id === selectedId;
  const hidden = block.style.hideDesktop;

  return (
    <li>
      <div
        onClick={() => setSelected(block.id)}
        style={{ paddingLeft: 8 + depth * 12 }}
        className={cn(
          "group flex items-center gap-1 pr-2 py-1.5 text-xs cursor-pointer border-l-2 transition",
          isSel ? "bg-pink-500/15 border-pink-500 text-white" : "border-transparent text-white/70 hover:bg-white/5"
        )}
      >
        {hasChildren ? (
          <button
            onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
            className="w-4 h-4 inline-flex items-center justify-center rounded hover:bg-white/10"
          >
            <ChevronRight className={cn("w-3 h-3 transition-transform", open && "rotate-90")} />
          </button>
        ) : (
          <span className="w-4" />
        )}
        <span className="uppercase tracking-wider text-[9px] text-white/40 w-14 shrink-0">{block.type}</span>
        <span className="flex-1 truncate">{blockLabel(block)}</span>
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition">
          <button
            onClick={(e) => { e.stopPropagation(); updateBlockStyle(block.id, { hideDesktop: !hidden }); }}
            className="p-1 hover:bg-white/10 rounded" title="Visibility"
          >
            {hidden ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); duplicateBlock(block.id); }}
            className="p-1 hover:bg-white/10 rounded" title="Duplicate"
          >
            <Copy className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); removeBlock(block.id); }}
            className="p-1 hover:bg-pink-500/30 rounded text-pink-300" title="Delete"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
      {hasChildren && open && (
        <ul>
          {block.children!.map((c) => (
            <TreeNode key={c.id} block={c} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

export function StructurePanel() {
  const { content } = useBuilderStore();
  const all: Block[] = [
    ...(content.header ? [content.header] : []),
    ...content.blocks,
    ...(content.footer ? [content.footer] : []),
  ];
  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-2.5 border-b border-white/10 flex items-center gap-2">
        <Layers className="w-3.5 h-3.5 text-pink-400" />
        <h3 className="text-sm font-semibold">Structure</h3>
        <span className="ml-auto text-[11px] text-white/40">{all.length}</span>
      </div>
      <div className="flex-1 overflow-y-auto py-1">
        {all.length === 0 ? (
          <p className="text-center text-xs text-white/40 py-8 px-3">
            No blocks yet. Drop widgets from the left panel.
          </p>
        ) : (
          <ul>
            {all.map((b) => <TreeNode key={b.id} block={b} depth={0} />)}
          </ul>
        )}
      </div>
    </div>
  );
}
