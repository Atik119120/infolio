import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface SiteFeatures {
  builder_enabled: boolean;
}

export function useSiteFeatures() {
  const [features, setFeatures] = useState<SiteFeatures>({ builder_enabled: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await (supabase as any)
        .from("site_settings")
        .select("value")
        .eq("key", "features")
        .maybeSingle();
      if (cancelled) return;
      if (!error && data?.value) {
        const v = data.value as any;
        setFeatures({ builder_enabled: !!v.builder_enabled });
      } else {
        setFeatures({ builder_enabled: false });
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  return { features, loading };
}
