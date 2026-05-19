import { useState } from "react";
import { HexColorPicker } from "react-colorful";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useBuilderStore } from "../store";
import type { BlockStyle } from "../types";
import { AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ImageUploader } from "./ImageUploader";
import { PageThemePanel } from "./PageThemePanel";

function ColorField({ label, value, onChange }: { label: string; value?: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-white/70">{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <button className="w-full h-9 rounded-md border border-white/10 bg-white/5 flex items-center gap-2 px-2 text-left text-xs text-white">
            <span
              className="w-5 h-5 rounded border border-white/20"
              style={{ background: value || "transparent" }}
            />
            <span className="flex-1 truncate">{value || "Pick a color"}</span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3">
          <HexColorPicker color={value || "#000000"} onChange={onChange} />
          <Input
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="mt-2 h-8 text-xs"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

function PxSlider({
  label,
  value,
  onChange,
  max = 200,
}: {
  label: string;
  value?: string;
  onChange: (v: string) => void;
  max?: number;
}) {
  const num = parseInt(value || "0") || 0;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label className="text-xs text-white/70">{label}</Label>
        <span className="text-[11px] text-white/50">{num}px</span>
      </div>
      <Slider value={[num]} max={max} step={1} onValueChange={([v]) => onChange(`${v}px`)} />
    </div>
  );
}

export function RightPanel() {
  const { content, selectedId, updateBlockContent, updateBlockStyle } = useBuilderStore();
  const block = content.blocks.find((b) => b.id === selectedId);
  const [tab, setTab] = useState("content");

  if (!block) {
    return (
      <div className="h-full bg-slate-950/95 border-l border-white/10">
        <PageThemePanel />
      </div>
    );
  }

  const s = block.style;
  const setS = (patch: Partial<BlockStyle>) => updateBlockStyle(block.id, patch);
  const setC = (patch: Record<string, any>) => updateBlockContent(block.id, patch);

  return (
    <div className="h-full bg-slate-950/95 backdrop-blur-xl border-l border-white/10 text-white flex flex-col">
      <div className="p-4 border-b border-white/10">
        <p className="text-[10px] uppercase tracking-widest text-white/40">Editing</p>
        <h3 className="text-sm font-semibold capitalize mt-0.5">{block.type}</h3>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-3 m-3 bg-white/5">
          <TabsTrigger value="content" className="text-xs">Content</TabsTrigger>
          <TabsTrigger value="style" className="text-xs">Style</TabsTrigger>
          <TabsTrigger value="advanced" className="text-xs">Advanced</TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-4">
          <TabsContent value="content" className="space-y-3 mt-0">
            {Object.entries(block.content).map(([key, val]) => {
              if (key === "links" || typeof val === "object") return null;
              const isLong = typeof val === "string" && val.length > 60;
              return (
                <div key={key} className="space-y-1.5">
                  <Label className="text-xs text-white/70 capitalize">{key}</Label>
                  {isLong ? (
                    <textarea
                      value={String(val ?? "")}
                      onChange={(e) => setC({ [key]: e.target.value })}
                      rows={3}
                      className="w-full text-xs rounded-md bg-white/5 border border-white/10 px-2 py-1.5 text-white"
                    />
                  ) : (
                    <Input
                      value={String(val ?? "")}
                      onChange={(e) => setC({ [key]: e.target.value })}
                      className="h-8 text-xs bg-white/5 border-white/10 text-white"
                    />
                  )}
                </div>
              );
            })}
            {block.type === "image" && (
              <p className="text-[10px] text-white/40">
                Tip: paste any Cloudinary or hosted URL above.
              </p>
            )}
          </TabsContent>

          <TabsContent value="style" className="space-y-4 mt-0">
            <div className="space-y-1.5">
              <Label className="text-xs text-white/70">Align</Label>
              <div className="flex gap-1">
                {(["left", "center", "right"] as const).map((a) => {
                  const Icon = a === "left" ? AlignLeft : a === "center" ? AlignCenter : AlignRight;
                  return (
                    <button
                      key={a}
                      onClick={() => setS({ textAlign: a })}
                      className={cn(
                        "flex-1 h-8 rounded-md border border-white/10 inline-flex items-center justify-center",
                        s.textAlign === a ? "bg-red-500/20 border-red-500/50" : "bg-white/5"
                      )}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </button>
                  );
                })}
              </div>
            </div>

            <PxSlider label="Font Size" value={s.fontSize} onChange={(v) => setS({ fontSize: v })} max={120} />
            <div className="space-y-1.5">
              <Label className="text-xs text-white/70">Font Weight</Label>
              <select
                value={s.fontWeight || "400"}
                onChange={(e) => setS({ fontWeight: e.target.value })}
                className="w-full h-8 text-xs rounded-md bg-white/5 border border-white/10 text-white px-2"
              >
                {["300", "400", "500", "600", "700", "800", "900"].map((w) => (
                  <option key={w} value={w} className="bg-slate-900">{w}</option>
                ))}
              </select>
            </div>

            <ColorField label="Text Color" value={s.color} onChange={(v) => setS({ color: v })} />
            <ColorField label="Background" value={s.background} onChange={(v) => setS({ background: v })} />

            <div className="grid grid-cols-2 gap-3">
              <PxSlider label="Pad Top" value={s.paddingTop} onChange={(v) => setS({ paddingTop: v })} />
              <PxSlider label="Pad Bottom" value={s.paddingBottom} onChange={(v) => setS({ paddingBottom: v })} />
              <PxSlider label="Pad Left" value={s.paddingLeft} onChange={(v) => setS({ paddingLeft: v })} />
              <PxSlider label="Pad Right" value={s.paddingRight} onChange={(v) => setS({ paddingRight: v })} />
            </div>

            <PxSlider label="Border Radius" value={s.borderRadius} onChange={(v) => setS({ borderRadius: v })} max={100} />
            <PxSlider label="Border Width" value={s.borderWidth} onChange={(v) => setS({ borderWidth: v })} max={20} />
            <ColorField label="Border Color" value={s.borderColor} onChange={(v) => setS({ borderColor: v })} />

            <div className="space-y-1.5">
              <Label className="text-xs text-white/70">Shadow</Label>
              <select
                value={s.boxShadow || ""}
                onChange={(e) => setS({ boxShadow: e.target.value })}
                className="w-full h-8 text-xs rounded-md bg-white/5 border border-white/10 text-white px-2"
              >
                <option value="" className="bg-slate-900">None</option>
                <option value="0 1px 3px rgba(0,0,0,0.1)" className="bg-slate-900">Soft</option>
                <option value="0 10px 20px rgba(0,0,0,0.15)" className="bg-slate-900">Medium</option>
                <option value="0 20px 40px rgba(0,0,0,0.2)" className="bg-slate-900">Strong</option>
              </select>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4 mt-0">
            <p className="text-[10px] uppercase tracking-widest text-white/40">Responsive</p>
            <div className="flex items-center justify-between">
              <Label className="text-xs text-white/70">Hide on Desktop</Label>
              <Switch checked={!!s.hideDesktop} onCheckedChange={(v) => setS({ hideDesktop: v })} />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-xs text-white/70">Hide on Tablet</Label>
              <Switch checked={!!s.hideTablet} onCheckedChange={(v) => setS({ hideTablet: v })} />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-xs text-white/70">Hide on Mobile</Label>
              <Switch checked={!!s.hideMobile} onCheckedChange={(v) => setS({ hideMobile: v })} />
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
