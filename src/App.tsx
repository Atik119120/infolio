import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminRoute } from "@/components/AdminRoute";
import SubdomainRouter from "@/components/SubdomainRouter";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import DashboardOverview from "./pages/DashboardOverview";
import PortfolioEdit from "./pages/PortfolioEdit";
import DashboardSettings from "./pages/DashboardSettings";
import PublicPortfolio from "./pages/PublicPortfolio";
import ThemeDemo from "./pages/ThemeDemo";
import ThemeCollection from "./pages/ThemeCollection";
import NotFound from "./pages/NotFound";
import ResetPassword from "./pages/ResetPassword";
import AdminAuth from "./pages/admin/AdminAuth";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminThemes from "./pages/admin/AdminThemes";
import AdminSettings from "./pages/admin/AdminSettings";

const queryClient = new QueryClient();

// Configure your main domain here when you deploy
// Example: "alphazero.online" or "yoursite.com"
// Users will get subdomains like: username.alphazero.online
const MAIN_DOMAIN = "alphazero.online";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <SubdomainRouter mainDomain={MAIN_DOMAIN}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/themes" element={<ThemeCollection />} />
                <Route path="/admin/login" element={<AdminAuth />} />
                <Route path="/u/:username" element={<PublicPortfolio />} />
                <Route path="/demo/:themeName" element={<ThemeDemo />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }>
                  <Route index element={<DashboardOverview />} />
                  <Route path="edit" element={<PortfolioEdit />} />
                  <Route path="settings" element={<DashboardSettings />} />
                </Route>
                {/* Admin Routes */}
                <Route path="/admin" element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }>
                  <Route index element={<AdminOverview />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="themes" element={<AdminThemes />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </SubdomainRouter>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
