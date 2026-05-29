// Domain Registrar Service Layer
// All registrar operations go through this layer. It calls a single
// edge function `registrar-api` which delegates to the active provider
// (currently the Mock provider). When HostNeed is wired up, only the
// edge function needs to change — this client API stays the same.

import { supabase } from "@/integrations/supabase/client";
import type {
  AvailabilityResult,
  DnsRecord,
  DomainOrder,
  RegistrarDomain,
  TldPricing,
} from "./types";


async function call<T>(action: string, payload: Record<string, unknown> = {}): Promise<T> {
  const { data, error } = await supabase.functions.invoke("registrar-api", {
    body: { action, payload },
  });
  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return data?.result as T;
}

// ---------- Pricing ----------
export async function getTldPricing(): Promise<TldPricing[]> {
  const { data, error } = await supabase
    .from("tld_pricing")
    .select("*")
    .eq("is_active", true)
    .order("display_order");
  if (error) throw error;
  return (data as TldPricing[]) ?? [];
}

// ---------- Availability / Suggestions ----------
export const checkAvailability = (domain: string) =>
  call<AvailabilityResult[]>("checkAvailability", { domain });

export const getDomainSuggestions = (keyword: string) =>
  call<AvailabilityResult[]>("getDomainSuggestions", { keyword });

export const getDomainInfo = (domain: string) =>
  call<Record<string, unknown>>("getDomainInfo", { domain });

// ---------- Domain lifecycle (Phase 2 will wire real registrar) ----------
export const registerDomain = (params: { domain: string; years: number }) =>
  call<DomainOrder>("registerDomain", params);

export const transferDomain = (params: { domain: string; auth_code: string }) =>
  call<DomainOrder>("transferDomain", params);

export const renewDomain = (params: { domain_id: string; years: number }) =>
  call<DomainOrder>("renewDomain", params);

export const releaseDomain = (params: { domain_id: string }) =>
  call<{ ok: boolean }>("releaseDomain", params);

export const requestDelete = (params: { domain_id: string }) =>
  call<{ ok: boolean }>("requestDelete", params);

export const syncDomain = (params: { domain_id: string }) =>
  call<RegistrarDomain>("syncDomain", params);

export const getEPPCode = (params: { domain_id: string }) =>
  call<{ code: string }>("getEPPCode", params);

export const toggleIDProtection = (params: { domain_id: string; enabled: boolean }) =>
  call<{ ok: boolean }>("toggleIDProtection", params);

// ---------- Local DB reads ----------
export async function listMyDomains(userId: string): Promise<RegistrarDomain[]> {
  const { data, error } = await supabase
    .from("registrar_domains")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as RegistrarDomain[]) ?? [];
}

export async function listAllDomains(): Promise<RegistrarDomain[]> {
  const { data, error } = await supabase
    .from("registrar_domains")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as RegistrarDomain[]) ?? [];
}

export async function listMyOrders(userId: string): Promise<DomainOrder[]> {
  const { data, error } = await supabase
    .from("domain_orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as DomainOrder[]) ?? [];
}


// ---------- DNS records ----------
export async function listDnsRecords(domainId: string): Promise<DnsRecord[]> {
  const { data, error } = await supabase
    .from("dns_records")
    .select("*")
    .eq("domain_id", domainId)
    .order("type")
    .order("name");
  if (error) throw error;
  return (data as DnsRecord[]) ?? [];
}

export async function upsertDnsRecord(record: Partial<DnsRecord> & { domain_id: string; type: string; name: string; content: string }) {
  const { data, error } = await supabase
    .from("dns_records")
    .upsert(record as any)
    .select()
    .single();
  if (error) throw error;
  return data as DnsRecord;
}

export async function deleteDnsRecord(id: string) {
  const { error } = await supabase.from("dns_records").delete().eq("id", id);
  if (error) throw error;
}

// ---------- Nameservers ----------
export const updateNameservers = (params: { domain_id: string; nameservers: string[] }) =>
  call<RegistrarDomain>("updateNameservers", params);

export const toggleAutoRenew = (params: { domain_id: string; enabled: boolean }) =>
  call<{ ok: boolean }>("toggleAutoRenew", params);

export const toggleRegistrarLock = (params: { domain_id: string; enabled: boolean }) =>
  call<{ ok: boolean }>("toggleRegistrarLock", params);

export const completeMockOrder = (params: { order_id: string }) =>
  call<{ ok: boolean; domain_id?: string }>("completeMockOrder", params);

// ---------- Provider admin ----------
export const testConnection = () =>
  call<{ ok: boolean; provider: string; message: string; using_mock_fallback: boolean }>("testConnection");

export const getProviderStatus = () =>
  call<{ hostneed_credentials_present: boolean; providers: any[] }>("providerStatus");

