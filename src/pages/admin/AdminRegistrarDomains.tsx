import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Globe2, Search } from "lucide-react";

interface Row {
  id: string;
  domain_name: string;
  status: string;
  expires_at: string | null;
  user_id: string;
  auto_renew: boolean;
}

export default function AdminRegistrarDomains() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("registrar_domains")
        .select("id,domain_name,status,expires_at,user_id,auto_renew")
        .order("created_at", { ascending: false });
      setRows((data as Row[]) ?? []);
      setLoading(false);
    })();
  }, []);

  const filtered = rows.filter((r) => r.domain_name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-white">All Domains</h1>
        <p className="text-sm text-slate-400 mt-1">Customer-owned domains under management</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search domain..."
          className="pl-9 bg-slate-900 border-slate-800 text-white"
        />
      </div>

      {loading ? (
        <div className="grid gap-2"><Skeleton className="h-14" /><Skeleton className="h-14" /></div>
      ) : filtered.length === 0 ? (
        <Card className="p-10 bg-slate-900/50 border-slate-800 text-center">
          <Globe2 className="w-10 h-10 mx-auto text-slate-600 mb-2" />
          <p className="text-slate-400">No domains found.</p>
        </Card>
      ) : (
        <Card className="bg-slate-900/50 border-slate-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-900 text-slate-400">
              <tr>
                <th className="text-left px-4 py-3">Domain</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Expires</th>
                <th className="text-left px-4 py-3">Auto Renew</th>
                <th className="text-left px-4 py-3">User</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-t border-slate-800">
                  <td className="px-4 py-3 text-white">{r.domain_name}</td>
                  <td className="px-4 py-3"><Badge variant="outline" className="capitalize border-slate-700">{r.status}</Badge></td>
                  <td className="px-4 py-3 text-slate-400">{r.expires_at ? new Date(r.expires_at).toLocaleDateString() : "—"}</td>
                  <td className="px-4 py-3 text-slate-400">{r.auto_renew ? "Yes" : "No"}</td>
                  <td className="px-4 py-3 text-slate-500 text-xs font-mono">{r.user_id.slice(0, 8)}…</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
