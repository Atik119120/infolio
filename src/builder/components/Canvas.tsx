import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Copy, Trash2, GripVertical, BookmarkPlus } from "lucide-react";
import { useBuilderStore } from "../store";
import { BlockRenderer } from "../blocks/BlockRenderer";
import type { Block } from "../types";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { saveBlockAsSection } from "./SectionsLibrary";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { ThemeStyle } from "./ThemeStyle";

const deviceWidth: Record<string, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "390px",
};

function SortableBlock({ block }: { block: Block }) {
  const { selectedId, setSelected, removeBlock, duplicateBlock, updateBlockContent, device } =
    useBuilderStore();
  const { user } = useAuth();
  const isSelected = selectedId === block.id;
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
  });

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          ref={setNodeRef}
          style={{
            transform: CSS.Transform.toString(transform),
            transition,
            opacity: isDragging ? 0.5 : 1,
          }}
          onClick={(e) => {
            e.stopPropagation();
            setSelected(block.id);
          }}
          className={cn(
            "relative group",
            isSelected && "ring-2 ring-pink-500 ring-offset-2 ring-offset-slate-100"
          )}
        >
          {/* Toolbar */}
          <AnimatePresence>
            {isSelected && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="absolute -top-9 left-1/2 -translate-x-1/2 z-20 flex items-center gap-0.5 bg-slate-900 text-white rounded-lg shadow-xl px-1 py-1"
              >
                <button
                  {...attributes}
                  {...listeners}
                  className="p-1.5 hover:bg-white/10 rounded cursor-grab active:cursor-grabbing"
                  title="Drag"
                >
                  <GripVertical className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] uppercase tracking-wide px-2 opacity-70">
                  {block.type}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    duplicateBlock(block.id);
                  }}
                  className="p-1.5 hover:bg-white/10 rounded"
                  title="Duplicate (Cmd+D)"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeBlock(block.id);
                  }}
                  className="p-1.5 hover:bg-pink-500 rounded text-pink-300 hover:text-white"
                  title="Delete (Del)"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <BlockRenderer
            block={block}
            device={device}
            editable={isSelected}
            editorMode
            onEditText={(field, value) => updateBlockContent(block.id, { [field]: value })}
          />

        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-52">
        <ContextMenuItem onClick={() => duplicateBlock(block.id)}>
          <Copy className="w-3.5 h-3.5 mr-2" /> Duplicate
          <span className="ml-auto text-xs text-muted-foreground">⌘D</span>
        </ContextMenuItem>
        <ContextMenuItem onClick={() => setSelected(block.id)}>
          Select & Edit
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => user && saveBlockAsSection(user.id, block)}
          disabled={!user}
        >
          <BookmarkPlus className="w-3.5 h-3.5 mr-2" /> Save as section
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem
          className="text-pink-500 focus:text-pink-500"
          onClick={() => removeBlock(block.id)}
        >
          <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete
          <span className="ml-auto text-xs text-muted-foreground">Del</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

function HeaderFooterWrap({ label, block }: { label: "Header" | "Footer"; block: Block }) {
  const { selectedId, setSelected, device, updateBlockContent, setHeader, setFooter } = useBuilderStore();
  const isSel = selectedId === block.id;
  const remove = () => (label === "Header" ? setHeader(null) : setFooter(null));
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        setSelected(block.id);
      }}
      className={cn(
        "relative group cursor-pointer",
        isSel && "ring-2 ring-pink-500 ring-offset-2 ring-offset-slate-100"
      )}
    >
      <div className="absolute top-1 left-1 z-20 text-[9px] uppercase tracking-widest bg-pink-600/90 text-white px-1.5 py-0.5 rounded">
        {label}
      </div>
      {isSel && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            remove();
          }}
          className="absolute top-1 right-1 z-20 text-[10px] bg-slate-900 hover:bg-red-600 text-white rounded px-1.5 py-0.5"
          title={`Remove ${label}`}
        >
          <Trash2 className="w-3 h-3" />
        </button>
      )}
      <BlockRenderer
        block={block}
        device={device}
        editable={isSel}
        editorMode
        onEditText={(field, value) => updateBlockContent(block.id, { [field]: value })}
      />
    </div>
  );
}

export function Canvas() {
  const { content, device, setSelected, setBlocks } = useBuilderStore();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const theme = content.theme || {};

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIdx = content.blocks.findIndex((b) => b.id === active.id);
    const newIdx = content.blocks.findIndex((b) => b.id === over.id);
    if (oldIdx === -1 || newIdx === -1) return;
    setBlocks(arrayMove(content.blocks, oldIdx, newIdx));
  };

  return (
    <div
      className="h-full overflow-y-auto overflow-x-hidden bg-slate-200/70 dark:bg-slate-800/40 py-8 px-4 flex justify-center items-start"
      onClick={() => setSelected(null)}
    >
      <motion.div
        id="builder-canvas-scope"
        animate={{ width: deviceWidth[device] }}
        transition={{ duration: 0.3 }}
        className="shadow-2xl rounded-lg overflow-hidden min-h-[80vh] w-full"
        style={{
          maxWidth: deviceWidth[device],
          background: theme.background || "#ffffff",
          fontFamily: theme.fontFamily,
        }}
      >
        <ThemeStyle theme={theme} scopeId="builder-canvas-scope" />
        {content.header && (
          <HeaderFooterWrap label="Header" block={content.header} />
        )}
        {content.blocks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400 text-center px-6">
            <div className="text-5xl mb-3">✨</div>
            <p className="text-lg font-medium text-slate-600">Start building</p>
            <p className="text-sm">Click elements from the left sidebar to add them here</p>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={content.blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
              {content.blocks.map((b) => (
                <SortableBlock key={b.id} block={b} />
              ))}
            </SortableContext>
          </DndContext>
        )}
        {content.footer && (
          <HeaderFooterWrap label="Footer" block={content.footer} />
        )}
      </motion.div>
    </div>
  );
}
