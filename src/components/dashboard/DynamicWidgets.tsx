import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/hooks/useWorkspace";
import {
  ShoppingBag, Package, DollarSign, AlertTriangle, Download, BarChart3,
  Calendar, Utensils, Truck, MessageCircle, Eye, FileText, Trophy
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Widget {
  icon: LucideIcon;
  label: string;
  value: string | number;
  hint?: string;
  color: string;
}

export default function DynamicWidgets() {
  const { user } = useAuth();
  const w = useWorkspace();
  const [widgets, setWidgets] = useState<Widget[]>([]);

  useEffect(() => {
    if (!user || w.loading) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, w.loading, w.websiteType, w.ecommerceEnabled]);

  const load = async () => {
    if (!user) return;
    const list: Widget[] = [];

    if (w.ecommerceEnabled) {
      const [{ data: orders }, { count: productCount }, { data: lowStock }] = await Promise.all([
        supabase.from("orders").select("total, status, created_at").eq("store_owner_id", user.id),
        supabase.from("products").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("products").select("id").eq("user_id", user.id).lte("stock", 5).eq("track_inventory", true),
      ]);
      const revenue = (orders || []).filter((o: any) => o.status === "paid" || o.status === "fulfilled")
        .reduce((s: number, o: any) => s + Number(o.total || 0), 0);
      const pending = (orders || []).filter((o: any) => o.status === "pending").length;

      list.push(
        { icon: DollarSign, label: "Revenue", value: `৳${revenue.toFixed(0)}`, color: "from-emerald-500 to-teal-500" },
        { icon: ShoppingBag, label: "Total Orders", value: orders?.length || 0, hint: `${pending} pending`, color: "from-blue-500 to-cyan-500" },
        { icon: Package, label: "Products", value: productCount || 0, color: "from-violet-500 to-fuchsia-500" },
        { icon: AlertTriangle, label: "Low Stock", value: lowStock?.length || 0, hint: "≤ 5 units", color: "from-amber-500 to-orange-500" },
      );

      if (w.websiteType === "digital") {
        list.push({ icon: Download, label: "Downloads", value: orders?.length || 0, color: "from-pink-500 to-rose-500" });
      }
    } else if (w.websiteType === "restaurant") {
      list.push(
        { icon: Calendar, label: "Reservations", value: 0, hint: "this week", color: "from-amber-500 to-red-500" },
        { icon: Utensils, label: "Menu Items", value: 0, color: "from-orange-500 to-pink-500" },
        { icon: Trophy, label: "Popular Foods", value: 0, color: "from-yellow-500 to-orange-500" },
        { icon: Truck, label: "Delivery Requests", value: 0, color: "from-red-500 to-rose-500" },
      );
    } else {
      // Portfolio default widgets
      const [{ count: views }, { count: messages }, { count: projects }] = await Promise.all([
        supabase.from("page_views").select("id", { count: "exact", head: true }).eq("owner_id", user.id),
        supabase.from("contact_messages").select("id", { count: "exact", head: true }).eq("portfolio_owner_id", user.id),
        supabase.from("projects").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      ]);
      list.push(
        { icon: Eye, label: "Portfolio Views", value: views || 0, color: "from-cyan-500 to-blue-500" },
        { icon: MessageCircle, label: "Contact Requests", value: messages || 0, color: "from-violet-500 to-fuchsia-500" },
        { icon: FileText, label: "Featured Projects", value: projects || 0, color: "from-emerald-500 to-teal-500" },
        { icon: BarChart3, label: "Profile Completion", value: "—", hint: "Coming soon", color: "from-amber-500 to-orange-500" },
      );
    }

    setWidgets(list);
  };

  if (widgets.length === 0) return null;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      {widgets.map((wd) => (
        <div
          key={wd.label}
          className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-4 overflow-hidden group hover:border-white/20 transition"
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${wd.color} opacity-[0.07] group-hover:opacity-[0.12] transition`} />
          <div className="relative">
            <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${wd.color} flex items-center justify-center mb-3`}>
              <wd.icon className="w-4 h-4 text-white" />
            </div>
            <p className="text-[10px] uppercase tracking-wider text-white/50">{wd.label}</p>
            <p className="text-2xl font-bold text-white mt-1">{wd.value}</p>
            {wd.hint && <p className="text-[10px] text-white/40 mt-0.5">{wd.hint}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
