import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingBag, Clock, CheckCircle, XCircle, Palette, CreditCard } from "lucide-react";
import { THEME_OPTIONS } from "@/components/portfolio/themes/types";

interface Purchase {
  id: string;
  theme_id: string;
  transaction_id: string;
  payment_method: string;
  amount: number;
  status: string;
  created_at: string;
  approved_at: string | null;
  rejected_reason: string | null;
}

const getThemeName = (themeId: string) => {
  const theme = THEME_OPTIONS.find(t => t.value === themeId);
  return theme?.label || themeId;
};

const getPaymentMethodLabel = (method: string) => {
  switch (method) {
    case 'bkash': return 'bKash';
    case 'nagad': return 'Nagad';
    case 'rocket': return 'Rocket';
    default: return method;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'pending':
      return <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
    case 'approved':
      return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30"><CheckCircle className="w-3 h-3 mr-1" /> Approved</Badge>;
    case 'rejected':
      return <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/30"><XCircle className="w-3 h-3 mr-1" /> Rejected</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default function DashboardPurchases() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchPurchases();
    }
  }, [user]);

  const fetchPurchases = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("theme_purchases")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPurchases(data || []);
    } catch (error) {
      console.error("Error fetching purchases:", error);
    } finally {
      setLoading(false);
    }
  };

  const pendingPurchases = purchases.filter(p => p.status === 'pending');
  const approvedPurchases = purchases.filter(p => p.status === 'approved');
  const rejectedPurchases = purchases.filter(p => p.status === 'rejected');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-violet-500" />
          My Purchases
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          আপনার সব থিম কেনার রেকর্ড দেখুন
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/20 border-amber-200 dark:border-amber-800/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-600 dark:text-amber-400">Pending</p>
                <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">{pendingPurchases.length}</p>
              </div>
              <Clock className="w-8 h-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/20 border-emerald-200 dark:border-emerald-800/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-600 dark:text-emerald-400">Approved</p>
                <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{approvedPurchases.length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-violet-50 to-violet-100/50 dark:from-violet-950/30 dark:to-violet-900/20 border-violet-200 dark:border-violet-800/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-violet-600 dark:text-violet-400">Total Spent</p>
                <p className="text-2xl font-bold text-violet-700 dark:text-violet-300">
                  ৳{approvedPurchases.reduce((sum, p) => sum + p.amount, 0)}
                </p>
              </div>
              <CreditCard className="w-8 h-8 text-violet-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Purchases List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-violet-500" />
            Purchase History
          </CardTitle>
          <CardDescription>আপনার থিম কেনার সব রেকর্ড</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-4">
              <TabsTrigger value="all">All ({purchases.length})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({pendingPurchases.length})</TabsTrigger>
              <TabsTrigger value="approved">Approved ({approvedPurchases.length})</TabsTrigger>
              <TabsTrigger value="rejected">Rejected ({rejectedPurchases.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <PurchaseList purchases={purchases} formatDate={formatDate} />
            </TabsContent>
            <TabsContent value="pending">
              <PurchaseList purchases={pendingPurchases} formatDate={formatDate} />
            </TabsContent>
            <TabsContent value="approved">
              <PurchaseList purchases={approvedPurchases} formatDate={formatDate} />
            </TabsContent>
            <TabsContent value="rejected">
              <PurchaseList purchases={rejectedPurchases} formatDate={formatDate} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function PurchaseList({ purchases, formatDate }: { purchases: Purchase[], formatDate: (date: string) => string }) {
  if (purchases.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500 dark:text-slate-400">
        <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" />
        <p>কোনো পারচেজ নেই</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {purchases.map((purchase) => (
        <div
          key={purchase.id}
          className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  {getThemeName(purchase.theme_id)}
                </h3>
                {getStatusBadge(purchase.status)}
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400 space-y-1">
                <p>
                  <span className="font-medium">Transaction ID:</span> {purchase.transaction_id}
                </p>
                <p>
                  <span className="font-medium">Payment:</span> {getPaymentMethodLabel(purchase.payment_method)}
                </p>
                <p>
                  <span className="font-medium">Date:</span> {formatDate(purchase.created_at)}
                </p>
                {purchase.status === 'rejected' && purchase.rejected_reason && (
                  <p className="text-red-500">
                    <span className="font-medium">Reason:</span> {purchase.rejected_reason}
                  </p>
                )}
                {purchase.status === 'approved' && purchase.approved_at && (
                  <p className="text-emerald-600 dark:text-emerald-400">
                    <span className="font-medium">Approved:</span> {formatDate(purchase.approved_at)}
                  </p>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-violet-600 dark:text-violet-400">
                ৳{purchase.amount}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
