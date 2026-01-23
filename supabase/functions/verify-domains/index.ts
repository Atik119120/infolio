import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Domain {
  id: string;
  domain: string;
  verification_token: string;
  user_id: string;
}

// DNS lookup using public DNS-over-HTTPS API
async function lookupTxtRecords(domain: string): Promise<string[]> {
  try {
    // Use Cloudflare's DNS-over-HTTPS API
    const response = await fetch(
      `https://cloudflare-dns.com/dns-query?name=_lovable.${domain}&type=TXT`,
      {
        headers: {
          Accept: "application/dns-json",
        },
      }
    );

    if (!response.ok) {
      console.log(`DNS lookup failed for ${domain}: ${response.status}`);
      return [];
    }

    const data = await response.json();
    
    if (!data.Answer) {
      console.log(`No TXT records found for _lovable.${domain}`);
      return [];
    }

    // Extract TXT record values
    const txtRecords = data.Answer
      .filter((record: any) => record.type === 16) // TXT record type
      .map((record: any) => record.data.replace(/"/g, "")); // Remove quotes

    console.log(`Found TXT records for ${domain}:`, txtRecords);
    return txtRecords;
  } catch (error) {
    console.error(`Error looking up DNS for ${domain}:`, error);
    return [];
  }
}

// Check A record points to correct IP
async function checkARecord(domain: string): Promise<boolean> {
  try {
    const response = await fetch(
      `https://cloudflare-dns.com/dns-query?name=${domain}&type=A`,
      {
        headers: {
          Accept: "application/dns-json",
        },
      }
    );

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    
    if (!data.Answer) {
      return false;
    }

    // Check if any A record points to Lovable's IP
    const lovableIP = "185.158.133.1";
    const hasCorrectIP = data.Answer.some(
      (record: any) => record.type === 1 && record.data === lovableIP
    );

    console.log(`A record check for ${domain}: ${hasCorrectIP ? "correct" : "incorrect"}`);
    return hasCorrectIP;
  } catch (error) {
    console.error(`Error checking A record for ${domain}:`, error);
    return false;
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch all unverified domains
    const { data: domains, error: fetchError } = await supabase
      .from("domains")
      .select("id, domain, verification_token, user_id")
      .eq("is_verified", false);

    if (fetchError) {
      console.error("Error fetching domains:", fetchError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch domains" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!domains || domains.length === 0) {
      console.log("No unverified domains to check");
      return new Response(
        JSON.stringify({ message: "No domains to verify", verified: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Checking ${domains.length} unverified domains`);

    const verificationResults: { domain: string; verified: boolean; reason?: string }[] = [];

    for (const domain of domains as Domain[]) {
      console.log(`Verifying domain: ${domain.domain}`);

      // Check TXT record for verification token
      const txtRecords = await lookupTxtRecords(domain.domain);
      const tokenFound = txtRecords.some(
        (record) => record === domain.verification_token
      );

      if (!tokenFound) {
        verificationResults.push({
          domain: domain.domain,
          verified: false,
          reason: "TXT verification record not found",
        });
        continue;
      }

      // Check A record points to correct IP
      const aRecordCorrect = await checkARecord(domain.domain);

      if (!aRecordCorrect) {
        verificationResults.push({
          domain: domain.domain,
          verified: false,
          reason: "A record does not point to correct IP",
        });
        continue;
      }

      // Both checks passed - verify the domain
      const { error: updateError } = await supabase
        .from("domains")
        .update({
          is_verified: true,
          verified_at: new Date().toISOString(),
        })
        .eq("id", domain.id);

      if (updateError) {
        console.error(`Error updating domain ${domain.domain}:`, updateError);
        verificationResults.push({
          domain: domain.domain,
          verified: false,
          reason: "Database update failed",
        });
      } else {
        console.log(`Domain verified: ${domain.domain}`);
        verificationResults.push({
          domain: domain.domain,
          verified: true,
        });
      }
    }

    const verifiedCount = verificationResults.filter((r) => r.verified).length;

    return new Response(
      JSON.stringify({
        message: `Verified ${verifiedCount} of ${domains.length} domains`,
        verified: verifiedCount,
        results: verificationResults,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
