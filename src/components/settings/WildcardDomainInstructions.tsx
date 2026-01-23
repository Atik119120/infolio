import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Globe2, 
  Shield, 
  CheckCircle2, 
  Copy,
  ExternalLink,
  Info,
  Server,
  Lock
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function WildcardDomainInstructions() {
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const { toast } = useToast();

  const copyToClipboard = (text: string, itemId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(itemId);
    setTimeout(() => setCopiedItem(null), 2000);
    toast({ title: "Copied!", description: "Value copied to clipboard" });
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Globe2 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle className="flex items-center gap-2">
              Subdomain Setup (Admin Only)
              <Badge variant="outline" className="text-xs">Advanced</Badge>
            </CardTitle>
            <CardDescription>
              Enable username.yourdomain.com for all users
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overview */}
        <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
          <Info className="w-5 h-5 text-primary mt-0.5 shrink-0" />
          <div className="text-sm">
            <p className="font-medium mb-1">কীভাবে কাজ করে:</p>
            <p className="text-muted-foreground">
              Wildcard DNS সেটআপ করলে, প্রতিটি user তাদের username দিয়ে subdomain পাবে।
              যেমন: <code className="bg-background px-1 rounded">john.yourdomain.com</code>,{' '}
              <code className="bg-background px-1 rounded">sara.yourdomain.com</code>
            </p>
          </div>
        </div>

        {/* Step 1: Wildcard DNS */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
              1
            </div>
            <h4 className="font-medium flex items-center gap-2">
              <Server className="w-4 h-4" />
              Wildcard A Record সেটআপ করুন
            </h4>
          </div>
          
          <div className="ml-8 space-y-2">
            <p className="text-sm text-muted-foreground">
              আপনার DNS provider এ গিয়ে এই record যোগ করুন:
            </p>
            
            <div className="flex items-center gap-2 bg-background rounded p-3 border">
              <code className="flex-1 text-sm">
                Type: <span className="text-primary font-medium">A</span> | 
                Name: <span className="text-primary font-medium">*</span> | 
                Value: <span className="text-primary font-medium">185.158.133.1</span>
              </code>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={() => copyToClipboard("185.158.133.1", "wildcard-a")}
              >
                {copiedItem === "wildcard-a" ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground">
              <strong>Note:</strong> * (asterisk) মানে সব subdomain এই IP তে যাবে
            </p>
          </div>
        </div>

        {/* Step 2: Root Domain */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
              2
            </div>
            <h4 className="font-medium flex items-center gap-2">
              <Globe2 className="w-4 h-4" />
              Root Domain A Record
            </h4>
          </div>
          
          <div className="ml-8 space-y-2">
            <p className="text-sm text-muted-foreground">
              Main domain এর জন্য আলাদা A record:
            </p>
            
            <div className="flex items-center gap-2 bg-background rounded p-3 border">
              <code className="flex-1 text-sm">
                Type: <span className="text-primary font-medium">A</span> | 
                Name: <span className="text-primary font-medium">@</span> | 
                Value: <span className="text-primary font-medium">185.158.133.1</span>
              </code>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={() => copyToClipboard("185.158.133.1", "root-a")}
              >
                {copiedItem === "root-a" ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Step 3: SSL Certificate */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
              3
            </div>
            <h4 className="font-medium flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Wildcard SSL Certificate
            </h4>
          </div>
          
          <div className="ml-8 space-y-3">
            <p className="text-sm text-muted-foreground">
              সব subdomain এ HTTPS কাজ করার জন্য wildcard SSL certificate দরকার:
            </p>
            
            <div className="bg-background rounded-lg p-4 border space-y-3">
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-green-500 mt-1 shrink-0" />
                <div>
                  <p className="text-sm font-medium">Let's Encrypt (Free)</p>
                  <p className="text-xs text-muted-foreground">
                    Wildcard certificate এর জন্য DNS-01 challenge ব্যবহার করতে হবে
                  </p>
                </div>
              </div>
              
              <div className="text-sm space-y-1">
                <p className="font-medium text-muted-foreground">Certificate covers:</p>
                <code className="block bg-muted px-2 py-1 rounded text-xs">
                  *.yourdomain.com
                </code>
                <code className="block bg-muted px-2 py-1 rounded text-xs">
                  yourdomain.com
                </code>
              </div>
            </div>

            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <p className="text-sm text-amber-700 dark:text-amber-400">
                <strong>Important:</strong> Lovable automatically provisions SSL when you connect your domain through the platform. For wildcard SSL, ensure your DNS provider supports CNAME flattening or use a provider like Cloudflare.
              </p>
            </div>
          </div>
        </div>

        {/* Step 4: Verification */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
              4
            </div>
            <h4 className="font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Automatic Verification
            </h4>
          </div>
          
          <div className="ml-8">
            <p className="text-sm text-muted-foreground">
              System প্রতি ১০ মিনিটে automatically DNS records check করে এবং verified domains activate করে।
              DNS propagation এ সাধারণত ৫ মিনিট থেকে ৭২ ঘন্টা সময় লাগতে পারে।
            </p>
          </div>
        </div>

        {/* Help Link */}
        <div className="pt-4 border-t">
          <a
            href="https://docs.lovable.dev/features/custom-domain"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline inline-flex items-center gap-1"
          >
            বিস্তারিত documentation দেখুন <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
