import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const VERCEL_TOKEN = Deno.env.get("VERCEL_API_TOKEN") ?? "";
const RAW_TEAM = (Deno.env.get("VERCEL_TEAM_ID") ?? "").trim();
const VERCEL_TEAM = RAW_TEAM.startsWith("team_") ? RAW_TEAM : "";
const teamQuery = VERCEL_TEAM ? `?teamId=${VERCEL_TEAM}` : "";
const withTeam = (qs = "") => {
  if (!VERCEL_TEAM) return qs;
  return qs ? `${qs}&teamId=${VERCEL_TEAM}` : `?teamId=${VERCEL_TEAM}`;
};

interface Domain {
  id: string;
  domain: string;
  verification_token: string | null;
  user_id: string;
}

async function getUserVercelProjectId(supabase: any, userId: string): Promise<string | null> {
  const { data } = await supabase
    .from("deployments")
    .select("vercel_project_id")
    .eq("user_id", userId)
    .eq("is_active", true)
    .not("vercel_project_id", "is", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data?.vercel_project_id ?? null;
}

async function vercelAttachDomain(projectId: string, domain: string) {
  const res = await fetch(
    `https://api.vercel.com/v10/projects/${projectId}/domains${teamQuery}`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${VERCEL_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({ name: domain }),
    },
  );
  const body = await res.json().catch(() => ({}));
  // 200 ok, 409 already exists -> both fine
  return { ok: res.ok || res.status === 409, status: res.status, body };
}

async function vercelGetDomain(projectId: string, domain: string) {
  const res = await fetch(
    `https://api.vercel.com/v9/projects/${projectId}/domains/${domain}${teamQuery}`,
    { headers: { Authorization: `Bearer ${VERCEL_TOKEN}` } },
  );
  if (!res.ok) return null;
  return await res.json();
}

async function vercelVerifyDomain(projectId: string, domain: string) {
  const res = await fetch(
    `https://api.vercel.com/v9/projects/${projectId}/domains/${domain}/verify${teamQuery}`,
    { method: "POST", headers: { Authorization: `Bearer ${VERCEL_TOKEN}` } },
  );
  return await res.json().catch(() => ({}));
}

async function sendVerificationEmail(resend: Resend, email: string, displayName: string | null, domain: string) {
  try {
    const name = displayName || "there";
    await resend.emails.send({
      from: "Infolio <noreply@infolio.online>",
      to: [email],
      subject: `🎉 Your domain ${domain} is now verified!`,
      html: `<p>Hi ${name},</p><p>Your domain <strong>${domain}</strong> is verified and live on Infolio.</p><p>Visit: <a href="https://${domain}">https://${domain}</a></p>`,
    });
    return true;
  } catch (e) {
    console.error("email error", e);
    return false;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const resendKey = Deno.env.get("RESEND_API_KEY");
    const resend = resendKey ? new Resend(resendKey) : null;

    const { data: domains, error } = await supabase
      .from("domains")
      .select("id, domain, verification_token, user_id")
      .eq("is_verified", false);

    if (error) {
      return new Response(JSON.stringify({ error: "Failed to fetch" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!domains?.length) {
      return new Response(JSON.stringify({ message: "No domains to verify", verified: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const results: any[] = [];

    for (const d of domains as Domain[]) {
      const normalized = d.domain.toLowerCase();

      // Internal Infolio subdomain: auto-verify
      if (normalized === "infolio.online" || normalized.endsWith(".infolio.online")) {
        await supabase.from("domains").update({
          is_verified: true,
          verified_at: new Date().toISOString(),
          verification_token: null,
        }).eq("id", d.id);
        results.push({ domain: d.domain, verified: true, reason: "Internal subdomain" });
        continue;
      }

      if (!VERCEL_TOKEN) {
        results.push({ domain: d.domain, verified: false, reason: "Vercel token not configured" });
        continue;
      }

      const projectId = await getUserVercelProjectId(supabase, d.user_id);
      if (!projectId) {
        results.push({ domain: d.domain, verified: false, reason: "Deploy your site first to enable domain attachment" });
        continue;
      }

      // 1. Attach (idempotent)
      const attach = await vercelAttachDomain(projectId, normalized);
      if (!attach.ok && attach.status !== 409) {
        results.push({ domain: d.domain, verified: false, reason: `Vercel attach failed: ${JSON.stringify(attach.body)?.slice(0, 200)}` });
        continue;
      }

      // 2. Trigger verify (no-op if already verified or DNS still pending)
      await vercelVerifyDomain(projectId, normalized);

      // 3. Read current status
      const info = await vercelGetDomain(projectId, normalized);
      const verified = info?.verified === true;
      const verification = Array.isArray(info?.verification) ? info.verification : [];
      const txt = verification.find((v: any) => v?.type === "TXT");

      if (verified) {
        await supabase.from("domains").update({
          is_verified: true,
          verified_at: new Date().toISOString(),
          verification_token: null,
        }).eq("id", d.id);

        let emailSent = false;
        if (resend) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("email, display_name")
            .eq("user_id", d.user_id)
            .maybeSingle();
          if (profile?.email) {
            emailSent = await sendVerificationEmail(resend, profile.email, profile.display_name, d.domain);
          }
        }
        results.push({ domain: d.domain, verified: true, emailSent });
      } else {
        // Persist Vercel-issued TXT value (if any) so UI can show it
        const token = txt?.value ?? null;
        if (token && token !== d.verification_token) {
          await supabase.from("domains").update({ verification_token: token }).eq("id", d.id);
        }
        results.push({
          domain: d.domain,
          verified: false,
          reason: txt ? "Awaiting DNS propagation (TXT/A records)" : "Awaiting DNS propagation",
          required_txt: txt ? { name: txt.domain, value: txt.value } : null,
        });
      }
    }

    const verifiedCount = results.filter((r) => r.verified).length;
    return new Response(JSON.stringify({
      message: `Verified ${verifiedCount} of ${domains.length} domains`,
      verified: verifiedCount,
      results,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
