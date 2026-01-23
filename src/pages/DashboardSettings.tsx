import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Globe, Copy, ExternalLink, CheckCircle } from "lucide-react";

interface Profile {
  username: string;
}

interface Portfolio {
  is_published: boolean | null;
}

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
      supabase.from("portfolios").select("is_published").eq("user_id", user.id).maybeSingle(),
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
          <p className="text-sm text-muted-foreground">
            Your username: <span className="font-medium">{profile?.username}</span>
          </p>
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