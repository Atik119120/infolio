import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Check, Sparkles } from "lucide-react";
import { usePlan } from "@/hooks/usePlan";
import { useAuth } from "@/contexts/AuthContext";
import { PlanPurchaseDialog } from "./PlanPurchaseDialog";

export function PlanCard() {
  const { plan, isPro, expiresAt, storageLimitBytes, loading } = usePlan();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  if (loading) return null;

  return (
    <>
      <Card className={isPro ? "border-amber-400/50 bg-gradient-to-br from-amber-50/50 to-orange-50/30 dark:from-amber-950/10 dark:to-orange-950/10" : ""}>
        <CardHeader>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <CardTitle className="flex items-center gap-2">
                {isPro ? <Crown className="w-5 h-5 text-amber-500 fill-amber-500" /> : <Sparkles className="w-5 h-5" />}
                {isPro ? "Pro Plan" : "Free Plan"}
                <Badge variant={isPro ? "default" : "secondary"} className={isPro ? "bg-amber-500 hover:bg-amber-500" : ""}>
                  {isPro ? "Active" : "Free"}
                </Badge>
              </CardTitle>
              <CardDescription className="mt-1">
                {isPro
                  ? `Pro until ${expiresAt ? new Date(expiresAt).toLocaleDateString() : "—"}`
                  : "Upgrade to unlock custom domain, SEO tools, and more storage."}
              </CardDescription>
            </div>
            {!isPro && (
              <Button onClick={() => setOpen(true)} className="rounded-full">
                <Crown className="w-4 h-4 mr-2" /> Upgrade — ৳200/year
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-2 text-sm">
            <Feature ok>Storage: {Math.round(storageLimitBytes / 1024 / 1024)} MB</Feature>
            <Feature ok>Subdomain (username.alphazero.online)</Feature>
            <Feature ok={isPro}>Custom domain</Feature>
            <Feature ok={isPro}>SEO meta tag editor</Feature>
            <Feature ok={isPro}>Google Search Console</Feature>
            <Feature ok={isPro}>Auto sitemap</Feature>
            <Feature ok={isPro}>Advanced editor & layout</Feature>
            <Feature ok>Ad-free</Feature>
          </div>
        </CardContent>
      </Card>

      {user && <PlanPurchaseDialog open={open} onOpenChange={setOpen} userId={user.id} />}
    </>
  );
}

function Feature({ children, ok }: { children: React.ReactNode; ok: boolean }) {
  return (
    <div className={`flex items-center gap-2 ${ok ? "" : "text-muted-foreground/60"}`}>
      <Check className={`w-4 h-4 shrink-0 ${ok ? "text-primary" : "text-muted-foreground/40"}`} />
      <span>{children}</span>
    </div>
  );
}
