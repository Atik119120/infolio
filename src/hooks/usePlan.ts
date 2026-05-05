import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type Plan = "free" | "pro";

export interface PlanInfo {
  plan: Plan;
  isPro: boolean;
  storageLimitBytes: number;
  perFileLimitBytes: number;
  expiresAt: string | null;
  loading: boolean;
  refresh: () => Promise<void>;
}

const FREE_STORAGE = 100 * 1024 * 1024; // 100 MB
const PRO_STORAGE = 300 * 1024 * 1024;  // 300 MB
const FREE_FILE = 1 * 1024 * 1024;      // 1 MB
const PRO_FILE = 3 * 1024 * 1024;       // 3 MB

export function usePlan(): PlanInfo {
  const { user } = useAuth();
  const [plan, setPlan] = useState<Plan>("free");
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!user) { setPlan("free"); setLoading(false); return; }
    setLoading(true);
    const { data } = await supabase
      .from("profiles")
      .select("plan, plan_expires_at")
      .eq("user_id", user.id)
      .maybeSingle();
    let p: Plan = (data?.plan as Plan) || "free";
    if (p === "pro" && data?.plan_expires_at && new Date(data.plan_expires_at) < new Date()) {
      p = "free";
    }
    setPlan(p);
    setExpiresAt(data?.plan_expires_at ?? null);
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [user?.id]);

  const isPro = plan === "pro";
  return {
    plan,
    isPro,
    storageLimitBytes: isPro ? PRO_STORAGE : FREE_STORAGE,
    perFileLimitBytes: isPro ? PRO_FILE : FREE_FILE,
    expiresAt,
    loading,
    refresh: load,
  };
}

export const PLAN_LIMITS = {
  free: { storage: FREE_STORAGE, file: FREE_FILE, label: "100 MB", fileLabel: "1 MB" },
  pro: { storage: PRO_STORAGE, file: PRO_FILE, label: "300 MB", fileLabel: "3 MB" },
};
