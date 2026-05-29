import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import type { TldPricing } from "@/lib/registrar/types";

export default function AdminRegistrarPricing() {
  const [rows, setRows] = useState<TldPricing[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("tld_pricing").select("*").order("display_order");
    setRows((data as TldPricing[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const update = (id: string, field: keyof TldPricing, value: number) => {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const save = async (row: TldPricing) => {
    setSaving(row.id);
    const { error } = await supabase
      .from("tld_pricing")
      .update({
        register_price: row.register_price,
        renew_price: row.renew_price,
        transfer_price: row.transfer_price,
      })
      .eq("id", row.id);
    setSaving(null);
    if (error) toast.error(error.message);
    else toast.success(`${row.tld} updated`);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-white">TLD Pricing</h1>
        <p className="text-sm text-slate-400 mt-1">Set register / renew / transfer prices per TLD</p>
      </div>

      {loading ? (
        <Skeleton className="h-64" />
      ) : (
        <Card className="bg-slate-900/50 border-slate-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-900 text-slate-400">
              <tr>
                <th className="text-left px-4 py-3">TLD</th>
                <th className="text-left px-4 py-3">Register</th>
                <th className="text-left px-4 py-3">Renew</th>
                <th className="text-left px-4 py-3">Transfer</th>
                <th className="text-left px-4 py-3">Currency</th>
                <th className="text-left px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-slate-800">
                  <td className="px-4 py-3 text-white font-medium">{r.tld}</td>
                  {(["register_price", "renew_price", "transfer_price"] as const).map((f) => (
                    <td key={f} className="px-4 py-2">
                      <Input
                        type="number"
                        value={r[f]}
                        onChange={(e) => update(r.id, f, Number(e.target.value))}
                        className="bg-slate-950 border-slate-800 text-white w-28"
                      />
                    </td>
                  ))}
                  <td className="px-4 py-3 text-slate-400">{r.currency}</td>
                  <td className="px-4 py-2">
                    <Button size="sm" onClick={() => save(r)} disabled={saving === r.id} className="bg-orange-500 hover:bg-orange-600 text-white">
                      {saving === r.id ? "Saving…" : "Save"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
