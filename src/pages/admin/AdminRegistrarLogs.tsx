import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface Log {
  id: string; user_id: string | null; action: string;
  entity_type: string | null; entity_id: string | null;
  details: Record<string, unknown>; created_at: string;
}

export default function AdminRegistrarLogs() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("registrar_activity_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);
      setLogs((data as Log[]) ?? []);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-white">Activity Logs</h1>
        <p className="text-sm text-slate-400 mt-1">Recent registrar actions (last 200)</p>
      </div>

      {loading ? (
        <Skeleton className="h-64" />
      ) : logs.length === 0 ? (
        <Card className="p-10 bg-slate-900/50 border-slate-800 text-center text-slate-400">
          No activity yet.
        </Card>
      ) : (
        <Card className="bg-slate-900/50 border-slate-800 divide-y divide-slate-800">
          {logs.map((l) => (
            <div key={l.id} className="px-4 py-3 flex items-center justify-between gap-3 text-sm">
              <div className="flex items-center gap-3 min-w-0">
                <Badge variant="outline" className="border-slate-700 text-slate-300 font-mono text-xs">{l.action}</Badge>
                <span className="text-slate-400 truncate">{JSON.stringify(l.details)}</span>
              </div>
              <span className="text-xs text-slate-500 shrink-0">{new Date(l.created_at).toLocaleString()}</span>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
