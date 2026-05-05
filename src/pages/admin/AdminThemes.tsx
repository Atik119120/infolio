import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Palette, 
  Eye, 
  Camera, 
  TrendingUp, 
  Briefcase, 
  Store,
  BookOpen,
  ExternalLink,
  Clock,
  CheckCircle2,
  XCircle,
  CreditCard,
  Loader2
} from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const themes = [
  { 
    id: "simple", 
    name: "Simple", 
    icon: Star, 
    color: "from-slate-500 to-slate-700",
    description: "Free minimal theme",
    isPremium: false
  },
  { 
    id: "web-developer", 
    name: "Web Developer", 
    icon: Code, 
    color: "from-green-500 to-emerald-600",
    description: "VS Code-inspired terminal aesthetic",
    isPremium: true
  },
  { 
    id: "graphic-designer", 
    name: "Graphic Designer", 
    icon: Palette, 
    color: "from-pink-500 to-rose-600",
    description: "Adobe Creative Suite inspired",
    isPremium: true
  },
  { 
    id: "photographer", 
    name: "Photographer", 
    icon: Camera, 
    color: "from-amber-500 to-orange-600",
    description: "Camera viewfinder frames",
    isPremium: true
  },
  { 
    id: "video-editor", 
    name: "Video Editor", 
    icon: Video, 
    color: "from-purple-500 to-violet-600",
    description: "Premiere Pro timeline style",
    isPremium: true
  },
  { 
    id: "digital-marketer", 
    name: "Digital Marketer", 
    icon: TrendingUp, 
    color: "from-blue-500 to-cyan-600",
    description: "Dashboard metrics aesthetic",
    isPremium: true
  },
  { 
    id: "official", 
    name: "Official", 
    icon: Briefcase, 
    color: "from-slate-600 to-slate-800",
    description: "Apple-style minimalist corporate",
    isPremium: true
  },
  { 
    id: "personal", 
    name: "Personal", 
    icon: Heart, 
    color: "from-rose-400 to-pink-500",
    description: "Story-driven polaroid style",
    isPremium: true
  },
  { 
    id: "cosmic", 
    name: "Cosmic", 
    icon: Sparkles, 
    color: "from-indigo-600 via-purple-600 to-pink-500",
    description: "Luxury space universe theme",
    isPremium: true
  },
];

interface ThemeUsage {
  theme: string;
  count: number;
}

interface PurchaseRequest {
  id: string;
  user_id: string;
  theme_id: string;
  transaction_id: string;
  payment_method: string;
  amount: number;
  status: string;
  created_at: string;
  profile?: {
    display_name: string | null;
    email: string | null;
    username: string;
  };
}

