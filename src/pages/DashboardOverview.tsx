import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  Eye,
  FileEdit,
  Globe,
  ArrowRight,
  CheckCircle2,
  Circle,
  MessageCircle,
  HardDrive,
  Gauge,
  Crown,
  Layers,
} from "lucide-react";
import { openWhatsApp } from "@/lib/whatsapp";
import { getPortfolioUrl } from "@/lib/portfolioUrl";
import { cn } from "@/lib/utils";
import DynamicWidgets from "@/components/dashboard/DynamicWidgets";

interface Portfolio { is_published: boolean; headline: string | null; bio: string | null; }
interface Profile { username: string; display_name: string | null; avatar_url: string | null; }
interface Stats { skills: number; projects: number; experiences: number; }

export default function DashboardOverview() {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<Stats>({ skills: 0, projects: 0, experiences: 0 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => { if (user) fetchData(); }, [user]);

  const fetchData = async () => {
    if (!user) return;
    const [portfolioRes, profileRes, skillsRes, projectsRes, experiencesRes] = await Promise.all([
      supabase.from("portfolios").select("is_published, headline, bio").eq("user_id", user.id).single(),
      supabase.from("profiles").select("username, display_name, avatar_url").eq("user_id", user.id).single(),
      supabase.from("skills").select("id").eq("user_id", user.id),
      supabase.from("projects").select("id").eq("user_id", user.id),
      supabase.from("experiences").select("id").eq("user_id", user.id),
    ]);
    if (portfolioRes.data) setPortfolio(portfolioRes.data as Portfolio);
    if (profileRes.data) setProfile(profileRes.data);
    setStats({
      skills: skillsRes.data?.length || 0,
      projects: projectsRes.data?.length || 0,
      experiences: experiencesRes.data?.length || 0,
    });
    setLoading(false);
  };

  const togglePublish = async () => {
    if (!user) return;
    setSaving(true);
    const next = !portfolio?.is_published;
    const { error } = await supabase.from("portfolios").update({ is_published: next }).eq("user_id", user.id);
    setSaving(false);
    if (error) toast({ variant: "destructive", title: "Error", description: error.message });
    else { toast({ title: next ? "Portfolio published" : "Portfolio unpublished" }); fetchData(); }
  };

  const getCompletionScore = () => {
    let score = 0;
    if (profile?.display_name) score += 15;
    if (profile?.avatar_url) score += 15;
    if (portfolio?.headline) score += 15;
    if (portfolio?.bio) score += 15;
    if (stats.skills > 0) score += 15;
    if (stats.projects > 0) score += 15;
    if (stats.experiences > 0) score += 10;
    return Math.min(score, 100);
  };

  const completionItems = [
    { label: "Display Name", done: !!profile?.display_name },
    { label: "Profile Photo", done: !!profile?.avatar_url },
    { label: "Headline", done: !!portfolio?.headline },
    { label: "Bio", done: !!portfolio?.bio },
    { label: "Skills", done: stats.skills > 0 },
    { label: "Projects", done: stats.projects > 0 },
    { label: "Experience", done: stats.experiences > 0 },
  ];

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-28 bg-white/5 rounded-lg" />
        <div className="grid md:grid-cols-4 gap-4">
          <div className="h-24 bg-white/5 rounded-lg" />
          <div className="h-24 bg-white/5 rounded-lg" />
          <div className="h-24 bg-white/5 rounded-lg" />
          <div className="h-24 bg-white/5 rounded-lg" />
        </div>
      </div>
    );
  }

  const portfolioUrl = getPortfolioUrl(profile?.username);
  const score = getCompletionScore();

  return (
    <div className="space-y-4 animate-fade-in text-white">
      <DynamicWidgets />
      {/* Welcome */}
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold mb-1 tracking-tight">
              Welcome, {profile?.display_name || "there"}.
            </h1>
            <p className="text-white/50 text-sm">
              {portfolio?.is_published ? "Your portfolio is live." : "Publish your portfolio whenever you're ready."}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-9 bg-transparent border-white/15 text-white hover:bg-white/5 hover:text-white" onClick={() => navigate("/dashboard/edit")}>
              <FileEdit className="w-4 h-4 mr-1.5" /> Edit
            </Button>
            {profile && (
              <Button size="sm" className="h-9 bg-white text-black hover:bg-white/90" onClick={() => window.open(portfolioUrl, "_blank")}>
                <Eye className="w-4 h-4 mr-1.5" /> Preview
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatTile label="Skills" value={stats.skills} />
        <StatTile label="Projects" value={stats.projects} />
        <StatTile label="Experience" value={stats.experiences} />
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
          <p className="text-xs text-white/50">Portfolio</p>
          <div className="mt-2 flex items-center gap-2">
            <span className={cn("text-xs px-2 py-0.5 rounded-full border", portfolio?.is_published ? "border-white/30 text-white" : "border-white/10 text-white/50")}>
              {portfolio?.is_published ? "Live" : "Draft"}
            </span>
            <button disabled={saving} onClick={togglePublish} className="text-xs text-white/70 hover:text-white inline-flex items-center">
              {portfolio?.is_published ? "Unpublish" : "Publish"} <ArrowRight className="w-3 h-3 ml-0.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Completion */}
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium">Completion</p>
          <span className="text-xl font-semibold">{score}%</span>
        </div>
        <div className="h-1 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full bg-white transition-all" style={{ width: `${score}%` }} />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
          {completionItems.map((item) => (
            <div key={item.label} className="flex items-center gap-1.5 text-xs">
              {item.done
                ? <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                : <Circle className="w-3.5 h-3.5 text-white/30" />}
              <span className={item.done ? "text-white/80" : "text-white/40"}>{item.label}</span>
            </div>
          ))}
        </div>
        {score < 100 && (
          <Button className="w-full mt-4 h-9 text-sm bg-white text-black hover:bg-white/90" onClick={() => navigate("/dashboard/edit")}>
            Complete Portfolio <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        )}
      </div>

      {/* Usage */}
      <div className="grid md:grid-cols-3 gap-3">
        <UsageTile icon={<HardDrive className="w-4 h-4" />} label="Storage" used={120} total={500} unit="MB" />
        <UsageTile icon={<Gauge className="w-4 h-4" />} label="Bandwidth" used={2.4} total={10} unit="GB" />
        <UsageTile icon={<Layers className="w-4 h-4" />} label="Projects" used={1} total={1} unit="" />
      </div>

      {/* Plan */}
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-lg border border-white/15 grid place-items-center">
            <Crown className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-sm">You're on the Basic plan</p>
            <p className="text-xs text-white/50">Upgrade for custom domains, GitHub deploys & more.</p>
          </div>
        </div>
        <Button size="sm" className="h-9 bg-white text-black hover:bg-white/90 shrink-0" onClick={() => navigate("/#pricing")}>
          Upgrade <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </Button>
      </div>

      {/* Portfolio URL */}
      {profile && (
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg border border-white/15 grid place-items-center"><Globe className="w-5 h-5 text-white" /></div>
            <div className="min-w-0">
              <p className="font-medium text-sm">Your Portfolio</p>
              <p className="text-xs text-white/50 truncate">{portfolioUrl}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="h-8 text-xs bg-transparent border-white/15 text-white hover:bg-white/5 hover:text-white" onClick={() => navigator.clipboard.writeText(portfolioUrl)}>Copy</Button>
        </div>
      )}

      {/* Support - colorful */}
      <div
        className="rounded-xl p-4 flex items-center justify-between gap-3 border border-emerald-400/30"
        style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.18), rgba(59,130,246,0.18) 60%, rgba(168,85,247,0.18))" }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg grid place-items-center" style={{ background: "linear-gradient(135deg, #25D366, #128C7E)" }}>
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-medium text-sm text-white">Need help?</p>
            <p className="text-xs text-white/70">Chat with us directly on WhatsApp</p>
          </div>
        </div>
        <Button
          className="h-9 text-white border-0 hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #25D366, #128C7E)" }}
          onClick={() => openWhatsApp("Hi! I need help with my Infolio account.")}
        >
          <MessageCircle className="w-4 h-4 mr-1.5" /> WhatsApp
        </Button>
      </div>
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
      <p className="text-xs text-white/50">{label}</p>
      <p className="text-2xl font-semibold mt-2">{value}</p>
    </div>
  );
}

function UsageTile({ icon, label, used, total, unit }: { icon: React.ReactNode; label: string; used: number; total: number; unit: string }) {
  const pct = Math.min(Math.round((used / total) * 100), 100);
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg border border-white/15 grid place-items-center text-white">{icon}</div>
          <span className="text-sm font-medium">{label}</span>
        </div>
        <span className="text-xs text-white/50">{pct}%</span>
      </div>
      <div className="h-1 rounded-full bg-white/10 overflow-hidden">
        <div className="h-full bg-white" style={{ width: `${pct}%` }} />
      </div>
      <p className="text-xs text-white/50">
        <span className="font-semibold text-white">{used}{unit}</span> of {total}{unit} used
      </p>
    </div>
  );
}
