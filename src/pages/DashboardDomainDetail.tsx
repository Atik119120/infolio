import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  listDnsRecords,
  upsertDnsRecord,
  deleteDnsRecord,
  updateNameservers,
  toggleAutoRenew,
  toggleRegistrarLock,
  toggleIDProtection,
  getEPPCode,
} from "@/lib/registrar/api";
import type { RegistrarDomain, DnsRecord, DnsRecordType } from "@/lib/registrar/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Globe2, Trash2, Plus, ArrowLeft, Copy, KeyRound } from "lucide-react";
import { toast } from "sonner";

const DNS_TYPES: DnsRecordType[] = ["A", "AAAA", "CNAME", "MX", "TXT", "NS", "SRV", "CAA"];

export default function DashboardDomainDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [domain, setDomain] = useState<RegistrarDomain | null>(null);
  const [records, setRecords] = useState<DnsRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [nsInput, setNsInput] = useState("");
  const [newRec, setNewRec] = useState({ type: "A" as DnsRecordType, name: "@", content: "", ttl: 3600, priority: "" });

  const load = async () => {
    if (!id) return;
    setLoading(true);
    const { data: dom } = await supabase.from("registrar_domains").select("*").eq("id", id).maybeSingle();
    setDomain(dom as RegistrarDomain | null);
    setNsInput(((dom as any)?.nameservers ?? []).join("\n"));
    setRecords(await listDnsRecords(id));
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [id]);

  if (loading) {
    return <div className="space-y-4"><Skeleton className="h-12 w-64" /><Skeleton className="h-40" /></div>;
  }
  if (!domain) {
    return <Card className="p-8 bg-white/[0.02] border-white/10 text-center text-white/60">Domain not found.</Card>;
  }

  const saveNs = async () => {
    try {
      const list = nsInput.split(/\s+/).map((s) => s.trim()).filter(Boolean);
      await updateNameservers({ domain_id: domain.id, nameservers: list });
      toast.success("Nameservers updated");
      load();
    } catch (e: any) { toast.error(e.message); }
  };

  const addRec = async () => {
    if (!newRec.content) return toast.error("Content required");
    try {
      await upsertDnsRecord({
        domain_id: domain.id,
        type: newRec.type, name: newRec.name, content: newRec.content,
        ttl: Number(newRec.ttl) || 3600,
        priority: newRec.priority ? Number(newRec.priority) : null,
      });
      setNewRec({ type: "A", name: "@", content: "", ttl: 3600, priority: "" });
      toast.success("Record added");
      setRecords(await listDnsRecords(domain.id));
    } catch (e: any) { toast.error(e.message); }
  };

  const removeRec = async (rid: string) => {
    if (!confirm("Delete this record?")) return;
    await deleteDnsRecord(rid);
    setRecords(await listDnsRecords(domain.id));
    toast.success("Deleted");
  };

  const setFlag = async (fn: (p: any) => Promise<any>, key: string, val: boolean) => {
    try {
      await fn({ domain_id: domain.id, enabled: val });
      setDomain({ ...domain, [key]: val } as RegistrarDomain);
      toast.success("Updated");
    } catch (e: any) { toast.error(e.message); }
  };

  const showEpp = async () => {
    try {
      const r = await getEPPCode({ domain_id: domain.id });
      navigator.clipboard.writeText(r.code);
      toast.success(`EPP copied: ${r.code}`);
    } catch (e: any) { toast.error(e.message); }
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard/my-domains")} className="text-white/70">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back
      </Button>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Globe2 className="w-6 h-6 text-white/70" />
          <h1 className="text-2xl font-semibold text-white">{domain.domain_name}</h1>
          <Badge variant="outline" className="border-green-500/30 text-green-400">{domain.status}</Badge>
        </div>
        <div className="text-sm text-white/50">
          Expires: {domain.expires_at ? new Date(domain.expires_at).toLocaleDateString() : "—"}
        </div>
      </div>

      <Tabs defaultValue="dns">
        <TabsList className="bg-white/[0.03] border border-white/10">
          <TabsTrigger value="dns">DNS Records</TabsTrigger>
          <TabsTrigger value="ns">Nameservers</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="dns" className="space-y-4 mt-4">
          <Card className="p-4 bg-white/[0.02] border-white/10">
            <h3 className="text-white font-medium mb-3">Add Record</h3>
            <div className="grid md:grid-cols-6 gap-2">
              <Select value={newRec.type} onValueChange={(v) => setNewRec({ ...newRec, type: v as DnsRecordType })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{DNS_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
              <Input placeholder="Name (@)" value={newRec.name} onChange={(e) => setNewRec({ ...newRec, name: e.target.value })} />
              <Input className="md:col-span-2" placeholder="Content / Value" value={newRec.content} onChange={(e) => setNewRec({ ...newRec, content: e.target.value })} />
              <Input type="number" placeholder="TTL" value={newRec.ttl} onChange={(e) => setNewRec({ ...newRec, ttl: Number(e.target.value) })} />
              {newRec.type === "MX" || newRec.type === "SRV" ? (
                <Input type="number" placeholder="Priority" value={newRec.priority} onChange={(e) => setNewRec({ ...newRec, priority: e.target.value })} />
              ) : <Button onClick={addRec}><Plus className="w-4 h-4 mr-1" />Add</Button>}
            </div>
            {(newRec.type === "MX" || newRec.type === "SRV") && (
              <Button onClick={addRec} className="mt-2"><Plus className="w-4 h-4 mr-1" />Add</Button>
            )}
          </Card>

          <Card className="bg-white/[0.02] border-white/10 overflow-hidden">
            {records.length === 0 ? (
              <div className="p-8 text-center text-sm text-white/50">No DNS records yet.</div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-white/[0.03] text-white/60">
                  <tr><th className="text-left p-3">Type</th><th className="text-left p-3">Name</th><th className="text-left p-3">Content</th><th className="text-left p-3">TTL</th><th className="text-left p-3">Pri</th><th className="p-3"></th></tr>
                </thead>
                <tbody>
                  {records.map((r) => (
                    <tr key={r.id} className="border-t border-white/5 text-white/80">
                      <td className="p-3"><Badge variant="outline" className="border-white/20">{r.type}</Badge></td>
                      <td className="p-3">{r.name}</td>
                      <td className="p-3 font-mono text-xs break-all">{r.content}</td>
                      <td className="p-3">{r.ttl}</td>
                      <td className="p-3">{r.priority ?? "—"}</td>
                      <td className="p-3 text-right">
                        <Button size="sm" variant="ghost" onClick={() => removeRec(r.id)} className="text-red-400 hover:bg-red-500/10">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="ns" className="mt-4">
          <Card className="p-5 bg-white/[0.02] border-white/10 space-y-3">
            <Label className="text-white/80">Nameservers (one per line, min 2)</Label>
            <textarea
              className="w-full min-h-32 rounded-md bg-black/30 border border-white/10 p-3 text-sm text-white font-mono"
              value={nsInput}
              onChange={(e) => setNsInput(e.target.value)}
            />
            <Button onClick={saveNs}>Save Nameservers</Button>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-4 space-y-3">
          {[
            { label: "Auto-Renew", key: "auto_renew", fn: toggleAutoRenew, desc: "Renew automatically before expiry" },
            { label: "Registrar Lock", key: "registrar_lock", fn: toggleRegistrarLock, desc: "Prevent unauthorized transfers" },
            { label: "ID Protection / WHOIS Privacy", key: "id_protection", fn: toggleIDProtection, desc: "Hide your contact info from WHOIS" },
          ].map((s) => (
            <Card key={s.key} className="p-4 bg-white/[0.02] border-white/10 flex items-center justify-between">
              <div>
                <p className="text-white font-medium">{s.label}</p>
                <p className="text-xs text-white/50">{s.desc}</p>
              </div>
              <Switch
                checked={!!(domain as any)[s.key]}
                onCheckedChange={(v) => setFlag(s.fn as any, s.key, v)}
              />
            </Card>
          ))}
          <Card className="p-4 bg-white/[0.02] border-white/10 flex items-center justify-between">
            <div>
              <p className="text-white font-medium">EPP / Auth Code</p>
              <p className="text-xs text-white/50">Required to transfer domain to another registrar</p>
            </div>
            <Button variant="outline" onClick={showEpp} className="border-white/20 text-white">
              <KeyRound className="w-4 h-4 mr-1" /> Get Code
            </Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
