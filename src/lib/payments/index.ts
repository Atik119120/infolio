/**
 * Payment provider registry.
 * `getActiveProvider()` reads `site_settings.active_payment_provider`
 * so the active provider can be switched from the admin panel without redeploy.
 */

import { supabase } from "@/integrations/supabase/client";
import type { PaymentProvider } from "./types";
import { manualProvider } from "./manual";
import { companyGatewayProvider } from "./companyGateway";

export * from "./types";
export { manualProvider, companyGatewayProvider };

const REGISTRY: Record<string, PaymentProvider> = {
  manual: manualProvider,
  company_gateway: companyGatewayProvider,
};

let cached: { provider: PaymentProvider; ts: number } | null = null;
const TTL = 60 * 1000;

export async function getActiveProvider(): Promise<PaymentProvider> {
  if (cached && Date.now() - cached.ts < TTL) return cached.provider;

  let key = "manual";
  try {
    const { data } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "active_payment_provider")
      .maybeSingle();
    const raw = (data as any)?.value;
    if (typeof raw === "string") key = raw;
    else if (raw && typeof raw === "object" && "key" in raw) key = String((raw as any).key);
  } catch {
    /* fall back to manual */
  }

  const provider = REGISTRY[key] ?? manualProvider;
  cached = { provider, ts: Date.now() };
  return provider;
}

export function listProviders(): PaymentProvider[] {
  return Object.values(REGISTRY);
}

export function clearProviderCache() {
  cached = null;
}
