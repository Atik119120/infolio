import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Crown, Loader2, Search, UserCheck, UserX, Clock } from "lucide-react";
import { format } from "date-fns";

interface ProUser {
  user_id: string;
  display_name: string | null;
  email: string | null;
  username: string | null;
  plan: string | null;
  plan_purchased_at: string | null;
  plan_expires_at: string | null;
}

interface FoundUser {
  user_id: string;
  display_name: string | null;
  email: string | null;
  username: string | null;
  plan: string | null;
  plan_expires_at: string | null;
}

export default function AdminPlans() {
  const [proUsers, setProUsers] = useState<ProUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<FoundUser[]>([]);
  const [duration, setDuration] = useState<string>("12"); // months
  const [actingId, setActingId] = useState<string | null>(null);
  const { toast } = useToast();

  const loadProUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("user_id, display_name, email, username, plan, plan_purchased_at, plan_expires_at")
      .eq("plan", "pro")
      .order("plan_purchased_at", { ascending: false });
    if (error) toast({ variant: "destructive", title: error.message });
    else setProUsers((data ?? []) as ProUser[]);
    setLoading(false);
  };

  useEffect(() => { loadProUsers(); }, []);

  const handleSearch = async () => {
    if (!search.trim()) {
      setResults([]);
      return;
    }
    setSearching(true);
    const term = `%${search.trim()}%`;
    const { data, error } = await supabase
      .from("profiles")
      .select("user_id, display_name, email, username, plan, plan_expires_at")
      .or(`email.ilike.${term},username.ilike.${term},display_name.ilike.${term}`)
      .limit(10);
    if (error) toast({ variant: "destructive", title: error.message });
    else setResults((data ?? []) as FoundUser[]);
    setSearching(false);
  };

  const grantPro = async (u: FoundUser) => {
    setActingId(u.user_id);
    const months = parseInt(duration) || 12;
    const expires = new Date();
    expires.setMonth(expires.getMonth() + months);

    const { error } = await supabase
      .from("profiles")
      .update({
        plan: "pro",
        plan_purchased_at: new Date().toISOString(),
        plan_expires_at: expires.toISOString(),
      })
      .eq("user_id", u.user_id);

    if (error) toast({ variant: "destructive", title: "Failed", description: error.message });
    else toast({ title: "Pro activated", description: `${u.display_name || u.username} upgraded for ${months} month(s).` });
    setActingId(null);
    handleSearch();
    loadProUsers();
  };

  const revokePro = async (u: ProUser) => {
    if (!confirm(`Revoke Pro from ${u.display_name || u.username}?`)) return;
    setActingId(u.user_id);
    const { error } = await supabase
      .from("profiles")
      .update({ plan: "free", plan_expires_at: null, plan_purchased_at: null })
      .eq("user_id", u.user_id);
    if (error) toast({ variant: "destructive", title: error.message });
    else toast({ title: "Pro revoked" });
    setActingId(null);
    loadProUsers();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Crown className="w-6 h-6 text-amber-500" /> Pro Plan Management
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Users contact you on WhatsApp. After receiving payment, search the user below and activate Pro manually.
        </p>
      </div>

      {/* Grant Pro Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-green-500" /> Grant Pro Plan
          </CardTitle>
          <CardDescription>Search a user by email, username or name and activate Pro.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-[1fr_180px_auto] gap-2">
            <div>
              <Label className="text-xs">Search user</Label>
              <Input
                placeholder="email, username or name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <div>
              <Label className="text-xs">Duration</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 month</SelectItem>
                  <SelectItem value="3">3 months</SelectItem>
                  <SelectItem value="6">6 months</SelectItem>
                  <SelectItem value="12">1 year</SelectItem>
                  <SelectItem value="24">2 years</SelectItem>
                  <SelectItem value="120">Lifetime (10y)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={handleSearch} disabled={searching} className="w-full">
                {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Search className="w-4 h-4 mr-1" /> Search</>}
              </Button>
            </div>
          </div>

          {results.length > 0 && (
            <div className="space-y-2">
              {results.map((u) => (
                <div key={u.user_id} className="border rounded-lg p-3 flex items-center justify-between gap-3">
                  <div className="text-sm min-w-0">
                    <div className="font-medium truncate">
                      {u.display_name || u.username}
                      {u.plan === "pro" && <Badge className="ml-2 bg-amber-500">Already Pro</Badge>}
                    </div>
                    <div className="text-muted-foreground text-xs truncate">@{u.username} · {u.email}</div>
                    {u.plan_expires_at && (
                      <div className="text-xs text-muted-foreground">Expires: {format(new Date(u.plan_expires_at), "PP")}</div>
                    )}
                  </div>
                  <Button size="sm" onClick={() => grantPro(u)} disabled={actingId === u.user_id}>
                    {actingId === u.user_id ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Crown className="w-4 h-4 mr-1" /> Activate Pro</>}
                  </Button>
                </div>
              ))}
            </div>
          )}
          {search && results.length === 0 && !searching && (
            <p className="text-sm text-muted-foreground">No users found.</p>
          )}
        </CardContent>
      </Card>

      {/* Active Pro Users */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-500" /> Active Pro Users ({proUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" /> Loading…</div>
          ) : proUsers.length === 0 ? (
            <p className="text-sm text-muted-foreground">No Pro users yet.</p>
          ) : (
            <div className="space-y-2">
              {proUsers.map((u) => {
                const expired = u.plan_expires_at && new Date(u.plan_expires_at) < new Date();
                return (
                  <div key={u.user_id} className="border rounded-lg p-3 flex items-center justify-between gap-3">
                    <div className="text-sm min-w-0">
                      <div className="font-medium truncate">{u.display_name || u.username}</div>
                      <div className="text-muted-foreground text-xs truncate">@{u.username} · {u.email}</div>
                      <div className="text-xs flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" />
                        {u.plan_expires_at ? (
                          <span className={expired ? "text-destructive" : "text-muted-foreground"}>
                            {expired ? "Expired" : "Expires"} {format(new Date(u.plan_expires_at), "PP")}
                          </span>
                        ) : <span className="text-muted-foreground">No expiry</span>}
                      </div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => revokePro(u)} disabled={actingId === u.user_id}>
                      <UserX className="w-4 h-4 mr-1" /> Revoke
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
