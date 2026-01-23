import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Palette, Globe, TrendingUp, Eye, Clock, CheckCircle, XCircle, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

interface Stats {
  totalUsers: number;
  totalPortfolios: number;
  publishedPortfolios: number;
  totalProjects: number;
  pendingApprovals: number;
  pendingPublish: number;
  customDomains: number;
}

interface RecentUser {
  id: string;
  username: string;
  display_name: string | null;
  email: string | null;
  phone_number: string | null;
  is_approved: boolean;
  created_at: string;
}

export default function AdminOverview() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalPortfolios: 0,
    publishedPortfolios: 0,
    totalProjects: 0,
    pendingApprovals: 0,
    pendingPublish: 0,
    customDomains: 0,
  });
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
    fetchRecentUsers();
  }, []);

  const fetchStats = async () => {
    try {
      const [usersRes, portfoliosRes, publishedRes, projectsRes, pendingRes, pendingPublishRes, domainsRes] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("portfolios").select("id", { count: "exact", head: true }),
        supabase.from("portfolios").select("id", { count: "exact", head: true }).eq("is_published", true),
        supabase.from("projects").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }).eq("is_approved", false),
        supabase.from("portfolios").select("id", { count: "exact", head: true }).eq("pending_publish", true),
        supabase.from("domains").select("id", { count: "exact", head: true }).eq("is_verified", true),
      ]);

      setStats({
        totalUsers: usersRes.count || 0,
        totalPortfolios: portfoliosRes.count || 0,
        publishedPortfolios: publishedRes.count || 0,
        totalProjects: projectsRes.count || 0,
        pendingApprovals: pendingRes.count || 0,
        pendingPublish: pendingPublishRes.count || 0,
        customDomains: domainsRes.count || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentUsers = async () => {
    try {
      const { data } = await supabase
        .from("profiles")
        .select("id, username, display_name, email, phone_number, is_approved, created_at")
        .order("created_at", { ascending: false })
        .limit(5);
      
      setRecentUsers(data || []);
    } catch (error) {
      console.error("Error fetching recent users:", error);
    }
  };

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      description: "Registered users",
    },
    {
      title: "Pending Approval",
      value: stats.pendingApprovals,
      icon: Clock,
      color: "from-yellow-500 to-orange-500",
      description: "Awaiting approval",
      urgent: stats.pendingApprovals > 0,
    },
    {
      title: "Published",
      value: stats.publishedPortfolios,
      icon: Globe,
      color: "from-green-500 to-emerald-500",
      description: "Live portfolios",
    },
    {
      title: "Pending Publish",
      value: stats.pendingPublish,
      icon: Eye,
      color: "from-purple-500 to-pink-500",
      description: "Awaiting publish approval",
      urgent: stats.pendingPublish > 0,
    },
    {
      title: "Custom Domains",
      value: stats.customDomains,
      icon: Globe,
      color: "from-indigo-500 to-violet-500",
      description: "Verified domains",
    },
    {
      title: "Projects",
      value: stats.totalProjects,
      icon: FileText,
      color: "from-rose-500 to-red-500",
      description: "Total projects added",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold">Admin Overview</h2>
        <p className="text-muted-foreground">
          Monitor and manage all aspects of Alpha Portfolio
        </p>
      </div>

      {/* Urgent Actions */}
      {(stats.pendingApprovals > 0 || stats.pendingPublish > 0) && (
        <Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-800 dark:text-yellow-200">Action Required</p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    {stats.pendingApprovals} user(s) pending approval, {stats.pendingPublish} publish request(s)
                  </p>
                </div>
              </div>
              <Button onClick={() => navigate("/admin/users")} variant="outline" className="border-yellow-500 text-yellow-700">
                Review Now
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`overflow-hidden ${stat.urgent ? 'border-yellow-500 ring-2 ring-yellow-500/20' : ''}`}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardDescription>{stat.title}</CardDescription>
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {loading ? "..." : stat.value.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Users */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Recent Users
              </CardTitle>
              <CardDescription>
                Latest registered users
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate("/admin/users")}>
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-bold">
                    {(user.display_name || user.username).charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium">{user.display_name || user.username}</p>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>{user.email}</span>
                      {user.phone_number && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {user.phone_number}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(user.created_at), "MMM d, yyyy")}
                  </span>
                  {user.is_approved ? (
                    <Badge variant="default" className="bg-green-500">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Approved
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-700 dark:text-yellow-400">
                      <Clock className="w-3 h-3 mr-1" />
                      Pending
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Common administrative tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Card 
              className="bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
              onClick={() => navigate("/admin/users")}
            >
              <CardContent className="p-4 flex items-center gap-3">
                <Users className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="font-medium">Manage Users</p>
                  <p className="text-sm text-muted-foreground">Approve & manage users</p>
                </div>
              </CardContent>
            </Card>
            <Card 
              className="bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
              onClick={() => navigate("/admin/themes")}
            >
              <CardContent className="p-4 flex items-center gap-3">
                <Palette className="w-8 h-8 text-purple-500" />
                <div>
                  <p className="font-medium">Theme Settings</p>
                  <p className="text-sm text-muted-foreground">Configure available themes</p>
                </div>
              </CardContent>
            </Card>
            <Card 
              className="bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
              onClick={() => navigate("/admin/settings")}
            >
              <CardContent className="p-4 flex items-center gap-3">
                <Globe className="w-8 h-8 text-green-500" />
                <div>
                  <p className="font-medium">Platform Settings</p>
                  <p className="text-sm text-muted-foreground">Configure platform</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}