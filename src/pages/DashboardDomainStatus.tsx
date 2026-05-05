import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Globe2,
  CheckCircle2,
  Clock,
  AlertCircle,
  RefreshCw,
  Loader2,
  Radio,
  ExternalLink,
  Server,
  Shield,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface DomainRow {
  id: string;
  domain: string;
  is_verified: boolean | null;
  verification_token: string | null;
  verified_at: string | null;
  created_at: string;
}

interface DnsCheck {
  txt: "pending" | "ok" | "fail";
  a: "pending" | "ok" | "fail";
  txtValue?: string[];
  aValue?: string[];
  cnameValue?: string[];
  checkedAt?: Date;
}

const ACCEPTED_IPS = ["76.76.21.21", "76.76.21.61", "76.76.21.93"];
const ACCEPTED_CNAME_TARGETS = ["cname.vercel-dns.com", "cname.vercel-dns.com."];
const MAIN_DOMAIN = "alokchitra.site";

async function dohQuery(name: string, type: "A" | "CNAME" | "TXT"): Promise<string[]> {
  try {
    const res = await fetch(
      `https://cloudflare-dns.com/dns-query?name=${name}&type=${type}`,
      { headers: { Accept: "application/dns-json" } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.Answer) return [];
    const recordType = type === "A" ? 1 : type === "CNAME" ? 5 : 16;
    return data.Answer
      .filter((r: any) => r.type === recordType)
      .map((r: any) => String(r.data).replace(/"/g, ""));
  } catch {
    return [];
  }
}

export default function DashboardDomainStatus() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [domains, setDomains] = useState<DomainRow[]>([]);
  const [username, setUsername] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [dnsChecks, setDnsChecks] = useState<Record<string, DnsCheck>>({});
  const [subdomainCheck, setSubdomainCheck] = useState<DnsCheck>({ txt: "pending", a: "pending" });
  const [lastEvent, setLastEvent] = useState<Date | null>(null);
  const [realtimeStatus, setRealtimeStatus] = useState<"connecting" | "live" | "off">("connecting");

  const fetchAll = useCallback(async () => {
    if (!user) return;
    const [d, p] = await Promise.all([
      supabase.from("domains").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("profiles").select("username").eq("user_id", user.id).maybeSingle(),
    ]);
    setDomains((d.data as DomainRow[]) || []);
    setUsername(p.data?.username || "");
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // Realtime subscription on domains table for this user
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel(`domains-status-${user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "domains", filter: `user_id=eq.${user.id}` },
        (payload) => {
          setLastEvent(new Date());
          setDomains((prev) => {
            if (payload.eventType === "INSERT") return [payload.new as DomainRow, ...prev];
            if (payload.eventType === "DELETE") return prev.filter((x) => x.id !== (payload.old as any).id);
            if (payload.eventType === "UPDATE") {
              const updated = payload.new as DomainRow;
              if (updated.is_verified) {
                toast({ title: "✅ Domain Verified!", description: `${updated.domain} is now live.` });
              }
              return prev.map((x) => (x.id === updated.id ? updated : x));
            }
            return prev;
          });
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") setRealtimeStatus("live");
        else if (status === "CHANNEL_ERROR" || status === "CLOSED") setRealtimeStatus("off");
      });
    return () => { supabase.removeChannel(channel); };
  }, [user, toast]);

  // Run DNS checks for a domain
  const checkDomainDns = useCallback(async (d: DomainRow) => {
    setDnsChecks((prev) => ({ ...prev, [d.id]: { txt: "pending", a: "pending" } }));
    const [txt, a, cname] = await Promise.all([
      dohQuery(`_lovable.${d.domain}`, "TXT"),
      dohQuery(d.domain, "A"),
      dohQuery(d.domain, "CNAME"),
    ]);
    const txtOk = !!d.verification_token && txt.includes(d.verification_token);
    const dnsOk = a.some((ip) => ACCEPTED_IPS.includes(ip)) || cname.some((target) => ACCEPTED_CNAME_TARGETS.includes(target.toLowerCase()));
    setDnsChecks((prev) => ({
      ...prev,
      [d.id]: {
        txt: txtOk ? "ok" : "fail",
        a: dnsOk ? "ok" : "fail",
        txtValue: txt,
        aValue: a,
        cnameValue: cname,
        checkedAt: new Date(),
      },
    }));
  }, []);

  const checkSubdomain = useCallback(async () => {
    setSubdomainCheck({ txt: "ok", a: "pending" });
    const host = `${username || "test"}.${MAIN_DOMAIN}`;
    const [a, cname] = await Promise.all([dohQuery(host, "A"), dohQuery(host, "CNAME")]);
    const dnsOk = a.some((ip) => ACCEPTED_IPS.includes(ip)) || cname.some((target) => ACCEPTED_CNAME_TARGETS.includes(target.toLowerCase()));
    setSubdomainCheck({ txt: "ok", a: dnsOk ? "ok" : "fail", aValue: a, cnameValue: cname, checkedAt: new Date() });
  }, [username]);

  // Auto-run DNS checks on load
  useEffect(() => {
    domains.forEach((d) => { if (!dnsChecks[d.id]) checkDomainDns(d); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [domains]);

  useEffect(() => {
    if (username) checkSubdomain();
  }, [username, checkSubdomain]);

  // Auto-poll every 30s for unverified domains
  useEffect(() => {
    const interval = setInterval(() => {
      domains.forEach((d) => { if (!d.is_verified) checkDomainDns(d); });
      if (username) checkSubdomain();
    }, 30000);
    return () => clearInterval(interval);
  }, [domains, username, checkDomainDns, checkSubdomain]);

  const triggerVerification = async () => {
    setVerifying(true);
    try {
      const { data, error } = await supabase.functions.invoke("verify-domains");
      if (error) throw error;
      toast({ title: "Verification triggered", description: data?.message || "Check completed" });
      fetchAll();
    } catch (e: any) {
      toast({ variant: "destructive", title: "Failed", description: e.message });
    } finally {
      setVerifying(false);
    }
  };

  const StatusDot = ({ s }: { s: "pending" | "ok" | "fail" }) => (
    <span className={`inline-block w-2 h-2 rounded-full ${
      s === "ok" ? "bg-green-500" : s === "fail" ? "bg-red-500" : "bg-amber-400 animate-pulse"
    }`} />
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Globe2 className="w-6 h-6 text-primary" />
            Domain Status
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time verification status of your custom domains and subdomain.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1.5">
            <Radio className={`w-3 h-3 ${
              realtimeStatus === "live" ? "text-green-500" : realtimeStatus === "off" ? "text-red-500" : "text-amber-500 animate-pulse"
            }`} />
            {realtimeStatus === "live" ? "Live" : realtimeStatus === "off" ? "Offline" : "Connecting"}
          </Badge>
          <Button onClick={triggerVerification} disabled={verifying} size="sm">
            {verifying ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
            Re-check now
          </Button>
        </div>
      </div>

      {lastEvent && (
        <p className="text-xs text-muted-foreground">
          Last update received {formatDistanceToNow(lastEvent, { addSuffix: true })}
        </p>
      )}

      {/* Subdomain Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Server className="w-5 h-5 text-primary" />
                Free Subdomain
              </CardTitle>
              <CardDescription>Provided automatically with your account</CardDescription>
            </div>
            {subdomainCheck.a === "ok" ? (
              <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                <CheckCircle2 className="w-3 h-3 mr-1" /> Active
              </Badge>
            ) : subdomainCheck.a === "fail" ? (
              <Badge variant="outline" className="text-amber-600 border-amber-500/30">
                <Clock className="w-3 h-3 mr-1" /> Wildcard DNS pending
              </Badge>
            ) : (
              <Badge variant="outline"><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Checking</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
            <div className="flex items-center gap-2 min-w-0">
              <Globe2 className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="font-mono text-sm truncate">
                {username || "your-username"}.{MAIN_DOMAIN}
              </span>
            </div>
            <a
              href={`https://${username}.${MAIN_DOMAIN}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary text-xs hover:underline inline-flex items-center gap-1"
            >
              Open <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2 p-2 rounded border bg-background">
              <StatusDot s={subdomainCheck.a} />
              <span className="text-muted-foreground">Wildcard A record:</span>
              <span className="font-mono text-xs ml-auto">
                {subdomainCheck.aValue?.[0] || "—"}
              </span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded border bg-background">
              <CheckCircle2 className="w-3 h-3 text-green-500" />
              <span className="text-muted-foreground">SSL:</span>
              <span className="text-xs ml-auto">Auto-managed</span>
            </div>
          </div>
          {subdomainCheck.checkedAt && (
            <p className="text-xs text-muted-foreground">
              Checked {formatDistanceToNow(subdomainCheck.checkedAt, { addSuffix: true })} · Auto re-checks every 30s
            </p>
          )}
        </CardContent>
      </Card>

      {/* Custom Domains */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Custom Domains
          </CardTitle>
          <CardDescription>
            DNS propagation typically takes 5 minutes to 72 hours.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {domains.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              <Globe2 className="w-10 h-10 mx-auto mb-2 opacity-30" />
              No custom domains added yet. Add one from Settings.
            </div>
          ) : (
            domains.map((d) => {
              const c = dnsChecks[d.id] || { txt: "pending" as const, a: "pending" as const };
              return (
                <div key={d.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <Globe2 className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span className="font-medium truncate">{d.domain}</span>
                    </div>
                    {d.is_verified ? (
                      <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Verified
                        {d.verified_at && ` · ${formatDistanceToNow(new Date(d.verified_at), { addSuffix: true })}`}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-amber-600 border-amber-500/30">
                        <Clock className="w-3 h-3 mr-1" /> Pending
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2 p-2 rounded border bg-background">
                      <StatusDot s={c.txt} />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-muted-foreground">TXT _lovable</div>
                        <div className="font-mono text-xs truncate">
                          {c.txt === "ok" ? "Found ✓" : c.txt === "fail" ? "Not found" : "Checking…"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded border bg-background">
                      <StatusDot s={c.a} />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-muted-foreground">A record</div>
                        <div className="font-mono text-xs truncate">
                          {c.aValue?.[0] || (c.a === "fail" ? "Wrong/missing" : "Checking…")}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {c.checkedAt
                        ? `Last DNS check ${formatDistanceToNow(c.checkedAt, { addSuffix: true })}`
                        : "Awaiting DNS check…"}
                    </span>
                    <Button size="sm" variant="ghost" onClick={() => checkDomainDns(d)} className="h-7">
                      <RefreshCw className="w-3 h-3 mr-1" /> Re-check
                    </Button>
                  </div>

                  {!d.is_verified && c.txt === "ok" && c.a === "ok" && (
                    <div className="flex items-start gap-2 p-3 rounded bg-amber-500/10 border border-amber-500/20 text-xs">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span>
                        DNS looks correct! Click <strong>Re-check now</strong> above to finalize verification on the server.
                      </span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      {/* When changes take effect info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">⏱ When do changes take effect?</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>• <strong>DNS propagation:</strong> 5 min – 72 hrs (usually under 1 hour)</p>
          <p>• <strong>Server verification:</strong> Auto-runs hourly + on-demand via "Re-check now"</p>
          <p>• <strong>SSL provisioning:</strong> ~2–10 min after verification succeeds</p>
          <p>• <strong>Live updates:</strong> This page refreshes automatically when status changes ({realtimeStatus})</p>
        </CardContent>
      </Card>
    </div>
  );
}
