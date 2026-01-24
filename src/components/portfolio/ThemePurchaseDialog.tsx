import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { 
  Loader2, 
  CreditCard, 
  CheckCircle2, 
  Copy, 
  Smartphone,
  Lock,
  Sparkles
} from "lucide-react";
import { THEME_OPTIONS } from "./themes/types";

interface ThemePurchaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  themeId: string;
  themeName: string;
  userId: string;
  onSuccess: () => void;
}

const PAYMENT_NUMBER = "01950990757";

const paymentMethods = [
  { 
    id: 'bkash', 
    name: 'bKash', 
    color: 'bg-pink-500',
    textColor: 'text-pink-500',
    bgLight: 'bg-pink-50 dark:bg-pink-950/30'
  },
  { 
    id: 'nagad', 
    name: 'Nagad', 
    color: 'bg-orange-500',
    textColor: 'text-orange-500',
    bgLight: 'bg-orange-50 dark:bg-orange-950/30'
  },
  { 
    id: 'rocket', 
    name: 'Rocket', 
    color: 'bg-purple-600',
    textColor: 'text-purple-600',
    bgLight: 'bg-purple-50 dark:bg-purple-950/30'
  },
];

export function ThemePurchaseDialog({
  open,
  onOpenChange,
  themeId,
  themeName,
  userId,
  onSuccess,
}: ThemePurchaseDialogProps) {
  const [step, setStep] = useState<'payment' | 'confirm' | 'success'>('payment');
  const [paymentMethod, setPaymentMethod] = useState('bkash');
  const [transactionId, setTransactionId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const themePrice = THEME_OPTIONS.find(t => t.value === themeId)?.price || 200;

  const handleCopyNumber = async () => {
    await navigator.clipboard.writeText(PAYMENT_NUMBER);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied!",
      description: "Payment number copied to clipboard",
    });
  };

  const handleSubmitPurchase = async () => {
    if (!transactionId.trim()) {
      toast({
        variant: "destructive",
        title: "Transaction ID Required",
        description: "Please enter your transaction ID",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Insert purchase request (return id so Telegram buttons work)
      const [{ data: purchase, error: purchaseError }, { data: profile }] = await Promise.all([
        supabase
          .from("theme_purchases")
          .insert({
            user_id: userId,
            theme_id: themeId,
            transaction_id: transactionId.trim(),
            payment_method: paymentMethod,
            amount: themePrice,
            status: "pending",
          })
          .select("id")
          .single(),
        supabase
          .from("profiles")
          .select("display_name, email, username")
          .eq("user_id", userId)
          .maybeSingle(),
      ]);

      if (purchaseError) throw purchaseError;

      // Send notification to admin
      try {
        await supabase.functions.invoke('send-notification', {
          body: {
            type: 'theme_purchase',
            purchaseId: purchase?.id,
            userId,
            userEmail: profile?.email,
            userName: profile?.display_name || profile?.username,
            username: profile?.username,
            themeId,
            themeName,
            transactionId: transactionId.trim(),
            paymentMethod,
            amount: themePrice,
          },
        });
      } catch (notifyError) {
        console.log('Notification failed, but purchase recorded:', notifyError);
      }

      setStep('success');
      onSuccess();
    } catch (error: any) {
      console.error('Purchase error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to submit purchase request",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setStep('payment');
    setTransactionId('');
    setPaymentMethod('bkash');
    onOpenChange(false);
  };

  const selectedMethod = paymentMethods.find(m => m.id === paymentMethod);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary" />
            Unlock {themeName} Theme
          </DialogTitle>
          <DialogDescription>
            Purchase this premium theme for ৳{themePrice}
          </DialogDescription>
        </DialogHeader>

        {step === 'payment' && (
          <div className="space-y-6 py-4">
            {/* Theme Badge */}
            <div className="flex items-center justify-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span className="font-medium text-amber-600 dark:text-amber-400">Premium Theme</span>
              </div>
            </div>

            {/* Price */}
            <div className="text-center">
              <div className="text-4xl font-bold">৳{themePrice}</div>
              <p className="text-sm text-muted-foreground mt-1">One-time payment</p>
            </div>

            {/* Payment Method Selection */}
            <div className="space-y-3">
              <Label>Select Payment Method</Label>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="grid grid-cols-3 gap-2">
                  {paymentMethods.map((method) => (
                    <Label
                      key={method.id}
                      htmlFor={method.id}
                      className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        paymentMethod === method.id
                          ? `border-primary ${method.bgLight}`
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <RadioGroupItem value={method.id} id={method.id} className="sr-only" />
                      <div className={`w-10 h-10 rounded-full ${method.color} flex items-center justify-center`}>
                        <Smartphone className="w-5 h-5 text-white" />
                      </div>
                      <span className={`text-sm font-medium ${paymentMethod === method.id ? method.textColor : ''}`}>
                        {method.name}
                      </span>
                    </Label>
                  ))}
                </div>
              </RadioGroup>
            </div>

            {/* Payment Instructions */}
            <div className={`p-4 rounded-lg ${selectedMethod?.bgLight} border`}>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Payment Instructions
              </h4>
              <ol className="text-sm space-y-2 text-muted-foreground">
                <li>1. Open your <strong className={selectedMethod?.textColor}>{selectedMethod?.name}</strong> app</li>
                <li>2. Go to <strong>Send Money</strong></li>
                <li>3. Send <strong>৳{themePrice}</strong> to this number:</li>
              </ol>
              
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 bg-background rounded-lg px-4 py-3 font-mono text-lg font-bold text-center">
                  {PAYMENT_NUMBER}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyNumber}
                  className="shrink-0"
                >
                  {copied ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>

              <p className="text-xs text-muted-foreground mt-3">
                Reference: <strong>{themeName} Theme</strong>
              </p>
            </div>

            <Button 
              className="w-full" 
              onClick={() => setStep('confirm')}
            >
              I've Made the Payment
            </Button>
          </div>
        )}

        {step === 'confirm' && (
          <div className="space-y-6 py-4">
            <div className="space-y-3">
              <Label htmlFor="transactionId">Enter Transaction ID</Label>
              <Input
                id="transactionId"
                placeholder="e.g., TXN123456789"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                className="text-center font-mono text-lg"
              />
              <p className="text-xs text-muted-foreground text-center">
                You'll find this in your {selectedMethod?.name} app under transaction history
              </p>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Theme:</span>
                <span className="font-medium">{themeName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-medium">৳{themePrice}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Payment Method:</span>
                <span className={`font-medium ${selectedMethod?.textColor}`}>{selectedMethod?.name}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setStep('payment')}
                className="flex-1"
              >
                Back
              </Button>
              <Button 
                onClick={handleSubmitPurchase}
                disabled={isSubmitting || !transactionId.trim()}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Confirm Purchase'
                )}
              </Button>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Purchase Request Submitted!</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Your request is being reviewed. You'll be notified once approved.
              </p>
            </div>
            <Button onClick={handleClose} className="mt-4">
              Got it
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}