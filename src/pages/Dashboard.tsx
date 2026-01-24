import { useState, useEffect } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ThemeToggle";
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
    { icon: Settings, label: "Settings", path: "/dashboard/settings" },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Bold & Colorful */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-card via-card to-primary/5 border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center shadow-glow">
                <img src={alphaLogo} alt="Alpha Portfolio" className="w-6 h-6 object-contain invert" />
              </div>
              <span className="text-lg font-bold gradient-text">Alpha</span>
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

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1">
            {navItems.map((item) => {
              const isActive = item.hash 
                ? false // Profile link goes to edit page with hash
                : location.pathname === item.path || 
                  (item.path === "/dashboard" && location.pathname === "/dashboard");
              
              return (
                <Button
                  key={item.label}
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-2.5 h-10 text-sm font-medium transition-all",
                    isActive && "bg-gradient-to-r from-primary/20 to-accent/10 text-primary border-l-2 border-primary shadow-sm"
                  )}
                  onClick={() => {
                    if (item.hash) {
                      navigate(item.path);
                      // Trigger tab change
                      setTimeout(() => {
                        const event = new CustomEvent('switchTab', { detail: item.hash });
                        window.dispatchEvent(event);
                      }, 100);
                    } else {
                      navigate(item.path);
                    }
                    setSidebarOpen(false);
                  }}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Button>
              );
            })}
          </nav>

          {/* View Portfolio Link */}
          {profile && (
            <div className="p-3 border-t">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2 h-9 text-sm bg-gradient-to-r from-primary/5 to-secondary/5 hover:from-primary/10 hover:to-secondary/10 border-primary/20"
                onClick={() => window.open(`/u/${profile.username}`, "_blank")}
              >
                <Eye className="w-4 h-4 text-primary" />
                View Portfolio
                <ExternalLink className="w-3 h-3 ml-auto opacity-50" />
              </Button>
            </div>
          )}

          {/* User Profile */}
          <div className="p-3 border-t bg-gradient-to-r from-muted/50 to-transparent">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start gap-2.5 h-12 px-2">
                  <Avatar className="w-8 h-8 ring-2 ring-primary/20">
                    <AvatarImage src={profile?.avatar_url || undefined} />
                    <AvatarFallback className="gradient-primary text-white text-sm">
                      {profile?.display_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left min-w-0">
                    <p className="font-medium text-sm truncate">
                      {profile?.display_name || "User"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user?.email}
                    </p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-52">
                <DropdownMenuLabel className="text-xs">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/dashboard/settings")} className="text-sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive text-sm">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar - Compact */}
        <header className="h-14 border-b bg-card/80 backdrop-blur-md flex items-center justify-between px-4 sticky top-0 z-30">
          <Button 
            variant="ghost" 
            size="icon"
            className="lg:hidden h-8 w-8"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-4 h-4" />
          </Button>
          
          <div className="hidden lg:block">
            <h1 className="text-lg font-semibold">
              {navItems.find(item => 
                !item.hash && (location.pathname === item.path || 
                (item.path === "/dashboard" && location.pathname === "/dashboard"))
              )?.label || "Dashboard"}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {profile && (
              <Button
                size="sm"
                className="hidden sm:flex gap-1.5 h-8 text-xs gradient-primary shadow-glow"
                onClick={() => window.open(`/u/${profile.username}`, "_blank")}
              >
                <Eye className="w-3.5 h-3.5" />
                Preview
              </Button>
            )}
          </div>
        </header>

        {/* Page Content - Reduced padding */}
        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}