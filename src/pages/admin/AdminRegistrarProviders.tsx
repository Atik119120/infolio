import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import type { RegistrarProvider } from "@/lib/registrar/types";
import { testConnection, getProviderStatus } from "@/lib/registrar/api";
import { Server, CheckCircle2, AlertTriangle, Plug, Loader2, RefreshCw, Bug } from "lucide-react";

export default function AdminRegistrarProviders() {
  const [providers, setProviders] = useState<RegistrarProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState(false);
  const [credsPresent, setCredsPresent] = useState(false);
  const [status, setStatus] = useState<any>(null);
  const [lastTest, setLastTest] = useState<any>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("registrar_providers").select("*").order("created_at");
    setProviders((data as RegistrarProvider[]) ?? []);
    try {
      const s = await getProviderStatus();
      setStatus(s);
      setCredsPresent(s.hostneed_credentials_present);
    } catch { /* ignore */ }
    setLoading(false);
  };


  const updateField = async (p: RegistrarProvider, patch: Partial<RegistrarProvider>, msg: string) => {
    const { error } = await supabase.from("registrar_providers").update(patch as any).eq("id", p.id);
    if (error) toast.error(error.message);
    else { toast.success(msg); load(); }
  };

  const makeDefault = async (p: RegistrarProvider) => {
    await supabase.from("registrar_providers").update({ is_default: false }).neq("id", p.id);
    await updateField(p, { is_default: true }, `${p.name} set as default`);
  };

  const runTest = async () => {
    setTesting(true);
    try {
      const r: any = await testConnection();
      console.log("[testConnection] full response", r);
      setLastTest(r);
      if (r.ok && !r.using_mock_fallback) {
        toast.success(`✓ ${r.provider}: ${r.message}`);
      } else if (r.using_mock_fallback) {
        toast.warning(`Using Mock fallback: ${r.message}`);
      } else {
        const detail = [r.kind, r.message, r.http_status ? `HTTP ${r.http_status}` : null]
          .filter(Boolean).join(" — ");
        toast.error(`✗ ${r.provider}: ${detail}`, { duration: 14000, description: r.endpoint });
      }
      // Refresh debug status so last_request/recent_requests update
      try { const s = await getProviderStatus(); setStatus(s); } catch { /* ignore */ }
    } catch (e: any) {
      console.error("[testConnection] threw", e);
      toast.error(e?.message ?? "Test failed", { duration: 14000 });
    } finally { setTesting(false); }
  };



  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold text-white">API Providers</h1>
          <p className="text-sm text-slate-400 mt-1">Registrar API integrations & driver switching</p>
        </div>
        <Button onClick={runTest} disabled={testing} className="bg-orange-500 hover:bg-orange-600">
          {testing ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Plug className="w-4 h-4 mr-1" />}
          Test Active Provider
        </Button>
      </div>

      <Card className={`p-4 border ${credsPresent ? "bg-green-500/5 border-green-500/30" : "bg-yellow-500/5 border-yellow-500/30"}`}>
        <div className="flex items-start gap-3">
          {credsPresent
            ? <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5" />
            : <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />}
          <div>
            <p className="text-sm text-white font-medium">
              HostNeed Credentials: {credsPresent ? "Configured" : "Missing"}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {credsPresent
                ? "All 3 secrets present (HOSTNEED_API_URL, HOSTNEED_USERNAME, HOSTNEED_API_SECRET). HostNeed driver will run when enabled & non-mock."
                : "Add secrets to enable real driver. System auto-falls back to Mock driver until credentials are present."}
            </p>
          </div>
        </div>
      </Card>

      {loading ? (
        <Skeleton className="h-40" />
      ) : (
        <div className="grid gap-3">
          {providers.map((p) => (
            <Card key={p.id} className="p-5 bg-slate-900/50 border-slate-800">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-500/15 border border-orange-500/30 flex items-center justify-center">
                    <Server className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-medium text-white">{p.name}</h3>
                      {p.is_default && <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">Default</Badge>}
                      {p.is_mock
                        ? <Badge variant="outline" className="border-yellow-500/40 text-yellow-400">Mock Mode</Badge>
                        : <Badge variant="outline" className="border-green-500/40 text-green-400">Live</Badge>}
                      <Badge variant="outline" className="border-slate-600 text-slate-400 capitalize">{p.provider_type}</Badge>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 break-all">{p.api_endpoint || "—"}</p>
                    {p.notes && <p className="text-xs text-slate-400 mt-2 max-w-md">{p.notes}</p>}
                  </div>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Enabled</span>
                    <Switch checked={p.is_enabled} onCheckedChange={(v) => updateField(p, { is_enabled: v }, `${p.name} ${v ? "enabled" : "disabled"}`)} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Mock Mode</span>
                    <Switch checked={p.is_mock} onCheckedChange={(v) => updateField(p, { is_mock: v }, `Mock mode ${v ? "on" : "off"}`)} />
                  </div>
                  {!p.is_default && (
                    <Button size="sm" variant="outline" className="border-slate-700 text-slate-300" onClick={() => makeDefault(p)}>
                      Set Default
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ---------- Debug Panel ---------- */}
      <Card className="p-5 bg-slate-900/50 border-slate-800">
        <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Bug className="w-4 h-4 text-orange-400" />
            <h2 className="text-lg font-medium text-white">HostNeed Debug Panel</h2>
          </div>
          <Button size="sm" variant="outline" className="border-slate-700 text-slate-300"
            onClick={async () => { const s = await getProviderStatus(); setStatus(s); toast.success("Refreshed"); }}>
            <RefreshCw className="w-3 h-3 mr-1" /> Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 text-xs">
          <div className="p-3 rounded bg-slate-950/60 border border-slate-800">
            <div className="text-slate-500 mb-1">Base Endpoint</div>
            <div className="text-slate-200 font-mono break-all">{status?.hostneed_endpoint ?? "—"}</div>
          </div>
          <div className="p-3 rounded bg-slate-950/60 border border-slate-800">
            <div className="text-slate-500 mb-1">Active Provider</div>
            <div className="text-slate-200">
              {status?.active_provider?.name ?? "—"}{" "}
              <Badge variant="outline" className="ml-1 border-slate-700 text-slate-400 capitalize">
                {status?.active_provider?.provider_type ?? "n/a"}
              </Badge>
            </div>
          </div>
          <div className="p-3 rounded bg-slate-950/60 border border-slate-800">
            <div className="text-slate-500 mb-1">Mock Status</div>
            <div className="text-slate-200">{status?.using_mock ? "Mock driver (fallback)" : "Live driver"}</div>
          </div>
          <div className="p-3 rounded bg-slate-950/60 border border-slate-800">
            <div className="text-slate-500 mb-1">Username</div>
            <div className="text-slate-200 font-mono">{status?.hostneed_username_preview ?? "—"}</div>
          </div>
        </div>

        {/* Auth diagnostics */}
        {status?.auth_diagnostics && (
          <div className="mb-4 rounded bg-slate-950/80 border border-slate-800 p-3 text-xs space-y-2">
            <div className="text-slate-400 font-medium">Authentication Diagnostics</div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {[
                ["API URL detected", status.auth_diagnostics.api_url_detected, `len ${status.auth_diagnostics.api_url_length}`],
                ["Username detected", status.auth_diagnostics.username_detected, `len ${status.auth_diagnostics.username_length}`],
                ["Secret detected", status.auth_diagnostics.secret_detected, `len ${status.auth_diagnostics.secret_length}`],
              ].map(([label, ok, meta]: any) => (
                <div key={label} className="flex items-center gap-2">
                  <Badge className={ok ? "bg-green-500/20 text-green-300 border-green-500/30" : "bg-red-500/20 text-red-300 border-red-500/30"}>
                    {ok ? "yes" : "no"}
                  </Badge>
                  <span className="text-slate-300">{label}</span>
                  <span className="text-slate-500">({meta})</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
              <div><span className="text-slate-500">Generated timestamp (UTC): </span><span className="font-mono text-slate-200">{status.auth_diagnostics.generated_timestamp_utc}</span></div>
              <div><span className="text-slate-500">Server time (UTC): </span><span className="font-mono text-slate-200">{status.auth_diagnostics.server_time_utc}</span></div>
              <div><span className="text-slate-500">Token length: </span><span className="font-mono text-slate-200">{status.auth_diagnostics.token_length}</span></div>
              <div><span className="text-slate-500">Token preview: </span><span className="font-mono text-slate-200">{status.auth_diagnostics.token_preview ?? "—"}</span></div>
              <div><span className="text-slate-500">Provider mode: </span><span className="font-mono text-slate-200">{status.current_provider_mode}</span></div>
              {status.auth_diagnostics.token_error && (
                <div className="text-red-300 md:col-span-2">Token error: {status.auth_diagnostics.token_error}</div>
              )}
            </div>
            <div className="text-slate-500 break-all pt-1">
              Algorithm: <span className="font-mono text-slate-400">{status.auth_diagnostics.algorithm}</span>
            </div>
            <div className="text-slate-500">
              Headers sent: <span className="font-mono text-slate-400">{`{ username: "${status.hostneed_username_preview ?? "?"}", token: "<base64-hmac>" }`}</span>
            </div>
          </div>
        )}

        {lastTest && (
          <div className="mb-4">
            <div className="text-xs text-slate-400 mb-1">Last Test Connection Attempts</div>
            <div className="rounded bg-slate-950/80 border border-slate-800 divide-y divide-slate-800 text-xs">
              {(lastTest.attempts ?? []).map((a: any, i: number) => (
                <div key={i} className="px-3 py-2 flex items-start gap-2">
                  <Badge className={a.ok ? "bg-green-500/20 text-green-300 border-green-500/30" : "bg-red-500/20 text-red-300 border-red-500/30"}>
                    {a.http_status || "ERR"}
                  </Badge>
                  <div className="min-w-0 flex-1">
                    <div className="font-mono text-slate-200">{a.action}</div>
                    <div className="text-slate-500 break-all">{a.endpoint}</div>
                    <div className="text-slate-400 mt-0.5 break-all">{a.message}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <div className="text-xs text-slate-400 mb-1">Last API Request / Response</div>
          {status?.last_request ? (
            <div className="rounded bg-slate-950/80 border border-slate-800 p-3 text-xs space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={status.last_request.ok ? "bg-green-500/20 text-green-300 border-green-500/30" : "bg-red-500/20 text-red-300 border-red-500/30"}>
                  {status.last_request.http_status || "ERR"}
                </Badge>
                <span className="font-mono text-slate-200">{status.last_request.action}</span>
                <span className="text-slate-500">{status.last_request.duration_ms} ms</span>
                <span className="text-slate-600">{status.last_request.at}</span>
              </div>
              <div>
                <div className="text-slate-500">URL</div>
                <div className="font-mono text-slate-300 break-all">{status.last_request.url}</div>
              </div>
              <div>
                <div className="text-slate-500">Request Body</div>
                <pre className="font-mono text-slate-300 break-all whitespace-pre-wrap">{status.last_request.request_body || "(empty)"}</pre>
              </div>
              <div>
                <div className="text-slate-500">Headers (token redacted)</div>
                <pre className="font-mono text-slate-300 break-all whitespace-pre-wrap">{JSON.stringify(status.last_request.request_headers_safe, null, 2)}</pre>
              </div>
              <div>
                <div className="text-slate-500">Response Body</div>
                <pre className="font-mono text-slate-300 break-all whitespace-pre-wrap max-h-64 overflow-auto">{status.last_request.response_body || "(empty)"}</pre>
              </div>
              {status.last_request.error_kind && (
                <div className="text-red-300">
                  <span className="text-slate-500">Error: </span>
                  {status.last_request.error_kind} — {status.last_request.error_message}
                </div>
              )}
            </div>
          ) : (
            <div className="text-xs text-slate-500 italic">No requests captured yet. Click "Test Active Provider" to capture diagnostics.</div>
          )}
        </div>
      </Card>
    </div>
  );
}

