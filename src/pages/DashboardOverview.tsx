import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  Eye,
  FileEdit,
  Globe,
  Sparkles,
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

interface Portfolio {
  is_published: boolean;
  headline: string | null;
  bio: string | null;
}

interface Profile {
  username: string;
  display_name: string | null;
  avatar_url: string | null;
}

interface Stats {
  skills: number;
  projects: number;
  experiences: number;
}

export default function DashboardOverview() {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<Stats>({ skills: 0, projects: 0, experiences: 0 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

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
    const { error } = await supabase
      .from("portfolios")
      .update({ is_published: next })
      .eq("user_id", user.id);
    setSaving(false);
    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      toast({ title: next ? "Portfolio published" : "Portfolio unpublished" });
      fetchData();
    }
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
        <div className="h-28 bg-muted rounded-lg" />
        <div className="grid md:grid-cols-4 gap-4">
          <div className="h-32 bg-muted rounded-lg" />
          <div className="h-32 bg-muted rounded-lg" />
          <div className="h-32 bg-muted rounded-lg" />
        </div>
      </div>
    );
  }

  const portfolioUrl = getPortfolioUrl(profile?.username);

  return (
    <div className="space-y-4 animate-fade-in">
      <Card className="gradient-hero text-white overflow-hidden relative shadow-glow">
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent" />
        <CardContent className="p-5 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-1">
                Welcome, {profile?.display_name || "there"}! 👋
              </h1>
              <p className="text-white/80 text-sm">
                {portfolio?.is_published ? "Your portfolio is live!" : "Publish your portfolio whenever you're ready."}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-0 h-9" onClick={() => navigate("/dashboard/edit")}>
                <FileEdit className="w-4 h-4 mr-1.5" />
                Edit
              </Button>
              {profile && (
                <Button size="sm" className="bg-white text-primary hover:bg-white/90 h-9" onClick={() => window.open(portfolioUrl, "_blank")}>
                  <Eye className="w-4 h-4 mr-1.5" />
                  Preview
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardHeader className="pb-1 pt-3 px-3 flex-row items-center justify-between">
            <CardTitle className="text-xs font-medium text-muted-foreground">Skills</CardTitle>
            <Sparkles className="w-4 h-4 text-secondary" />
          </CardHeader>
          <CardContent className="px-3 pb-3"><div className="text-2xl font-bold">{stats.skills}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1 pt-3 px-3 flex-row items-center justify-between">
            <CardTitle className="text-xs font-medium text-muted-foreground">Projects</CardTitle>
            <FileEdit className="w-4 h-4 text-accent" />
          </CardHeader>
          <CardContent className="px-3 pb-3"><div className="text-2xl font-bold">{stats.projects}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1 pt-3 px-3 flex-row items-center justify-between">
            <CardTitle className="text-xs font-medium text-muted-foreground">Experience</CardTitle>
            <FileEdit className="w-4 h-4 text-accent" />
          </CardHeader>
          <CardContent className="px-3 pb-3"><div className="text-2xl font-bold">{stats.experiences}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1 pt-3 px-3 flex-row items-center justify-between">
            <CardTitle className="text-xs font-medium text-muted-foreground">Portfolio</CardTitle>
            <Globe className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <Badge variant={portfolio?.is_published ? "default" : "secondary"} className={portfolio?.is_published ? "bg-green-500 text-xs h-5" : "text-xs h-5"}>
              {portfolio?.is_published ? "Live" : "Draft"}
            </Badge>
            <Button variant="link" className="px-0 mt-1 h-auto text-xs" disabled={saving} onClick={togglePublish}>
              {portfolio?.is_published ? "Unpublish" : "Publish"}
              <ArrowRight className="w-3 h-3 ml-0.5" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2 pt-4 px-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Completion</CardTitle>
            <span className="text-xl font-bold gradient-text">{getCompletionScore()}%</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 px-4 pb-4">
          <Progress value={getCompletionScore()} className="h-2" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {completionItems.map((item) => (
              <div key={item.label} className="flex items-center gap-1.5 text-xs">
                {item.done ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> : <Circle className="w-3.5 h-3.5 text-muted-foreground" />}
                <span className={item.done ? "text-foreground" : "text-muted-foreground"}>{item.label}</span>
              </div>
            ))}
          </div>
          {getCompletionScore() < 100 && (
            <Button className="w-full mt-2 gradient-primary h-9 text-sm" onClick={() => navigate("/dashboard/edit")}>
              Complete Portfolio <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          )}
        </CardContent>
      </Card>

      {/* USAGE & PLAN */}
      <div className="grid md:grid-cols-3 gap-3">
        <UsageTile icon={<HardDrive className="w-4 h-4" />} label="Storage" used={120} total={500} unit="MB" tone="primary" />
        <UsageTile icon={<Gauge className="w-4 h-4" />} label="Bandwidth" used={2.4} total={10} unit="GB" tone="secondary" />
        <UsageTile icon={<Layers className="w-4 h-4" />} label="Projects" used={1} total={1} unit="" tone="accent" />
      </div>

      <Card className="border-primary/30 bg-gradient-to-r from-primary/8 via-card to-card">
        <CardContent className="p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl gradient-primary grid place-items-center shadow-md shadow-primary/30">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm">You're on the Basic plan</p>
              <p className="text-xs text-muted-foreground">Upgrade for custom domains, GitHub deploys & more.</p>
            </div>
          </div>
          <Button size="sm" className="gradient-primary text-white h-9 shrink-0" onClick={() => navigate("/#pricing")}>
            Upgrade <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </CardContent>
      </Card>


      {profile && (
        <Card className="border-dashed border-primary/30 bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardContent className="p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center"><Globe className="w-5 h-5 text-white" /></div>
              <div className="min-w-0">
                <p className="font-medium text-sm">Your Portfolio</p>
                <p className="text-xs text-muted-foreground truncate">{portfolioUrl}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => navigator.clipboard.writeText(portfolioUrl)}>Copy</Button>
          </CardContent>
        </Card>
      )}

      <Card className="border-[#25D366]/40 bg-[#25D366]/5">
        <CardContent className="p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center"><MessageCircle className="w-5 h-5 text-white" /></div>
            <div>
              <p className="font-medium text-sm">Need help?</p>
              <p className="text-xs text-muted-foreground">Chat with us directly on WhatsApp</p>
            </div>
          </div>
          <Button className="bg-[#25D366] hover:bg-[#1fbb59] text-white h-9" onClick={() => openWhatsApp("Hi! I need help with my Infolio account.")}>
            <MessageCircle className="w-4 h-4 mr-1.5" /> WhatsApp
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function UsageTile({ icon, label, used, total, unit, tone }: { icon: React.ReactNode; label: string; used: number; total: number; unit: string; tone: "primary" | "secondary" | "accent" }) {
  const pct = Math.min(Math.round((used / total) * 100), 100);
  const tones = {
    primary: "bg-primary/15 text-primary",
    secondary: "bg-secondary/15 text-secondary",
    accent: "bg-accent/15 text-accent",
  } as const;
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg grid place-items-center ${tones[tone]}`}>{icon}</div>
            <span className="text-sm font-medium">{label}</span>
          </div>
          <span className="text-xs text-muted-foreground">{pct}%</span>
        </div>
        <Progress value={pct} className="h-1.5" />
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">{used}{unit}</span> of {total}{unit} used
        </p>
      </CardContent>
    </Card>
  );
}
