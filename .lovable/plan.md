
# InfoLio Platform Restructure Plan

Goal: 3-tier creator-focused plans, centralized permission system, modular payment abstraction, hidden developer features. Ship in 4 phases to avoid breaking existing users.

---

## Phase 1 — Centralized Permissions & Plan Schema (foundation)

**DB migration:**
- Add `plans` table (admin-editable): `id`, `key` (free/starter/creator), `name`, `price_bdt`, `max_projects`, `max_websites`, `storage_mb`, `allow_custom_domain`, `allow_seo`, `allow_premium_themes` (none/limited/all), `included_premium_themes` (int), `extra_theme_price_bdt`, `allow_branding_toggle`, `allow_dev_features`, `sort_order`, `is_active`.
- Seed: `free`, `starter` (৳ TBD, 1 premium theme), `creator` (all premium, custom domain).
- Add `profiles.plan_key` (text, default `free`) — migrate existing: current Pro users → `creator`, others → `free`.
- Add `portfolios.show_branding` (bool, default true).

**Code:**
- `src/lib/permissions.ts` — single source: `can(user, "custom_domain")`, `limit(user, "projects")`. Reads plan from DB, never hardcoded.
- Refactor `usePlan` to load from `plans` table via React Query.
- Replace scattered `isPro` checks with `can()` calls.

---

## Phase 2 — Payment Provider Abstraction

**Architecture:**
```text
src/lib/payments/
  types.ts           PaymentProvider interface
  manual.ts          Current bKash/WhatsApp flow (default)
  companyGateway.ts  Stub for future API
  index.ts           getActiveProvider() — reads admin setting
```

**Interface:**
```ts
interface PaymentProvider {
  id: string;
  initiatePurchase(item: PurchaseItem, user): Promise<PurchaseSession>;
  // manual returns { type: "manual_instructions", ... }
  // future returns { type: "redirect", url } or { type: "embedded" }
  verifyPayment?(ref: string): Promise<Status>; // future only
}
```

- `ThemePurchaseDialog` → calls `provider.initiatePurchase()`, renders by session type.
- Admin approval flow (current) stays untouched for manual provider.
- Webhook edge function `payment-webhook` scaffold (disabled until gateway connected).
- Admin setting `active_payment_provider` in `site_settings` — switch with no code change later.

**Theme price:** ৳50 per extra premium theme, read from `plans.extra_theme_price_bdt`.

---

## Phase 3 — Feature Gates (UI enforcement)

- **Branding toggle:** Settings page → switch (disabled on Free, shows upgrade tooltip). Public theme footer reads `portfolio.show_branding && !can(user,"hide_branding") ? show : hide`.
- **Custom domain:** Hide entire UI block on Free/Starter via `can(user,"custom_domain")`.
- **SEO controls:** Free → only favicon + title; Starter/Creator → full SEO form.
- **Project limit:** Enforce in `ProjectsForm` create handler using `limit(user,"projects")`.
- **Theme selector:** Free shows 2-3 free themes + locked premium overlay; Starter shows free + 1 selected premium + ৳50 unlock on others; Creator shows everything unlocked.

---

## Phase 4 — Hide Developer Features + Admin Panel

**Hide from user dashboard (not delete):**
- GitHub Deploy tab, Custom Code form, External Deployment — gated by `can(user,"dev_features")`, default false.
- Routes/components stay; just conditional render.

**Admin panel additions (`/admin/plans`):**
- Edit any plan row (limits, prices, feature flags) — no redeploy needed.
- Per-user override: toggle `dev_features`, `custom_domain` for specific account.
- Toggle payment provider.

**Demo content + section visibility:** Already shipped in earlier turns; verify all themes honor `section_visibility` and code-level fallbacks (no changes needed unless regression found).

---

## Migration Safety

- Existing Pro users → auto-mapped to `creator` (no feature loss).
- Existing portfolios → `show_branding=true` (matches current behavior).
- Existing `theme_purchases` table untouched — manual provider reuses it.
- All hardcoded `isPro` removed gradually; old code paths kept until `permissions.ts` covers them.

---

## Out of Scope (this plan)

- Actual company gateway integration (stub only).
- Pricing page UI redesign (separate task after tiers are live).
- Bandwidth metering.

---

Approve করলে Phase 1 দিয়ে শুরু করব।
