import { useState, useEffect } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
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

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

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

  const navItems = [
    { icon: LayoutDashboard, label: "Overview", path: "/dashboard" },
    { icon: User, label: "Profile", path: "/dashboard/edit", hash: "basic" },
    { icon: FileEdit, label: "Edit Portfolio", path: "/dashboard/edit" },
    { icon: Globe2, label: "Domain Status", path: "/dashboard/domain-status" },
    { icon: Settings, label: "Settings", path: "/dashboard/settings" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Fixed Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-r border-slate-200 dark:border-slate-800/50 transform transition-transform duration-300 ease-out",
        "lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo Header */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-purple-500/25">
                    <img src={alphaLogo} alt="Alpha" className="h-6 w-auto object-contain" />
                  </div>
                </div>
                <div>
                  <h1 className="font-bold text-slate-900 dark:text-white tracking-tight">Alpha</h1>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">Portfolio</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="lg:hidden h-8 w-8"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            <p className="px-3 py-2 text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
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
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive 
                      ? "bg-gradient-to-r from-violet-500/15 to-fuchsia-500/10 text-violet-600 dark:text-violet-400 shadow-sm" 
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50"
                  )}
                >
                  <item.icon className={cn(
                    "w-4 h-4",
                    isActive && "text-violet-500"
                  )} />
                  <span className="flex-1 text-left">{item.label}</span>
                  {isActive && (
                    <ChevronRight className="w-4 h-4 text-violet-500" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* View Portfolio Link */}
          {profile && (
            <div className="px-3 pb-2">
              <button
                onClick={() => window.open(`/${profile.username}`, "_blank")}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-200"
              >
                <Eye className="w-4 h-4" />
                <span className="flex-1 text-left">View Portfolio</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-75" />
              </button>
              <button
                onClick={() => openWhatsApp("Hi! I need help with my Infolio account.")}
                className="mt-2 w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium bg-[#25D366] text-white hover:bg-[#1fbb59] transition-all duration-200"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="flex-1 text-left">WhatsApp Support</span>
              </button>
            </div>
          )}

          {/* User Profile */}
          <div className="p-3 border-t border-slate-200 dark:border-slate-800/50">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors">
                  <Avatar className="w-9 h-9 ring-2 ring-violet-500/30">
                    <AvatarImage src={profile?.avatar_url || undefined} />
                    <AvatarFallback className="bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white text-sm font-medium">
                      {profile?.display_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                      {profile?.display_name || "User"}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {user?.email}
                    </p>
                  </div>
                  <Zap className="w-4 h-4 text-violet-500" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel className="text-slate-500 text-xs">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/dashboard/settings")} className="text-sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-red-500 text-sm">
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
        <header className="sticky top-0 z-30 h-14 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800/50 flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon"
              className="lg:hidden h-8 w-8"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            
            <div className="hidden lg:flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-500" />
              <h1 className="text-sm font-semibold text-slate-900 dark:text-white">
                {navItems.find(item => 
                  !item.hash && (location.pathname === item.path || 
                  (item.path === "/dashboard" && location.pathname === "/dashboard"))
                )?.label || "Dashboard"}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {profile && (
              <Button
                size="sm"
                onClick={() => window.open(`/${profile.username}`, "_blank")}
                className="hidden sm:flex gap-1.5 h-8 text-xs bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white shadow-md shadow-violet-500/20"
              >
                <Eye className="w-3.5 h-3.5" />
                Preview
              </Button>
            )}
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
