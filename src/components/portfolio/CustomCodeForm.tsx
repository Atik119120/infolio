import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Code2, Loader2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Props {
  portfolio: any;
  userId: string;
  onUpdate: () => void;
}

export function CustomCodeForm({ portfolio, userId, onUpdate }: Props) {
  const [html, setHtml] = useState("");
  const [css, setCss] = useState("");
  const [js, setJs] = useState("");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setHtml(portfolio?.custom_html || "");
    setCss(portfolio?.custom_css || "");
    setJs(portfolio?.custom_js || "");
  }, [portfolio?.custom_html, portfolio?.custom_css, portfolio?.custom_js]);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("portfolios")
      .update({ custom_html: html, custom_css: css, custom_js: js } as any)
      .eq("user_id", userId);
    setSaving(false);
    if (error) {
      toast({ variant: "destructive", title: "Save failed", description: error.message });
    } else {
      toast({ title: "Custom code saved", description: "Switch to the Custom Code theme to publish it live." });
      onUpdate();
    }
  };

  const isActive = portfolio?.theme === "custom-code";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code2 className="w-5 h-5 text-primary" />
          Custom Code
        </CardTitle>
        <CardDescription>
          Paste your own HTML, CSS and JavaScript. Select the <b>Custom Code</b> theme to publish it.
          You can use tokens like <code>{`{{name}}`}</code>, <code>{`{{headline}}`}</code>, <code>{`{{bio}}`}</code>,
          <code>{`{{email}}`}</code>, <code>{`{{phone}}`}</code>, <code>{`{{avatar_url}}`}</code>.
          {!isActive && (
            <span className="block mt-2 text-amber-600 dark:text-amber-400">
              Custom Code theme is not currently active — your code is saved but won't show until you select it.
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="cc-html">HTML</Label>
          <Textarea
            id="cc-html"
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            placeholder={'<section>\n  <h1>{{name}}</h1>\n  <p>{{headline}}</p>\n</section>'}
            className="font-mono text-sm min-h-[200px]"
          />
        </div>
        <div>
          <Label htmlFor="cc-css">CSS</Label>
          <Textarea
            id="cc-css"
            value={css}
            onChange={(e) => setCss(e.target.value)}
            placeholder={'body { background: #0f172a; color: white; }'}
            className="font-mono text-sm min-h-[160px]"
          />
        </div>
        <div>
          <Label htmlFor="cc-js">JavaScript (optional)</Label>
          <Textarea
            id="cc-js"
            value={js}
            onChange={(e) => setJs(e.target.value)}
            placeholder={'console.log("Hello from custom theme")'}
            className="font-mono text-sm min-h-[120px]"
          />
        </div>
        <Button onClick={save} disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Custom Code
        </Button>
      </CardContent>
    </Card>
  );
}
