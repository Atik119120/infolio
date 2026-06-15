/**
 * Payment provider abstraction.
 * Current provider: manual (bKash/WhatsApp/admin approval).
 * Future providers (company gateway, automated) plug in via the same interface.
 *
 * Switch the active provider from admin settings (`site_settings.active_payment_provider`)
 * with no code changes required.
 */

export type PurchaseItemType = "premium_theme" | "plan_upgrade" | "extra_theme";

export interface PurchaseItem {
  type: PurchaseItemType;
  /** e.g. theme slug or plan key */
  refId: string;
  /** Amount in BDT (paisa-free integer taka). */
  amountBdt: number;
  /** Human-readable label shown in checkout UI. */
  label: string;
  metadata?: Record<string, unknown>;
}

export interface PurchaseUser {
  id: string;
  email?: string | null;
  username?: string | null;
}

export type PurchaseSession =
  | {
      type: "manual_instructions";
      providerId: string;
      purchaseId: string;
      payee: { bkash: string; nagad?: string; rocket?: string };
      reference: string;
      whatsappUrl?: string;
      amountBdt: number;
      instructions: string;
    }
  | {
      type: "redirect";
      providerId: string;
      purchaseId: string;
      url: string;
    }
  | {
      type: "embedded";
      providerId: string;
      purchaseId: string;
      sessionToken: string;
    };

export type PaymentStatus = "pending" | "approved" | "rejected" | "failed";

export interface PaymentProvider {
  /** Stable identifier stored in DB (e.g. "manual", "company_gateway"). */
  id: string;
  /** Display name for admin UI. */
  name: string;
  /** Whether this provider requires admin manual approval. */
  manualApproval: boolean;
  /** Begin a purchase; returns a session the UI can render. */
  initiatePurchase(item: PurchaseItem, user: PurchaseUser): Promise<PurchaseSession>;
  /** Optional automated verification (future API providers). */
  verifyPayment?(purchaseId: string): Promise<PaymentStatus>;
}
