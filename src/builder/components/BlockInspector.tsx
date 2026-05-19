import { useState } from "react";
import { HexColorPicker } from "react-colorful";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useBuilderStore } from "../store";
import type { Block, BlockStyle, DeviceMode } from "../types";
import {
  AlignLeft, AlignCenter, AlignRight, AlignJustify, ChevronLeft,
  Monitor, Tablet, Smartphone, ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ImageUploader } from "./ImageUploader";
import { RepeaterControl, StringListControl } from "./RepeaterControl";
import { REPEATER_SCHEMAS, STRING_LIST_SCHEMAS } from "./repeaterSchemas";
import { CONTENT_SCHEMAS, type ContentField } from "./contentSchemas";

/* ---------- Reusable controls ---------- */

function ColorField({ label, value, onChange }: { label: string; value?: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[11px] text-white/70">{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <button className="w-full h-8 rounded-md border border-white/10 bg-white/5 flex items-center gap-2 px-2 text-left text-[11px] text-white">
            <span className="w-4 h-4 rounded border border-white/20" style={{ background: value || "transparent" }} />
            <span className="flex-1 truncate">{value || "Pick color"}</span>
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

function NumSlider({
  label, value, onChange, max = 200, min = 0, step = 1, unit = "px",
}: { label: string; value?: number | string; onChange: (v: number) => void; max?: number; min?: number; step?: number; unit?: string }) {
  const num = typeof value === "number" ? value : parseFloat(String(value || "0")) || 0;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <Label className="text-[11px] text-white/70">{label}</Label>
        <span className="text-[10px] text-white/50">{num}{unit}</span>
      </div>
      <Slider value={[num]} min={min} max={max} step={step} onValueChange={([v]) => onChange(v)} />
    </div>
  );
}

function PxSlider({ label, value, onChange, max = 200 }: { label: string; value?: string; onChange: (v: string) => void; max?: number }) {
  return <NumSlider label={label} value={parseInt(value || "0") || 0} onChange={(v) => onChange(`${v}px`)} max={max} />;
}

function SelectField({ label, value, onChange, options }: { label: string; value?: string; onChange: (v: string) => void; options: string[] | { value: string; label: string }[] }) {
  return (
    <div className="space-y-1">
      <Label className="text-[11px] text-white/70">{label}</Label>
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-8 text-xs rounded-md bg-white/5 border border-white/10 text-white px-2"
      >
        {options.map((o) => {
          const v = typeof o === "string" ? o : o.value;
          const l = typeof o === "string" ? o : o.label;
          return <option key={v} value={v} className="bg-slate-900">{l}</option>;
        })}
      </select>
    </div>
  );
}

function Section({ title, defaultOpen = false, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-md border border-white/10 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-3 py-2 flex items-center justify-between bg-white/[0.03] hover:bg-white/[0.06] text-left"
      >
        <span className="text-[11px] uppercase tracking-widest text-pink-400/80">{title}</span>
        <ChevronDown className={cn("w-3.5 h-3.5 text-white/50 transition", open && "rotate-180")} />
      </button>
      {open && <div className="px-3 py-3 space-y-3 border-t border-white/10">{children}</div>}
    </div>
  );
}

/* ---------- Main inspector ---------- */

export function BlockInspector({ block }: { block: Block }) {
  const { updateBlockContent, updateBlockStyleForDevice, setSelected, device, setDevice } = useBuilderStore();
  const [tab, setTab] = useState("content");

  // Merged style for current device (displays effective value)
  const respOverride = device !== "desktop" ? block.style.responsive?.[device] || {} : {};
  const s: BlockStyle = { ...block.style, ...respOverride };

  const setS = (patch: Partial<BlockStyle>) => updateBlockStyleForDevice(block.id, device, patch);
  const setC = (patch: Record<string, any>) => updateBlockContent(block.id, patch);

  const deviceIcons: { key: DeviceMode; Icon: any }[] = [
    { key: "desktop", Icon: Monitor },
    { key: "tablet", Icon: Tablet },
    { key: "mobile", Icon: Smartphone },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-2.5 border-b border-white/10 flex items-center gap-2">
        <button
          onClick={() => setSelected(null)}
          className="h-7 w-7 -ml-1 rounded-md hover:bg-white/10 inline-flex items-center justify-center text-white/70 hover:text-white"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] uppercase tracking-widest text-pink-400/80">Edit</p>
          <h3 className="text-sm font-semibold capitalize truncate">{block.type}</h3>
        </div>
        <div className="flex bg-white/5 rounded-md p-0.5">
          {deviceIcons.map(({ key, Icon }) => (
            <button
              key={key}
              onClick={() => setDevice(key)}
              title={key}
              className={cn(
                "h-6 w-7 rounded inline-flex items-center justify-center",
                device === key ? "bg-pink-600 text-white" : "text-white/60 hover:text-white"
              )}
            >
              <Icon className="w-3 h-3" />
            </button>
          ))}
        </div>
      </div>

      {device !== "desktop" && (
        <div className="px-3 py-1.5 bg-pink-600/10 border-b border-pink-500/20 text-[10px] text-pink-300">
          Editing {device} overrides only
        </div>
      )}

      <Tabs value={tab} onValueChange={setTab} className="flex-1 flex flex-col min-h-0">
        <TabsList className="grid grid-cols-3 mx-3 mt-3 bg-white/5 h-8">
          <TabsTrigger value="content" className="text-[11px] h-6">Content</TabsTrigger>
          <TabsTrigger value="style" className="text-[11px] h-6">Style</TabsTrigger>
          <TabsTrigger value="advanced" className="text-[11px] h-6">Advanced</TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
          {/* ============== CONTENT ============== */}
          <TabsContent value="content" className="space-y-3 mt-0">
            {(() => {
              const schema = CONTENT_SCHEMAS[block.type];
              if (!schema) return null;
              const renderField = (f: ContentField) => {
                const val = (block.content as any)[f.name];
                if (f.type === "boolean") {
                  return (
                    <div key={f.name} className="flex items-center justify-between py-1.5 px-2 rounded-md bg-white/5 border border-white/10">
                      <Label className="text-xs text-white/80">{f.label}</Label>
                      <Switch checked={!!val} onCheckedChange={(v) => setC({ [f.name]: v })} />
                    </div>
                  );
                }
                if (f.type === "image") {
                  return <ImageUploader key={f.name} label={f.label} value={String(val ?? "")} onChange={(v) => setC({ [f.name]: v })} />;
                }
                if (f.type === "select" && f.options) {
                  return (
                    <SelectField
                      key={f.name}
                      label={f.label}
                      value={String(val ?? f.options[0]?.value ?? "")}
                      onChange={(v) => setC({ [f.name]: v })}
                      options={f.options}
                    />
                  );
                }
                if (f.type === "textarea") {
                  return (
                    <div key={f.name} className="space-y-1.5">
                      <Label className="text-xs text-white/70">{f.label}</Label>
                      <textarea
                        value={String(val ?? "")}
                        placeholder={f.placeholder}
                        onChange={(e) => setC({ [f.name]: e.target.value })}
                        rows={3}
                        className="w-full text-xs rounded-md bg-white/5 border border-white/10 px-2 py-1.5 text-white"
                      />
                    </div>
                  );
                }
                return (
                  <div key={f.name} className="space-y-1.5">
                    <Label className="text-xs text-white/70">{f.label}</Label>
                    <Input
                      value={String(val ?? "")}
                      placeholder={f.placeholder}
                      onChange={(e) => setC({ [f.name]: e.target.value })}
                      className="h-8 text-xs bg-white/5 border-white/10 text-white"
                    />
                  </div>
                );
              };

              // Render schema groups
              const groupNodes = schema.groups.map((g, i) => (
                <Section key={g.title} title={g.title} defaultOpen={g.defaultOpen ?? i === 0}>
                  {g.fields.map(renderField)}
                </Section>
              ));

              // Append repeater/string-list fields not covered in schema groups
              const schemaFieldNames = new Set(schema.groups.flatMap((g) => g.fields.map((f) => f.name)));
              const extraNodes = Object.entries(block.content)
                .filter(([k]) => !schemaFieldNames.has(k))
                .map(([key, val]) => {
                  const schemaKey = `${block.type}.${key}`;
                  const repeaterSchema = REPEATER_SCHEMAS[schemaKey];
                  const stringSchema = STRING_LIST_SCHEMAS[schemaKey];
                  if (Array.isArray(val) && repeaterSchema) {
                    return (
                      <div key={key} className="space-y-2">
                        <Label className="text-[11px] uppercase tracking-widest text-pink-400/80">
                          {repeaterSchema.itemLabel}s
                        </Label>
                        <RepeaterControl items={val} schema={repeaterSchema} onChange={(items) => setC({ [key]: items })} />
                      </div>
                    );
                  }
                  if (Array.isArray(val) && stringSchema) {
                    return (
                      <div key={key} className="space-y-2">
                        <Label className="text-[11px] uppercase tracking-widest text-pink-400/80">{stringSchema.itemLabel}s</Label>
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
                  return null;
                })
                .filter(Boolean);

              return (
                <>
                  {groupNodes}
                  {extraNodes}
                </>
              );
            })()}

            {!CONTENT_SCHEMAS[block.type] && (<>
            {Object.entries(block.content).map(([key, val]) => {
              const schemaKey = `${block.type}.${key}`;
              const repeaterSchema = REPEATER_SCHEMAS[schemaKey];
              const stringSchema = STRING_LIST_SCHEMAS[schemaKey];

              if (Array.isArray(val) && repeaterSchema) {
                return (
                  <div key={key} className="space-y-2">
                    <Label className="text-[11px] uppercase tracking-widest text-pink-400/80">
                      {repeaterSchema.itemLabel}s
                    </Label>
                    <RepeaterControl items={val} schema={repeaterSchema} onChange={(items) => setC({ [key]: items })} />
                  </div>
                );
              }
              if (Array.isArray(val) && stringSchema) {
                return (
                  <div key={key} className="space-y-2">
                    <Label className="text-[11px] uppercase tracking-widest text-pink-400/80">{stringSchema.itemLabel}s</Label>
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
              if (typeof val === "object" && val !== null) return null;

              const isImageField = /^(imageUrl|src|image|logoUrl|avatarUrl)$/i.test(key);
              const isHtmlField = block.type === "customCode" && key === "html";
              const isLong = typeof val === "string" && val.length > 60;
              const isBoolean = typeof val === "boolean";
              const layoutKeys = ["layout", "variant", "align"];
              const isLayoutSelect = block.type === "navbar" && key === "layout";

              if (isBoolean) {
                return (
                  <div key={key} className="flex items-center justify-between py-1.5 px-2 rounded-md bg-white/5 border border-white/10">
                    <Label className="text-xs text-white/80 capitalize">{key}</Label>
                    <Switch checked={!!val} onCheckedChange={(v) => setC({ [key]: v })} />
                  </div>
                );
              }
              if (isLayoutSelect) {
                return (
                  <SelectField
                    key={key}
                    label="Navbar Layout"
                    value={String(val ?? "split")}
                    onChange={(v) => setC({ [key]: v })}
                    options={[
                      { value: "split", label: "Split (logo left, menu right)" },
                      { value: "center", label: "Centered menu" },
                      { value: "left", label: "Left aligned" },
                    ]}
                  />
                );
              }

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
            </>)}
          </TabsContent>

          {/* ============== STYLE ============== */}
          <TabsContent value="style" className="space-y-2 mt-0">
            {block.type === "container" && (
              <Section title="Layout" defaultOpen>
                <SelectField
                  label="Display"
                  value={s.display || "flex"}
                  onChange={(v) => setS({ display: v as any })}
                  options={["flex", "grid", "block", "inline-block"]}
                />
                {(s.display === "flex" || !s.display) && (
                  <>
                    <SelectField label="Direction" value={s.flexDirection || "row"} onChange={(v) => setS({ flexDirection: v as any })} options={["row", "column", "row-reverse", "column-reverse"]} />
                    <SelectField label="Justify" value={s.justifyContent || "flex-start"} onChange={(v) => setS({ justifyContent: v as any })} options={["flex-start", "center", "flex-end", "space-between", "space-around"]} />
                    <SelectField label="Align" value={s.alignItems || "stretch"} onChange={(v) => setS({ alignItems: v as any })} options={["flex-start", "center", "flex-end", "stretch"]} />
                    <SelectField label="Wrap" value={s.flexWrap || "nowrap"} onChange={(v) => setS({ flexWrap: v as any })} options={["nowrap", "wrap"]} />
                  </>
                )}
                {s.display === "grid" && (
                  <NumSlider label="Grid Columns" value={s.gridColumns ?? 3} onChange={(v) => setS({ gridColumns: v })} min={1} max={12} unit="" />
                )}
                <PxSlider label="Gap" value={s.gap} onChange={(v) => setS({ gap: v })} max={80} />
                <PxSlider label="Min Height" value={s.minHeight} onChange={(v) => setS({ minHeight: v })} max={800} />
              </Section>
            )}

            <Section title="Typography" defaultOpen>
              <PxSlider label="Font Size" value={s.fontSize} onChange={(v) => setS({ fontSize: v })} max={120} />
              <SelectField label="Weight" value={s.fontWeight || "400"} onChange={(v) => setS({ fontWeight: v })} options={["300","400","500","600","700","800","900"]} />
              <SelectField
                label="Font Family"
                value={s.fontFamily || ""}
                onChange={(v) => setS({ fontFamily: v })}
                options={[
                  { value: "", label: "Default" },
                  { value: "Inter, sans-serif", label: "Inter" },
                  { value: "'Space Grotesk', sans-serif", label: "Space Grotesk" },
                  { value: "'DM Sans', sans-serif", label: "DM Sans" },
                  { value: "Poppins, sans-serif", label: "Poppins" },
                  { value: "Georgia, serif", label: "Georgia" },
                  { value: "'Playfair Display', serif", label: "Playfair" },
                  { value: "'JetBrains Mono', monospace", label: "JetBrains Mono" },
                ]}
              />
              <SelectField label="Style" value={s.fontStyle || "normal"} onChange={(v) => setS({ fontStyle: v as any })} options={["normal", "italic"]} />
              <SelectField label="Transform" value={s.textTransform || "none"} onChange={(v) => setS({ textTransform: v as any })} options={["none", "uppercase", "lowercase", "capitalize"]} />
              <div className="space-y-1">
                <Label className="text-[11px] text-white/70">Align</Label>
                <div className="flex gap-1">
                  {([["left", AlignLeft],["center", AlignCenter],["right", AlignRight],["justify", AlignJustify]] as const).map(([a, Icon]) => (
                    <button
                      key={a}
                      onClick={() => setS({ textAlign: a as any })}
                      className={cn("flex-1 h-7 rounded border border-white/10 inline-flex items-center justify-center", s.textAlign === a ? "bg-pink-500/20 border-pink-500/50" : "bg-white/5")}
                    >
                      <Icon className="w-3 h-3" />
                    </button>
                  ))}
                </div>
              </div>
              <NumSlider label="Line Height" value={parseFloat(s.lineHeight || "1.5")} onChange={(v) => setS({ lineHeight: String(v) })} min={0.8} max={3} step={0.05} unit="" />
              <NumSlider label="Letter Spacing" value={parseFloat(s.letterSpacing || "0")} onChange={(v) => setS({ letterSpacing: `${v}px` })} min={-5} max={20} step={0.5} />
              <ColorField label="Text Color" value={s.color} onChange={(v) => setS({ color: v })} />
            </Section>

            <Section title="Background">
              <ColorField label="Background Color" value={s.background} onChange={(v) => setS({ background: v })} />
              <ColorField label="Gradient From" value={s.gradientFrom} onChange={(v) => setS({ gradientFrom: v })} />
              <ColorField label="Gradient To" value={s.gradientTo} onChange={(v) => setS({ gradientTo: v })} />
              <NumSlider label="Gradient Angle" value={s.gradientAngle ?? 135} onChange={(v) => setS({ gradientAngle: v })} max={360} unit="°" />
              <ImageUploader label="Background Image" value={s.backgroundImage || ""} onChange={(v) => setS({ backgroundImage: v })} />
              <SelectField label="Bg Size" value={s.backgroundSize || "cover"} onChange={(v) => setS({ backgroundSize: v })} options={["cover", "contain", "auto"]} />
              <SelectField label="Bg Position" value={s.backgroundPosition || "center"} onChange={(v) => setS({ backgroundPosition: v })} options={["center", "top", "bottom", "left", "right"]} />
              <NumSlider label="Backdrop Blur" value={s.backdropBlur ?? 0} onChange={(v) => setS({ backdropBlur: v })} max={40} />
            </Section>

            <Section title="Border & Radius">
              <PxSlider label="Radius" value={s.borderRadius} onChange={(v) => setS({ borderRadius: v })} max={200} />
              <div className="grid grid-cols-2 gap-2">
                <PxSlider label="TL" value={s.borderTopLeftRadius} onChange={(v) => setS({ borderTopLeftRadius: v })} max={200} />
                <PxSlider label="TR" value={s.borderTopRightRadius} onChange={(v) => setS({ borderTopRightRadius: v })} max={200} />
                <PxSlider label="BL" value={s.borderBottomLeftRadius} onChange={(v) => setS({ borderBottomLeftRadius: v })} max={200} />
                <PxSlider label="BR" value={s.borderBottomRightRadius} onChange={(v) => setS({ borderBottomRightRadius: v })} max={200} />
              </div>
              <PxSlider label="Border Width" value={s.borderWidth} onChange={(v) => setS({ borderWidth: v })} max={20} />
              <SelectField label="Style" value={s.borderStyle || "solid"} onChange={(v) => setS({ borderStyle: v as any })} options={["solid", "dashed", "dotted", "double"]} />
              <ColorField label="Border Color" value={s.borderColor} onChange={(v) => setS({ borderColor: v })} />
            </Section>

            <Section title="Shadow">
              <SelectField
                label="Preset"
                value={s.boxShadow || ""}
                onChange={(v) => setS({ boxShadow: v })}
                options={[
                  { value: "", label: "None" },
                  { value: "0 1px 3px rgba(0,0,0,0.1)", label: "Soft" },
                  { value: "0 10px 20px rgba(0,0,0,0.15)", label: "Medium" },
                  { value: "0 20px 40px rgba(0,0,0,0.25)", label: "Strong" },
                  { value: "0 30px 60px rgba(0,0,0,0.35)", label: "Dramatic" },
                ]}
              />
              <p className="text-[10px] text-white/40">Custom shadow:</p>
              <NumSlider label="X" value={s.shadowX ?? 0} onChange={(v) => setS({ shadowX: v })} min={-50} max={50} />
              <NumSlider label="Y" value={s.shadowY ?? 0} onChange={(v) => setS({ shadowY: v })} min={-50} max={50} />
              <NumSlider label="Blur" value={s.shadowBlur ?? 0} onChange={(v) => setS({ shadowBlur: v })} max={100} />
              <NumSlider label="Spread" value={s.shadowSpread ?? 0} onChange={(v) => setS({ shadowSpread: v })} min={-50} max={50} />
              <ColorField label="Shadow Color" value={s.shadowColor} onChange={(v) => setS({ shadowColor: v })} />
            </Section>

            <Section title="Spacing">
              <div className="grid grid-cols-2 gap-2">
                <PxSlider label="Pad T" value={s.paddingTop} onChange={(v) => setS({ paddingTop: v })} />
                <PxSlider label="Pad B" value={s.paddingBottom} onChange={(v) => setS({ paddingBottom: v })} />
                <PxSlider label="Pad L" value={s.paddingLeft} onChange={(v) => setS({ paddingLeft: v })} />
                <PxSlider label="Pad R" value={s.paddingRight} onChange={(v) => setS({ paddingRight: v })} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <PxSlider label="Margin T" value={s.marginTop} onChange={(v) => setS({ marginTop: v })} />
                <PxSlider label="Margin B" value={s.marginBottom} onChange={(v) => setS({ marginBottom: v })} />
                <PxSlider label="Margin L" value={s.marginLeft} onChange={(v) => setS({ marginLeft: v })} />
                <PxSlider label="Margin R" value={s.marginRight} onChange={(v) => setS({ marginRight: v })} />
              </div>
            </Section>

            <Section title="Size">
              <Input value={s.width || ""} placeholder="width (e.g. 100%, 320px)" onChange={(e) => setS({ width: e.target.value })} className="h-8 text-xs bg-white/5 border-white/10 text-white" />
              <Input value={s.height || ""} placeholder="height" onChange={(e) => setS({ height: e.target.value })} className="h-8 text-xs bg-white/5 border-white/10 text-white" />
              <Input value={s.maxWidth || ""} placeholder="max-width" onChange={(e) => setS({ maxWidth: e.target.value })} className="h-8 text-xs bg-white/5 border-white/10 text-white" />
            </Section>
          </TabsContent>

          {/* ============== ADVANCED ============== */}
          <TabsContent value="advanced" className="space-y-2 mt-0">
            <Section title="Motion" defaultOpen>
              <SelectField
                label="Entrance"
                value={s.animation || "none"}
                onChange={(v) => setS({ animation: v as any })}
                options={["none","fade-up","fade-down","fade-left","fade-right","zoom-in","zoom-out","flip","blur"]}
              />
              <NumSlider label="Duration" value={s.animationDuration ?? 0.6} onChange={(v) => setS({ animationDuration: v })} min={0.1} max={3} step={0.1} unit="s" />
              <NumSlider label="Delay" value={s.animationDelay ?? 0} onChange={(v) => setS({ animationDelay: v })} min={0} max={3} step={0.1} unit="s" />
              <SelectField label="Hover" value={s.hoverEffect || "none"} onChange={(v) => setS({ hoverEffect: v as any })} options={["none","lift","grow","shrink","tilt","glow"]} />
              <NumSlider label="Opacity" value={Math.round((s.opacity ?? 1) * 100)} onChange={(v) => setS({ opacity: v / 100 })} max={100} unit="%" />
            </Section>

            <Section title="Transform">
              <NumSlider label="Rotate" value={s.rotate ?? 0} onChange={(v) => setS({ rotate: v })} min={-180} max={180} unit="°" />
              <NumSlider label="Scale" value={s.scale ?? 1} onChange={(v) => setS({ scale: v })} min={0.1} max={3} step={0.05} unit="x" />
              <Input value={s.translateX || ""} placeholder="translateX (e.g. 10px)" onChange={(e) => setS({ translateX: e.target.value })} className="h-8 text-xs bg-white/5 border-white/10 text-white" />
              <Input value={s.translateY || ""} placeholder="translateY" onChange={(e) => setS({ translateY: e.target.value })} className="h-8 text-xs bg-white/5 border-white/10 text-white" />
              <NumSlider label="Skew X" value={s.skewX ?? 0} onChange={(v) => setS({ skewX: v })} min={-45} max={45} unit="°" />
              <NumSlider label="Skew Y" value={s.skewY ?? 0} onChange={(v) => setS({ skewY: v })} min={-45} max={45} unit="°" />
            </Section>

            <Section title="Filters">
              <NumSlider label="Blur" value={s.filterBlur ?? 0} onChange={(v) => setS({ filterBlur: v })} max={20} />
              <NumSlider label="Brightness" value={s.filterBrightness ?? 1} onChange={(v) => setS({ filterBrightness: v })} min={0} max={3} step={0.05} unit="x" />
              <NumSlider label="Grayscale" value={s.filterGrayscale ?? 0} onChange={(v) => setS({ filterGrayscale: v })} max={1} step={0.05} unit="" />
            </Section>

            <Section title="Position">
              <SelectField label="Position" value={s.position || "static"} onChange={(v) => setS({ position: v as any })} options={["static","relative","absolute","sticky","fixed"]} />
              <div className="grid grid-cols-2 gap-2">
                <Input value={s.top || ""} placeholder="top" onChange={(e) => setS({ top: e.target.value })} className="h-8 text-xs bg-white/5 border-white/10 text-white" />
                <Input value={s.right || ""} placeholder="right" onChange={(e) => setS({ right: e.target.value })} className="h-8 text-xs bg-white/5 border-white/10 text-white" />
                <Input value={s.bottom || ""} placeholder="bottom" onChange={(e) => setS({ bottom: e.target.value })} className="h-8 text-xs bg-white/5 border-white/10 text-white" />
                <Input value={s.left || ""} placeholder="left" onChange={(e) => setS({ left: e.target.value })} className="h-8 text-xs bg-white/5 border-white/10 text-white" />
              </div>
              <NumSlider label="z-index" value={s.zIndex ?? 0} onChange={(v) => setS({ zIndex: v })} min={-10} max={100} unit="" />
            </Section>

            <Section title="Responsive">
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
            </Section>

            <Section title="Custom CSS" defaultOpen>
              <Input
                value={block.style.htmlId || ""}
                placeholder="HTML ID (e.g. my-section)"
                onChange={(e) => updateBlockStyleForDevice(block.id, "desktop", { htmlId: e.target.value })}
                className="h-8 text-xs bg-white/5 border-white/10 text-white"
              />
              <Input
                value={block.style.cssClasses || ""}
                placeholder="CSS classes (space separated)"
                onChange={(e) => updateBlockStyleForDevice(block.id, "desktop", { cssClasses: e.target.value })}
                className="h-8 text-xs bg-white/5 border-white/10 text-white"
              />
              <div className="space-y-1">
                <Label className="text-[11px] text-white/70">Custom CSS (use <code className="text-pink-300">selector</code> for this block)</Label>
                <textarea
                  value={block.style.customCss || ""}
                  onChange={(e) => updateBlockStyleForDevice(block.id, "desktop", { customCss: e.target.value })}
                  rows={6}
                  placeholder="background: red; transform: rotate(2deg);"
                  spellCheck={false}
                  className="w-full text-[11px] font-mono rounded-md bg-slate-900 border border-white/10 px-2 py-1.5 text-emerald-200"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[11px] text-white/70">Hover CSS</Label>
                <textarea
                  value={block.style.hoverCss || ""}
                  onChange={(e) => updateBlockStyleForDevice(block.id, "desktop", { hoverCss: e.target.value })}
                  rows={4}
                  placeholder="transform: translateY(-4px); box-shadow: 0 20px 40px rgba(0,0,0,.2);"
                  spellCheck={false}
                  className="w-full text-[11px] font-mono rounded-md bg-slate-900 border border-white/10 px-2 py-1.5 text-emerald-200"
                />
              </div>
            </Section>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
