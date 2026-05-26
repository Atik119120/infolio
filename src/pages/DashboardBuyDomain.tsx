import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Search, Loader2, CheckCircle2, XCircle, ShoppingCart, Globe2 } from "lucide-react";
import { openWhatsApp } from "@/lib/whatsapp";

const TLDS = [".com", ".net", ".org", ".io", ".dev", ".app", ".co", ".xyz", ".online", ".site", ".tech", ".me"];

// Indicative pricing (BDT/year) — admin can change later
const PRICING: Record<string, number> = {
  ".com": 1200, ".net": 1400, ".org": 1300, ".io": 4500,
  ".dev": 1800, ".app": 1800, ".co": 3200, ".xyz": 350,
  ".online": 400, ".site": 400, ".tech": 600, ".me": 2500,
};

interface Result {
  domain: string;
  available: boolean | null;
  info?: string;
  price?: number;
  loading?: boolean;
}

export default function DashboardBuyDomain() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [searching, setSearching] = useState(false);

  const search = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const raw = query.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/+$/, "");
    if (!raw) return;

    // Strip any TLD user typed to get base name
    const base = raw.includes(".") ? raw.split(".")[0] : raw;
    if (!/^[a-z0-9-]{2,63}$/.test(base)) {
      toast.error("Invalid domain name");
      return;
    }

    const initial: Result[] = TLDS.map((tld) => ({
      domain: `${base}${tld}`,
      available: null,
      price: PRICING[tld],
      loading: true,
    }));
    setResults(initial);
    setSearching(true);

    await Promise.all(
      initial.map(async (r, idx) => {
        try {
          const { data, error } = await supabase.functions.invoke("check-domain-availability", {
            body: { domain: r.domain },
          });
          setResults((prev) => {
            const next = [...prev];
            next[idx] = {
              ...r,
              loading: false,
              available: error ? null : !!data?.available,
              info: data?.info,
            };
            return next;
          });
        } catch {
          setResults((prev) => {
            const next = [...prev];
            next[idx] = { ...r, loading: false, available: null, info: "Check failed" };
            return next;
          });
        }
      })
    );
    setSearching(false);
  };

  const buy = (r: Result) => {
    const msg = `Hi! I want to buy domain: ${r.domain} (Price: ৳${r.price}/year). Please proceed.`;
    openWhatsApp(msg);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Globe2 className="w-6 h-6" /> Buy a Domain
        </h1>
        <p className="text-sm text-white/60 mt-1">
          Search availability across popular TLDs and order through WhatsApp.
        </p>
      </div>

      <form onSubmit={search} className="flex gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter a name (e.g. mybrand)"
          className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
        />
        <Button type="submit" disabled={searching || !query.trim()}>
          {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Search className="w-4 h-4 mr-1" />Search</>}
        </Button>
      </form>

      {results.length === 0 && (
        <div className="text-center py-16 border border-dashed border-white/10 rounded-lg text-white/40 text-sm">
          Type a name above and hit Search to check availability.
        </div>
      )}

      <div className="grid gap-2">
        {results.map((r) => (
          <div
            key={r.domain}
            className="flex items-center justify-between gap-3 border border-white/10 rounded-lg px-4 py-3 bg-white/[0.02]"
          >
            <div className="flex items-center gap-3 min-w-0">
              {r.loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-white/40 shrink-0" />
              ) : r.available === true ? (
                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
              ) : r.available === false ? (
                <XCircle className="w-4 h-4 text-white/30 shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-amber-500 shrink-0" />
              )}
              <span className="font-mono text-sm text-white truncate">{r.domain}</span>
              {!r.loading && (
                r.available === true ? (
                  <Badge className="bg-green-500/15 text-green-500 border-green-500/30">Available</Badge>
                ) : r.available === false ? (
                  <Badge variant="outline" className="text-white/40 border-white/20">Taken</Badge>
                ) : (
                  <Badge variant="outline" className="text-amber-500 border-amber-500/30">Unknown</Badge>
                )
              )}
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-sm text-white/70">৳{r.price}/yr</span>
              <Button
                size="sm"
                disabled={r.loading || r.available !== true}
                onClick={() => buy(r)}
              >
                <ShoppingCart className="w-3.5 h-3.5 mr-1" /> Buy
              </Button>
            </div>
          </div>
        ))}
      </div>

      {results.length > 0 && (
        <p className="text-xs text-white/40 text-center">
          Availability checks are indicative. Final price & registration confirmed on WhatsApp.
        </p>
      )}
    </div>
  );
}
