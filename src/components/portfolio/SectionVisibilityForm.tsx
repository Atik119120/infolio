import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Switch } from "@/components/ui/switch";
import {
  ALL_SECTIONS,
  SECTION_LABELS,
  getSectionVisibility,
  type SectionKey,
} from "@/lib/sectionVisibility";

interface Props {
  portfolio: any;
  userId: string;
  onUpdate: () => void;
  onSuccess?: (msg: string) => void;
  onError?: (msg: string) => void;
}

export function SectionVisibilityForm({
  portfolio,
  userId,
  onUpdate,
  onError,
}: Props) {
  const [state, setState] = useState<Record<SectionKey, boolean>>(() =>
    getSectionVisibility(portfolio)
  );

  useEffect(() => {
    setState(getSectionVisibility(portfolio));
  }, [portfolio?.section_visibility]);

  const toggle = async (key: SectionKey, val: boolean) => {
    const next = { ...state, [key]: val };
    setState(next);
    const { error } = await supabase
      .from("portfolios")
      .update({ section_visibility: next as any })
      .eq("user_id", userId);
    if (error) {
      onError?.(error.message);
      setState(state);
      return;
    }
    onUpdate();
  };

  return (
    <div className="space-y-1">
      <p className="text-[12px] text-[#71717A] mb-3">
        Show or hide sections. Hidden sections are removed from the page and
        navigation. Your content is preserved.
      </p>
      {ALL_SECTIONS.map((k) => (
        <label
          key={k}
          className="flex items-center justify-between px-3 py-2.5 rounded-md hover:bg-[#181818]/60 cursor-pointer transition-colors"
        >
          <span className="text-[13px] text-white">{SECTION_LABELS[k]}</span>
          <Switch
            checked={state[k] !== false}
            onCheckedChange={(v) => toggle(k, !!v)}
          />
        </label>
      ))}
    </div>
  );
}
