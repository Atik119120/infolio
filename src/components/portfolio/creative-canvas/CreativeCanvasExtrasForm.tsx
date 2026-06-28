import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X, Loader2, GripVertical } from "lucide-react";

interface Props {
  portfolio: any;
  userId: string;
  onUpdate: () => void;
  onSuccess: (m: string) => void;
  onError: (m: string) => void;
  mode: "marquee" | "software";
}

const DEFAULT_MARQUEE = [
  "Brand Identity", "Illustration", "UI / UX", "Editorial",
  "Motion", "Packaging", "Print", "Web Design",
];

const DEFAULT_SOFTWARE = [
  { name: "Photoshop", slug: "photoshop" },
  { name: "Illustrator", slug: "illustrator" },
  { name: "Figma", slug: "figma" },
  { name: "After Effects", slug: "aftereffects" },
  { name: "Premiere Pro", slug: "premierepro" },
  { name: "Blender", slug: "blender" },
];

const SLUG_HINTS = "photoshop, illustrator, figma, aftereffects, premierepro, blender, indesign, xd, sketch, framer, webflow, canva, lightroom";

export function CreativeCanvasExtrasForm({ portfolio, userId, onUpdate, onSuccess, onError, mode }: Props) {
  const [saving, setSaving] = useState(false);

  // Marquee state
  const [words, setWords] = useState<string[]>(
    Array.isArray(portfolio?.hero_marquee_words) && portfolio.hero_marquee_words.length
      ? portfolio.hero_marquee_words
      : DEFAULT_MARQUEE
  );
  const [wordInput, setWordInput] = useState("");

  // Software state
  const [software, setSoftware] = useState<{ name: string; slug: string }[]>(
    Array.isArray(portfolio?.theme_software) && portfolio.theme_software.length
      ? portfolio.theme_software
      : DEFAULT_SOFTWARE
  );
  const [swName, setSwName] = useState("");
  const [swSlug, setSwSlug] = useState("");

  useEffect(() => {
    if (Array.isArray(portfolio?.hero_marquee_words) && portfolio.hero_marquee_words.length) {
      setWords(portfolio.hero_marquee_words);
    }
    if (Array.isArray(portfolio?.theme_software) && portfolio.theme_software.length) {
      setSoftware(portfolio.theme_software);
    }
  }, [portfolio?.hero_marquee_words, portfolio?.theme_software]);

  const saveMarquee = async (next: string[]) => {
    setSaving(true);
    const { error } = await supabase
      .from("portfolios")
      .update({ hero_marquee_words: next } as any)
      .eq("user_id", userId);
    setSaving(false);
    if (error) return onError(error.message);
    onSuccess("Marquee updated");
    onUpdate();
  };

  const saveSoftware = async (next: { name: string; slug: string }[]) => {
    setSaving(true);
    const { error } = await supabase
      .from("portfolios")
      .update({ theme_software: next } as any)
      .eq("user_id", userId);
    setSaving(false);
    if (error) return onError(error.message);
    onSuccess("Toolbox updated");
    onUpdate();
  };

  const addWord = () => {
    const v = wordInput.trim();
    if (!v) return;
    if (words.length >= 16) return onError("Max 16 words");
    const next = [...words, v];
    setWords(next); setWordInput("");
    saveMarquee(next);
  };
  const removeWord = (i: number) => {
    const next = words.filter((_, idx) => idx !== i);
    setWords(next); saveMarquee(next);
  };

  const addSoftware = () => {
    const n = swName.trim();
    if (!n) return onError("Name is required");
    if (software.length >= 12) return onError("Max 12 software");
    const s = n.toLowerCase().replace(/[^a-z0-9]/g, "");
    const next = [...software, { name: n, slug: s }];
    setSoftware(next); setSwName(""); setSwSlug("");
    saveSoftware(next);
  };

  const removeSoftware = (i: number) => {
    const next = software.filter((_, idx) => idx !== i);
    setSoftware(next); saveSoftware(next);
  };
  const resetSoftware = () => { setSoftware(DEFAULT_SOFTWARE); saveSoftware(DEFAULT_SOFTWARE); };
  const resetWords = () => { setWords(DEFAULT_MARQUEE); saveMarquee(DEFAULT_MARQUEE); };

  if (mode === "marquee") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Hero Marquee Words
            {saving && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
          </CardTitle>
          <CardDescription>
            The scrolling ribbon under the hero. Add the keywords/skills you want shown (max 16).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={wordInput}
              onChange={(e) => setWordInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addWord())}
              placeholder="e.g. Brand Identity"
              maxLength={40}
            />
            <Button type="button" onClick={addWord} className="shrink-0">
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          </div>

          {words.length === 0 ? (
            <p className="text-sm text-muted-foreground">No words yet — add some above.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {words.map((w, i) => (
                <span
                  key={`${w}-${i}`}
                  className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1.5 rounded-full bg-muted text-sm border"
                >
                  {w}
                  <button
                    type="button"
                    onClick={() => removeWord(i)}
                    className="w-5 h-5 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive flex items-center justify-center"
                    aria-label={`Remove ${w}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="flex justify-end">
            <Button type="button" variant="ghost" size="sm" onClick={resetWords}>
              Reset to defaults
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // mode === "software"
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Toolbox / Software
          {saving && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
        </CardTitle>
        <CardDescription>
          Just type the software name — the original logo is fetched automatically (e.g. Photoshop, Illustrator, InDesign, Lightroom, Figma, Canva, Blender). Max 12.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid sm:grid-cols-[1fr_auto] gap-2">
          <div className="space-y-1.5">
            <Label className="text-xs">Software Name</Label>
            <Input
              value={swName}
              onChange={(e) => setSwName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSoftware(); } }}
              placeholder="Photoshop"
              maxLength={30}
            />
          </div>
          <div className="flex items-end">
            <Button type="button" onClick={addSoftware} className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          </div>
        </div>

        </div>

        {software.length === 0 ? (
          <p className="text-sm text-muted-foreground">No software yet — add some above.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-2">
            {software.map((s, i) => (
              <div
                key={`${s.slug}-${i}`}
                className="flex items-center gap-3 p-2.5 rounded-lg border bg-card"
              >
                <GripVertical className="w-4 h-4 text-muted-foreground shrink-0" />
                <img
                  src={`https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${s.slug}/${s.slug}-original.svg`}
                  alt=""
                  className="w-8 h-8 object-contain shrink-0"
                  onError={(e) => ((e.currentTarget.style.opacity = "0.2"))}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{s.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{s.slug}</div>
                </div>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => removeSoftware(i)}
                  aria-label={`Remove ${s.name}`}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end">
          <Button type="button" variant="ghost" size="sm" onClick={resetSoftware}>
            Reset to defaults
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
