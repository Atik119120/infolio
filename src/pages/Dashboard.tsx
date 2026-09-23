import { useState, useEffect } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useSiteFeatures } from "@/hooks/useSiteFeatures";
import { usePermissions } from "@/lib/permissions";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { openWhatsApp } from "@/lib/whatsapp";
import { MessageCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  FileEdit,
  Settings,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Eye,
  User,
  Sparkles,
  ChevronRight,
  Zap,
  ShoppingBag,
  Globe2,
  Rocket,
  Wand2,
  BarChart3,
  Palette,
  Sun,
  Moon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import alphaLogo from "@/assets/alpha-portfolio-logo.png";

interface Profile {
  username: string;
  display_name: string | null;
  avatar_url: string | null;
}

export default function Dashboard() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { features } = useSiteFeatures();

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  // Force pure black background while in the dashboard
  useEffect(() => {
    const prevHtml = document.documentElement.style.backgroundColor;
    const prevBody = document.body.style.backgroundColor;
    document.documentElement.style.backgroundColor = "#000";
    document.body.style.backgroundColor = "#000";
    return () => {
      document.documentElement.style.backgroundColor = prevHtml;
      document.body.style.backgroundColor = prevBody;
    };
  }, []);

  const fetchProfile = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from("profiles")
      .select("username, display_name, avatar_url")
      .eq("user_id", user.id)
      .single();
    
    if (data) {
      setProfile(data);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const allNavItems: { icon: typeof LayoutDashboard; label: string; path: string; hash?: string }[] = [
    { icon: LayoutDashboard, label: "Overview", path: "/dashboard" },
    { icon: Palette, label: "Themes", path: "/dashboard/themes" },
    { icon: FileEdit, label: "Edit Portfolio", path: "/dashboard/edit" },
    { icon: Wand2, label: "Page Builder", path: "/dashboard/builder" },
    { icon: BarChart3, label: "Analytics", path: "/dashboard/analytics" },
    { icon: Globe2, label: "Domain Status", path: "/dashboard/domain-status" },
    { icon: Rocket, label: "Deploy", path: "/dashboard/deploy" },
    { icon: Settings, label: "Settings", path: "/dashboard/settings" },
  ];

  const { can } = usePermissions();
  const { theme } = useTheme();
  const navItems = allNavItems.filter((item) => {
    if (item.label === "Page Builder" && !features.builder_enabled) return false;
    if (item.label === "Deploy" && !can("dev_features")) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Fixed Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-200 ease-out",
        "lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo Header */}
          <div className="px-5 py-6 border-b border-border">
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1 flex justify-center">
                <img
                  src={alphaLogo}
                  alt="Infolio"
                  className={cn("h-10 w-auto object-contain", theme === "dark" && "brightness-0 invert")}
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted shrink-0"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <p className="mt-2 text-center text-[10px] text-muted-foreground uppercase tracking-[0.25em]">Dashboard</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
            <p className="px-3 py-2 text-[10px] font-medium text-muted-foreground uppercase tracking-[0.2em]">
              Menu
            </p>
            {navItems.map((item) => {
              const isActive = item.hash
                ? false
                : location.pathname === item.path ||
                  (item.path === "/dashboard" && location.pathname === "/dashboard");

              return (
                <button
                  key={item.label}
                  onClick={() => {
                    if (item.hash) {
                      navigate(item.path);
                      setTimeout(() => {
                        const event = new CustomEvent('switchTab', { detail: item.hash });
                        window.dispatchEvent(event);
                      }, 100);
                    } else {
                      navigate(item.path);
                    }
                    setSidebarOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground font-medium shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <item.icon className="w-4 h-4" strokeWidth={1.75} />
                  <span className="flex-1 text-left">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* View Portfolio Link */}
          {profile && (
            <div className="px-3 pb-3 space-y-1.5">
              <button
                onClick={() => window.open(`/${profile.username}`, "_blank")}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-foreground/80 hover:text-foreground hover:bg-muted transition-colors border border-border"
              >
                <Eye className="w-4 h-4" strokeWidth={1.75} />
                <span className="flex-1 text-left">View Portfolio</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-50" />
              </button>
              <button
                onClick={() => openWhatsApp("Hi! I need help with my Infolio account.")}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-foreground/80 hover:text-foreground hover:bg-muted transition-colors"
              >
                <MessageCircle className="w-4 h-4" strokeWidth={1.75} />
                <span className="flex-1 text-left">Support</span>
              </button>
            </div>
          )}

          {/* User Profile */}
          <div className="p-3 border-t border-border">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-muted transition-colors">
                  <Avatar className="w-8 h-8 ring-1 ring-border">
                    <AvatarImage src={profile?.avatar_url || undefined} />
                    <AvatarFallback className="bg-muted text-foreground text-xs font-medium">
                      {profile?.display_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {profile?.display_name || "User"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user?.email}
                    </p>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 bg-popover border-border text-popover-foreground">
                <DropdownMenuLabel className="text-muted-foreground text-xs">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem onClick={() => navigate("/dashboard/settings")} className="text-sm focus:bg-muted">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem onClick={handleSignOut} className="text-sm focus:bg-muted text-destructive focus:text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>

      {/* Main Content - Scrollable */}
      <div className="lg:pl-64 min-h-screen flex flex-col">
        {/* Top Bar - Fixed */}
        <header className="sticky top-0 z-30 h-14 bg-card/80 backdrop-blur border-b border-border flex items-center justify-between px-5">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>

            <img
              src={alphaLogo}
              alt="Infolio"
              className={cn("h-7 w-auto object-contain lg:hidden", theme === "dark" && "brightness-0 invert")}
            />

            <h1 className="hidden lg:block text-sm font-medium text-foreground tracking-tight">
              {navItems.find(item =>
                !item.hash && (location.pathname === item.path ||
                (item.path === "/dashboard" && location.pathname === "/dashboard"))
              )?.label || "Dashboard"}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {profile && (
              <Button
                size="sm"
                onClick={() => window.open(`/${profile.username}`, "_blank")}
                className="flex gap-1.5 h-8 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Preview</span>
              </Button>
            )}
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="dashboard-bw flex-1 p-4 lg:p-8 overflow-y-auto bg-background">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

