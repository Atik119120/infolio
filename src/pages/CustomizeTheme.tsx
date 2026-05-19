import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { getThemeTemplate } from "@/builder/themeTemplates";

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48);

export default function CustomizeTheme() {
  const { themeId } = useParams<{ themeId: string }>();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/auth");
      return;
    }
    if (!themeId) return;

    (async () => {
      const tpl = getThemeTemplate(themeId);
      // Find a unique slug
      const base = slugify(`${themeId}-${user.id.slice(0, 6)}`);
      let slug = base;
      for (let i = 0; i < 3; i++) {
        const { data: existing } = await supabase
          .from("builder_pages").select("id").eq("slug", slug).maybeSingle();
        if (!existing) break;
        slug = `${base}-${Date.now().toString(36)}`;
      }

      const { data, error } = await supabase
        .from("builder_pages")
        .insert({
          user_id: user.id,
          name: tpl.name,
          slug,
          content: { blocks: tpl.blocks, theme: tpl.theme } as any,
        })
        .select()
        .single();

      if (error || !data) {
        toast.error("Failed to start customizer");
        navigate("/dashboard/builder");
        return;
      }
      navigate(`/dashboard/builder/${data.id}`, { replace: true });
    })();
  }, [themeId, user, loading, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white gap-3">
      <Loader2 className="w-6 h-6 animate-spin text-red-500" />
      <p className="text-sm text-white/70">Preparing your customizable theme…</p>
    </div>
  );
}
