import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface Props {
  portfolio: any;
  userId: string;
  onUpdate: () => void;
  onSuccess: (m: string) => void;
  onError: (m: string) => void;
}

type Stats = { years: string; projects: string; clients: string; awards: string };

export function CreativeCanvasStatsForm({ portfolio, userId, onUpdate, onSuccess, onError }: Props) {
  const s = portfolio?.about_stats || {};
  const [stats, setStats] = useState<Stats>({
    years: s.years ?? "5+",
    projects: s.projects ?? "120+",
    clients: s.clients ?? "40+",
    awards: s.awards ?? "08",
  });
  const [saving, setSaving] = useState(false);
  const initial = useRef(stats);

  useEffect(() => {
    if (JSON.stringify(stats) === JSON.stringify(initial.current)) return;
    const t = setTimeout(async () => {
      setSaving(true);
      const { error } = await supabase
        .from("portfolios")
        .update({ about_stats: stats } as any)
        .eq("user_id", userId);
      setSaving(false);
      if (error) return onError(error.message);
      initial.current = stats;
      onSuccess("Stats updated");
      onUpdate();
    }, 600);
    return () => clearTimeout(t);
  }, [stats]);

  const fields: { key: keyof Stats; label: string }[] = [
    { key: "years", label: "Years" },
    { key: "projects", label: "Projects" },
    { key: "clients", label: "Clients" },
    { key: "awards", label: "Awards" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          About Stats
          {saving && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
        </CardTitle>
        <CardDescription>The 4 numbers shown beside your portrait (Years / Projects / Clients / Awards).</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {fields.map((f) => (
            <div key={f.key} className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider">{f.label}</Label>
              <Input
                value={stats[f.key]}
                onChange={(e) => setStats({ ...stats, [f.key]: e.target.value })}
                placeholder="e.g. 40+"
                maxLength={8}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
