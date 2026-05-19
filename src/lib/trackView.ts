import { supabase } from "@/integrations/supabase/client";

export async function trackView(opts: {
  ownerId: string;
  pageType: "portfolio" | "builder";
  slug?: string | null;
}) {
  try {
    if (!opts.ownerId) return;
    const key = `tv:${opts.pageType}:${opts.slug || ""}`;
    // throttle: 1 view per page per 30 min from same tab
    const last = sessionStorage.getItem(key);
    if (last && Date.now() - Number(last) < 30 * 60 * 1000) return;
    sessionStorage.setItem(key, String(Date.now()));

    const url = new URL(window.location.href);
    await supabase.functions.invoke("track-view", {
      body: {
        owner_id: opts.ownerId,
        page_type: opts.pageType,
        slug: opts.slug || null,
        path: url.pathname,
        referrer: document.referrer || null,
        utm_source: url.searchParams.get("utm_source"),
        utm_medium: url.searchParams.get("utm_medium"),
        utm_campaign: url.searchParams.get("utm_campaign"),
      },
    });
  } catch {
    /* ignore */
  }
}
