import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { getFeatures, type FeatureFlags, type Engine, type WebsiteType, isEcommerceType } from "@/lib/features";

export interface Workspace {
  loading: boolean;
  plan: string;
  features: FeatureFlags;
  engine: Engine;
  websiteType: WebsiteType;
  ecommerceEnabled: boolean;
  reload: () => Promise<void>;
  setEngine: (engine: Engine) => Promise<void>;
  setWebsiteType: (t: WebsiteType) => Promise<void>;
}

export function useWorkspace(): Workspace {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<string>("basic");
  const [engine, setEngineState] = useState<Engine>("theme");
  const [websiteType, setWebsiteTypeState] = useState<WebsiteType>("portfolio");

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const [{ data: profile }, { data: portfolio }] = await Promise.all([
      supabase.from("profiles").select("plan").eq("user_id", user.id).maybeSingle(),
      supabase
        .from("portfolios")
        .select("active_engine, website_type")
        .eq("user_id", user.id)
        .maybeSingle(),
    ]);
    if (profile?.plan) setPlan(profile.plan);
    if (portfolio) {
      setEngineState(((portfolio as any).active_engine || "theme") as Engine);
      setWebsiteTypeState(((portfolio as any).website_type || "portfolio") as WebsiteType);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const setEngine = async (next: Engine) => {
    if (!user) return;
    setEngineState(next);
    await supabase
      .from("portfolios")
      .update({ active_engine: next } as any)
      .eq("user_id", user.id);
  };

  const setWebsiteType = async (next: WebsiteType) => {
    if (!user) return;
    setWebsiteTypeState(next);
    await supabase
      .from("portfolios")
      .update({ website_type: next } as any)
      .eq("user_id", user.id);
  };

  const features = getFeatures(plan);
  const ecommerceEnabled = features.ecommerce || isEcommerceType(websiteType);

  return {
    loading,
    plan,
    features,
    engine,
    websiteType,
    ecommerceEnabled,
    reload: load,
    setEngine,
    setWebsiteType,
  };
}
