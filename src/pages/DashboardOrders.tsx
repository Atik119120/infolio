import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ShoppingBag, Loader2, X, Search, Filter } from "lucide-react";

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  shipping_address: string | null;
  shipping_city: string | null;
  shipping_zip: string | null;
  shipping_country: string | null;
  subtotal: number;
  shipping_fee: number;
  tax: number;
  total: number;
  currency: string;
  payment_method: string;
  transaction_id: string | null;
  status: string;
  notes: string | null;
  created_at: string;
}

interface OrderItem {
  id: string;
  title: string;
  image_url: string | null;
  price: number;
  qty: number;
}

const STATUS_OPTIONS = ["pending", "paid", "fulfilled", "cancelled"] as const;
const statusColor: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-300",
  paid: "bg-blue-500/20 text-blue-300",
  fulfilled: "bg-green-500/20 text-green-300",
  cancelled: "bg-red-500/20 text-red-300",
};

export default function DashboardOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [openItems, setOpenItems] = useState<OrderItem[]>([]);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("orders" as any)
      .select("*")
      .eq("store_owner_id", user.id)
      .order("created_at", { ascending: false });
    setLoading(false);
    if (error) return toast.error(error.message);
    setOrders((data as any) || []);
  };

  useEffect(() => { load(); }, [user]);

  const open = async (o: Order) => {
    setOpenId(o.id);
    const { data } = await supabase
      .from("order_items" as any)
      .select("*")
      .eq("order_id", o.id);
    setOpenItems((data as any) || []);
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("orders" as any).update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(`Marked ${status}`);
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  const filtered = orders.filter((o) => {
    if (statusFilter !== "all" && o.status !== statusFilter) return false;
    if (q && !`${o.order_number} ${o.customer_name} ${o.customer_email}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((s, o) => s + Number(o.total), 0);

  const openOrder = orders.find((o) => o.id === openId);

  return (
    <div className="p-6 space-y-5 text-white">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-pink-500" /> Orders
        </h1>
        <p className="text-sm text-white/50">Track and fulfill your store orders.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Total orders" value={orders.length.toString()} />
        <Stat label="Pending" value={orders.filter((o) => o.status === "pending").length.toString()} />
        <Stat label="Fulfilled" value={orders.filter((o) => o.status === "fulfilled").length.toString()} />
        <Stat label="Revenue" value={`$${totalRevenue.toFixed(2)}`} />
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by # / name / email..."
            className="w-full h-10 pl-9 pr-3 rounded-lg bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-pink-500"
          />
        </div>
        <div className="inline-flex items-center gap-2">
          <Filter className="w-4 h-4 text-white/40" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-pink-500"
          >
            <option value="all">All status</option>
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="py-16 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-white/40" /></div>
      ) : filtered.length === 0 ? (
        <div className="border border-dashed border-white/10 rounded-2xl p-12 text-center text-white/50">
          <ShoppingBag className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No orders match your filters.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-white/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-white/60 text-xs uppercase tracking-wider">
              <tr>
                <th className="text-left p-3">Order</th>
                <th className="text-left p-3">Customer</th>
                <th className="text-left p-3 hidden md:table-cell">Date</th>
                <th className="text-left p-3">Total</th>
                <th className="text-left p-3">Status</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id} className="border-t border-white/10 hover:bg-white/[0.03]">
                  <td className="p-3 font-mono text-xs text-pink-300">{o.order_number}</td>
                  <td className="p-3">
                    <div>{o.customer_name}</div>
                    <div className="text-xs text-white/40">{o.customer_email}</div>
                  </td>
                  <td className="p-3 text-white/60 hidden md:table-cell">{new Date(o.created_at).toLocaleDateString()}</td>
                  <td className="p-3 font-semibold">${Number(o.total).toFixed(2)}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${statusColor[o.status]}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button onClick={() => open(o)} className="h-8 px-3 rounded-md bg-white/5 hover:bg-white/10 text-xs">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail drawer */}
      {openOrder && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-slate-950 flex items-center justify-between p-5 border-b border-white/10">
              <div>
                <h2 className="font-bold">Order {openOrder.order_number}</h2>
                <p className="text-xs text-white/40">{new Date(openOrder.created_at).toLocaleString()}</p>
              </div>
              <button onClick={() => setOpenId(null)} className="h-8 w-8 grid place-items-center rounded-full hover:bg-white/10">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-5 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <Info label="Customer">{openOrder.customer_name}</Info>
                <Info label="Email">{openOrder.customer_email}</Info>
                {openOrder.customer_phone && <Info label="Phone">{openOrder.customer_phone}</Info>}
                <Info label="Payment">{openOrder.payment_method}</Info>
                {openOrder.transaction_id && <Info label="Transaction">{openOrder.transaction_id}</Info>}
              </div>

              {(openOrder.shipping_address || openOrder.shipping_city) && (
                <Info label="Shipping address">
                  {[openOrder.shipping_address, openOrder.shipping_city, openOrder.shipping_zip, openOrder.shipping_country].filter(Boolean).join(", ")}
                </Info>
              )}

              <div>
                <p className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">Items</p>
                <div className="space-y-2">
                  {openItems.map((it) => (
                    <div key={it.id} className="flex gap-3 p-2 rounded-lg bg-white/5">
                      {it.image_url && <img src={it.image_url} alt="" className="w-12 h-12 object-cover rounded" />}
                      <div className="flex-1">
                        <p className="font-medium">{it.title}</p>
                        <p className="text-xs text-white/40">${Number(it.price).toFixed(2)} × {it.qty}</p>
                      </div>
                      <p className="font-semibold">${(Number(it.price) * it.qty).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-white/10 pt-3 space-y-1.5 text-sm">
                <Row label="Subtotal" value={`$${Number(openOrder.subtotal).toFixed(2)}`} />
                <Row label="Shipping" value={`$${Number(openOrder.shipping_fee).toFixed(2)}`} />
                <Row label="Tax" value={`$${Number(openOrder.tax).toFixed(2)}`} />
                <Row label="Total" value={`$${Number(openOrder.total).toFixed(2)}`} bold />
              </div>

              <div>
                <p className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">Update status</p>
                <div className="flex gap-2 flex-wrap">
                  {STATUS_OPTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(openOrder.id, s)}
                      className={`px-3 h-8 rounded-md text-xs font-medium capitalize ${
                        openOrder.status === s
                          ? "bg-pink-600 text-white"
                          : "bg-white/5 hover:bg-white/10 text-white/70"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-xl bg-white/5 border border-white/10 p-4">
    <p className="text-[11px] uppercase tracking-wider text-white/50">{label}</p>
    <p className="text-xl font-bold mt-1">{value}</p>
  </div>
);

const Info = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <p className="text-[10px] font-semibold text-white/40 uppercase tracking-wider">{label}</p>
    <p className="text-sm text-white/90 mt-0.5">{children}</p>
  </div>
);

const Row = ({ label, value, bold }: { label: string; value: string; bold?: boolean }) => (
  <div className={`flex justify-between ${bold ? "font-bold text-base pt-2 border-t border-white/10" : "text-white/60"}`}>
    <span>{label}</span><span>{value}</span>
  </div>
);
