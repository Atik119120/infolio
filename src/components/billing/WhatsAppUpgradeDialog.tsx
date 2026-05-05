import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageCircle, Crown, Check } from "lucide-react";

interface WhatsAppUpgradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Optional context — e.g. "Pro Plan", "Cosmic Theme" */
  reason?: string;
  title?: string;
  description?: string;
}

const WHATSAPP_NUMBER = "8801950990757"; // international format (no +)
const WA_DISPLAY = "+880 1950-990757";

const FEATURES = [
  "Custom domain support",
  "300 MB storage (3x more)",
  "SEO meta tags & sitemap",
  "Google Search Console verification",
  "Premium themes unlock",
  "Priority support",
];

export function WhatsAppUpgradeDialog({
  open,
  onOpenChange,
  reason = "Pro upgrade",
  title = "Unlock Premium",
  description = "Contact us on WhatsApp to upgrade your account.",
}: WhatsAppUpgradeDialogProps) {
  const message = encodeURIComponent(
    `Hi! I'd like to upgrade my Alokchitra account.\n\nRequest: ${reason}\n\nPlease guide me with the payment process.`
  );
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-500" />
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div className="space-y-2 bg-muted/40 rounded-lg p-4">
            {FEATURES.map((f) => (
              <div key={f} className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-primary shrink-0" />
                <span>{f}</span>
              </div>
            ))}
          </div>

          <div className="rounded-lg border bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 p-4 text-center space-y-2">
            <p className="text-sm text-muted-foreground">Talk to us directly on WhatsApp</p>
            <p className="text-lg font-bold font-mono">{WA_DISPLAY}</p>
          </div>

          <Button
            asChild
            className="w-full bg-[#25D366] hover:bg-[#1fbb59] text-white"
            size="lg"
          >
            <a href={waLink} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="w-5 h-5 mr-2" />
              Chat on WhatsApp
            </a>
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            After payment, an admin will activate your premium features.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
