import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  Loader2, 
  Globe, 
  Copy, 
  ExternalLink, 
  CheckCircle, 
  Palette, 
  Camera, 
  PenTool, 
  Film, 
  TrendingUp, 
  Code2, 
  Building2, 
  Heart, 
  Sparkles,
  Clock,
  Send,
  MessageSquare,
  AlertCircle,
  Shield,
  LogOut,
  Trash2
} from "lucide-react";
import { THEME_OPTIONS } from "@/components/portfolio/themes/types";
import CustomDomainManager from "@/components/settings/CustomDomainManager";
import BrandingToggleForm from "@/components/settings/BrandingToggleForm";
import { PlanCard } from "@/components/billing/PlanCard";
import { ProGate } from "@/components/billing/ProGate";
import { SeoSettingsCard } from "@/components/settings/SeoSettingsCard";
import { getPortfolioUrl } from "@/lib/portfolioUrl";

interface Profile {
  username: string;
  is_approved: boolean | null;
  approved_at: string | null;
  phone_number: string | null;
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
  const [supportMessage, setSupportMessage] = useState("");
  const [sendingSupport, setSendingSupport] = useState(false);
  const [requestingPublish, setRequestingPublish] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    const [profileRes, portfolioRes] = await Promise.all([
      supabase.from("profiles").select("username, is_approved, approved_at, phone_number").eq("user_id", user.id).maybeSingle(),
      supabase.from("portfolios").select("is_published, theme").eq("user_id", user.id).maybeSingle(),
    ]);