export default function AdminThemes() {
  const [themeUsage, setThemeUsage] = useState<ThemeUsage[]>([]);
  const [purchases, setPurchases] = useState<PurchaseRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchThemeUsage(), fetchPurchases()]);
    setLoading(false);
  };

  const fetchThemeUsage = async () => {
    try {
      const { data, error } = await supabase
        .from("portfolios")
        .select("theme");

      if (error) throw error;

      const usageMap: Record<string, number> = {};
      (data || []).forEach((p) => {
        const theme = p.theme || "simple";
        usageMap[theme] = (usageMap[theme] || 0) + 1;
      });

      const usage = Object.entries(usageMap).map(([theme, count]) => ({
        theme,
        count,
      }));

      setThemeUsage(usage);
    } catch (error) {
      console.error("Error fetching theme usage:", error);
    }
  };

  const fetchPurchases = async () => {
    try {
      const { data: purchasesData, error } = await supabase
        .from("theme_purchases")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch profiles for each purchase
      if (purchasesData && purchasesData.length > 0) {
        const userIds = [...new Set(purchasesData.map(p => p.user_id))];
        const { data: profilesData } = await supabase
          .from("profiles")
          .select("user_id, display_name, email, username")
          .in("user_id", userIds);

        const profilesMap = new Map(profilesData?.map(p => [p.user_id, p]));
        
        const purchasesWithProfiles = purchasesData.map(p => ({
          ...p,
          profile: profilesMap.get(p.user_id)
        }));

        setPurchases(purchasesWithProfiles);
      } else {
        setPurchases([]);
      }
    } catch (error) {
      console.error("Error fetching purchases:", error);
    }
  };

  const handleApprove = async (purchase: PurchaseRequest) => {
    setProcessingId(purchase.id);
    try {
      const { error } = await supabase
        .from("theme_purchases")
        .update({ 
          status: 'approved',
          approved_at: new Date().toISOString()
        })
        .eq("id", purchase.id);

      if (error) throw error;

      toast({
        title: "Purchase Approved",
        description: `${purchase.profile?.display_name || 'User'} can now use the ${getThemeName(purchase.theme_id)} theme.`,
      });

      fetchPurchases();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (purchase: PurchaseRequest) => {
    setProcessingId(purchase.id);
    try {
      const { error } = await supabase
        .from("theme_purchases")
        .update({ 
          status: 'rejected',
          rejected_reason: 'Payment verification failed'
        })
        .eq("id", purchase.id);

      if (error) throw error;

      toast({
        title: "Purchase Rejected",
        description: "The purchase request has been rejected.",
      });

      fetchPurchases();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setProcessingId(null);
    }
  };

  const getThemeCount = (themeId: string) => {
    return themeUsage.find((t) => t.theme === themeId)?.count || 0;
  };

  const getThemeName = (themeId: string) => {
    return themes.find(t => t.id === themeId)?.name || themeId;
  };

  const getThemeColor = (themeId: string) => {
    return themes.find(t => t.id === themeId)?.color || 'from-gray-500 to-gray-700';
  };

  const pendingPurchases = purchases.filter(p => p.status === 'pending');
  const approvedPurchases = purchases.filter(p => p.status === 'approved');
  const rejectedPurchases = purchases.filter(p => p.status === 'rejected');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white">Theme Management</h2>
        <p className="text-slate-400">
          Manage themes and purchase requests
        </p>
      </div>

      <Tabs defaultValue="purchases" className="space-y-6">
        <TabsList className="bg-slate-800/50">
          <TabsTrigger value="purchases" className="data-[state=active]:bg-orange-500">
            <CreditCard className="w-4 h-4 mr-2" />
            Purchase Requests
            {pendingPurchases.length > 0 && (
              <Badge className="ml-2 bg-red-500 text-white">{pendingPurchases.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="themes" className="data-[state=active]:bg-orange-500">
            <Palette className="w-4 h-4 mr-2" />
            All Themes
          </TabsTrigger>
          <TabsTrigger value="stats" className="data-[state=active]:bg-orange-500">
            <TrendingUp className="w-4 h-4 mr-2" />
            Statistics
          </TabsTrigger>
        </TabsList>

        {/* Purchase Requests Tab */}
        <TabsContent value="purchases" className="space-y-6">
          {/* Pending Purchases */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Clock className="w-5 h-5 text-amber-500" />
                Pending Approvals
              </CardTitle>
              <CardDescription className="text-slate-400">
                Review and approve theme purchase requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingPurchases.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  No pending purchase requests
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingPurchases.map((purchase) => (
                    <motion.div
                      key={purchase.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getThemeColor(purchase.theme_id)} flex items-center justify-center`}>
                          <Palette className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-white">{getThemeName(purchase.theme_id)}</h4>
                            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                              ৳{purchase.amount}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-400">
                            {purchase.profile?.display_name || purchase.profile?.username} • {purchase.profile?.email}
                          </p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                            <span className="uppercase font-medium">{purchase.payment_method}</span>
                            <span>TXN: {purchase.transaction_id}</span>
                            <span>{format(new Date(purchase.created_at), 'MMM dd, yyyy HH:mm')}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                          onClick={() => handleReject(purchase)}
                          disabled={processingId === purchase.id}
                        >
                          {processingId === purchase.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <XCircle className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleApprove(purchase)}
                          disabled={processingId === purchase.id}
                        >
                          {processingId === purchase.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <CheckCircle2 className="w-4 h-4 mr-1" />
                              Approve
                            </>
                          )}
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Approved */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                Recent Approvals
              </CardTitle>
            </CardHeader>
            <CardContent>
              {approvedPurchases.length === 0 ? (
                <div className="text-center py-4 text-slate-500">No approved purchases yet</div>
              ) : (
                <div className="space-y-2">
                  {approvedPurchases.slice(0, 10).map((purchase) => (
                    <div
                      key={purchase.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-green-500/5 border border-green-500/20"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded bg-gradient-to-br ${getThemeColor(purchase.theme_id)} flex items-center justify-center`}>
                          <Palette className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <span className="font-medium text-white">{getThemeName(purchase.theme_id)}</span>
                          <span className="text-slate-400 mx-2">•</span>
                          <span className="text-sm text-slate-400">{purchase.profile?.display_name || purchase.profile?.email}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <span>৳{purchase.amount}</span>
                        <Badge variant="outline" className="border-green-500/30 text-green-400">Approved</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* All Themes Tab */}
        <TabsContent value="themes">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {themes.map((theme, index) => (
              <motion.div
                key={theme.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="overflow-hidden group hover:shadow-lg transition-shadow bg-slate-900/50 border-slate-800">
                  <div className={`h-24 bg-gradient-to-br ${theme.color} relative`}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <theme.icon className="w-12 h-12 text-white/80" />
                    </div>
                    <div className="absolute top-2 right-2">
                      {theme.isPremium ? (
                        <Badge className="bg-amber-500 text-white">৳200</Badge>
                      ) : (
                        <Badge className="bg-green-500 text-white">Free</Badge>
                      )}
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-white">{theme.name}</CardTitle>
                      <Badge variant="secondary" className="bg-slate-800 text-slate-300">
                        {loading ? "..." : getThemeCount(theme.id)} users
                      </Badge>
                    </div>
                    <CardDescription className="text-sm text-slate-400">
                      {theme.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-slate-700 text-slate-300 hover:bg-slate-800"
                      onClick={() => window.open(`/demo/${theme.id}`, "_blank")}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                      <ExternalLink className="w-3 h-3 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Statistics Tab */}
        <TabsContent value="stats">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Theme Popularity</CardTitle>
              <CardDescription className="text-slate-400">
                Distribution of themes across all portfolios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {themes.map((theme) => {
                  const count = getThemeCount(theme.id);
                  const total = themeUsage.reduce((sum, t) => sum + t.count, 0);
                  const percentage = total > 0 ? (count / total) * 100 : 0;

                  return (
                    <div key={theme.id} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${theme.color}`} />
                          <span className="text-white">{theme.name}</span>
                          {!theme.isPremium && (
                            <Badge variant="outline" className="text-[10px] border-green-500/30 text-green-400">Free</Badge>
                          )}
                        </div>
                        <span className="text-slate-400">
                          {count} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full bg-gradient-to-r ${theme.color}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ delay: 0.3, duration: 0.5 }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Revenue Stats */}
          <Card className="bg-slate-900/50 border-slate-800 mt-6">
            <CardHeader>
              <CardTitle className="text-white">Revenue Overview</CardTitle>
              <CardDescription className="text-slate-400">
                Theme purchase statistics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-center">
                  <div className="text-2xl font-bold text-green-400">
                    ৳{approvedPurchases.reduce((sum, p) => sum + p.amount, 0)}
                  </div>
                  <p className="text-sm text-slate-400">Total Revenue</p>
                </div>
                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    {approvedPurchases.length}
                  </div>
                  <p className="text-sm text-slate-400">Approved</p>
                </div>
                <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 text-center">
                  <div className="text-2xl font-bold text-amber-400">
                    {pendingPurchases.length}
                  </div>
                  <p className="text-sm text-slate-400">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}