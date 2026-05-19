import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Globe2, Plus, Trash2, Loader2, CheckCircle2, Clock, Copy, RefreshCw, ExternalLink } from "lucide-react";
import { z } from "zod";

const domainSchema = z.string().trim().min(4).max(255)
  .regex(/^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/, "Invalid domain");

interface Domain {
  id: string;
  domain: string;
  is_verified: boolean | null;
  verification_token: string | null;
  verified_at: string | null;
}

export function DeployDomainDialog({ open, onOpenChange, subdomain }: { open: boolean; onOpenChange: (v: boolean) => void; subdomain?: string | null }) {
  const { user } = useAuth();
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [newDomain, setNewDomain] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => { if (open && user) load(); }, [open, user]);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("domains").select("*").eq("user_id", user!.id).order("created_at", { ascending: false });
    setDomains((data as Domain[]) || []);
    setLoading(false);
  };

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    const v = domainSchema.safeParse(newDomain.trim());
    if (!v.success) { setErr(v.error.errors[0].message); return; }
    const clean = newDomain.toLowerCase().replace(/^https?:\/\//, "").replace(/\/+$/, "");
    setAdding(true);
    const { error } = await supabase.from("domains").insert({ user_id: user!.id, domain: clean, is_verified: false });
    if (error) { setErr(error.code === "23505" ? "Already added" : error.message); setAdding(false); return; }
    try { await supabase.functions.invoke("verify-domains"); } catch {}
    setNewDomain(""); setAdding(false);
    toast.success("Domain added — configure DNS to verify");
    load();
  };

  const verify = async () => {
    setVerifying(true);
    try {
      await supabase.functions.invoke("verify-domains");
      toast.success("Verification check complete");
      load();
    } finally { setVerifying(false); }
  };

  const remove = async (id: string) => {
    await supabase.from("domains").delete().eq("id", id);
    toast.success("Domain removed");
    load();
  };

  const copy = (t: string) => { navigator.clipboard.writeText(t); toast.success("Copied"); };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Globe2 className="w-5 h-5" /> Custom Domains</DialogTitle>
          <DialogDescription>
            Connect your own domain. Currently published at <span className="font-mono text-foreground">{subdomain}.infolio.online</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={add} className="flex gap-2">
          <Input value={newDomain} onChange={(e) => { setNewDomain(e.target.value); setErr(""); }} placeholder="yourdomain.com" disabled={adding} />
          <Button type="submit" disabled={adding || !newDomain.trim()}>
            {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Plus className="w-4 h-4 mr-1" />Add</>}
          </Button>
        </form>
        {err && <p className="text-xs text-destructive">{err}</p>}

        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">{domains.length} domain{domains.length !== 1 && "s"}</p>
          {domains.some((d) => !d.is_verified) && (
            <Button size="sm" variant="ghost" onClick={verify} disabled={verifying}>
              {verifying ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : <RefreshCw className="w-3.5 h-3.5 mr-1" />} Verify Now
            </Button>
          )}
        </div>

        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {loading && <Loader2 className="w-5 h-5 animate-spin mx-auto" />}
          {!loading && domains.length === 0 && (
            <div className="text-center py-8 text-sm text-muted-foreground border border-dashed rounded-lg">
              No custom domains yet
            </div>
          )}
          {domains.map((d) => (
            <div key={d.id} className="border rounded-lg p-3 space-y-2 bg-card/50">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-mono text-sm truncate">{d.domain}</span>
                  {d.is_verified
                    ? <Badge className="bg-green-500/15 text-green-600 border-green-500/30 hover:bg-green-500/20"><CheckCircle2 className="w-3 h-3 mr-1" />Verified</Badge>
                    : <Badge variant="outline" className="text-amber-600 border-amber-500/40"><Clock className="w-3 h-3 mr-1" />Pending</Badge>}
                </div>
                <div className="flex items-center gap-1">
                  {d.is_verified && (
                    <Button size="icon" variant="ghost" className="h-7 w-7" asChild>
                      <a href={`https://${d.domain}`} target="_blank" rel="noreferrer"><ExternalLink className="w-3.5 h-3.5" /></a>
                    </Button>
                  )}
                  <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => remove(d.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                </div>
              </div>
              {!d.is_verified && (
                <div className="text-xs space-y-1.5 bg-muted/40 rounded p-2">
                  <p className="font-medium text-foreground">DNS Records:</p>
                  <div className="flex items-center justify-between font-mono">
                    <span>A @ → 76.76.21.21</span>
                    <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => copy("76.76.21.21")}><Copy className="w-3 h-3" /></Button>
                  </div>
                  {d.verification_token && (
                    <div className="flex items-center justify-between font-mono">
                      <span className="truncate">TXT _vercel → {d.verification_token}</span>
                      <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => copy(d.verification_token!)}><Copy className="w-3 h-3" /></Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
