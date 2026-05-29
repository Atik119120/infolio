import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { listMyDomains, listMyOrders } from "@/lib/registrar/api";
import type { RegistrarDomain, DomainOrder } from "@/lib/registrar/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Globe2, ShoppingBag, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const statusColor: Record<string, string> = {
  active: "bg-green-500/15 text-green-400 border-green-500/30",
  pending: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  expired: "bg-red-500/15 text-red-400 border-red-500/30",
  suspended: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  transferred_out: "bg-gray-500/15 text-gray-400 border-gray-500/30",
  processing: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  completed: "bg-green-500/15 text-green-400 border-green-500/30",
  failed: "bg-red-500/15 text-red-400 border-red-500/30",
  cancelled: "bg-gray-500/15 text-gray-400 border-gray-500/30",
};

export default function DashboardMyDomains() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [domains, setDomains] = useState<RegistrarDomain[]>([]);
  const [orders, setOrders] = useState<DomainOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const [d, o] = await Promise.all([listMyDomains(user.id), listMyOrders(user.id)]);
        setDomains(d);
        setOrders(o);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold text-white">My Domains</h1>
          <p className="text-sm text-white/50 mt-1">Manage your registered domains and orders</p>
        </div>
        <Button onClick={() => navigate("/dashboard/register-domain")} className="bg-white text-black hover:bg-white/90">
          <Plus className="w-4 h-4 mr-2" /> Register Domain
        </Button>

      </div>

      <section>
        <h2 className="text-sm font-medium text-white/70 uppercase tracking-wider mb-3">Active Domains</h2>
        {loading ? (
          <div className="grid gap-3"><Skeleton className="h-20" /><Skeleton className="h-20" /></div>
        ) : domains.length === 0 ? (
            <Globe2 className="w-10 h-10 mx-auto text-white/30 mb-3" />
            <p className="text-white/60">No domains yet.</p>
            <Button variant="link" className="text-white" onClick={() => navigate("/dashboard/register-domain")}>
              Search & register your first domain →
            </Button>

            </Button>
          </Card>
        ) : (
          <div className="grid gap-3">
            {domains.map((d) => (
              <Card key={d.id} className="p-4 bg-white/[0.02] border-white/10 flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-2">
                    <Globe2 className="w-4 h-4 text-white/60" />
                    <span className="font-medium text-white">{d.domain_name}</span>
                    <Badge variant="outline" className={statusColor[d.status] ?? ""}>{d.status}</Badge>
                  </div>
                  <p className="text-xs text-white/40 mt-1">
                    Expires: {d.expires_at ? new Date(d.expires_at).toLocaleDateString() : "—"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => navigate(`/dashboard/domains/${d.id}`)} className="border-white/20 text-white/80 hover:bg-white/5">Manage</Button>
                  <Button size="sm" variant="outline" className="border-white/20 text-white/80 hover:bg-white/5">Renew</Button>
                </div>

              </Card>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-sm font-medium text-white/70 uppercase tracking-wider mb-3">Recent Orders</h2>
        {loading ? (
          <Skeleton className="h-20" />
        ) : orders.length === 0 ? (
          <Card className="p-6 bg-white/[0.02] border-white/10 text-center text-sm text-white/50">
            <ShoppingBag className="w-6 h-6 mx-auto text-white/30 mb-2" />
            No orders yet.
          </Card>
        ) : (
          <div className="grid gap-2">
            {orders.map((o) => (
              <Card key={o.id} className="p-3 bg-white/[0.02] border-white/10 flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="capitalize border-white/20 text-white/70">{o.order_type}</Badge>
                  <span className="text-white">{o.domain_name}</span>
                  <span className="text-white/40">· {o.years}yr</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-white/60">{o.amount} {o.currency}</span>
                  <Badge variant="outline" className={statusColor[o.status] ?? ""}>{o.status}</Badge>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
