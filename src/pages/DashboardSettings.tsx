import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Globe, Copy, ExternalLink, CheckCircle, Palette, Camera, PenTool, Film, TrendingUp, Code2, Building2, Heart, Sparkles } from "lucide-react";
import { THEME_OPTIONS } from "@/components/portfolio/themes/types";
import CustomDomainManager from "@/components/settings/CustomDomainManager";

interface Profile {
  username: string;
}

interface Portfolio {
  is_published: boolean | null;
  theme: string | null;
}

const themeIcons: Record<string, typeof Camera> = {
  'photographer': Camera,
  'graphic-designer': PenTool,
  'video-editor': Film,
  'digital-marketer': TrendingUp,
  'web-developer': Code2,
  'official': Building2,
  'personal': Heart,
  'cosmic': Sparkles,
};

export default function DashboardSettings() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    const [profileRes, portfolioRes] = await Promise.all([
      supabase.from("profiles").select("username").eq("user_id", user.id).maybeSingle(),
      supabase.from("portfolios").select("is_published, theme").eq("user_id", user.id).maybeSingle(),
    ]);

    if (profileRes.data) setProfile(profileRes.data);
    if (portfolioRes.data) setPortfolio(portfolioRes.data);

    setLoading(false);
  };

  const handleTogglePublish = async () => {
    if (!user) return;

    setSaving(true);

    const { error } = await supabase
      .from("portfolios")
      .update({ is_published: !portfolio?.is_published })
      .eq("user_id", user.id);

    setSaving(false);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update publish status",
      });
    } else {
      toast({
        title: portfolio?.is_published ? "Portfolio Unpublished" : "Portfolio Published",
        description: portfolio?.is_published
          ? "Your portfolio is now private"
          : "Your portfolio is now live!",
      });
      fetchData();
    }
  };

  const handleThemeChange = async (theme: string) => {
    if (!user) return;

    setSaving(true);

    const { error } = await supabase
      .from("portfolios")
      .update({ theme })
      .eq("user_id", user.id);

    setSaving(false);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update theme",
      });
    } else {
      toast({
        title: "Theme Updated",
        description: "Your portfolio theme has been changed",
      });
      fetchData();
    }
  };

  const copyUrl = () => {
    const url = `${window.location.origin}/u/${profile?.username}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Copied!", description: "Portfolio URL copied to clipboard" });
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-48 bg-muted rounded-lg" />
        <div className="h-48 bg-muted rounded-lg" />
      </div>
    );
  }

  const portfolioUrl = `${window.location.origin}/u/${profile?.username}`;
  // Subdomain URL (will work when deployed with custom domain)
  const subdomainUrl = `${profile?.username}.alphaportfolio.com`;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your portfolio settings</p>
      </div>

      {/* Portfolio URL */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Portfolio URL
          </CardTitle>
          <CardDescription>Share this link with others to view your portfolio</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current URL (Path-based) */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Current URL</Label>
            <div className="flex gap-2">
              <Input value={portfolioUrl} readOnly className="font-mono text-sm" />
              <Button variant="outline" onClick={copyUrl}>
                {copied ? (
                  <CheckCircle className="w-4 h-4 text-success" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
              <Button variant="outline" asChild>
                <a href={portfolioUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            </div>
          </div>
          
          {/* Subdomain URL (After Launch) */}
          <div className="space-y-2 pt-2 border-t">
            <Label className="text-xs text-muted-foreground">Your Subdomain (After Launch)</Label>
            <div className="flex items-center gap-2">
              <Input 
                value={subdomainUrl} 
                readOnly 
                className="font-mono text-sm bg-muted/50" 
              />
              <Button 
                variant="outline" 
                onClick={() => {
                  navigator.clipboard.writeText(`https://${subdomainUrl}`);
                  toast({ title: "Copied!", description: "Subdomain URL copied" });
                }}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              এই URL টি লঞ্চের পর কাজ করবে। আপনার portfolio{' '}
              <span className="font-medium text-primary">{profile?.username}.alphaportfolio.com</span> এ অ্যাক্সেস করা যাবে।
            </p>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Your username: <span className="font-medium">{profile?.username}</span>
          </p>
        </CardContent>
      </Card>

      {/* Custom Domains */}
      <CustomDomainManager />

      {/* Theme Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Portfolio Theme
          </CardTitle>
          <CardDescription>Choose a theme that matches your profession</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={portfolio?.theme || 'personal'}
            onValueChange={handleThemeChange}
            className="grid gap-4 md:grid-cols-2"
          >
            {THEME_OPTIONS.map((theme) => {
              const Icon = themeIcons[theme.value] || Heart;
              return (
                <div key={theme.value}>
                  <RadioGroupItem
                    value={theme.value}
                    id={theme.value}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={theme.value}
                    className="flex items-start gap-4 rounded-lg border-2 border-muted bg-card p-4 hover:bg-muted/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{theme.label}</div>
                      <p className="text-sm text-muted-foreground">{theme.description}</p>
                    </div>
                  </Label>
                </div>
              );
            })}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Publish Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Publish Settings</CardTitle>
          <CardDescription>Control who can see your portfolio</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Label htmlFor="publish" className="text-base">
                  Portfolio Published
                </Label>
                <Badge variant={portfolio?.is_published ? "default" : "secondary"}>
                  {portfolio?.is_published ? "Live" : "Draft"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {portfolio?.is_published
                  ? "Your portfolio is visible to everyone"
                  : "Only you can see your portfolio"}
              </p>
            </div>
            <Switch
              id="publish"
              checked={portfolio?.is_published || false}
              onCheckedChange={handleTogglePublish}
              disabled={saving}
            />
          </div>
        </CardContent>
      </Card>

      {/* Account Info */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={user?.email || ""} readOnly disabled />
          </div>
          <p className="text-sm text-muted-foreground">
            Contact support if you need to change your email address.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
