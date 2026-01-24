import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Shield, Bell, Database, Globe, HardDrive, Key, Loader2, Eye, EyeOff } from "lucide-react";
import WildcardDomainInstructions from "@/components/settings/WildcardDomainInstructions";
import StorageAnalytics from "@/components/admin/StorageAnalytics";
import { CleanupHistory } from "@/components/admin/CleanupHistory";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function AdminSettings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("সব ফিল্ড পূরণ করুন");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("নতুন পাসওয়ার্ড মিলছে না");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে");
      return;
    }

    setIsChangingPassword(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error: any) {
      toast.error("পাসওয়ার্ড পরিবর্তন করতে সমস্যা হয়েছে");
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Admin Settings</h2>
        <p className="text-muted-foreground">
          Configure platform-wide settings
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="storage" className="flex items-center gap-2">
            <HardDrive className="w-4 h-4" />
            Storage
          </TabsTrigger>
          <TabsTrigger value="domains" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Domains
          </TabsTrigger>
        </TabsList>

        {/* General Settings Tab */}
        <TabsContent value="general" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* General Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  General Settings
                </CardTitle>
                <CardDescription>
                  Basic platform configuration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow New Registrations</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable new user sign-ups
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Temporarily disable access
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security
                </CardTitle>
                <CardDescription>
                  Security and access controls
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Verification</Label>
                    <p className="text-sm text-muted-foreground">
                      Require email confirmation
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Auth</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable 2FA for admins
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            {/* Password Change */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  পাসওয়ার্ড পরিবর্তন করুন
                </CardTitle>
                <CardDescription>
                  আপনার অ্যাডমিন অ্যাকাউন্টের পাসওয়ার্ড পরিবর্তন করুন
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">বর্তমান পাসওয়ার্ড</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="বর্তমান পাসওয়ার্ড"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">নতুন পাসওয়ার্ড</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="নতুন পাসওয়ার্ড"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">পাসওয়ার্ড নিশ্চিত করুন</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="পাসওয়ার্ড নিশ্চিত করুন"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={handleChangePassword} 
                  disabled={isChangingPassword}
                  className="w-full md:w-auto"
                >
                  {isChangingPassword ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      পরিবর্তন হচ্ছে...
                    </>
                  ) : (
                    <>
                      <Key className="w-4 h-4 mr-2" />
                      পাসওয়ার্ড পরিবর্তন করুন
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notifications
                </CardTitle>
                <CardDescription>
                  Admin notification preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>New User Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified of new sign-ups
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Security Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Get security notifications
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            {/* Data Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Data Management
                </CardTitle>
                <CardDescription>
                  Database and storage settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full">
                  <Database className="w-4 h-4 mr-2" />
                  Export All Data
                </Button>
                <Button variant="outline" className="w-full">
                  <Globe className="w-4 h-4 mr-2" />
                  Clear Cache
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Storage Tab */}
        <TabsContent value="storage" className="space-y-6">
          <StorageAnalytics />
          <CleanupHistory />
        </TabsContent>

        {/* Domains Tab */}
        <TabsContent value="domains">
          <WildcardDomainInstructions />
        </TabsContent>
      </Tabs>
    </div>
  );
}
