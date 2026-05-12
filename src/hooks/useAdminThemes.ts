import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface AdminTheme {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  html: string;
  css: string;
  js: string;
  preview_image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Loads admin-uploaded themes from the `admin_themes` table.
 * Used by the user-facing ThemeSelector to merge custom themes into the list,
 * and by PublicPortfolio to render a custom theme by slug.
 */
export function useAdminThemes() {
  const [themes, setThemes] = useState<AdminTheme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await (supabase as any)
        .from("admin_themes")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      if (cancelled) return;
      if (!error && data) setThemes(data as AdminTheme[]);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { themes, loading };
}

export async function fetchAdminThemeBySlug(slug: string): Promise<AdminTheme | null> {
  const { data } = await (supabase as any)
    .from("admin_themes")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();
  return (data as AdminTheme) || null;
}
