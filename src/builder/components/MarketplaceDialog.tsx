import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Sparkles, Crown, Check, LayoutTemplate, Blocks, Library } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { TEMPLATES, cloneTemplate, type TemplateDef } from "../templates";

import {
  SECTION_BLUEPRINTS,
  BLUEPRINT_CATEGORIES,
  type Tier,
  type SectionBlueprint,
} from "../marketplace/sectionBlueprints";
import { useBuilderStore } from "../store";
import { SectionsLibrary } from "./SectionsLibrary";
import type { PageContent, Block } from "../types";

type TabKey = "templates" | "sections" | "saved";

interface UnifiedTemplate {
  id: string;
  name: string;
  category: string;
  tier: Tier;
  preview: string;
  content: PageContent;
}

const reassign = (b: Block): Block => ({
  ...b,
  id: crypto.randomUUID(),
  children: b.children?.map(reassign),
});

const cloneAny = (t: { content: PageContent }): PageContent => ({
  theme: { ...(t.content.theme || {}) },
  blocks: t.content.blocks.map(reassign),
  header: t.content.header ? reassign(t.content.header) : null,
  footer: t.content.footer ? reassign(t.content.footer) : null,
});

const ALL_TEMPLATES: UnifiedTemplate[] = [
  ...TEMPLATES.map((t: TemplateDef) => ({
    id: t.id, name: t.name, category: t.category, tier: "Free" as Tier,
    preview: t.preview, content: t.content,
  })),
];

