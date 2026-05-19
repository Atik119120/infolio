import { useState, useEffect, useRef } from "react";
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
  RefreshCw,
  Search
} from "lucide-react";

// Popular domain extensions with estimated pricing (USD/year)
const DOMAIN_EXTENSIONS_DATA: { ext: string; price: string; priceNum: number }[] = [
  { ext: ".com", price: "$10-15", priceNum: 12 },
  { ext: ".net", price: "$12-15", priceNum: 13 },
  { ext: ".org", price: "$10-15", priceNum: 12 },
  { ext: ".io", price: "$40-60", priceNum: 50 },
  { ext: ".dev", price: "$12-20", priceNum: 15 },
  { ext: ".app", price: "$12-20", priceNum: 15 },
  { ext: ".co", price: "$25-35", priceNum: 30 },
  { ext: ".xyz", price: "$1-10", priceNum: 5 },
  { ext: ".tech", price: "$5-15", priceNum: 10 },
  { ext: ".online", price: "$3-10", priceNum: 6 },
  { ext: ".site", price: "$3-10", priceNum: 6 },
  { ext: ".me", price: "$15-25", priceNum: 20 },
  { ext: ".info", price: "$5-15", priceNum: 10 },
  { ext: ".biz", price: "$15-20", priceNum: 17 },
  { ext: ".in", price: "$8-15", priceNum: 10 },
  { ext: ".bd", price: "$50-100", priceNum: 75 },
];

const DOMAIN_EXTENSIONS = DOMAIN_EXTENSIONS_DATA.map(d => d.ext);

// Get price for a TLD
const getDomainPrice = (domain: string): string => {
  const ext = "." + domain.split(".").pop()?.toLowerCase();
  return DOMAIN_EXTENSIONS_DATA.find(d => d.ext === ext)?.price || "$10-50";
};

// Popular registrars with affiliate-free links
const REGISTRARS = [
  { name: "Namecheap", url: (domain: string) => `https://www.namecheap.com/domains/registration/results/?domain=${domain}`, icon: "🏷️" },
  { name: "GoDaddy", url: (domain: string) => `https://www.godaddy.com/domainsearch/find?domainToCheck=${domain}`, icon: "🌐" },
  { name: "Porkbun", url: (domain: string) => `https://porkbun.com/checkout/search?q=${domain}`, icon: "🐷" },
  { name: "Google Domains", url: (domain: string) => `https://domains.google.com/registrar/search?searchTerm=${domain}`, icon: "🔍" },
];

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

interface AvailabilityResult {
  domain: string;
  available: boolean;
  info: string;
  checking: boolean;
  expiryDate?: string;
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
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");
  const [availabilityResults, setAvailabilityResults] = useState<Record<string, AvailabilityResult>>({});
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const { user } = useAuth();
  const { toast } = useToast();

  // Check domain availability
  const checkAvailability = async (domain: string) => {
    if (!domain || availabilityResults[domain]?.checking) return;

    setAvailabilityResults(prev => ({
      ...prev,
      [domain]: { domain, available: false, info: 'Checking...', checking: true }
    }));

    try {
      const { data, error } = await supabase.functions.invoke('check-domain-availability', {
        body: { domain }
      });

      if (error) throw error;

      setAvailabilityResults(prev => ({
        ...prev,
        [domain]: { 
          domain, 
          available: data.available, 
          info: data.info || (data.available ? 'Available!' : 'Taken'),
          checking: false,
          expiryDate: data.expiryDate
        }
      }));
    } catch (err) {
      console.error('Availability check error:', err);
      setAvailabilityResults(prev => ({
        ...prev,
        [domain]: { domain, available: false, info: 'Check failed', checking: false }
      }));
    }
  };

  // Generate domain suggestions based on input
  const getDomainSuggestions = () => {
    const input = newDomain.trim().toLowerCase();
    if (!input || input.includes(".")) return [];
    
    return DOMAIN_EXTENSIONS
      .filter(ext => searchFilter ? ext.includes(searchFilter.toLowerCase()) : true)
      .map(ext => `${input}${ext}`);
  };

