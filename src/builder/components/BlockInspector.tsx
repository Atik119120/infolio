import { useState } from "react";
import { HexColorPicker } from "react-colorful";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useBuilderStore } from "../store";
import type { Block, BlockStyle } from "../types";
import { AlignLeft, AlignCenter, AlignRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { ImageUploader } from "./ImageUploader";
import { RepeaterControl, StringListControl } from "./RepeaterControl";
import { REPEATER_SCHEMAS, STRING_LIST_SCHEMAS } from "./repeaterSchemas";

function ColorField({ label, value, onChange }: { label: string; value?: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-white/70">{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <button className="w-full h-9 rounded-md border border-white/10 bg-white/5 flex items-center gap-2 px-2 text-left text-xs text-white">
            <span className="w-5 h-5 rounded border border-white/20" style={{ background: value || "transparent" }} />
            <span className="flex-1 truncate">{value || "Pick a color"}</span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3">
          <HexColorPicker color={value || "#000000"} onChange={onChange} />
          <Input value={value || ""} onChange={(e) => onChange(e.target.value)} className="mt-2 h-8 text-xs" />
        </PopoverContent>
      </Popover>
    </div>
  );
}

function PxSlider({ label, value, onChange, max = 200 }: { label: string; value?: string; onChange: (v: string) => void; max?: number }) {
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

export function BlockInspector({ block }: { block: Block }) {
  const { updateBlockContent, updateBlockStyle, setSelected } = useBuilderStore();
  const [tab, setTab] = useState("content");
  const s = block.style;
  const setS = (patch: Partial<BlockStyle>) => updateBlockStyle(block.id, patch);
  const setC = (patch: Record<string, any>) => updateBlockContent(block.id, patch);

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-2.5 border-b border-white/10 flex items-center gap-2">
        <button
          onClick={() => setSelected(null)}
          className="h-7 w-7 -ml-1 rounded-md hover:bg-white/10 inline-flex items-center justify-center text-white/70 hover:text-white"
          title="Back to widgets"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-widest text-pink-400/80">Edit</p>
          <h3 className="text-sm font-semibold capitalize truncate">{block.type}</h3>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="flex-1 flex flex-col min-h-0">
        <TabsList className="grid grid-cols-3 mx-3 mt-3 bg-white/5 h-8">
          <TabsTrigger value="content" className="text-[11px] h-6">Content</TabsTrigger>
          <TabsTrigger value="style" className="text-[11px] h-6">Style</TabsTrigger>
          <TabsTrigger value="advanced" className="text-[11px] h-6">Advanced</TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
          <TabsContent value="content" className="space-y-3 mt-0">
            {Object.entries(block.content).map(([key, val]) => {
              const schemaKey = `${block.type}.${key}`;
              const repeaterSchema = REPEATER_SCHEMAS[schemaKey];
              const stringSchema = STRING_LIST_SCHEMAS[schemaKey];

              // Array of objects → repeater
              if (Array.isArray(val) && repeaterSchema) {
                return (
                  <div key={key} className="space-y-2">
                    <Label className="text-[11px] uppercase tracking-widest text-pink-400/80">
                      {repeaterSchema.itemLabel}s
                    </Label>
                    <RepeaterControl
                      items={val}
                      schema={repeaterSchema}
                      onChange={(items) => setC({ [key]: items })}
                    />
                  </div>
                );
              }

              // Array of strings → simple list
              if (Array.isArray(val) && stringSchema) {
                return (
                  <div key={key} className="space-y-2">
                    <Label className="text-[11px] uppercase tracking-widest text-pink-400/80">
                      {stringSchema.itemLabel}s
                    </Label>
                    <StringListControl
                      items={val as string[]}
                      itemLabel={stringSchema.itemLabel}
                      type={stringSchema.type}
                      placeholder={stringSchema.placeholder}
                      onChange={(items) => setC({ [key]: items })}
                    />
                  </div>
                );
              }

              // Unknown array/object → hide
              if (typeof val === "object" && val !== null) return null;

              const isImageField = /^(imageUrl|src|image|logoUrl|avatarUrl)$/i.test(key);
              const isHtmlField = block.type === "customCode" && key === "html";
              const isLong = typeof val === "string" && val.length > 60;

              if (isImageField) {
                return <ImageUploader key={key} label={key} value={String(val ?? "")} onChange={(v) => setC({ [key]: v })} />;
              }
              if (isHtmlField) {
                return (
                  <div key={key} className="space-y-1.5">
                    <Label className="text-xs text-white/70">HTML / CSS / JS</Label>
                    <textarea
                      value={String(val ?? "")}
                      onChange={(e) => setC({ [key]: e.target.value })}
                      rows={14}
                      spellCheck={false}
                      className="w-full text-[11px] font-mono rounded-md bg-slate-900 border border-white/10 px-2 py-1.5 text-emerald-200"
                    />
                  </div>
                );
              }
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
          </TabsContent>

          <TabsContent value="style" className="space-y-4 mt-0">
            {block.type === "container" && (
              <div className="space-y-3 pb-3 border-b border-white/10">
                <p className="text-[10px] uppercase tracking-widest text-pink-400/80">Layout</p>
                <div className="space-y-1.5">
                  <Label className="text-xs text-white/70">Display</Label>
                  <div className="grid grid-cols-3 gap-1">
                    {(["flex", "grid", "block"] as const).map((d) => (
                      <button
                        key={d}
                        onClick={() => setS({ display: d })}
                        className={cn(
                          "h-8 text-xs rounded-md border border-white/10 capitalize",
                          (s.display || "flex") === d ? "bg-pink-500/20 border-pink-500/50 text-white" : "bg-white/5 text-white/70"
                        )}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
                <PxSlider label="Gap" value={s.gap} onChange={(v) => setS({ gap: v })} max={80} />
                <PxSlider label="Min Height" value={s.minHeight} onChange={(v) => setS({ minHeight: v })} max={800} />
              </div>
            )}

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
                        s.textAlign === a ? "bg-pink-500/20 border-pink-500/50" : "bg-white/5"
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
            <p className="text-[10px] uppercase tracking-widest text-pink-400/80">Motion</p>
            <div className="space-y-1.5">
              <Label className="text-xs text-white/70">Entrance</Label>
              <select
                value={s.animation || "none"}
                onChange={(e) => setS({ animation: e.target.value as any })}
                className="w-full h-8 text-xs rounded-md bg-white/5 border border-white/10 text-white px-2"
              >
                {["none","fade-up","fade-down","fade-left","fade-right","zoom-in","zoom-out","flip","blur"].map((v) => (
                  <option key={v} value={v} className="bg-slate-900">{v}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <Label className="text-xs text-white/70">Duration</Label>
                  <span className="text-[11px] text-white/50">{(s.animationDuration ?? 0.6).toFixed(1)}s</span>
                </div>
                <Slider value={[Math.round((s.animationDuration ?? 0.6) * 10)]} min={1} max={30} step={1}
                  onValueChange={([v]) => setS({ animationDuration: v / 10 })} />
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <Label className="text-xs text-white/70">Delay</Label>
                  <span className="text-[11px] text-white/50">{(s.animationDelay ?? 0).toFixed(1)}s</span>
                </div>
                <Slider value={[Math.round((s.animationDelay ?? 0) * 10)]} min={0} max={30} step={1}
                  onValueChange={([v]) => setS({ animationDelay: v / 10 })} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-white/70">Hover</Label>
              <select
                value={s.hoverEffect || "none"}
                onChange={(e) => setS({ hoverEffect: e.target.value as any })}
                className="w-full h-8 text-xs rounded-md bg-white/5 border border-white/10 text-white px-2"
              >
                {["none","lift","grow","shrink","tilt","glow"].map((v) => (
                  <option key={v} value={v} className="bg-slate-900">{v}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <Label className="text-xs text-white/70">Opacity</Label>
                <span className="text-[11px] text-white/50">{Math.round((s.opacity ?? 1) * 100)}%</span>
              </div>
              <Slider value={[Math.round((s.opacity ?? 1) * 100)]} min={0} max={100} step={1}
                onValueChange={([v]) => setS({ opacity: v / 100 })} />
            </div>

            <p className="text-[10px] uppercase tracking-widest text-white/40 pt-3 border-t border-white/10">Responsive</p>
            <div className="flex items-center justify-between">
              <Label className="text-xs text-white/70">Hide Desktop</Label>
              <Switch checked={!!s.hideDesktop} onCheckedChange={(v) => setS({ hideDesktop: v })} />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-xs text-white/70">Hide Tablet</Label>
              <Switch checked={!!s.hideTablet} onCheckedChange={(v) => setS({ hideTablet: v })} />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-xs text-white/70">Hide Mobile</Label>
              <Switch checked={!!s.hideMobile} onCheckedChange={(v) => setS({ hideMobile: v })} />
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
