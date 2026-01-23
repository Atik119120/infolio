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
} from "lucide-react";

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
      supabase.from("portfolios").select("is_published, headline, bio").eq("user_id", user.id).single(),
      supabase.from("profiles").select("username, display_name, avatar_url").eq("user_id", user.id).single(),
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
    if (!user) return;
    
    await supabase
      .from("portfolios")
      .update({ is_published: !portfolio?.is_published })
      .eq("user_id", user.id);
    
    fetchData();
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-32 bg-muted rounded-lg" />
        <div className="grid md:grid-cols-3 gap-6">
          <div className="h-40 bg-muted rounded-lg" />
          <div className="h-40 bg-muted rounded-lg" />
          <div className="h-40 bg-muted rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Banner */}
      <Card className="gradient-hero text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-black/10" />
        <CardContent className="p-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {profile?.display_name || "there"}! 👋
              </h1>
              <p className="text-white/80">
                {portfolio?.is_published 
                  ? "Your portfolio is live and looking great!"
                  : "Let's complete your portfolio and publish it to the world!"}
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                className="bg-white/20 hover:bg-white/30 text-white border-0"
                onClick={() => navigate("/dashboard/edit")}
              >
                <FileEdit className="w-4 h-4 mr-2" />
                Edit Portfolio
              </Button>
              {profile && (
                <Button
                  className="bg-white text-primary hover:bg-white/90"
                  onClick={() => window.open(`/u/${profile.username}`, "_blank")}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Live
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Skills Added
            </CardTitle>
            <Sparkles className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.skills}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Showcase your expertise
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Projects Added
            </CardTitle>
            <FileEdit className="w-5 h-5 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.projects}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Display your best work
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Portfolio Status
            </CardTitle>
            <Globe className="w-5 h-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge 
                variant={portfolio?.is_published ? "default" : "secondary"}
                className={portfolio?.is_published ? "bg-success" : ""}
              >
                {portfolio?.is_published ? "Published" : "Draft"}
              </Badge>
            </div>
            <Button 
              variant="link" 
              className="px-0 mt-2 h-auto text-sm"
              onClick={togglePublish}
            >
              {portfolio?.is_published ? "Unpublish" : "Publish Now"}
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Completion Progress */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Portfolio Completion</CardTitle>
            <span className="text-2xl font-bold text-primary">{getCompletionScore()}%</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={getCompletionScore()} className="h-3" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {completionItems.map((item) => (
              <div 
                key={item.label} 
                className="flex items-center gap-2 text-sm"
              >
                {item.done ? (
                  <CheckCircle2 className="w-4 h-4 text-success" />
                ) : (
                  <Circle className="w-4 h-4 text-muted-foreground" />
                )}
                <span className={item.done ? "text-foreground" : "text-muted-foreground"}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
          {getCompletionScore() < 100 && (
            <Button 
              className="w-full mt-4 gradient-primary"
              onClick={() => navigate("/dashboard/edit")}
            >
              Complete Your Portfolio
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Quick Link */}
      {profile && (
        <Card className="border-dashed">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-medium">Your Portfolio URL</p>
                <p className="text-sm text-muted-foreground">
                  {window.location.origin}/u/{profile.username}
                </p>
              </div>
            </div>
            <Button 
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/u/${profile.username}`);
              }}
            >
              Copy Link
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}