import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface Props {
  profile: any;
  portfolio: any;
  userId: string;
  onUpdate: () => void;
  onSuccess: (m: string) => void;
  onError: (m: string) => void;
}

export function HeroNameForm({ profile, portfolio, userId, onUpdate, onSuccess, onError }: Props) {
  const initial = portfolio?.brand_name ?? profile?.display_name ?? "";
  const [value, setValue] = useState<string>(initial);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setValue(portfolio?.brand_name ?? profile?.display_name ?? "");
  }, [portfolio?.brand_name, profile?.display_name]);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("portfolios")
      .update({ brand_name: value } as any)
      .eq("user_id", userId);
    setSaving(false);
    if (error) return onError(error.message);
    onSuccess("Name updated");
    onUpdate();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Hero Name
          {saving && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
        </CardTitle>
        <CardDescription>
          Hero-এ "Hi, I'm <b>...</b>" এ যে নাম দেখাবে। প্রথম শব্দ accent color এ highlight হবে।
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Display Name</Label>
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Your Name"
            maxLength={60}
          />
        </div>
        <div className="flex justify-end">
          <Button type="button" onClick={save} disabled={saving}>Save</Button>
        </div>
      </CardContent>
    </Card>
  );
}
