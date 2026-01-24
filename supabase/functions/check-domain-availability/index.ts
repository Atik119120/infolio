import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Check if domain has DNS records (indicates it's taken)
async function checkDNS(domain: string): Promise<boolean> {
  try {
    // Try to resolve A records
    const aRecords = await Deno.resolveDns(domain, "A").catch(() => []);
    if (aRecords.length > 0) return true;

    // Try to resolve NS records
    const nsRecords = await Deno.resolveDns(domain, "NS").catch(() => []);
    if (nsRecords.length > 0) return true;

    // Try to resolve MX records
    const mxRecords = await Deno.resolveDns(domain, "MX").catch(() => []);
    if (mxRecords.length > 0) return true;

    return false;
  } catch (error) {
    console.log(`DNS check error for ${domain}:`, error);
    return false;
  }
}

// Check domain via RDAP (Registration Data Access Protocol)
async function checkRDAP(domain: string): Promise<{ registered: boolean; info?: string; expiryDate?: string }> {
  const tld = domain.split('.').pop()?.toLowerCase();
  
  // RDAP bootstrap URLs for common TLDs
  const rdapServers: Record<string, string> = {
    'com': 'https://rdap.verisign.com/com/v1/domain/',
    'net': 'https://rdap.verisign.com/net/v1/domain/',
    'org': 'https://rdap.publicinterestregistry.org/rdap/domain/',
    'io': 'https://rdap.nic.io/domain/',
    'dev': 'https://rdap.nic.google/domain/',
    'app': 'https://rdap.nic.google/domain/',
    'co': 'https://rdap.nic.co/domain/',
    'me': 'https://rdap.nic.me/domain/',
    'xyz': 'https://rdap.centralnic.com/xyz/domain/',
    'tech': 'https://rdap.centralnic.com/tech/domain/',
    'online': 'https://rdap.centralnic.com/online/domain/',
    'site': 'https://rdap.centralnic.com/site/domain/',
  };

  const rdapUrl = rdapServers[tld || ''];
  
  if (!rdapUrl) {
    // For unsupported TLDs, fall back to DNS check
    const hasDNS = await checkDNS(domain);
    return { 
      registered: hasDNS, 
      info: hasDNS ? 'Domain appears to be registered' : 'Domain may be available (limited check)' 
    };
  }

  try {
    const response = await fetch(`${rdapUrl}${domain}`, {
      headers: { 'Accept': 'application/rdap+json' },
    });

    if (response.status === 200) {
      const data = await response.json();
      
      // Extract registrar info
      const registrar = data.entities?.find((e: any) => e.roles?.includes('registrar'))?.vcardArray?.[1]?.find((v: any) => v[0] === 'fn')?.[3];
      
      // Extract expiry date from events array
      let expiryDate: string | undefined;
      const expirationEvent = data.events?.find((e: any) => e.eventAction === 'expiration');
      if (expirationEvent?.eventDate) {
        try {
          const date = new Date(expirationEvent.eventDate);
          expiryDate = date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          });
        } catch {
          // Ignore date parsing errors
        }
      }
      
      return { 
        registered: true, 
        info: registrar ? `Registered via ${registrar}` : 'Domain is registered',
        expiryDate
      };
    } else if (response.status === 404) {
      return { registered: false, info: 'Domain is available!' };
    } else {
      // Consume response body to prevent resource leak
      await response.text();
      // Fallback to DNS check
      const hasDNS = await checkDNS(domain);
      return { 
        registered: hasDNS, 
        info: hasDNS ? 'Domain appears to be registered' : 'Domain may be available' 
      };
    }
  } catch (error) {
    console.log(`RDAP check error for ${domain}:`, error);
    // Fallback to DNS check
    const hasDNS = await checkDNS(domain);
    return { 
      registered: hasDNS, 
      info: hasDNS ? 'Domain appears to be registered' : 'Unable to verify availability' 
    };
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { domain } = await req.json();

    if (!domain || typeof domain !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Domain is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Clean domain
    const cleanDomain = domain.toLowerCase().trim().replace(/^https?:\/\//, '').replace(/\/+$/, '');

    // Validate domain format
    const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    if (!domainRegex.test(cleanDomain)) {
      return new Response(
        JSON.stringify({ error: 'Invalid domain format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Checking availability for: ${cleanDomain}`);

    const result = await checkRDAP(cleanDomain);

    return new Response(
      JSON.stringify({
        domain: cleanDomain,
        available: !result.registered,
        info: result.info,
        expiryDate: result.expiryDate,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error checking domain:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to check domain availability' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
