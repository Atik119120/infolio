import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Search, Loader2, CheckCircle2, XCircle, ShoppingCart, Globe2 } from "lucide-react";
import { openWhatsApp } from "@/lib/whatsapp";
import SiteHeader from "@/components/home/SiteHeader";
import Footer from "@/components/home/Footer";

const TLDS = [".com", ".net", ".org", ".io", ".dev", ".app", ".co", ".xyz", ".online", ".site", ".tech", ".me"];

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

export default function BuyDomain() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [searching, setSearching] = useState(false);

  const search = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const raw = query.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/+$/, "");
    if (!raw) return;
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
    openWhatsApp(`Hi! I want to buy domain: ${r.domain} (Price: ৳${r.price}/year). Please proceed.`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />

      <main className="flex-1 pt-28 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
              <Globe2 className="w-3.5 h-3.5" /> Domain Registration
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Find your perfect domain
            </h1>
            <p className="mt-3 text-muted-foreground">
              Search across popular TLDs and order instantly via WhatsApp.
            </p>
          </div>

          <form onSubmit={search} className="flex gap-2 mb-8">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter your brand name (e.g. mybrand)"
              className="h-12 text-base"
            />
            <Button type="submit" size="lg" disabled={searching || !query.trim()}>
              {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Search className="w-4 h-4 mr-1" />Search</>}
            </Button>
          </form>

          {results.length === 0 && (
            <div className="text-center py-16 border border-dashed rounded-lg text-muted-foreground text-sm">
              Type a name above and hit Search to check availability.
            </div>
          )}

          <div className="grid gap-2">
            {results.map((r) => (
              <div
                key={r.domain}
                className="flex items-center justify-between gap-3 border rounded-lg px-4 py-3 bg-card"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {r.loading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground shrink-0" />
                  ) : r.available === true ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                  ) : r.available === false ? (
                    <XCircle className="w-4 h-4 text-muted-foreground shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-amber-500 shrink-0" />
                  )}
                  <span className="font-mono text-sm truncate">{r.domain}</span>
                  {!r.loading && (
                    r.available === true ? (
                      <Badge className="bg-green-500/15 text-green-700 border-green-500/30 hover:bg-green-500/20">Available</Badge>
                    ) : r.available === false ? (
                      <Badge variant="outline" className="text-muted-foreground">Taken</Badge>
                    ) : (
                      <Badge variant="outline" className="text-amber-600 border-amber-500/30">Unknown</Badge>
                    )
                  )}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm text-muted-foreground">৳{r.price}/yr</span>
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
            <p className="text-xs text-muted-foreground text-center mt-6">
              Availability checks are indicative. Final price & registration confirmed on WhatsApp.
            </p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
