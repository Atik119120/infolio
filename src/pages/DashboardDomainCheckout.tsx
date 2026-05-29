import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { checkAvailability, getTldPricing, registerDomain, completeMockOrder } from "@/lib/registrar/api";
import type { AvailabilityResult, TldPricing } from "@/lib/registrar/types";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Check, X, ShoppingCart, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface CartLine { domain: string; tld: string; years: number; price: number; }

export default function DashboardDomainCheckout() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [results, setResults] = useState<AvailabilityResult[]>([]);
  const [pricing, setPricing] = useState<TldPricing[]>([]);
  const [searching, setSearching] = useState(false);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [paying, setPaying] = useState(false);

  useEffect(() => { getTldPricing().then(setPricing).catch(() => {}); }, []);
  useEffect(() => { if (params.get("q")) run(params.get("q")!); /* eslint-disable-next-line */ }, []);

  const run = async (term?: string) => {
    const t = (term ?? q).trim();
    if (!t) return;
    setSearching(true);
    try { setResults(await checkAvailability(t)); }
    catch (e: any) { toast.error(e.message); }
    finally { setSearching(false); }
  };

  const addToCart = (r: AvailabilityResult) => {
    if (cart.find((c) => c.domain === r.domain)) return;
    setCart([...cart, { domain: r.domain, tld: r.tld, years: 1, price: r.price ?? 0 }]);
    toast.success(`${r.domain} added to cart`);
  };

  const removeFromCart = (d: string) => setCart(cart.filter((c) => c.domain !== d));
  const setYears = (d: string, y: number) =>
    setCart(cart.map((c) => c.domain === d ? { ...c, years: Math.max(1, Math.min(10, y)) } : c));

  const total = cart.reduce((s, c) => s + c.price * c.years, 0);

  const checkout = async () => {
    if (cart.length === 0) return;
    setPaying(true);
    try {
      for (const item of cart) {
        const order = await registerDomain({ domain: item.domain, years: item.years });
        // Mock: auto-complete payment to provision immediately
        await completeMockOrder({ order_id: (order as any).id });
      }
      toast.success("All domains registered!");
      setCart([]);
      navigate("/dashboard/my-domains");
    } catch (e: any) { toast.error(e.message); }
    finally { setPaying(false); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Register a Domain</h1>
        <p className="text-sm text-white/50 mt-1">Search, add to cart, and check out.</p>
      </div>

      <Card className="p-5 bg-white/[0.02] border-white/10">
        <div className="flex gap-2">
          <Input
            placeholder="yourbrand"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && run()}
            className="bg-black/30 border-white/10 text-white"
          />
          <Button onClick={() => run()} disabled={searching} className="bg-white text-black hover:bg-white/90">
            {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span className="ml-1">Search</span>
          </Button>
        </div>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-2">
          <h2 className="text-sm font-medium text-white/70 uppercase tracking-wider">Results</h2>
          {searching ? (
            <><Skeleton className="h-14" /><Skeleton className="h-14" /><Skeleton className="h-14" /></>
          ) : results.length === 0 ? (
            <Card className="p-8 bg-white/[0.02] border-white/10 text-center text-sm text-white/50">
              Search a name to see availability.
            </Card>
          ) : results.map((r) => {
            const inCart = !!cart.find((c) => c.domain === r.domain);
            return (
              <Card key={r.domain} className="p-3 bg-white/[0.02] border-white/10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {r.available
                    ? <Check className="w-4 h-4 text-green-400 shrink-0" />
                    : <X className="w-4 h-4 text-red-400 shrink-0" />}
                  <div className="min-w-0">
                    <p className="text-white font-medium truncate">{r.domain}</p>
                    <p className="text-xs text-white/40">{r.info}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-white/80 text-sm">৳{r.price}/yr</span>
                  {r.available && (
                    <Button size="sm" disabled={inCart} onClick={() => addToCart(r)}
                      className="bg-white text-black hover:bg-white/90 disabled:opacity-50">
                      {inCart ? "In Cart" : "Add"}
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        <div className="space-y-2">
          <h2 className="text-sm font-medium text-white/70 uppercase tracking-wider flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" /> Cart ({cart.length})
          </h2>
          <Card className="p-4 bg-white/[0.02] border-white/10 space-y-3">
            {cart.length === 0 ? (
              <p className="text-sm text-white/40 text-center py-4">Cart is empty</p>
            ) : (
              <>
                {cart.map((c) => (
                  <div key={c.domain} className="border-b border-white/5 pb-3 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white text-sm truncate">{c.domain}</span>
                      <Button size="sm" variant="ghost" onClick={() => removeFromCart(c.domain)}
                        className="h-7 w-7 p-0 text-red-400 hover:bg-red-500/10">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1">
                        <Button size="sm" variant="outline" className="h-6 w-6 p-0 border-white/20" onClick={() => setYears(c.domain, c.years - 1)}>-</Button>
                        <span className="text-white/70 w-12 text-center">{c.years}yr</span>
                        <Button size="sm" variant="outline" className="h-6 w-6 p-0 border-white/20" onClick={() => setYears(c.domain, c.years + 1)}>+</Button>
                      </div>
                      <span className="text-white">৳{c.price * c.years}</span>
                    </div>
                  </div>
                ))}
                <div className="flex justify-between pt-2 text-sm">
                  <span className="text-white/60">Total</span>
                  <span className="text-white font-semibold">৳{total} BDT</span>
                </div>
                <Badge variant="outline" className="border-yellow-500/30 text-yellow-400 text-xs w-full justify-center py-1">
                  Mock payment — instant activation
                </Badge>
                <Button onClick={checkout} disabled={paying} className="w-full bg-white text-black hover:bg-white/90">
                  {paying ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
                  Checkout
                </Button>
              </>
            )}
          </Card>

          {pricing.length > 0 && (
            <Card className="p-4 bg-white/[0.02] border-white/10">
              <p className="text-xs text-white/50 mb-2 uppercase tracking-wider">Popular TLDs</p>
              <div className="grid grid-cols-2 gap-1 text-xs">
                {pricing.slice(0, 8).map((p) => (
                  <div key={p.id} className="flex justify-between text-white/70">
                    <span>{p.tld}</span>
                    <span>৳{p.register_price}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
