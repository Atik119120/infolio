import { HexColorPicker } from "react-colorful";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useBuilderStore } from "../store";
import { createBlock } from "../blocks/defaults";
import { Palette } from "lucide-react";

const FONTS = [
  "Inter, sans-serif",
  "Poppins, sans-serif",
  "Roboto, sans-serif",
  "Montserrat, sans-serif",
  "Playfair Display, serif",
  "Georgia, serif",
  "DM Sans, sans-serif",
  "Space Grotesk, sans-serif",
];

export function PageThemePanel() {
  const { content, setTheme } = useBuilderStore();
  const t = content.theme || {};

  return (
    <div className="h-full flex flex-col text-white">
      <div className="p-4 border-b border-white/10 flex items-center gap-2">
        <Palette className="w-4 h-4 text-red-400" />
        <div>
          <p className="text-[10px] uppercase tracking-widest text-white/40">Page</p>
          <h3 className="text-sm font-semibold">Theme settings</h3>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs text-white/70">Primary color</Label>
          <Popover>
            <PopoverTrigger asChild>
              <button className="w-full h-9 rounded-md border border-white/10 bg-white/5 flex items-center gap-2 px-2 text-left text-xs text-white">
                <span className="w-5 h-5 rounded border border-white/20" style={{ background: t.primaryColor || "#dc2626" }} />
                <span className="flex-1 truncate">{t.primaryColor || "#dc2626"}</span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-3">
              <HexColorPicker color={t.primaryColor || "#dc2626"} onChange={(v) => setTheme({ primaryColor: v })} />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-white/70">Page background</Label>
          <Popover>
            <PopoverTrigger asChild>
              <button className="w-full h-9 rounded-md border border-white/10 bg-white/5 flex items-center gap-2 px-2 text-left text-xs text-white">
                <span className="w-5 h-5 rounded border border-white/20" style={{ background: t.background || "#ffffff" }} />
                <span className="flex-1 truncate">{t.background || "#ffffff"}</span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-3">
              <HexColorPicker color={t.background || "#ffffff"} onChange={(v) => setTheme({ background: v })} />
              <Input value={t.background || ""} onChange={(e) => setTheme({ background: e.target.value })} placeholder="hex or gradient" className="mt-2 h-8 text-xs" />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-white/70">Text color</Label>
          <Popover>
            <PopoverTrigger asChild>
              <button className="w-full h-9 rounded-md border border-white/10 bg-white/5 flex items-center gap-2 px-2 text-left text-xs text-white">
                <span className="w-5 h-5 rounded border border-white/20" style={{ background: t.textColor || "#0f172a" }} />
                <span className="flex-1 truncate">{t.textColor || "#0f172a"}</span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-3">
              <HexColorPicker color={t.textColor || "#0f172a"} onChange={(v) => setTheme({ textColor: v })} />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-white/70">Body font</Label>
          <select
            value={t.fontFamily || "Inter, sans-serif"}
            onChange={(e) => setTheme({ fontFamily: e.target.value })}
            className="w-full h-9 text-xs rounded-md bg-white/5 border border-white/10 text-white px-2"
          >
            {FONTS.map((f) => (
              <option key={f} value={f} className="bg-slate-900">{f.split(",")[0]}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-white/70">Heading font</Label>
          <select
            value={t.headingFontFamily || ""}
            onChange={(e) => setTheme({ headingFontFamily: e.target.value })}
            className="w-full h-9 text-xs rounded-md bg-white/5 border border-white/10 text-white px-2"
          >
            <option value="" className="bg-slate-900">Same as body</option>
            {FONTS.map((f) => (
              <option key={f} value={f} className="bg-slate-900">{f.split(",")[0]}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-white/70">Base font size</Label>
          <Input
            value={t.baseFontSize || ""}
            onChange={(e) => setTheme({ baseFontSize: e.target.value })}
            placeholder="16px"
            className="h-8 text-xs bg-white/5 border-white/10 text-white"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-white/70">Container max width</Label>
          <Input
            value={t.containerWidth || ""}
            onChange={(e) => setTheme({ containerWidth: e.target.value })}
            placeholder="1200px"
            className="h-8 text-xs bg-white/5 border-white/10 text-white"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-white/70">Button radius</Label>
          <Input
            value={t.buttonRadius || ""}
            onChange={(e) => setTheme({ buttonRadius: e.target.value })}
            placeholder="9999px"
            className="h-8 text-xs bg-white/5 border-white/10 text-white"
          />
        </div>

        <p className="text-[10px] text-white/40 pt-3 border-t border-white/10">
          Tip: Theme settings apply to every block. Click a block to override.
        </p>
      </div>
    </div>
  );
}
