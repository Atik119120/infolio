import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Palette, Globe, TrendingUp, Eye } from "lucide-react";
import { motion } from "framer-motion";

interface Stats {
  totalUsers: number;
  totalPortfolios: number;
  publishedPortfolios: number;
  totalProjects: number;
}

export default function AdminOverview() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalPortfolios: 0,
    publishedPortfolios: 0,
    totalProjects: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [usersRes, portfoliosRes, publishedRes, projectsRes] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("portfolios").select("id", { count: "exact", head: true }),
        supabase.from("portfolios").select("id", { count: "exact", head: true }).eq("is_published", true),
        supabase.from("projects").select("id", { count: "exact", head: true }),
      ]);

      setStats({
        totalUsers: usersRes.count || 0,
        totalPortfolios: portfoliosRes.count || 0,
        publishedPortfolios: publishedRes.count || 0,
        totalProjects: projectsRes.count || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
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
      title: "Total Portfolios",
      value: stats.totalPortfolios,
      icon: FileText,
      color: "from-purple-500 to-pink-500",
      description: "Created portfolios",
    },
    {
      title: "Published",
      value: stats.publishedPortfolios,
      icon: Globe,
      color: "from-green-500 to-emerald-500",
      description: "Live portfolios",
    },
    {
      title: "Projects",
      value: stats.totalProjects,
      icon: Eye,
      color: "from-orange-500 to-red-500",
      description: "Total projects added",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold">Admin Overview</h2>
        <p className="text-muted-foreground">
          Monitor and manage all aspects of PortfolioHub
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden">
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
            <Card className="bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
              <CardContent className="p-4 flex items-center gap-3">
                <Users className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="font-medium">Manage Users</p>
                  <p className="text-sm text-muted-foreground">View and manage all users</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
              <CardContent className="p-4 flex items-center gap-3">
                <Palette className="w-8 h-8 text-purple-500" />
                <div>
                  <p className="font-medium">Theme Settings</p>
                  <p className="text-sm text-muted-foreground">Configure available themes</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
              <CardContent className="p-4 flex items-center gap-3">
                <Globe className="w-8 h-8 text-green-500" />
                <div>
                  <p className="font-medium">View Analytics</p>
                  <p className="text-sm text-muted-foreground">Platform statistics</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
