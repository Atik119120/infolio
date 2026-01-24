import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Clock, CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { THEME_OPTIONS } from "@/components/portfolio/themes/types";

interface Purchase {
  id: string;
  theme_id: string;
  status: string;
  amount: number;
  created_at: string;
}

const getThemeName = (themeId: string) => {
  const theme = THEME_OPTIONS.find(t => t.value === themeId);
  return theme?.label || themeId;
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'pending':
      return <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30 text-xs"><Clock className="w-2.5 h-2.5 mr-0.5" /> Pending</Badge>;
    case 'approved':
      return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-xs"><CheckCircle className="w-2.5 h-2.5 mr-0.5" /> Approved</Badge>;
    case 'rejected':
      return <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/30 text-xs"><XCircle className="w-2.5 h-2.5 mr-0.5" /> Rejected</Badge>;
    default:
      return <Badge variant="outline" className="text-xs">{status}</Badge>;
  }
};

export default function RecentPurchasesWidget() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchRecentPurchases();
    }
  }, [user]);

  const fetchRecentPurchases = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("theme_purchases")
        .select("id, theme_id, status, amount, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) throw error;
      setPurchases(data || []);
    } catch (error) {
      console.error("Error fetching purchases:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('bn-BD', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-muted rounded w-1/3" />
            <div className="h-12 bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-card to-violet-500/5 border-violet-500/10">
      <CardHeader className="pb-2 pt-4 px-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-violet-500" />
            Recent Purchases
          </CardTitle>
          {purchases.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 text-xs text-violet-600 dark:text-violet-400"
              onClick={() => navigate("/dashboard/purchases")}
            >
              View All
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        {purchases.length === 0 ? (
          <div className="text-center py-4">
            <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">No purchases yet</p>
            <Button 
              variant="link" 
              size="sm" 
              className="mt-1 text-xs"
              onClick={() => navigate("/dashboard/edit")}
            >
              Browse Premium Themes
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {purchases.map((purchase) => (
              <div
                key={purchase.id}
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">{getThemeName(purchase.theme_id)}</p>
                    {getStatusBadge(purchase.status)}
                  </div>
                  <p className="text-xs text-muted-foreground">{formatDate(purchase.created_at)}</p>
                </div>
                <p className="text-sm font-semibold text-violet-600 dark:text-violet-400">৳{purchase.amount}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