    if (profileRes.data) setProfile(profileRes.data);
    if (portfolioRes.data) setPortfolio(portfolioRes.data as Portfolio);

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
      toast({ variant: "destructive", title: "Error", description: "Failed to update publish status" });
    } else {
      toast({
        title: portfolio?.is_published ? "Portfolio Unpublished" : "Portfolio Published",
        description: portfolio?.is_published ? "Your portfolio is now private" : "Your portfolio is now live!",
      });
      fetchData();
    }
  };

  const handleRequestPublish = async () => {
    // Auto-publish enabled — kept as no-op for backward compatibility
    return;
  };

  const handleSendSupport = async () => {
    if (!user || !profile || !supportMessage.trim()) return;

    setSendingSupport(true);

    try {
      await supabase.functions.invoke("send-notification", {
        body: {
          type: "support",
          userEmail: user.email,
          userName: profile.username,
          message: supportMessage,
        },
      });

      toast({
        title: "Support Message Sent",
        description: "We've received your message and will get back to you soon.",
      });

      setSupportMessage("");
    } catch (error) {
      console.error("Error sending support:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send support message",
      });
    } finally {
      setSendingSupport(false);
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
    const url = getPortfolioUrl(profile?.username);
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Copied!", description: "Portfolio URL copied to clipboard" });
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    setDeletingAccount(true);
    try {
      // Delete all user data via edge function
      const { data, error } = await supabase.functions.invoke("admin-manage-user", {
        body: { action: "delete_user", targetUserId: user.id },
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      // Sign out after deletion
      await signOut();

      toast({
        title: "Account Deleted",
        description: "Your account and all data has been permanently deleted.",
      });

      navigate("/");
    } catch (error) {
      console.error("Error deleting account:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete account. Please contact support.",
      });
    } finally {
      setDeletingAccount(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-48 bg-muted rounded-lg" />
        <div className="h-48 bg-muted rounded-lg" />
      </div>
    );
  }

  const portfolioUrl = getPortfolioUrl(profile?.username);
  const subdomainUrl = `${profile?.username}.infolio.online`;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your portfolio settings</p>
      </div>

      {/* Account Status Card */}
      <Card className={profile?.is_approved ? "border-green-500/50" : "border-yellow-500/50"}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Account Status
          </CardTitle>
          <CardDescription>Your account approval status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {profile?.is_approved ? (
                <>
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-green-700 dark:text-green-400">Account Approved</p>
                    <p className="text-sm text-muted-foreground">
                      You can now publish your portfolio
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium text-yellow-700 dark:text-yellow-400">Pending Approval</p>
                    <p className="text-sm text-muted-foreground">
                      Admin will review your account soon. You'll receive an email once approved.
                    </p>
                  </div>
                </>
              )}
            </div>
            <Badge variant={profile?.is_approved ? "default" : "secondary"} className={profile?.is_approved ? "bg-green-500" : "bg-yellow-500/20 text-yellow-700"}>
              {profile?.is_approved ? "Approved" : "Pending"}
            </Badge>
          </div>
        </CardContent>
      </Card>

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
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Current URL</Label>
            <div className="flex gap-2">
              <Input value={portfolioUrl} readOnly className="font-mono text-sm" />
              <Button variant="outline" onClick={copyUrl}>
                {copied ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
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
          
          <p className="text-sm text-muted-foreground">
            Your username: <span className="font-medium">{profile?.username}</span>
          </p>
        </CardContent>
      </Card>

      {/* Plan */}
      <PlanCard />

      {/* Branding toggle (Starter/Creator only) */}
      <BrandingToggleForm />

      {/* Custom Domains — Creator plan */}
      <ProGate
        title="Custom Domain"
        description="Connect your own domain (e.g. yourname.com) to your portfolio."
        feature="custom_domain"
      >
        <CustomDomainManager />
      </ProGate>

      {/* SEO — Pro only */}
      <SeoSettingsCard />

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
        <CardContent className="space-y-4">
          {profile?.is_approved ? (
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
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-800 dark:text-yellow-200">Account Approval Required</p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Your account needs admin approval before you can publish your portfolio.
                  </p>
                </div>
              </div>
              
              {false ? (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-800 dark:text-blue-200">Publish Request Pending</p>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Your publish request is under review. You'll receive an email once approved.
                    </p>
                  </div>
                </div>
              ) : (
                <Button 
                  onClick={handleRequestPublish}
                  disabled={requestingPublish}
                  className="w-full"
                >
                  {requestingPublish ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending Request...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Request to Publish
                    </>
                  )}
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Support - colorful */}
      <Card
        className="border-emerald-400/30 text-white"
        style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.18), rgba(59,130,246,0.18) 60%, rgba(168,85,247,0.18))" }}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <span className="w-8 h-8 rounded-lg grid place-items-center" style={{ background: "linear-gradient(135deg, #25D366, #128C7E)" }}>
              <MessageSquare className="w-4 h-4 text-white" />
            </span>
            Need Help?
          </CardTitle>
          <CardDescription className="text-white/70">
            Having issues or questions? Send us a message and we'll get back to you.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Describe your issue or question here..."
            value={supportMessage}
            onChange={(e) => setSupportMessage(e.target.value)}
            rows={4}
            className="bg-black/30 border-white/20 text-white placeholder:text-white/40"
          />
          <Button
            onClick={handleSendSupport}
            disabled={sendingSupport || !supportMessage.trim()}
            className="w-full text-white border-0 hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #6366f1, #a855f7, #ec4899)" }}
          >
            {sendingSupport ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Support Message
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Account Info */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={user?.email || ""} readOnly disabled />
            </div>
            {profile?.phone_number && (
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input value={profile.phone_number} readOnly disabled />
              </div>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Contact support if you need to change your account details.
          </p>
        </CardContent>
      </Card>

      {/* Logout & Account Actions */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            Irreversible actions for your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex-1"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="flex-1">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                    <Trash2 className="w-5 h-5" />
                    Delete Your Account?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete your account and all associated data:
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Your profile and portfolio</li>
                      <li>All projects, skills, and experiences</li>
                      <li>Uploaded images and files</li>
                      <li>Custom domains and settings</li>
                    </ul>
                    <p className="mt-3 font-medium text-destructive">This action cannot be undone!</p>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    disabled={deletingAccount}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {deletingAccount ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete My Account
                      </>
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <p className="text-xs text-muted-foreground">
            Deleting your account will remove all your data from our servers permanently.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}