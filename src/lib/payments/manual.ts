/**
 * Manual payment provider — current bKash/Nagad/Rocket + WhatsApp + admin approval flow.
 * Reuses the existing `theme_purchases` table.
 */

import { supabase } from "@/integrations/supabase/client";
import type { PaymentProvider, PurchaseItem, PurchaseSession, PurchaseUser } from "./types";

const PAYEE = { bkash: "01950990757", nagad: "01950990757", rocket: "01950990757" };
const WHATSAPP = "8801950990757";

export const manualProvider: PaymentProvider = {
  id: "manual",
  name: "Manual Payment (bKash / Nagad / Rocket)",
  manualApproval: true,

  async initiatePurchase(item: PurchaseItem, user: PurchaseUser): Promise<PurchaseSession> {
    const reference = `INF-${Date.now().toString(36).toUpperCase()}-${(user.username || user.id.slice(0, 6)).toUpperCase()}`;

    // Record a pending purchase row (reuses existing theme_purchases table for now)
    let purchaseId = reference;
    if (item.type === "premium_theme" || item.type === "extra_theme") {
      const { data, error } = await supabase
        .from("theme_purchases")
        .insert({
          user_id: user.id,
          theme_slug: item.refId,
          amount_bdt: item.amountBdt,
          status: "pending",
          payment_method: "manual",
          reference,
        } as any)
        .select("id")
        .maybeSingle();
      if (!error && data?.id) purchaseId = data.id;
    }

    const msg = `Hi, I want to purchase ${item.label} (৳${item.amountBdt}). Reference: ${reference}. Username: ${user.username ?? user.email ?? user.id}.`;
    const whatsappUrl = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;

    return {
      type: "manual_instructions",
      providerId: "manual",
      purchaseId,
      payee: PAYEE,
      reference,
      whatsappUrl,
      amountBdt: item.amountBdt,
      instructions:
        `Send ৳${item.amountBdt} to bKash/Nagad/Rocket ${PAYEE.bkash} (Send Money). ` +
        `After payment, send the transaction ID and reference (${reference}) to admin via WhatsApp. ` +
        `Your purchase will be activated within 24 hours.`,
    };
  },
};
