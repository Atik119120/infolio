import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useBuilderStore } from "../store";
import type { Block, PageContent } from "../types";

const EXAMPLES = [
  "A landing page for a productivity SaaS called Stackly",
  "Portfolio for a UX designer based in Berlin",
  "Modern agency homepage with bold typography",
  "Yoga studio with calm pastels and class schedule",
];

const withIds = (b: any): Block => ({
  id: crypto.randomUUID(),
  type: b.type,
  content: b.content || {},
  style: b.style || {},
  children: Array.isArray(b.children) ? b.children.map(withIds) : undefined,
});

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function AiGenerateDialog({ open, onOpenChange }: Props) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const replaceContent = useBuilderStore((s) => s.replaceContent);

  const generate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("builder-ai-generate", {
        body: { prompt },
      });
      if (error) throw error;
      if ((data as any).error) throw new Error((data as any).error);

      const blocks: Block[] = Array.isArray(data.blocks) ? data.blocks.map(withIds) : [];
      if (blocks.length === 0) throw new Error("AI returned no blocks");

      const content: PageContent = {
        theme: data.theme || {},
        header: data.header ? withIds(data.header) : null,
        footer: data.footer ? withIds(data.footer) : null,
        blocks,
      };
      replaceContent(content);
      toast.success("AI page generated!");
      onOpenChange(false);
      setPrompt("");
    } catch (e: any) {
      toast.error(e?.message || "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-red-500" />
            Generate page with AI
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the page you want… style, sections, audience"
            rows={5}
            className="resize-none"
          />
          <div className="flex flex-wrap gap-1.5">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => setPrompt(ex)}
                className="text-[11px] px-2 py-1 rounded-full bg-muted hover:bg-muted/70 text-muted-foreground"
              >
                {ex}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-muted-foreground">
            This replaces the current page content. Undo (Ctrl+Z) restores it.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button
              onClick={generate}
              disabled={loading || !prompt.trim()}
              className="bg-gradient-to-r from-red-600 to-pink-600 text-white hover:brightness-110"
            >
              {loading ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Sparkles className="w-4 h-4 mr-1.5" />}
              Generate
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
