import {
  LayoutDashboard, User, FileEdit, Image as ImageIcon, FileText, Star,
  Layers, Wand2, Palette, Search, Globe2, Rocket, BarChart3, Settings,
  Package, ShoppingBag, Store, Users, Tag, Truck, CreditCard, Plug,
  GitBranch, Code2, Boxes, Sparkles, Activity, Crown
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Workspace } from "@/hooks/useWorkspace";

export interface NavLeaf {
  icon: LucideIcon;
  label: string;
  path: string;
  badge?: string;
  hash?: string;
}

export interface NavGroup {
  label: string;
  icon: LucideIcon;
  items: NavLeaf[];
}

export type NavEntry = NavLeaf | NavGroup;

export function isGroup(e: NavEntry): e is NavGroup {
  return (e as NavGroup).items !== undefined;
}

export function buildSidebar(w: Workspace): NavEntry[] {
  const { features, engine } = w;
  const nav: NavEntry[] = [];

  nav.push({ icon: LayoutDashboard, label: "Overview", path: "/dashboard" });

  // Profile group (separate from Portfolio)
  nav.push({
    label: "Profile",
    icon: User,
    items: [
      { icon: User, label: "Personal Info", path: "/dashboard/edit", hash: "basic" },
      { icon: Sparkles, label: "Social Links", path: "/dashboard/edit", hash: "social" },
      { icon: Settings, label: "Account", path: "/dashboard/settings" },
    ],
  });

  // Portfolio group
  nav.push({
    label: "Portfolio",
    icon: Layers,
    items: [
      { icon: FileEdit, label: "Edit Portfolio", path: "/dashboard/edit", hash: "theme" },
      { icon: Boxes, label: "Customize", path: "/dashboard/edit", hash: "customize" },
      { icon: FileText, label: "Experience", path: "/dashboard/edit", hash: "experience" },
      { icon: ImageIcon, label: "Projects", path: "/dashboard/edit", hash: "projects" },
      { icon: Star, label: "Skills", path: "/dashboard/edit", hash: "skills" },
    ],
  });

  // Builder always accessible (regardless of active engine)
  nav.push({ icon: Wand2, label: "Page Builder", path: "/dashboard/builder" });
  if (engine === "react" && features.reactProjects) {
    nav.push({ icon: Code2, label: "React Projects", path: "/dashboard/builder" });
  }
  if (features.githubIntegration) {
    nav.push({ icon: GitBranch, label: "GitHub", path: "/dashboard/integrations" });
  }

  // Themes
  nav.push({ icon: Palette, label: "Themes", path: "/themes" });

  // Engine switcher (always present so users can switch)
  nav.push({ icon: Crown, label: "Website Engine", path: "/dashboard/engine" });


  // SEO
  nav.push({ icon: Search, label: "SEO", path: "/dashboard/seo" });

  // Site Settings (branding/header-footer/custom code)
  nav.push({ icon: Palette, label: "Site Settings", path: "/dashboard/site" });

  // Domains
  nav.push({ icon: Globe2, label: "Domains", path: "/dashboard/domain-status" });

  // Deployments
  nav.push({ icon: Rocket, label: "Deployments", path: "/dashboard/deploy" });

  // Analytics
  if (features.analytics) {
    nav.push({ icon: BarChart3, label: "Analytics", path: "/dashboard/analytics" });
  }

  // Integrations
  nav.push({ icon: Plug, label: "Integrations", path: "/dashboard/integrations" });

  // Activity
  nav.push({ icon: Activity, label: "Activity", path: "/dashboard/purchases" });

  // Settings
  nav.push({ icon: Settings, label: "Settings", path: "/dashboard/settings" });

  return nav;
}
