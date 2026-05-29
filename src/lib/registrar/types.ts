// Domain Registrar System — shared types
// Used by both admin and client UIs and the edge-function service layer.

export type RegistrarProviderType =
  | "hostneed"
  | "namecheap"
  | "resellerclub"
  | "openprovider"
  | "dynadot"
  | "spaceship"
  | "cloudflare"
  | "whmcs"
  | "custom";

export interface RegistrarProvider {
  id: string;
  name: string;
  provider_type: RegistrarProviderType;
  api_endpoint: string | null;
  credentials: Record<string, unknown>;
  is_default: boolean;
  is_enabled: boolean;
  is_mock: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface TldPricing {
  id: string;
  provider_id: string | null;
  tld: string;
  register_price: number;
  renew_price: number;
  transfer_price: number;
  currency: string;
  is_active: boolean;
  display_order: number;
}

export type DomainStatus = "active" | "expired" | "pending" | "suspended" | "transferred_out";

export interface RegistrarDomain {
  id: string;
  user_id: string;
  provider_id: string | null;
  domain_name: string;
  status: DomainStatus;
  registered_at: string | null;
  expires_at: string | null;
  auto_renew: boolean;
  registrar_lock: boolean;
  id_protection: boolean;
  whois_privacy: boolean;
  epp_code: string | null;
  nameservers: string[];
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export type OrderType = "register" | "transfer" | "renew" | "release" | "delete";
export type OrderStatus = "pending" | "processing" | "completed" | "failed" | "cancelled";

export interface DomainOrder {
  id: string;
  user_id: string;
  domain_id: string | null;
  provider_id: string | null;
  order_type: OrderType;
  domain_name: string;
  years: number;
  amount: number;
  currency: string;
  status: OrderStatus;
  payment_method: string | null;
  transaction_id: string | null;
  notes: string | null;
  created_at: string;
}

export interface AvailabilityResult {
  domain: string;
  tld: string;
  available: boolean;
  premium: boolean;
  price?: number;
  currency?: string;
  info?: string;
}


export type DnsRecordType = "A" | "AAAA" | "CNAME" | "MX" | "TXT" | "NS" | "SRV" | "CAA";

export interface DnsRecord {
  id: string;
  domain_id: string;
  type: DnsRecordType;
  name: string;
  content: string;
  ttl: number;
  priority: number | null;
  proxied: boolean;
  is_locked: boolean;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  domain: string;
  tld: string;
  years: number;
  price: number;
  currency: string;
}

