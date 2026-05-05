import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Crown, CheckCircle2, XCircle, Loader2, Clock } from "lucide-react";
import { format } from "date-fns";

interface PlanPurchase {
  id: string;
  user_id: string;
  amount: number;
  payment_method: string;
  transaction_id: string;
  status: string;
  created_at: string;
  approved_at: string | null;
  rejected_reason: string | null;
  profiles?: { display_name: string | null; email: string | null; username: string | null } | null;
}

export default function AdminPlans() {
  const [purchases, setPurchases] = useState<PlanPurchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<string | null>(null);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("plan_purchases")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) { toast({ variant: "destructive", title: error.message }); setLoading(false); return; }

    // Hydrate profiles
    const userIds = [...new Set((data ?? []).map((d: any) => d.user_id))];
    const { data: profs } = userIds.length ? await supabase
      .from("profiles")
      .select("user_id, display_name, email, username")
      .in("user_id", userIds) : { data: [] as any[] };
    const map = new Map((profs ?? []).map((p: any) => [p.user_id, p]));
    setPurchases((data ?? []).map((p: any) => ({ ...p, profiles: map.get(p.user_id) })));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const approve = async (p: PlanPurchase) => {
    setActingId(p.id);
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);

    const { data: { user } } = await supabase.auth.getUser();

    const [{ error: e1 }, { error: e2 }] = await Promise.all([
      supabase.from("plan_purchases").update({
        status: "approved",
        approved_at: new Date().toISOString(),
        approved_by: user?.id,
      }).eq("id", p.id),
      supabase.from("profiles").update({
        plan: "pro",
        plan_purchased_at: new Date().toISOString(),
        plan_expires_at: expires.toISOString(),
      }).eq("user_id", p.user_id),
    ]);

    if (e1 || e2) toast({ variant: "destructive", title: "Failed", description: e1?.message || e2?.message });
    else toast({ title: "User upgraded to Pro" });
    setActingId(null);
    load();
  };

  const reject = async (p: PlanPurchase) => {
    setActingId(p.id);
    const reason = prompt("Reason for rejection?") || "Payment not verified";
    const { error } = await supabase.from("plan_purchases").update({
      status: "rejected",
      rejected_reason: reason,
    }).eq("id", p.id);
    if (error) toast({ variant: "destructive", title: error.message });
    else toast({ title: "Purchase rejected" });
    setActingId(null);
    load();
  };

  const pending = purchases.filter(p => p.status === "pending");
  const others = purchases.filter(p => p.status !== "pending");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><Crown className="w-6 h-6 text-amber-500" /> Pro Plan Purchases</h1>
        <p className="text-muted-foreground text-sm mt-1">Approve user payments to upgrade them to Pro for 1 year.</p>
      </div>

      {loading ? <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" /> Loading…</div> : (
        <>
          <Section title={`Pending (${pending.length})`} items={pending} onApprove={approve} onReject={reject} actingId={actingId} />
          <Section title="History" items={others} />
        </>
      )}
    </div>
  );
}

function Section({ title, items, onApprove, onReject, actingId }: {
  title: string; items: PlanPurchase[];
  onApprove?: (p: PlanPurchase) => void; onReject?: (p: PlanPurchase) => void; actingId?: string | null;
}) {
  if (items.length === 0) return (
    <Card><CardHeader><CardTitle>{title}</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">No purchases.</CardContent></Card>
  );
  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {items.map((p) => (
          <div key={p.id} className="border rounded-lg p-4 flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1 text-sm">
              <div className="font-medium">{p.profiles?.display_name || p.profiles?.username || "Unknown"} <span className="text-muted-foreground">({p.profiles?.email})</span></div>
              <div className="text-muted-foreground">৳{p.amount} · {p.payment_method.toUpperCase()} · TXN: <span className="font-mono">{p.transaction_id}</span></div>
              <div className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" /> {format(new Date(p.created_at), "PPp")}</div>
              {p.rejected_reason && <div className="text-xs text-destructive">Reason: {p.rejected_reason}</div>}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={p.status === "approved" ? "default" : p.status === "rejected" ? "destructive" : "secondary"}>{p.status}</Badge>
              {onApprove && onReject && (
                <>
                  <Button size="sm" onClick={() => onApprove(p)} disabled={actingId === p.id}>
                    <CheckCircle2 className="w-4 h-4 mr-1" /> Approve
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => onReject(p)} disabled={actingId === p.id}>
                    <XCircle className="w-4 h-4 mr-1" /> Reject
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
