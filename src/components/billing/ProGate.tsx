import { useState, ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Lock } from "lucide-react";
import { usePlan } from "@/hooks/usePlan";
import { useAuth } from "@/contexts/AuthContext";
import { PlanPurchaseDialog } from "./PlanPurchaseDialog";

interface ProGateProps {
  title: string;
  description: string;
  icon?: ReactNode;
  children: ReactNode;
}

export function ProGate({ title, description, icon, children }: ProGateProps) {
  const { isPro, loading } = usePlan();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  if (loading) return null;
  if (isPro) return <>{children}</>;

  return (
    <>
      <Card className="border-dashed border-amber-300/60 bg-amber-50/30 dark:bg-amber-950/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {icon ?? <Lock className="w-5 h-5 text-amber-500" />}
            {title}
            <span className="ml-auto inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 font-semibold">
              <Crown className="w-3 h-3" /> PRO
            </span>
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setOpen(true)} className="rounded-full">
            <Crown className="w-4 h-4 mr-2" /> Upgrade to Pro — ৳200/year
          </Button>
        </CardContent>
      </Card>

      {user && <PlanPurchaseDialog open={open} onOpenChange={setOpen} userId={user.id} />}
    </>
  );
}
