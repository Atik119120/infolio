import { useState } from "react";
import { Plus, Trash2, Copy, ChevronUp, ChevronDown, GripVertical, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ImageUploader } from "./ImageUploader";
import type { RepeaterSchema, RepeaterField } from "./repeaterSchemas";
import { cn } from "@/lib/utils";

interface Props {
  items: any[];
  schema: RepeaterSchema;
  onChange: (items: any[]) => void;
}

function FieldEditor({ field, value, onChange }: { field: RepeaterField; value: any; onChange: (v: any) => void }) {
  if (field.type === "image") {
    return <ImageUploader label={field.label} value={value || ""} onChange={onChange} />;
  }
  if (field.type === "textarea") {
    return (
      <div className="space-y-1">
        <Label className="text-[11px] text-white/70">{field.label}</Label>
        <textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          placeholder={field.placeholder}
          className="w-full text-xs rounded-md bg-white/5 border border-white/10 px-2 py-1.5 text-white"
        />
      </div>
    );
  }
  if (field.type === "boolean") {
    return (
      <div className="flex items-center justify-between py-1">
        <Label className="text-[11px] text-white/70">{field.label}</Label>
        <Switch checked={!!value} onCheckedChange={onChange} />
      </div>
    );
  }
  if (field.type === "stringList") {
    const list: string[] = Array.isArray(value) ? value : [];
    return (
      <div className="space-y-1.5">
        <Label className="text-[11px] text-white/70">{field.label}</Label>
        {list.map((v, i) => (
          <div key={i} className="flex gap-1">
            <Input
              value={v}
              onChange={(e) => {
                const next = [...list];
                next[i] = e.target.value;
                onChange(next);
              }}
              className="h-7 text-xs bg-white/5 border-white/10 text-white"
            />
            <button
              onClick={() => onChange(list.filter((_, j) => j !== i))}
              className="h-7 w-7 rounded-md bg-white/5 hover:bg-red-500/30 text-white/70 inline-flex items-center justify-center"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}
        <button
          onClick={() => onChange([...list, ""])}
          className="w-full h-7 rounded-md border border-dashed border-white/20 text-[11px] text-white/70 hover:bg-white/5 inline-flex items-center justify-center gap-1"
        >
          <Plus className="w-3 h-3" /> Add
        </button>
      </div>
    );
  }
  return (
    <div className="space-y-1">
      <Label className="text-[11px] text-white/70">{field.label}</Label>
      <Input
        type={field.type === "number" ? "number" : "text"}
        value={value ?? ""}
        onChange={(e) => onChange(field.type === "number" ? Number(e.target.value) : e.target.value)}
        placeholder={field.placeholder}
        className="h-8 text-xs bg-white/5 border-white/10 text-white"
      />
    </div>
  );
}

export function RepeaterControl({ items, schema, onChange }: Props) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const update = (i: number, patch: any) => {
    const next = [...items];
    next[i] = { ...next[i], ...patch };
    onChange(next);
  };

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
    setOpenIdx(j);
  };

  const duplicate = (i: number) => {
    const next = [...items];
    next.splice(i + 1, 0, JSON.parse(JSON.stringify(items[i])));
    onChange(next);
  };

  const remove = (i: number) => {
    onChange(items.filter((_, j) => j !== i));
    if (openIdx === i) setOpenIdx(null);
  };

  const add = () => {
    onChange([...items, { ...schema.defaultItem }]);
    setOpenIdx(items.length);
  };

  return (
    <div className="space-y-2">
      {items.map((item, i) => {
        const open = openIdx === i;
        const headerLabel =
          (schema.titleField && item[schema.titleField]) || `${schema.itemLabel} ${i + 1}`;
        return (
          <div key={i} className="rounded-md border border-white/10 bg-white/[0.02] overflow-hidden">
            <div className="flex items-center gap-1 px-2 py-1.5">
              <GripVertical className="w-3 h-3 text-white/30" />
              <button
                onClick={() => setOpenIdx(open ? null : i)}
                className="flex-1 flex items-center gap-1.5 text-left text-xs text-white/90 truncate"
              >
                <ChevronRight className={cn("w-3 h-3 transition", open && "rotate-90")} />
                <span className="truncate">{String(headerLabel)}</span>
              </button>
              <button onClick={() => move(i, -1)} className="h-6 w-6 rounded hover:bg-white/10 inline-flex items-center justify-center text-white/60">
                <ChevronUp className="w-3 h-3" />
              </button>
              <button onClick={() => move(i, 1)} className="h-6 w-6 rounded hover:bg-white/10 inline-flex items-center justify-center text-white/60">
                <ChevronDown className="w-3 h-3" />
              </button>
              <button onClick={() => duplicate(i)} className="h-6 w-6 rounded hover:bg-white/10 inline-flex items-center justify-center text-white/60">
                <Copy className="w-3 h-3" />
              </button>
              <button onClick={() => remove(i)} className="h-6 w-6 rounded hover:bg-red-500/30 inline-flex items-center justify-center text-white/60">
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
            {open && (
              <div className="px-3 pb-3 pt-1 space-y-2.5 border-t border-white/10">
                {schema.fields.map((f) => (
                  <FieldEditor
                    key={f.name}
                    field={f}
                    value={item[f.name]}
                    onChange={(v) => update(i, { [f.name]: v })}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
      <button
        onClick={add}
        className="w-full h-8 rounded-md border border-dashed border-pink-500/40 text-xs text-pink-300 hover:bg-pink-500/10 inline-flex items-center justify-center gap-1.5"
      >
        <Plus className="w-3.5 h-3.5" /> Add {schema.itemLabel}
      </button>
    </div>
  );
}

export function StringListControl({
  items,
  itemLabel,
  type,
  placeholder,
  onChange,
}: {
  items: string[];
  itemLabel: string;
  type: "image" | "text";
  placeholder?: string;
  onChange: (items: string[]) => void;
}) {
  const update = (i: number, v: string) => {
    const next = [...items];
    next[i] = v;
    onChange(next);
  };
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  return (
    <div className="space-y-2">
      {items.map((v, i) => (
        <div key={i} className="rounded-md border border-white/10 bg-white/[0.02] p-2 space-y-1.5">
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-white/60 flex-1">{itemLabel} {i + 1}</span>
            <button onClick={() => move(i, -1)} className="h-6 w-6 rounded hover:bg-white/10 inline-flex items-center justify-center text-white/60"><ChevronUp className="w-3 h-3" /></button>
            <button onClick={() => move(i, 1)} className="h-6 w-6 rounded hover:bg-white/10 inline-flex items-center justify-center text-white/60"><ChevronDown className="w-3 h-3" /></button>
            <button
              onClick={() => onChange(items.filter((_, j) => j !== i))}
              className="h-6 w-6 rounded hover:bg-red-500/30 inline-flex items-center justify-center text-white/60"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
          {type === "image" ? (
            <ImageUploader label="" value={v} onChange={(nv) => update(i, nv)} />
          ) : (
            <Input value={v} placeholder={placeholder} onChange={(e) => update(i, e.target.value)} className="h-8 text-xs bg-white/5 border-white/10 text-white" />
          )}
        </div>
      ))}
      <button
        onClick={() => onChange([...items, ""])}
        className="w-full h-8 rounded-md border border-dashed border-pink-500/40 text-xs text-pink-300 hover:bg-pink-500/10 inline-flex items-center justify-center gap-1.5"
      >
        <Plus className="w-3.5 h-3.5" /> Add {itemLabel}
      </button>
    </div>
  );
}
