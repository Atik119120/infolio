import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ThemeSelector } from "@/components/portfolio/ThemeSelector";
import { Loader2 } from "lucide-react";

export default function DashboardThemes() {
  const { user } = useAuth();
  const [currentTheme, setCurrentTheme] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("portfolios")
      .select("theme")
      .eq("user_id", user.id)
      .maybeSingle();
    setCurrentTheme(data?.theme ?? "simple");
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [user]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-white/50" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white tracking-tight">Themes</h1>
        <p className="text-sm text-white/50 mt-1">
          Browse, preview, and select a theme for your portfolio. Premium themes can be purchased.
        </p>
      </div>
      <ThemeSelector
        currentTheme={currentTheme}
        userId={user.id}
        onUpdate={load}
      />
    </div>
  );
}