export function MarketplaceDialog({
  open, onOpenChange,
}: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const replaceContent = useBuilderStore((s) => s.replaceContent);
  const addBlock = useBuilderStore((s) => s.addBlock);
  const hasBlocks = useBuilderStore((s) => s.content.blocks.length > 0);

  const [tab, setTab] = useState<TabKey>("templates");
  const [query, setQuery] = useState("");
  const [tplCat, setTplCat] = useState<string>("All");
  const [secCat, setSecCat] = useState<string>("All");
  const [tier, setTier] = useState<"All" | Tier>("All");

  const tplCategories = useMemo(
    () => ["All", ...Array.from(new Set(ALL_TEMPLATES.map((t) => t.category)))],
    []
  );
  const secCategories = useMemo(() => ["All", ...BLUEPRINT_CATEGORIES], []);

  const filteredTemplates = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ALL_TEMPLATES.filter((t) => {
      if (tplCat !== "All" && t.category !== tplCat) return false;
      if (tier !== "All" && t.tier !== tier) return false;
      if (q && !`${t.name} ${t.category}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [tplCat, tier, query]);

  const filteredBlueprints = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SECTION_BLUEPRINTS.filter((b) => {
      if (secCat !== "All" && b.category !== secCat) return false;
      if (tier !== "All" && b.tier !== tier) return false;
      if (q && !`${b.name} ${b.category} ${b.tags.join(" ")}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [secCat, tier, query]);

  const applyTemplate = (t: UnifiedTemplate) => {
    if (hasBlocks && t.id !== "blank") {
      if (!confirm("This will replace your current page. Continue?")) return;
    }
    replaceContent(cloneAny(t));
    toast.success(`Applied: ${t.name}`);
    onOpenChange(false);
  };

  const addBlueprint = (b: SectionBlueprint) => {
    addBlock(b.build());
    toast.success(`Added: ${b.name}`);
  };

  const tabs: { key: TabKey; label: string; icon: any }[] = [
    { key: "templates", label: "Templates", icon: LayoutTemplate },
    { key: "sections", label: "Sections", icon: Blocks },
    { key: "saved", label: "My Library", icon: Library },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-3">
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-pink-500" />
            Marketplace
          </DialogTitle>
          <DialogDescription>
            Premium templates and reusable sections — drop them in and edit.
          </DialogDescription>
        </DialogHeader>

        {/* Tabs */}
        <div className="px-6 flex items-center gap-1 border-b">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "px-4 py-2.5 text-sm font-medium inline-flex items-center gap-2 border-b-2 transition -mb-px",
                tab === t.key
                  ? "border-pink-600 text-pink-600"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>

        {/* Filters */}
        {tab !== "saved" && (
          <div className="px-6 py-3 border-b space-y-2.5 bg-muted/30">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={tab === "templates" ? "Search templates..." : "Search sections..."}
                className="w-full h-9 pl-9 pr-3 rounded-lg bg-background border border-input text-sm focus:outline-none focus:ring-1 focus:ring-pink-500"
              />
            </div>
            <div className="flex flex-wrap gap-1.5 items-center">
              {(tab === "templates" ? tplCategories : secCategories).map((c) => {
                const active = tab === "templates" ? tplCat === c : secCat === c;
                return (
                  <button
                    key={c}
                    onClick={() =>
                      tab === "templates" ? setTplCat(c) : setSecCat(c)
                    }
                    className={cn(
                      "px-3 h-7 text-xs rounded-full border transition",
                      active
                        ? "bg-pink-600 text-white border-pink-600"
                        : "bg-background text-foreground/70 border-border hover:border-pink-400"
                    )}
                  >
                    {c}
                  </button>
                );
              })}
              <span className="mx-2 h-4 w-px bg-border" />
              {(["All", "Free", "Pro", "Elite"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTier(t)}
                  className={cn(
                    "px-3 h-7 text-xs rounded-full border transition inline-flex items-center gap-1",
                    tier === t
                      ? "bg-foreground text-background border-foreground"
                      : "bg-background text-foreground/70 border-border hover:border-foreground/40"
                  )}
                >
                  {t !== "Free" && t !== "All" && <Crown className="w-3 h-3" />}
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Body */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {tab === "templates" && (
            <Grid>
              {filteredTemplates.map((t) => (
                <Card
                  key={t.id}
                  title={t.name}
                  subtitle={t.category}
                  preview={t.preview}
                  tier={t.tier}
                  cta={t.id === "blank" ? "Start blank" : "Use template"}
                  onClick={() => applyTemplate(t)}
                />
              ))}
              {filteredTemplates.length === 0 && <Empty label="No templates match." />}
            </Grid>
          )}

          {tab === "sections" && (
            <Grid>
              {filteredBlueprints.map((b) => (
                <Card
                  key={b.id}
                  title={b.name}
                  subtitle={b.category}
                  preview={b.preview}
                  tier={b.tier}
                  cta="Insert section"
                  onClick={() => addBlueprint(b)}
                />
              ))}
              {filteredBlueprints.length === 0 && <Empty label="No sections match." />}
            </Grid>
          )}

          {tab === "saved" && (
            <div className="bg-slate-950 text-white rounded-xl p-3 -m-2">
              <SectionsLibrary />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ============= Helpers ============= */

const Grid = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">{children}</div>
);

const Empty = ({ label }: { label: string }) => (
  <div className="col-span-full text-center py-16 text-sm text-muted-foreground">
    {label}
  </div>
);

interface CardProps {
  title: string;
  subtitle: string;
  preview: string;
  tier: Tier;
  cta: string;
  onClick: () => void;
}

function Card({ title, subtitle, preview, tier, cta, onClick }: CardProps) {
  return (
    <motion.button
      whileHover={{ y: -3 }}
      onClick={onClick}
      className="group text-left rounded-xl overflow-hidden border border-border bg-card hover:border-pink-500/60 hover:shadow-lg transition relative"
    >
      <div className="aspect-video bg-muted overflow-hidden relative">
        <img src={preview} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
        {tier !== "Free" && (
          <span className="absolute top-2 right-2 inline-flex items-center gap-1 px-2 h-6 rounded-full bg-black/80 text-white text-[10px] font-bold uppercase tracking-wider">
            <Crown className="w-3 h-3 text-amber-400" />
            {tier}
          </span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />
        <div className="absolute bottom-3 left-3 right-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition">
          <span className="inline-flex items-center gap-1.5 px-3 h-8 rounded-full bg-white text-neutral-900 text-xs font-semibold shadow-lg">
            <Check className="w-3.5 h-3.5" /> {cta}
          </span>
        </div>
      </div>
      <div className="p-3">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-[11px] text-muted-foreground">{subtitle}</p>
      </div>
    </motion.button>
  );
}