  const suggestions = getDomainSuggestions();

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const handleAddDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = domainSchema.safeParse(newDomain);
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    const cleanDomain = newDomain
      .toLowerCase()
      .replace(/^https?:\/\//, "")
      .replace(/\/+$/, "");

    setAdding(true);

    const { error } = await supabase.from("domains").insert({
      user_id: user?.id,
      domain: cleanDomain,
      verification_token: null,
      is_verified: false,
    });

    if (error) {
      setAdding(false);
      if (error.code === "23505") setError("This domain is already registered");
      else setError(error.message);
      return;
    }

    // Attach to Vercel & fetch the required TXT record (if any)
    try {
      await supabase.functions.invoke("verify-domains");
    } catch (err) {
      console.error("Initial attach failed:", err);
    }

    setAdding(false);
    toast({
      title: "Domain Added",
      description: "Add the DNS records shown below, then click Verify Now",
    });
    setNewDomain("");
    fetchDomains();
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
            <div className="relative">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    ref={inputRef}
                    id="new-domain"
                    type="text"
                    placeholder="Search or enter domain (e.g., mysite)"
                    value={newDomain}
                    onChange={(e) => {
                      setNewDomain(e.target.value);
                      setError("");
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    className={`pl-9 ${error ? "border-destructive" : ""}`}
                    disabled={adding}
                  />
                </div>
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

              {/* Domain Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div 
                  ref={suggestionsRef}
                  className="absolute z-50 w-full mt-1 bg-popover border rounded-lg shadow-lg max-h-80 overflow-y-auto"
                >
                  <div className="p-2 border-b">
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Filter extensions..."
                        value={searchFilter}
                        onChange={(e) => setSearchFilter(e.target.value)}
                        className="h-8 pl-7 text-xs"
                      />
                    </div>
                  </div>
                  <div className="p-1">
                    {suggestions.map((suggestion) => {
                      const result = availabilityResults[suggestion];
                      const price = getDomainPrice(suggestion);
                      return (
                        <div key={suggestion} className="border-b last:border-b-0">
                          <button
                            type="button"
                            onClick={() => {
                              setNewDomain(suggestion);
                              setShowSuggestions(false);
                              setSearchFilter("");
                            }}
                            onMouseEnter={() => checkAvailability(suggestion)}
                            className="w-full px-3 py-2 text-left text-sm hover:bg-accent flex items-center justify-between gap-2 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs font-mono">
                                {suggestion.split(".").pop()}
                              </Badge>
                              <span className="font-mono text-sm">{suggestion}</span>
                              <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                ~{price}/yr
                              </span>
                            </div>
                            {/* Availability Status */}
                            <div className="flex items-center gap-1 text-xs">
                              {result?.checking ? (
                                <span className="flex items-center gap-1 text-muted-foreground">
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                </span>
                              ) : result ? (
                                result.available ? (
                                  <span className="flex items-center gap-1 text-green-600 font-medium">
                                    <CheckCircle2 className="w-3 h-3" />
                                    Available
                                  </span>
                                ) : (
                                  <div className="flex flex-col items-end">
                                    <span className="flex items-center gap-1 text-destructive">
                                      <AlertCircle className="w-3 h-3" />
                                      Taken
                                    </span>
                                    {result.expiryDate && (
                                      <span className="text-[10px] text-muted-foreground">
                                        Expires: {result.expiryDate}
                                      </span>
                                    )}
                                  </div>
                                )
                              ) : (
                                <span className="text-muted-foreground text-xs">Hover to check</span>
                              )}
                            </div>
                          </button>
                          {/* Registrar Links - Show only for available domains */}
                          {result?.available && (
                            <div className="px-3 pb-2 flex flex-wrap gap-1.5">
                              <span className="text-xs text-muted-foreground">Buy at:</span>
                              {REGISTRARS.map((registrar) => (
                                <a
                                  key={registrar.name}
                                  href={registrar.url(suggestion)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary hover:bg-primary/20 px-2 py-0.5 rounded-full transition-colors"
                                >
                                  <span>{registrar.icon}</span>
                                  {registrar.name}
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            {error && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {error}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Type your domain name and select an extension, or enter the full domain directly
            </p>
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
                  domain.domain.toLowerCase().endsWith(".infolio.online") ? (
                    <div className="bg-muted/50 rounded-lg p-4 text-sm flex items-start gap-2">
                      <Info className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <p>
                        Internal Infolio subdomain — no DNS setup required. Click <strong>Verify Now</strong> to activate instantly.
                      </p>
                    </div>
                  ) : (
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
                            Type: A | Name: @ | Value: 76.76.21.21
                          </code>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 shrink-0"
                            onClick={() => copyToClipboard("76.76.21.21", `${domain.id}-a`)}
                          >
                            {copiedToken === `${domain.id}-a` ? (
                              <CheckCircle2 className="w-3 h-3 text-green-500" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* CNAME for www */}
                      <div className="space-y-1">
                        <p className="font-medium text-muted-foreground">CNAME (www subdomain):</p>
                        <div className="flex items-center gap-2 bg-background rounded p-2 border">
                          <code className="flex-1 text-xs">
                            Type: CNAME | Name: www | Value: cname.vercel-dns.com
                          </code>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 shrink-0"
                            onClick={() => copyToClipboard("cname.vercel-dns.com", `${domain.id}-www`)}
                          >
                            {copiedToken === `${domain.id}-www` ? (
                              <CheckCircle2 className="w-3 h-3 text-green-500" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Vercel TXT Verification (only if Vercel has issued one) */}
                      {domain.verification_token && (
                        <div className="space-y-1">
                          <p className="font-medium text-muted-foreground">TXT Record (Vercel Verification):</p>
                          <div className="flex items-center gap-2 bg-background rounded p-2 border">
                            <code className="flex-1 text-xs break-all">
                              Type: TXT | Name: _vercel | Value: {domain.verification_token}
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
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground">
                      DNS changes can take up to 72 hours to propagate. Verification happens natively through Vercel — no Lovable records required.
                    </p>
                  </div>
                  )
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
