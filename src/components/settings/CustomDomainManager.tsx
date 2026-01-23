import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  Globe2, 
  Plus, 
  Trash2, 
  Loader2, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Copy,
  ExternalLink,
  Info,
  RefreshCw
} from "lucide-react";
import { z } from "zod";

const domainSchema = z.string()
  .trim()
  .min(4, "Domain must be at least 4 characters")
  .max(255, "Domain is too long")
  .regex(
    /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/,
    "Please enter a valid domain (e.g., example.com)"
  );

interface Domain {
  id: string;
  domain: string;
  is_verified: boolean | null;
  verification_token: string | null;
  created_at: string;
  verified_at: string | null;
}

export default function CustomDomainManager() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [newDomain, setNewDomain] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchDomains();
    }
  }, [user]);

  const triggerVerification = async () => {
    setVerifying(true);
    try {
      const { data, error } = await supabase.functions.invoke("verify-domains");
      
      if (error) {
        console.error("Verification error:", error);
        toast({
          variant: "destructive",
          title: "Verification Failed",
          description: "Could not verify domains. Try again later.",
        });
      } else {
        toast({
          title: "Verification Complete",
          description: data?.message || "Domain verification check completed",
        });
        // Refresh domains list
        fetchDomains();
      }
    } catch (err) {
      console.error("Error triggering verification:", err);
    } finally {
      setVerifying(false);
    }
  };

  const fetchDomains = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("domains")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching domains:", error);
    } else {
      setDomains(data || []);
    }
    setLoading(false);
  };

  const generateVerificationToken = () => {
    return `lovable_verify_${crypto.randomUUID().split("-")[0]}`;
  };

  const handleAddDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = domainSchema.safeParse(newDomain);
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    // Remove protocol and trailing slashes
    const cleanDomain = newDomain
      .toLowerCase()
      .replace(/^https?:\/\//, "")
      .replace(/\/+$/, "");

    setAdding(true);

    const verificationToken = generateVerificationToken();

    const { error } = await supabase.from("domains").insert({
      user_id: user?.id,
      domain: cleanDomain,
      verification_token: verificationToken,
      is_verified: false,
    });

    setAdding(false);

    if (error) {
      if (error.code === "23505") {
        setError("This domain is already registered");
      } else {
        setError(error.message);
      }
    } else {
      toast({
        title: "Domain Added",
        description: "Please add the DNS records to verify ownership",
      });
      setNewDomain("");
      fetchDomains();
    }
  };

  const handleDeleteDomain = async (domainId: string) => {
    setDeleting(domainId);

    const { error } = await supabase
      .from("domains")
      .delete()
      .eq("id", domainId);

    setDeleting(null);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete domain",
      });
    } else {
      toast({
        title: "Domain Removed",
        description: "The domain has been removed from your account",
      });
      fetchDomains();
    }
  };

  const copyToClipboard = (text: string, tokenId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(tokenId);
    setTimeout(() => setCopiedToken(null), 2000);
    toast({ title: "Copied!", description: "Value copied to clipboard" });
  };

  const getStatusBadge = (domain: Domain) => {
    if (domain.is_verified) {
      return (
        <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Verified
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="text-amber-600 border-amber-500/30">
        <Clock className="w-3 h-3 mr-1" />
        Pending Verification
      </Badge>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Globe2 className="w-5 h-5" />
              Custom Domains
            </CardTitle>
            <CardDescription>
              Connect your own domain to your portfolio for a professional presence
            </CardDescription>
          </div>
          {domains.some(d => !d.is_verified) && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={triggerVerification}
              disabled={verifying}
            >
              {verifying ? (
                <Loader2 className="w-4 h-4 animate-spin mr-1" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-1" />
              )}
              Verify Now
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add New Domain Form */}
        <form onSubmit={handleAddDomain} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-domain">Add a Domain</Label>
            <div className="flex gap-2">
              <Input
                id="new-domain"
                type="text"
                placeholder="yourdomain.com"
                value={newDomain}
                onChange={(e) => {
                  setNewDomain(e.target.value);
                  setError("");
                }}
                className={error ? "border-destructive" : ""}
                disabled={adding}
              />
              <Button type="submit" disabled={adding || !newDomain.trim()}>
                {adding ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </>
                )}
              </Button>
            </div>
            {error && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {error}
              </p>
            )}
          </div>
        </form>

        {/* Domains List */}
        {domains.length > 0 ? (
          <div className="space-y-4">
            {domains.map((domain) => (
              <div
                key={domain.id}
                className="border rounded-lg p-4 space-y-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-medium truncate">
                        {domain.domain}
                      </span>
                      {getStatusBadge(domain)}
                    </div>
                    {domain.is_verified && (
                      <a
                        href={`https://${domain.domain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline inline-flex items-center gap-1 mt-1"
                      >
                        Visit site <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        disabled={deleting === domain.id}
                      >
                        {deleting === domain.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remove Domain</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to remove <strong>{domain.domain}</strong>? 
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteDomain(domain.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Remove
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>

                {/* DNS Instructions for Pending Domains */}
                {!domain.is_verified && (
                  <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <div className="text-sm">
                        <p className="font-medium mb-2">Add these DNS records to verify ownership:</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3 text-sm">
                      {/* A Record */}
                      <div className="space-y-1">
                        <p className="font-medium text-muted-foreground">A Record (Root Domain):</p>
                        <div className="flex items-center gap-2 bg-background rounded p-2 border">
                          <code className="flex-1 text-xs">
                            Type: A | Name: @ | Value: 185.158.133.1
                          </code>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 shrink-0"
                            onClick={() => copyToClipboard("185.158.133.1", `${domain.id}-a`)}
                          >
                            {copiedToken === `${domain.id}-a` ? (
                              <CheckCircle2 className="w-3 h-3 text-green-500" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* A Record for www */}
                      <div className="space-y-1">
                        <p className="font-medium text-muted-foreground">A Record (www subdomain):</p>
                        <div className="flex items-center gap-2 bg-background rounded p-2 border">
                          <code className="flex-1 text-xs">
                            Type: A | Name: www | Value: 185.158.133.1
                          </code>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 shrink-0"
                            onClick={() => copyToClipboard("185.158.133.1", `${domain.id}-www`)}
                          >
                            {copiedToken === `${domain.id}-www` ? (
                              <CheckCircle2 className="w-3 h-3 text-green-500" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* TXT Record */}
                      <div className="space-y-1">
                        <p className="font-medium text-muted-foreground">TXT Record (Verification):</p>
                        <div className="flex items-center gap-2 bg-background rounded p-2 border">
                          <code className="flex-1 text-xs break-all">
                            Type: TXT | Name: _lovable | Value: {domain.verification_token}
                          </code>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 shrink-0"
                            onClick={() => copyToClipboard(domain.verification_token || "", `${domain.id}-txt`)}
                          >
                            {copiedToken === `${domain.id}-txt` ? (
                              <CheckCircle2 className="w-3 h-3 text-green-500" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      DNS changes can take up to 72 hours to propagate. Once verified, your portfolio will be accessible at your custom domain.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Globe2 className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No custom domains connected yet.</p>
            <p className="text-sm">Add your domain above to get started.</p>
          </div>
        )}

        {/* Help Link */}
        <div className="pt-4 border-t">
          <a
            href="https://docs.lovable.dev/features/custom-domain"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline inline-flex items-center gap-1"
          >
            Learn more about custom domains <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
