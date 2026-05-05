import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2, CreditCard, CheckCircle2, Copy, Smartphone, Crown, Check,
} from "lucide-react";

interface PlanPurchaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  onSuccess?: () => void;
}

const PAYMENT_NUMBER = "01950990757";
const PRICE = 200;

const paymentMethods = [
  { id: "bkash", name: "bKash", color: "bg-pink-500", textColor: "text-pink-500", bgLight: "bg-pink-50" },
  { id: "nagad", name: "Nagad", color: "bg-orange-500", textColor: "text-orange-500", bgLight: "bg-orange-50" },
  { id: "rocket", name: "Rocket", color: "bg-purple-600", textColor: "text-purple-600", bgLight: "bg-purple-50" },
];

const PRO_FEATURES = [
  "Custom domain support",
  "300 MB storage (3x more)",
  "Advanced editor & layout control",
  "SEO meta tags editing",
  "Google Search Console verification",
  "Auto sitemap generation",
];

export function PlanPurchaseDialog({ open, onOpenChange, userId, onSuccess }: PlanPurchaseDialogProps) {
  const [step, setStep] = useState<"info" | "payment" | "confirm" | "success">("info");
  const [paymentMethod, setPaymentMethod] = useState("bkash");
  const [transactionId, setTransactionId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(PAYMENT_NUMBER);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async () => {
    if (!transactionId.trim()) {
      toast({ variant: "destructive", title: "Transaction ID required" });
      return;
    }
    setIsSubmitting(true);
    try {
      const { data: purchase, error } = await supabase
        .from("plan_purchases")
        .insert({
          user_id: userId,
          plan: "pro",
          amount: PRICE,
          payment_method: paymentMethod,
          transaction_id: transactionId.trim(),
          status: "pending",
        })
        .select("id")
        .single();
      if (error) throw error;

      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name, email, username")
        .eq("user_id", userId)
        .maybeSingle();

      try {
        await supabase.functions.invoke("send-notification", {
          body: {
            type: "plan_purchase",
            purchaseId: purchase?.id,
            userId,
            userEmail: profile?.email,
            userName: profile?.display_name || profile?.username,
            username: profile?.username,
            transactionId: transactionId.trim(),
            paymentMethod,
            amount: PRICE,
            plan: "pro",
          },
        });
      } catch {}

      setStep("success");
      onSuccess?.();
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: e.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setStep("info");
    setTransactionId("");
    setPaymentMethod("bkash");
    onOpenChange(false);
  };

  const selected = paymentMethods.find((m) => m.id === paymentMethod);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-500" />
            Upgrade to Pro
          </DialogTitle>
          <DialogDescription>One-time payment for 1 year of Pro access.</DialogDescription>
        </DialogHeader>

        {step === "info" && (
          <div className="space-y-5 py-2">
            <div className="text-center">
              <div className="text-4xl font-bold">৳{PRICE}<span className="text-base font-normal text-muted-foreground">/year</span></div>
            </div>
            <div className="space-y-2 bg-muted/40 rounded-lg p-4">
              {PRO_FEATURES.map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
            <Button className="w-full" onClick={() => setStep("payment")}>Continue to payment</Button>
          </div>
        )}

        {step === "payment" && (
          <div className="space-y-5 py-2">
            <div className="space-y-3">
              <Label>Select payment method</Label>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="grid grid-cols-3 gap-2">
                  {paymentMethods.map((m) => (
                    <Label
                      key={m.id}
                      htmlFor={`p-${m.id}`}
                      className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        paymentMethod === m.id ? `border-primary ${m.bgLight}` : "border-border hover:border-primary/50"
                      }`}
                    >
                      <RadioGroupItem value={m.id} id={`p-${m.id}`} className="sr-only" />
                      <div className={`w-10 h-10 rounded-full ${m.color} flex items-center justify-center`}>
                        <Smartphone className="w-5 h-5 text-white" />
                      </div>
                      <span className={`text-sm font-medium ${paymentMethod === m.id ? m.textColor : ""}`}>{m.name}</span>
                    </Label>
                  ))}
                </div>
              </RadioGroup>
            </div>

            <div className={`p-4 rounded-lg ${selected?.bgLight} border`}>
              <h4 className="font-medium mb-3 flex items-center gap-2"><CreditCard className="w-4 h-4" /> Payment instructions</h4>
              <ol className="text-sm space-y-1.5 text-muted-foreground">
                <li>1. Open <strong className={selected?.textColor}>{selected?.name}</strong> app</li>
                <li>2. Go to <strong>Send Money</strong></li>
                <li>3. Send <strong>৳{PRICE}</strong> to:</li>
              </ol>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 bg-background rounded-lg px-4 py-3 font-mono text-lg font-bold text-center">{PAYMENT_NUMBER}</div>
                <Button variant="outline" size="icon" onClick={handleCopy}>
                  {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-3">Reference: <strong>Pro Plan</strong></p>
            </div>

            <Button className="w-full" onClick={() => setStep("confirm")}>I've made the payment</Button>
          </div>
        )}

        {step === "confirm" && (
          <div className="space-y-5 py-2">
            <div className="space-y-3">
              <Label htmlFor="txid">Transaction ID</Label>
              <Input
                id="txid"
                placeholder="e.g., TXN123456789"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                className="text-center font-mono"
              />
            </div>
            <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Plan:</span><span className="font-medium">Pro (1 year)</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Amount:</span><span className="font-medium">৳{PRICE}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Method:</span><span className={`font-medium ${selected?.textColor}`}>{selected?.name}</span></div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setStep("payment")}>Back</Button>
              <Button className="flex-1" onClick={handleSubmit} disabled={isSubmitting || !transactionId.trim()}>
                {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting</> : "Confirm purchase"}
              </Button>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Request submitted!</h3>
              <p className="text-sm text-muted-foreground mt-2">Admin will review your payment shortly. You'll be upgraded to Pro once approved.</p>
            </div>
            <Button onClick={handleClose}>Got it</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
