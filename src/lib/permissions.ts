/**
 * Centralized permissions system.
 * Single source of truth for all plan-based feature gating.
 * Reads from `plans` table (admin-editable) — no hardcoded plan logic.
 *
 * Usage:
 *   const { can, limit, plan, loading } = usePermissions();
 *   if (can("custom_domain")) { ... }
 *   const maxProjects = limit("projects");
 */

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type PlanKey = "free" | "starter" | "creator" | string;

export type FeatureKey =
  | "custom_domain"
  | "seo"
  | "premium_themes_all"
  | "premium_themes_limited"
  | "hide_branding"
  | "dev_features";

export type LimitKey = "projects" | "websites" | "storage_mb" | "included_premium_themes" | "extra_theme_price_bdt";

export interface PlanRow {
  key: string;
  name: string;
  description: string | null;
  price_bdt: number;
  max_projects: number;
  max_websites: number;
  storage_mb: number;
  allow_custom_domain: boolean;
  allow_seo: boolean;
  premium_theme_access: "none" | "limited" | "all" | string;
  included_premium_themes: number;
  extra_theme_price_bdt: number;
  allow_branding_toggle: boolean;
  allow_dev_features: boolean;
  sort_order: number;
  is_active: boolean;
}

const DEFAULT_FREE: PlanRow = {
  key: "free",
  name: "Free",
  description: null,
  price_bdt: 0,
  max_projects: 4,
  max_websites: 1,
  storage_mb: 100,
  allow_custom_domain: false,
  allow_seo: false,
  premium_theme_access: "none",
  included_premium_themes: 0,
  extra_theme_price_bdt: 50,
  allow_branding_toggle: false,
  allow_dev_features: false,
  sort_order: 1,
  is_active: true,
};

/** Pure function: check a feature against a plan row + override map. */
export function checkCan(
  plan: PlanRow | null | undefined,
  feature: FeatureKey,
  overrides: Record<string, boolean> = {}
): boolean {
  if (feature in overrides) return overrides[feature];
  const p = plan ?? DEFAULT_FREE;
  switch (feature) {
    case "custom_domain": return p.allow_custom_domain;
    case "seo": return p.allow_seo;
    case "premium_themes_all": return p.premium_theme_access === "all";
    case "premium_themes_limited": return p.premium_theme_access !== "none";
    case "hide_branding": return p.allow_branding_toggle;
    case "dev_features": return p.allow_dev_features;
    default: return false;
  }
}

export function checkLimit(plan: PlanRow | null | undefined, key: LimitKey): number {
  const p = plan ?? DEFAULT_FREE;
  switch (key) {
    case "projects": return p.max_projects;
    case "websites": return p.max_websites;
    case "storage_mb": return p.storage_mb;
    case "included_premium_themes": return p.included_premium_themes;
    case "extra_theme_price_bdt": return p.extra_theme_price_bdt;
    default: return 0;
  }
}

/** Fetch all active plans (cached). */
function useAllPlans() {
  return useQuery({
    queryKey: ["plans"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("plans" as any)
        .select("*")
        .eq("is_active", true)
        .order("sort_order");
      if (error) throw error;
      return (data ?? []) as unknown as PlanRow[];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function usePermissions() {
  const { user } = useAuth();
  const { data: plans, isLoading: plansLoading } = useAllPlans();

  const { data: profile, isLoading: profLoading } = useQuery({
    queryKey: ["profile-plan", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("plan_key, plan, plan_expires_at")
        .eq("user_id", user!.id)
        .maybeSingle();
      return data;
    },
  });

  const { data: overrideRows } = useQuery({
    queryKey: ["feature-overrides", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data } = await supabase
        .from("feature_overrides" as any)
        .select("feature_key, enabled")
        .eq("user_id", user!.id);
      return (data ?? []) as unknown as { feature_key: string; enabled: boolean }[];
    },
  });

  // Resolve plan key (legacy fallback: profiles.plan = 'pro' → 'creator')
  let planKey: PlanKey = (profile as any)?.plan_key || "free";
  const legacyPlan = (profile as any)?.plan;
  if ((!planKey || planKey === "free") && legacyPlan === "pro") {
    const expiresAt = (profile as any)?.plan_expires_at;
    if (!expiresAt || new Date(expiresAt) >= new Date()) planKey = "creator";
  }

  const plan = plans?.find((p) => p.key === planKey) ?? plans?.find((p) => p.key === "free") ?? DEFAULT_FREE;

  const overrides: Record<string, boolean> = {};
  for (const row of overrideRows ?? []) overrides[row.feature_key] = row.enabled;

  return {
    plan,
    planKey,
    allPlans: plans ?? [],
    loading: plansLoading || (!!user && profLoading),
    can: (feature: FeatureKey) => checkCan(plan, feature, overrides),
    limit: (key: LimitKey) => checkLimit(plan, key),
  };
}
