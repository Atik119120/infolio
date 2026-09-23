import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Eye, Users, TrendingUp, Globe, Smartphone, Monitor, Tablet, ExternalLink } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

type Row = {
  created_at: string;
  page_type: "portfolio" | "builder";
  slug: string | null;
  path: string | null;
  visitor_hash: string | null;
  country: string | null;
  device: string | null;
  browser: string | null;
  referrer: string | null;
};

const RANGES = [
  { id: "7", label: "Last 7 days", days: 7 },
  { id: "30", label: "Last 30 days", days: 30 },
  { id: "90", label: "Last 90 days", days: 90 },
];

export default function DashboardAnalytics() {
  const { user } = useAuth();
  const [range, setRange] = useState("30");
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [scope, setScope] = useState<"all" | "portfolio" | "builder">("all");

  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      const days = RANGES.find((r) => r.id === range)!.days;
      const since = new Date(Date.now() - days * 86400000).toISOString();
      const { data } = await supabase
        .from("page_views")
        .select("created_at,page_type,slug,path,visitor_hash,country,device,browser,referrer")
        .eq("owner_id", user.id)
        .gte("created_at", since)
        .order("created_at", { ascending: false })
        .limit(5000);
      setRows((data as any) || []);
      setLoading(false);
    })();
  }, [user, range]);

  const filtered = useMemo(
    () => (scope === "all" ? rows : rows.filter((r) => r.page_type === scope)),
    [rows, scope]
  );

  const totalViews = filtered.length;
  const uniqueVisitors = useMemo(
    () => new Set(filtered.map((r) => r.visitor_hash).filter(Boolean)).size,
    [filtered]
  );
  const days = RANGES.find((r) => r.id === range)!.days;

  const chartData = useMemo(() => {
    const map = new Map<string, { date: string; views: number; visitors: Set<string> }>();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
      map.set(d, { date: d, views: 0, visitors: new Set() });
    }
    filtered.forEach((r) => {
      const d = r.created_at.slice(0, 10);
      const e = map.get(d);
      if (e) {
        e.views++;
        if (r.visitor_hash) e.visitors.add(r.visitor_hash);
      }
    });
    return Array.from(map.values()).map((e) => ({
      date: e.date.slice(5),
      Views: e.views,
      Visitors: e.visitors.size,
    }));
  }, [filtered, days]);

  const topList = (key: keyof Row, n = 6) => {
    const counts = new Map<string, number>();
    filtered.forEach((r) => {
      const v = (r[key] as string) || "Unknown";
      counts.set(v, (counts.get(v) || 0) + 1);
    });
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, n);
  };

  const topPages = useMemo(() => {
    const counts = new Map<string, { count: number; type: string }>();
    filtered.forEach((r) => {
      const k = r.path || r.slug || "/";
      const prev = counts.get(k) || { count: 0, type: r.page_type };
      prev.count++;
      counts.set(k, prev);
    });
    return Array.from(counts.entries())
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 8);
  }, [filtered]);

  const topReferrers = useMemo(() => {
    const counts = new Map<string, number>();
    filtered.forEach((r) => {
      let v = "Direct";
      if (r.referrer) {
        try {
          v = new URL(r.referrer).hostname.replace(/^www\./, "");
        } catch {
          v = r.referrer;
        }
      }
      counts.set(v, (counts.get(v) || 0) + 1);
    });
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 6);
  }, [filtered]);

  const topCountries = topList("country");
  const devices = topList("device", 5);
  const browsers = topList("browser", 5);

  const deviceIcon = (d: string) =>
    d === "mobile" ? <Smartphone className="w-4 h-4" /> : d === "tablet" ? <Tablet className="w-4 h-4" /> : <Monitor className="w-4 h-4" />;

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Web Analytics</h1>
          <p className="text-sm text-muted-foreground">Track who's visiting your portfolio and builder pages.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Tabs value={scope} onValueChange={(v) => setScope(v as any)}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="builder">Builder</TabsTrigger>
            </TabsList>
          </Tabs>
          <Tabs value={range} onValueChange={setRange}>
            <TabsList>
              {RANGES.map((r) => (
                <TabsTrigger key={r.id} value={r.id}>{r.label}</TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={<Eye className="w-5 h-5" />} label="Total Views" value={totalViews} />
            <StatCard icon={<Users className="w-5 h-5" />} label="Unique Visitors" value={uniqueVisitors} />
            <StatCard
              icon={<TrendingUp className="w-5 h-5" />}
              label="Avg / Day"
              value={Math.round((totalViews / days) * 10) / 10}
            />
            <StatCard icon={<Globe className="w-5 h-5" />} label="Countries" value={new Set(filtered.map((r) => r.country).filter(Boolean)).size} />
          </div>

          {/* Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Traffic over time</CardTitle>
              <CardDescription>Views and unique visitors per day.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="gv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gu" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity={0.15} />
                        <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" opacity={0.08} />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#ffffff80" }} stroke="#ffffff20" />
                    <YAxis tick={{ fontSize: 11, fill: "#ffffff80" }} stroke="#ffffff20" allowDecimals={false} />
                    <Tooltip contentStyle={{ background: "#0a0a0a", border: "1px solid #ffffff20", borderRadius: 8, color: "#fff" }} />
                    <Area type="monotone" dataKey="Views" stroke="#ffffff" fill="url(#gv)" strokeWidth={2} />
                    <Area type="monotone" dataKey="Visitors" stroke="#a3a3a3" fill="url(#gu)" strokeWidth={2} strokeDasharray="4 4" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Grid lists */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ListCard title="Top Pages" empty="No views yet">
              {topPages.map(([path, v]) => (
                <li key={path} className="flex items-center justify-between gap-2 py-2 border-b last:border-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground uppercase">{v.type}</span>
                    <span className="truncate text-sm">{path}</span>
                  </div>
                  <span className="text-sm font-semibold tabular-nums">{v.count}</span>
                </li>
              ))}
            </ListCard>

            <ListCard title="Top Referrers" empty="No referrers yet" icon={<ExternalLink className="w-4 h-4" />}>
              {topReferrers.map(([k, v]) => (
                <Row2 key={k} label={k} value={v} />
              ))}
            </ListCard>

            <ListCard title="Top Countries" empty="No country data yet">
              {topCountries.map(([k, v]) => (
                <Row2 key={k} label={k} value={v} />
              ))}
            </ListCard>

            <ListCard title="Devices" empty="—">
              {devices.map(([k, v]) => (
                <li key={k} className="flex items-center justify-between gap-2 py-2 border-b last:border-0">
                  <div className="flex items-center gap-2">
                    {deviceIcon(k)}
                    <span className="text-sm capitalize">{k}</span>
                  </div>
                  <span className="text-sm font-semibold tabular-nums">{v}</span>
                </li>
              ))}
            </ListCard>

            <ListCard title="Browsers" empty="—">
              {browsers.map(([k, v]) => (
                <Row2 key={k} label={k} value={v} />
              ))}
            </ListCard>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground uppercase tracking-wide">{label}</span>
          <div className="w-8 h-8 rounded-lg border border-border bg-muted/50 text-foreground flex items-center justify-center">{icon}</div>
        </div>
        <p className="text-2xl font-bold tabular-nums">{value.toLocaleString()}</p>
      </CardContent>
    </Card>
  );
}

function ListCard({ title, children, empty, icon }: { title: string; children: React.ReactNode; empty: string; icon?: React.ReactNode }) {
  const arr = Array.isArray(children) ? children : [children];
  const isEmpty = !arr || arr.length === 0 || (arr.length === 1 && !arr[0]);
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">{icon}{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {isEmpty ? <p className="text-sm text-muted-foreground py-6 text-center">{empty}</p> : <ul className="text-sm">{children}</ul>}
      </CardContent>
    </Card>
  );
}

function Row2({ label, value }: { label: string; value: number }) {
  return (
    <li className="flex items-center justify-between gap-2 py-2 border-b last:border-0">
      <span className="truncate text-sm">{label}</span>
      <span className="text-sm font-semibold tabular-nums">{value}</span>
    </li>
  );
}
