/**
 * Company Gateway provider — stub for future automated payment integration.
 * Will connect to the parent company's payment system via API/webhook.
 *
 * Activate by setting site_settings.active_payment_provider = "company_gateway"
 * once the gateway is implemented.
 */

import type { PaymentProvider, PurchaseItem, PurchaseSession, PurchaseUser } from "./types";

export const companyGatewayProvider: PaymentProvider = {
  id: "company_gateway",
  name: "Company Payment Gateway",
  manualApproval: false,

  async initiatePurchase(_item: PurchaseItem, _user: PurchaseUser): Promise<PurchaseSession> {
    throw new Error(
      "Company gateway not yet configured. Switch active_payment_provider back to 'manual' in site_settings."
    );
  },

  async verifyPayment(_purchaseId: string) {
    return "pending" as const;
  },
};
