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

import { THEME_OPTIONS } from "@/components/portfolio/themes/types";

const THEME_ICONS: Record<string, any> = {
  "freelancer": Briefcase,
  "creative-sidebar-pro": Palette,
  "dark-photographer": Camera,
  "creative-canvas": BookOpen,
};

const THEME_COLORS: Record<string, string> = {
  "freelancer": "from-blue-500 to-indigo-600",
  "creative-sidebar-pro": "from-yellow-500 to-orange-600",
  "dark-photographer": "from-gray-700 to-black",
  "creative-canvas": "from-orange-500 to-pink-600",
};

const themes = THEME_OPTIONS.map((t) => ({
  id: t.value,
  name: t.label,
  icon: THEME_ICONS[t.value] || Palette,
  color: THEME_COLORS[t.value] || "from-gray-500 to-gray-700",
  description: t.description,
  isPremium: t.isPremium,
}));

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

      <Tabs defaultValue="themes" className="space-y-6">
        <TabsList className="bg-slate-800/50">
          <TabsTrigger value="themes" className="data-[state=active]:bg-orange-500">
            <Palette className="w-4 h-4 mr-2" />
            All Themes
          </TabsTrigger>
          <TabsTrigger value="stats" className="data-[state=active]:bg-orange-500">
            <TrendingUp className="w-4 h-4 mr-2" />
            Statistics
          </TabsTrigger>
        </TabsList>

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