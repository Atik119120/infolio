import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  FileEdit,
  Globe,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Circle,
  Clock,
  Shield,
} from "lucide-react";
import RecentPurchasesWidget from "@/components/dashboard/RecentPurchasesWidget";
import SupportMessageDialog from "@/components/dashboard/SupportMessageDialog";

interface Portfolio {
  is_published: boolean;
  headline: string | null;
  bio: string | null;
  pending_publish: boolean | null;
}

interface Profile {
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  is_approved: boolean | null;
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
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    const [portfolioRes, profileRes, skillsRes, projectsRes, experiencesRes] = await Promise.all([
      supabase.from("portfolios").select("is_published, headline, bio, pending_publish").eq("user_id", user.id).single(),
      supabase.from("profiles").select("username, display_name, avatar_url, is_approved").eq("user_id", user.id).single(),
      supabase.from("skills").select("id").eq("user_id", user.id),
      supabase.from("projects").select("id").eq("user_id", user.id),
      supabase.from("experiences").select("id").eq("user_id", user.id),
    ]);

    if (portfolioRes.data) setPortfolio(portfolioRes.data);
    if (profileRes.data) setProfile(profileRes.data);
    
    setStats({
      skills: skillsRes.data?.length || 0,
      projects: projectsRes.data?.length || 0,
      experiences: experiencesRes.data?.length || 0,
    });

    setLoading(false);
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

  const togglePublish = async () => {
    if (!user || !profile?.is_approved) {
      navigate("/dashboard/settings");
      return;
    }
    
    await supabase
      .from("portfolios")
      .update({ is_published: !portfolio?.is_published })
      .eq("user_id", user.id);
    
    fetchData();
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-28 bg-muted rounded-lg" />
        <div className="grid md:grid-cols-4 gap-4">
          <div className="h-32 bg-muted rounded-lg" />
          <div className="h-32 bg-muted rounded-lg" />
          <div className="h-32 bg-muted rounded-lg" />
          <div className="h-32 bg-muted rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Account Status Alert - Compact */}
      {!profile?.is_approved && (
        <Card className="border-amber-500/50 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-amber-800 dark:text-amber-200">Pending Approval</p>
                <p className="text-xs text-amber-700 dark:text-amber-300 truncate">
                  Build your portfolio while we review your account
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate("/dashboard/settings")}
                className="border-amber-500 text-amber-700 dark:text-amber-300 h-8 text-xs"
              >
                Status
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Welcome Banner - Compact & Bold */}
      <Card className="gradient-hero text-white overflow-hidden relative shadow-glow">
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent" />
        <CardContent className="p-5 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-1">
                Welcome, {profile?.display_name || "there"}! 👋
              </h1>
              <p className="text-white/80 text-sm">
                {!profile?.is_approved 
                  ? "Build your portfolio while we review your account"
                  : portfolio?.is_published 
                    ? "Your portfolio is live!"
                    : "Complete and publish your portfolio"}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-0 h-9"
                onClick={() => navigate("/dashboard/edit")}
              >
                <FileEdit className="w-4 h-4 mr-1.5" />
                Edit
              </Button>
              {profile && (
                <Button
                  size="sm"
                  className="bg-white text-primary hover:bg-white/90 h-9"
                  onClick={() => window.open(`/u/${profile.username}`, "_blank")}
                >
                  <Eye className="w-4 h-4 mr-1.5" />
                  Preview
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid - Compact */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Account Status */}
        <Card className="bg-gradient-to-br from-card to-primary/5 border-primary/10">
          <CardHeader className="flex flex-row items-center justify-between pb-1 pt-3 px-3">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Status
            </CardTitle>
            <Shield className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <div className="flex items-center gap-1.5">
              {profile?.is_approved ? (
                <Badge variant="default" className="bg-green-500 text-xs h-5">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Approved
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-amber-500/20 text-amber-700 dark:text-amber-400 text-xs h-5">
                  <Clock className="w-3 h-3 mr-1" />
                  Pending
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-secondary/5 border-secondary/10">
          <CardHeader className="flex flex-row items-center justify-between pb-1 pt-3 px-3">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Skills
            </CardTitle>
            <Sparkles className="w-4 h-4 text-secondary" />
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <div className="text-2xl font-bold">{stats.skills}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-accent/5 border-accent/10">
          <CardHeader className="flex flex-row items-center justify-between pb-1 pt-3 px-3">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Projects
            </CardTitle>
            <FileEdit className="w-4 h-4 text-accent" />
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <div className="text-2xl font-bold">{stats.projects}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-success/5 border-success/10">
          <CardHeader className="flex flex-row items-center justify-between pb-1 pt-3 px-3">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Portfolio
            </CardTitle>
            <Globe className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <div className="flex items-center gap-1.5">
              {portfolio?.is_published ? (
                <Badge variant="default" className="bg-green-500 text-xs h-5">
                  Live
                </Badge>
              ) : portfolio?.pending_publish ? (
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-700 text-xs h-5">
                  Pending
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-xs h-5">Draft</Badge>
              )}
            </div>
            <Button 
              variant="link" 
              className="px-0 mt-1 h-auto text-xs"
              onClick={togglePublish}
            >
              {!profile?.is_approved 
                ? "Request" 
                : portfolio?.is_published 
                  ? "Unpublish" 
                  : "Publish"}
              <ArrowRight className="w-3 h-3 ml-0.5" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Completion Progress - Compact */}
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
              <div 
                key={item.label} 
                className="flex items-center gap-1.5 text-xs"
              >
                {item.done ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                ) : (
                  <Circle className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                )}
                <span className={item.done ? "text-foreground" : "text-muted-foreground"}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
          {getCompletionScore() < 100 && (
            <Button 
              className="w-full mt-2 gradient-primary h-9 text-sm"
              onClick={() => navigate("/dashboard/edit")}
            >
              Complete Portfolio
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Recent Purchases & Support Section */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Recent Purchases Widget */}
        <RecentPurchasesWidget />

        {/* Support Message */}
        <SupportMessageDialog />
      </div>

      {/* Quick Link - Compact */}
      {profile && (
        <Card className="border-dashed border-primary/30 bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardContent className="p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="font-medium text-sm">Your Portfolio</p>
                <p className="text-xs text-muted-foreground truncate">
                  {window.location.origin}/u/{profile.username}
                </p>
              </div>
            </div>
            <Button 
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/u/${profile.username}`);
              }}
            >
              Copy
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}