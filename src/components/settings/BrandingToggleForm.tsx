import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { usePermissions } from "@/lib/permissions";
import { useToast } from "@/hooks/use-toast";

/**
 * "Built with Infolio" branding toggle.
 * Free users: disabled (always shown). Starter/Creator: can hide.
 */
export default function BrandingToggleForm() {
  const { user } = useAuth();
  const { can, loading } = usePermissions();
  const { toast } = useToast();
  const [showBranding, setShowBranding] = useState(true);
  const [saving, setSaving] = useState(false);

  const allowed = can("hide_branding");

  useEffect(() => {
    if (!user) return;
    supabase
      .from("portfolios")
      .select("show_branding")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setShowBranding((data as any).show_branding !== false);
      });
  }, [user?.id]);

  const handleToggle = async (next: boolean) => {
    if (!user || !allowed) return;
    setSaving(true);
    setShowBranding(next);
    const { error } = await supabase
      .from("portfolios")
      .update({ show_branding: next } as any)
      .eq("user_id", user.id);
    setSaving(false);
    if (error) {
      setShowBranding(!next);
      toast({ variant: "destructive", title: "Failed", description: error.message });
    } else {
      toast({ title: "Saved", description: `Branding ${next ? "shown" : "hidden"} on your portfolio.` });
    }
  };

  if (loading) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" /> Branding
          {!allowed && (
            <Badge variant="outline" className="ml-auto">
              <Lock className="w-3 h-3 mr-1" /> Upgrade required
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Control whether "Built with Infolio" appears in your public portfolio footer.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-4">
          <div>
            <Label htmlFor="show-branding" className="text-base">
              Show "Built with Infolio"
            </Label>
            <p className="text-sm text-muted-foreground mt-1">
              {allowed
                ? "Turn off to remove platform branding from your public site."
                : "Available on Starter and Creator plans."}
            </p>
          </div>
          <Switch
            id="show-branding"
            checked={showBranding}
            onCheckedChange={handleToggle}
            disabled={!allowed || saving}
          />
        </div>
      </CardContent>
    </Card>
  );
}
