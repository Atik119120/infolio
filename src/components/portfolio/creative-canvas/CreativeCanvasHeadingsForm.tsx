import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface Props {
  portfolio: any;
  userId: string;
  onUpdate: () => void;
  onSuccess: (m: string) => void;
  onError: (m: string) => void;
  field: "toolbox_heading" | "education_heading";
  title: string;
  description: string;
  defaultValue: string;
}

export function CreativeCanvasHeadingsForm({
  portfolio,
  userId,
  onUpdate,
  onSuccess,
  onError,
  field,
  title,
  description,
  defaultValue,
}: Props) {
  const [value, setValue] = useState<string>(portfolio?.[field] ?? defaultValue);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setValue(portfolio?.[field] ?? defaultValue);
  }, [portfolio?.[field]]);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("portfolios")
      .update({ [field]: value } as any)
      .eq("user_id", userId);
    setSaving(false);
    if (error) return onError(error.message);
    onSuccess("Heading updated");
    onUpdate();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {title}
          {saving && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
        </CardTitle>
        <CardDescription>
          {description} Use <code className="px-1 rounded bg-muted">\n</code> for a new line and wrap any words in <code className="px-1 rounded bg-muted">*asterisks*</code> to highlight them in the accent color.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Heading</Label>
          <Input
            value={value.replace(/\n/g, "\\n")}
            onChange={(e) => setValue(e.target.value.replace(/\\n/g, "\n"))}
            placeholder={defaultValue.replace(/\n/g, "\\n")}
            maxLength={120}
          />
        </div>
        <div className="flex justify-end">
          <Button type="button" onClick={save} disabled={saving}>Save</Button>
        </div>
      </CardContent>
    </Card>
  );
}
