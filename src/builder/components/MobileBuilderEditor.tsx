import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Plus, Layers, Eye, Pencil, Save, Rocket, Loader2,
  Sparkles, Undo2, Redo2, X, ChevronRight, Palette, PanelTop, PanelBottom,
  ExternalLink, MoreVertical, Trash2, Copy,
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useBuilderStore } from "../store";
import { Canvas } from "./Canvas";
import { BlockInspector } from "./BlockInspector";
import { StructurePanel } from "./StructurePanel";
import { PageThemePanel } from "./PageThemePanel";
import { SectionsLibrary } from "./SectionsLibrary";
import { TemplatesDialog } from "./TemplatesDialog";
import { AiGenerateDialog } from "./AiGenerateDialog";
import { BLOCK_DEFS, createBlock } from "../blocks/defaults";
import * as Icons from "lucide-react";

interface Props {
  onSave: () => void;
  onPublish: () => void;
  saving: boolean;
  publishing: boolean;
}

type Sheet = null | "add" | "sections" | "page" | "more";
type Mode = "edit" | "preview";

export function MobileBuilderEditor({ onSave, onPublish, saving, publishing }: Props) {
  const navigate = useNavigate();
  const {
    pageName, setName, dirty, isPublished, pageSlug,
    content, selectedId, setSelected, setDevice, undo, redo,
    setHeader, setFooter, removeBlock, duplicateBlock,
  } = useBuilderStore();

  const [mode, setMode] = useState<Mode>("edit");
  const [sheet, setSheet] = useState<Sheet>(null);
  const [tplOpen, setTplOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);

  // Force mobile preview width on mobile devices
  useEffect(() => { setDevice("mobile"); }, [setDevice]);

  // Auto-open inspector when a block is selected in edit mode
  useEffect(() => {
    if (mode === "edit" && selectedId) setSheet("add"); // no-op trigger
  }, [selectedId, mode]);

  const previewMode = mode === "preview";
  const selectedBlock = selectedId ? findBlock(content, selectedId) : null;

  return (
    <div className="fixed inset-0 bg-slate-900 flex flex-col text-white z-50 overflow-hidden">
      {/* Top bar - compact */}
      <header className="h-12 shrink-0 bg-slate-950/95 backdrop-blur-xl border-b border-white/10 flex items-center gap-1 px-2">
        <Button
          variant="ghost" size="icon"
          className="h-9 w-9 text-white/70 hover:text-white hover:bg-white/10 shrink-0"
          onClick={() => navigate("/dashboard/builder")}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <Input
          value={pageName}
          onChange={(e) => setName(e.target.value)}
          className="h-8 bg-transparent border-transparent text-sm font-medium focus-visible:bg-white/10 focus-visible:border-white/20 focus-visible:ring-0 px-2 min-w-0"
        />
        {dirty && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" title="Unsaved" />}
        <Button
          variant="ghost" size="icon"
          className="h-9 w-9 text-white/70 hover:text-white hover:bg-white/10 shrink-0"
          onClick={() => setSheet("more")}
        >
          <MoreVertical className="w-4 h-4" />
        </Button>
      </header>

      {/* Mode chip when preview */}
      {previewMode && (
        <div className="shrink-0 px-3 py-1.5 bg-emerald-600/15 border-b border-emerald-500/20 text-[11px] text-emerald-300 flex items-center gap-2">
          <Eye className="w-3 h-3" /> Preview mode — tap Edit to make changes
        </div>
      )}

      {/* Canvas area */}
      <main
        className={cn(
          "flex-1 min-h-0 overflow-hidden",
          previewMode && "bg-black"
        )}
      >
        <div className={cn("h-full", previewMode && "[&_*]:!ring-0 [&_*]:!ring-offset-0")}
             onClickCapture={previewMode ? (e) => {
               // block selection clicks while previewing
               e.stopPropagation();
             } : undefined}
        >
          <Canvas />
        </div>
      </main>

      {/* Bottom action bar */}
      <nav className="h-16 shrink-0 bg-slate-950/95 backdrop-blur-xl border-t border-white/10 flex items-stretch px-1 pb-[env(safe-area-inset-bottom)]">
        <BarButton
          icon={<Plus className="w-5 h-5" />} label="Add"
          onClick={() => { setMode("edit"); setSheet("add"); }}
          disabled={previewMode}
        />
        <BarButton
          icon={<Layers className="w-5 h-5" />} label="Sections"
          onClick={() => setSheet("sections")}
        />
        <BarButton
          icon={previewMode ? <Pencil className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          label={previewMode ? "Edit" : "Preview"}
          accent
          onClick={() => {
            setSelected(null);
            setMode(previewMode ? "edit" : "preview");
          }}
        />
        <BarButton
          icon={saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          label="Save"
          onClick={onSave}
          disabled={saving}
        />
        <BarButton
          icon={publishing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Rocket className="w-5 h-5" />}
          label="Publish"
          onClick={onPublish}
          disabled={publishing}
          primary
        />
      </nav>

      {/* Inspector sheet — auto opens when block selected in edit mode */}
      <Sheet
        open={!previewMode && !!selectedBlock}
        onOpenChange={(o) => { if (!o) setSelected(null); }}
      >
        <SheetContent
          side="bottom"
          className="h-[78vh] p-0 bg-slate-950 border-white/10 text-white rounded-t-2xl flex flex-col"
        >
          <div className="shrink-0 flex items-center gap-2 px-4 h-12 border-b border-white/10">
            <div className="w-10 h-1 rounded-full bg-white/20 absolute left-1/2 -translate-x-1/2 -top-2.5" />
            <span className="text-[10px] uppercase tracking-widest text-pink-400 font-semibold">
              {selectedBlock?.type}
            </span>
            <span className="text-sm text-white/80 truncate flex-1">Edit block</span>
            {selectedBlock && (
              <>
                <button
                  className="p-2 rounded-md hover:bg-white/10 text-white/70"
                  onClick={() => duplicateBlock(selectedBlock.id)}
                  title="Duplicate"
                ><Copy className="w-4 h-4" /></button>
                <button
                  className="p-2 rounded-md hover:bg-red-500/20 text-red-300"
                  onClick={() => { removeBlock(selectedBlock.id); setSelected(null); }}
                  title="Delete"
                ><Trash2 className="w-4 h-4" /></button>
              </>
            )}
            <button
              className="p-2 rounded-md hover:bg-white/10 text-white/70"
              onClick={() => setSelected(null)}
            ><X className="w-4 h-4" /></button>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto">
            {selectedBlock && <BlockInspector block={selectedBlock} />}
          </div>
        </SheetContent>
      </Sheet>

      {/* Add widgets sheet */}
      <Sheet open={sheet === "add"} onOpenChange={(o) => !o && setSheet(null)}>
        <SheetContent
          side="bottom"
          className="h-[80vh] p-0 bg-slate-950 border-white/10 text-white rounded-t-2xl flex flex-col"
        >
          <AddSheet
            onClose={() => setSheet(null)}
            onOpenTemplates={() => { setSheet(null); setTplOpen(true); }}
            onOpenAi={() => { setSheet(null); setAiOpen(true); }}
          />
        </SheetContent>
      </Sheet>

      {/* Sections / structure sheet */}
      <Sheet open={sheet === "sections"} onOpenChange={(o) => !o && setSheet(null)}>
        <SheetContent
          side="bottom"
          className="h-[75vh] p-0 bg-slate-950 border-white/10 text-white rounded-t-2xl flex flex-col"
        >
          <SheetHeader className="px-4 h-12 border-b border-white/10 flex-row items-center">
            <SheetTitle className="text-white text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-pink-400" /> Jump to section
            </SheetTitle>
            <button className="ml-auto p-2 -mr-2 text-white/60" onClick={() => setSheet(null)}>
              <X className="w-4 h-4" />
            </button>
          </SheetHeader>
          <div className="flex-1 min-h-0 overflow-y-auto">
            <div onClick={() => setSheet(null)}>
              <StructurePanel />
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* "More" menu sheet */}
      <Sheet open={sheet === "more"} onOpenChange={(o) => !o && setSheet(null)}>
        <SheetContent
          side="bottom"
          className="h-auto max-h-[70vh] p-0 bg-slate-950 border-white/10 text-white rounded-t-2xl flex flex-col"
        >
          <SheetHeader className="px-4 h-12 border-b border-white/10 flex-row items-center">
            <SheetTitle className="text-white text-sm">Page actions</SheetTitle>
            <button className="ml-auto p-2 -mr-2 text-white/60" onClick={() => setSheet(null)}>
              <X className="w-4 h-4" />
            </button>
          </SheetHeader>
          <div className="p-2">
            <MenuRow icon={<Sparkles className="w-4 h-4 text-pink-400" />} label="AI Generate"
              onClick={() => { setSheet(null); setAiOpen(true); }} />
            <MenuRow icon={<Palette className="w-4 h-4" />} label="Page theme & SEO"
              onClick={() => setSheet("page")} />
            <MenuRow icon={<PanelTop className="w-4 h-4" />}
              label={content.header ? "Edit header" : "Add header"}
              onClick={() => {
                if (content.header) setSelected(content.header.id);
                else { const n = createBlock("navbar"); setHeader(n); setSelected(n.id); }
                setSheet(null);
              }} />
            <MenuRow icon={<PanelBottom className="w-4 h-4" />}
              label={content.footer ? "Edit footer" : "Add footer"}
              onClick={() => {
                if (content.footer) setSelected(content.footer.id);
                else { const f = createBlock("footer"); setFooter(f); setSelected(f.id); }
                setSheet(null);
              }} />
            <MenuRow icon={<Undo2 className="w-4 h-4" />} label="Undo"
              onClick={() => { undo(); setSheet(null); }} />
            <MenuRow icon={<Redo2 className="w-4 h-4" />} label="Redo"
              onClick={() => { redo(); setSheet(null); }} />
            {isPublished && pageSlug && (
              <MenuRow icon={<ExternalLink className="w-4 h-4" />} label="View published page"
                onClick={() => window.open(`/p/${pageSlug}`, "_blank")} />
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Page theme sheet */}
      <Sheet open={sheet === "page"} onOpenChange={(o) => !o && setSheet(null)}>
        <SheetContent
          side="bottom"
          className="h-[80vh] p-0 bg-slate-950 border-white/10 text-white rounded-t-2xl flex flex-col"
        >
          <SheetHeader className="px-4 h-12 border-b border-white/10 flex-row items-center">
            <SheetTitle className="text-white text-sm">Page theme</SheetTitle>
            <button className="ml-auto p-2 -mr-2 text-white/60" onClick={() => setSheet(null)}>
              <X className="w-4 h-4" />
            </button>
          </SheetHeader>
          <div className="flex-1 min-h-0 overflow-y-auto">
            <PageThemePanel />
          </div>
        </SheetContent>
      </Sheet>

      <TemplatesDialog open={tplOpen} onOpenChange={setTplOpen} />
      <AiGenerateDialog open={aiOpen} onOpenChange={setAiOpen} />
    </div>
  );
}

/* ----- helpers ----- */
function findBlock(content: any, id: string): any {
  const walk = (arr: any[]): any => {
    for (const b of arr) {
      if (b.id === id) return b;
      if (b.children) { const f = walk(b.children); if (f) return f; }
    }
    return null;
  };
  const roots = [
    ...(content.header ? [content.header] : []),
    ...(content.blocks || []),
    ...(content.footer ? [content.footer] : []),
  ];
  return walk(roots);
}

function BarButton({
  icon, label, onClick, disabled, accent, primary,
}: { icon: React.ReactNode; label: string; onClick?: () => void; disabled?: boolean; accent?: boolean; primary?: boolean }) {
  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex-1 min-w-0 flex flex-col items-center justify-center gap-0.5 rounded-lg mx-0.5 my-1.5 transition",
        "text-white/70 hover:text-white hover:bg-white/5 active:bg-white/10",
        accent && "text-pink-300 hover:text-pink-200",
        primary && "bg-gradient-to-r from-pink-600 to-fuchsia-600 text-white hover:brightness-110 shadow-lg shadow-pink-600/30",
        disabled && "opacity-40 pointer-events-none",
      )}
    >
      {icon}
      <span className="text-[10px] font-medium leading-none">{label}</span>
    </motion.button>
  );
}

