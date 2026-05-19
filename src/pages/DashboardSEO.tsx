import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Save, Search, Share2, Code, FileSearch } from "lucide-react";

interface SEOData {
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  og_image_url: string;
  google_verification: string;
  ga_measurement_id: string;
  gtm_id: string;
  custom_head_html: string;
  browser_title: string;
}

const blank = (): SEOData => ({
  meta_title: "",
  meta_description: "",
  meta_keywords: "",
  og_image_url: "",
  google_verification: "",
  ga_measurement_id: "",
  gtm_id: "",
  custom_head_html: "",
  browser_title: "",
});

export default function DashboardSEO() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<SEOData>(blank());
  const [tab, setTab] = useState<"basic" | "social" | "analytics" | "advanced">("basic");

  useEffect(() => {
    if (user) load();
  }, [user]);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    const { data: row } = await supabase
      .from("portfolios")
      .select("meta_title, meta_description, meta_keywords, og_image_url, google_verification, ga_measurement_id, gtm_id, custom_head_html, browser_title")
      .eq("user_id", user.id)
      .maybeSingle();
    if (row) setData({ ...blank(), ...(row as any) });
    setLoading(false);
  };

  const save = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("portfolios")
      .update(data as any)
      .eq("user_id", user.id);
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("SEO settings saved");
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-white/60" /></div>;
  }

  const titleLen = data.meta_title.length;
  const descLen = data.meta_description.length;

  const tabs = [
    { id: "basic", label: "Basic SEO", icon: Search },
    { id: "social", label: "Social / OG", icon: Share2 },
    { id: "analytics", label: "Analytics", icon: FileSearch },
    { id: "advanced", label: "Advanced", icon: Code },
  ] as const;

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">SEO Dashboard</h1>
          <p className="text-sm text-white/60 mt-1">Optimize how your site appears on search engines and social.</p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-medium flex items-center gap-2 disabled:opacity-60"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/[0.03] border border-white/10 rounded-xl p-1 w-fit overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
              tab === t.id ? "bg-white text-black" : "text-white/60 hover:text-white"
            }`}
          >
            <t.icon className="w-3.5 h-3.5" />
            {t.label}
          </button>
        ))}
      </div>

      {tab === "basic" && (
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 space-y-4">
          <Field label={`Browser Tab Title`}>
            <input
              className="seo-input"
              value={data.browser_title}
              onChange={(e) => setData({ ...data, browser_title: e.target.value })}
              placeholder="My Awesome Site"
            />
          </Field>
          <Field label={`Meta Title (${titleLen}/60)`}>
            <input
              className="seo-input"
              value={data.meta_title}
              onChange={(e) => setData({ ...data, meta_title: e.target.value })}
              maxLength={80}
            />
            <Bar value={titleLen} good={[40, 60]} />
          </Field>
          <Field label={`Meta Description (${descLen}/160)`}>
            <textarea
              className="seo-input min-h-[80px]"
              value={data.meta_description}
              onChange={(e) => setData({ ...data, meta_description: e.target.value })}
              maxLength={200}
            />
            <Bar value={descLen} good={[120, 160]} />
          </Field>
          <Field label="Keywords (comma separated)">
            <input
              className="seo-input"
              value={data.meta_keywords}
              onChange={(e) => setData({ ...data, meta_keywords: e.target.value })}
              placeholder="portfolio, designer, web"
            />
          </Field>

          {/* Google Preview */}
          <div className="mt-4 p-4 rounded-xl bg-white border border-white/20">
            <p className="text-xs text-neutral-500 mb-1">Google Preview</p>
            <p className="text-blue-700 text-base font-medium line-clamp-1">
              {data.meta_title || "Your meta title appears here"}
            </p>
            <p className="text-emerald-700 text-xs">infolio.online</p>
            <p className="text-neutral-600 text-sm mt-1 line-clamp-2">
              {data.meta_description || "Your meta description will appear here in Google search results."}
            </p>
          </div>
        </section>
      )}

      {tab === "social" && (
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 space-y-4">
          <Field label="OG Image URL (1200x630 recommended)">
            <input
              className="seo-input"
              value={data.og_image_url}
              onChange={(e) => setData({ ...data, og_image_url: e.target.value })}
              placeholder="https://..."
            />
          </Field>
          {data.og_image_url && (
            <div className="rounded-xl overflow-hidden border border-white/10 max-w-md">
              <img src={data.og_image_url} alt="OG preview" className="w-full" />
            </div>
          )}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 text-xs text-white/60">
            OG title and description are inherited from your basic SEO settings.
          </div>
        </section>
      )}

      {tab === "analytics" && (
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 space-y-4">
          <Field label="Google Analytics Measurement ID">
            <input
              className="seo-input"
              value={data.ga_measurement_id}
              onChange={(e) => setData({ ...data, ga_measurement_id: e.target.value })}
              placeholder="G-XXXXXXXXXX"
            />
          </Field>
          <Field label="Google Tag Manager ID">
            <input
              className="seo-input"
              value={data.gtm_id}
              onChange={(e) => setData({ ...data, gtm_id: e.target.value })}
              placeholder="GTM-XXXXXXX"
            />
          </Field>
          <Field label="Google Search Console Verification">
            <input
              className="seo-input"
              value={data.google_verification}
              onChange={(e) => setData({ ...data, google_verification: e.target.value })}
              placeholder="meta verification token"
            />
          </Field>
        </section>
      )}

      {tab === "advanced" && (
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 space-y-4">
          <Field label="Custom <head> HTML">
            <textarea
              className="seo-input min-h-[180px] font-mono text-xs"
              value={data.custom_head_html}
              onChange={(e) => setData({ ...data, custom_head_html: e.target.value })}
              placeholder="<meta ... /> <script>...</script>"
            />
          </Field>
          <p className="text-xs text-white/50">
            Injected into the &lt;head&gt; of your published site. Use for verification tags, schema markup, or third-party scripts.
          </p>
        </section>
      )}

      <style>{`
        .seo-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          color: white;
          border-radius: 0.5rem;
          padding: 0.6rem 0.8rem;
          font-size: 0.875rem;
          outline: none;
        }
        .seo-input:focus { border-color: rgba(16,185,129,0.6); }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium uppercase tracking-wider text-white/60">{label}</span>
      {children}
    </label>
  );
}

function Bar({ value, good }: { value: number; good: [number, number] }) {
  const pct = Math.min(100, (value / good[1]) * 100);
  const color =
    value === 0 ? "bg-white/10"
    : value < good[0] ? "bg-amber-500"
    : value <= good[1] ? "bg-emerald-500"
    : "bg-rose-500";
  return (
    <div className="h-1 bg-white/5 rounded-full overflow-hidden mt-1">
      <div className={`h-full ${color} transition-all`} style={{ width: `${pct}%` }} />
    </div>
  );
}
