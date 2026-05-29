import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminRoute } from "@/components/AdminRoute";
import SubdomainRouter from "@/components/SubdomainRouter";
import { Loader2 } from "lucide-react";

// Eagerly load landing & auth for fast first paint
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

// Lazy-load everything else to shrink the initial bundle
const Dashboard = lazy(() => import("./pages/Dashboard"));
const DashboardOverview = lazy(() => import("./pages/DashboardOverview"));
const PortfolioEdit = lazy(() => import("./pages/PortfolioEdit"));
const DashboardSettings = lazy(() => import("./pages/DashboardSettings"));
const DashboardPurchases = lazy(() => import("./pages/DashboardPurchases"));
const DashboardDomainStatus = lazy(() => import("./pages/DashboardDomainStatus"));
const DashboardBuyDomain = lazy(() => import("./pages/DashboardBuyDomain"));
const DashboardDeploy = lazy(() => import("./pages/DashboardDeploy"));
const DashboardAnalytics = lazy(() => import("./pages/DashboardAnalytics"));
const PublicPortfolio = lazy(() => import("./pages/PublicPortfolio"));
const ThemeDemo = lazy(() => import("./pages/ThemeDemo"));
const ThemeCollection = lazy(() => import("./pages/ThemeCollection"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const AdminAuth = lazy(() => import("./pages/admin/AdminAuth"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminOverview = lazy(() => import("./pages/admin/AdminOverview"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminThemes = lazy(() => import("./pages/admin/AdminThemes"));
const AdminCustomThemes = lazy(() => import("./pages/admin/AdminCustomThemes"));
const AdminPlans = lazy(() => import("./pages/admin/AdminPlans"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const AdminSiteSettings = lazy(() => import("./pages/admin/AdminSiteSettings"));
const BuilderList = lazy(() => import("./pages/BuilderList"));
const BuilderEditor = lazy(() => import("./pages/BuilderEditor"));
const PublicBuilderPage = lazy(() => import("./pages/PublicBuilderPage"));
const CustomizeTheme = lazy(() => import("./pages/CustomizeTheme"));
const Features = lazy(() => import("./pages/Features"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Faq = lazy(() => import("./pages/Faq"));
const BuyDomain = lazy(() => import("./pages/BuyDomain"));
const DashboardMyDomains = lazy(() => import("./pages/DashboardMyDomains"));
const AdminRegistrarDomains = lazy(() => import("./pages/admin/AdminRegistrarDomains"));
const AdminRegistrarPricing = lazy(() => import("./pages/admin/AdminRegistrarPricing"));
const AdminRegistrarProviders = lazy(() => import("./pages/admin/AdminRegistrarProviders"));
const AdminRegistrarLogs = lazy(() => import("./pages/admin/AdminRegistrarLogs"));

const queryClient = new QueryClient();

const MAIN_DOMAIN = "infolio.online";

const RouteFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SubdomainRouter mainDomain={MAIN_DOMAIN}>
            <Suspense fallback={<RouteFallback />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/themes" element={<ThemeCollection />} />
                <Route path="/features" element={<Features />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/faq" element={<Faq />} />
                <Route path="/buy-domain" element={<BuyDomain />} />
                <Route path="/admin/login" element={<AdminAuth />} />
                <Route path="/demo/:themeName" element={<ThemeDemo />} />
                <Route path="/u/:username" element={<PublicPortfolio />} />
                {/* Public SEO alias: infolio.online/@username */}
                <Route path="/@:username" element={<PublicPortfolio />} />
                <Route path="/p/:slug" element={<PublicBuilderPage />} />
                <Route path="/customize/:themeId" element={
                  <ProtectedRoute>
                    <CustomizeTheme />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/builder/:id" element={
                  <ProtectedRoute>
                    <BuilderEditor />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }>
                  <Route index element={<DashboardOverview />} />
                  <Route path="edit" element={<PortfolioEdit />} />
                  <Route path="builder" element={<BuilderList />} />
                  <Route path="purchases" element={<DashboardPurchases />} />
                  <Route path="settings" element={<DashboardSettings />} />
                  <Route path="domain-status" element={<DashboardDomainStatus />} />
                  <Route path="buy-domain" element={<DashboardBuyDomain />} />
                  <Route path="deploy" element={<DashboardDeploy />} />
                  <Route path="analytics" element={<DashboardAnalytics />} />
                </Route>
                <Route path="/admin" element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }>
                  <Route index element={<AdminOverview />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="themes" element={<AdminThemes />} />
                  <Route path="custom-themes" element={<AdminCustomThemes />} />
                  <Route path="plans" element={<AdminPlans />} />
                  <Route path="settings" element={<AdminSettings />} />
                  <Route path="site-settings" element={<AdminSiteSettings />} />
                </Route>
                {/* Public portfolio at root: /:username (must be LAST) */}
                <Route path="/:username" element={<PublicPortfolio />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </SubdomainRouter>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