function MenuRow({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 h-12 rounded-lg hover:bg-white/5 text-left text-sm text-white/90"
    >
      <span className="w-8 h-8 rounded-md bg-white/5 inline-flex items-center justify-center text-white/80">{icon}</span>
      <span className="flex-1">{label}</span>
      <ChevronRight className="w-4 h-4 text-white/30" />
    </button>
  );
}

/* ---------- Add sheet ---------- */
function AddSheet({
  onClose, onOpenTemplates, onOpenAi,
}: { onClose: () => void; onOpenTemplates: () => void; onOpenAi: () => void }) {
  const { addBlock } = useBuilderStore();
  const [tab, setTab] = useState<"sections" | "elements" | "layout" | "library">("sections");
  const groups = {
    sections: BLOCK_DEFS.filter((b) => b.category === "section"),
    elements: BLOCK_DEFS.filter((b) => b.category === "element"),
    layout: BLOCK_DEFS.filter((b) => b.category === "layout"),
  };

  return (
    <>
      <div className="shrink-0 px-4 pt-3 pb-2 border-b border-white/10">
        <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-3" />
        <div className="flex items-center gap-2 mb-3">
          <h3 className="text-sm font-semibold flex-1">Add to page</h3>
          <button className="p-1.5 text-white/60 hover:text-white" onClick={onClose}>
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-3">
          <button
            onClick={onOpenTemplates}
            className="h-11 rounded-lg bg-gradient-to-r from-pink-600 to-fuchsia-600 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-pink-600/20"
          >
            <Icons.LayoutTemplate className="w-4 h-4" /> Templates
          </button>
          <button
            onClick={onOpenAi}
            className="h-11 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-semibold flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-pink-400" /> AI generate
          </button>
        </div>
        <div className="grid grid-cols-4 gap-1 bg-white/5 p-0.5 rounded-lg">
          {(["sections", "elements", "layout", "library"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "h-8 rounded-md text-[11px] font-medium capitalize transition",
                tab === t ? "bg-pink-600 text-white" : "text-white/60"
              )}
            >{t}</button>
          ))}
        </div>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto p-3">
        {tab === "library" ? (
          <SectionsLibrary />
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {groups[tab].map((def) => {
              const Icon = (Icons as any)[def.icon] || Icons.Square;
              return (
                <motion.button
                  key={`${def.type}-${def.preset || def.label}`}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => {
                    addBlock(createBlock(def.preset || def.type));
                    onClose();
                  }}
                  className="aspect-square flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl bg-white/5 hover:bg-pink-500/10 border border-white/10 active:border-pink-500/40"
                >
                  <Icon className="w-5 h-5 text-pink-400" />
                  <span className="text-[10px] font-medium text-white/80 leading-tight text-center">{def.label}</span>
                </motion.button>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
