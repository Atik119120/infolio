import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

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

interface UserProfile {
  email: string;
  display_name: string | null;
}

// DNS lookup using public DNS-over-HTTPS API
async function lookupTxtRecords(domain: string): Promise<string[]> {
  try {
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

    const txtRecords = data.Answer
      .filter((record: any) => record.type === 16)
      .map((record: any) => record.data.replace(/"/g, ""));

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

    // Accept Vercel IPs (deploy target). Add more if needed.
    const acceptedIPs = ["76.76.21.21", "76.76.21.61", "76.76.21.93"];
    const hasCorrectIP = data.Answer.some(
      (record: any) => record.type === 1 && acceptedIPs.includes(record.data)
    );

    console.log(`A record check for ${domain}: ${hasCorrectIP ? "correct" : "incorrect"}`);
    return hasCorrectIP;
  } catch (error) {
    console.error(`Error checking A record for ${domain}:`, error);
    return false;
  }
}

// Send verification success email
async function sendVerificationEmail(
  resend: Resend,
  email: string,
  displayName: string | null,
  domain: string
): Promise<boolean> {
  try {
    const name = displayName || "there";
    
    const { error } = await resend.emails.send({
      from: "Infolio <noreply@resend.dev>",
      to: [email],
      subject: `🎉 Your domain ${domain} is now verified!`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🎉 Domain Verified!</h1>
          </div>
          
          <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
            <p style="font-size: 16px;">Hi ${name},</p>
            
            <p style="font-size: 16px;">Great news! Your custom domain has been successfully verified and is now active:</p>
            
            <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 16px; margin: 20px 0; text-align: center;">
              <p style="margin: 0; font-size: 18px; font-weight: bold; color: #166534;">
                🌐 ${domain}
              </p>
            </div>
            
            <p style="font-size: 16px;">Your portfolio is now accessible at:</p>
            <ul style="font-size: 16px;">
              <li><a href="https://${domain}" style="color: #667eea;">https://${domain}</a></li>
              <li><a href="https://www.${domain}" style="color: #667eea;">https://www.${domain}</a></li>
            </ul>
            
            <div style="background: #fef3c7; border: 1px solid #fcd34d; border-radius: 8px; padding: 16px; margin: 20px 0;">
              <p style="margin: 0; font-size: 14px; color: #92400e;">
                <strong>💡 Tip:</strong> It may take a few minutes for SSL certificates to be fully provisioned. If you see a security warning initially, please wait a moment and try again.
              </p>
            </div>
            
            <p style="font-size: 16px;">Thank you for using Infolio!</p>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            
            <p style="font-size: 12px; color: #6b7280; text-align: center;">
              This email was sent by Infolio. If you didn't add this domain, please contact support.
            </p>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error("Failed to send verification email:", error);
      return false;
    }

    console.log(`Verification email sent to ${email} for domain ${domain}`);
    return true;
  } catch (error) {
    console.error("Error sending verification email:", error);
    return false;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const resend = resendApiKey ? new Resend(resendApiKey) : null;

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

    const verificationResults: { domain: string; verified: boolean; reason?: string; emailSent?: boolean }[] = [];

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
        continue;
      }

      console.log(`Domain verified: ${domain.domain}`);

      // Send email notification
      let emailSent = false;
      if (resend) {
        // Get user email from profiles
        const { data: profile } = await supabase
          .from("profiles")
          .select("email, display_name")
          .eq("user_id", domain.user_id)
          .maybeSingle();

        if (profile?.email) {
          emailSent = await sendVerificationEmail(
            resend,
            profile.email,
            profile.display_name,
            domain.domain
          );
        } else {
          console.log(`No email found for user ${domain.user_id}`);
        }
      } else {
        console.log("Resend API key not configured, skipping email notification");
      }

      verificationResults.push({
        domain: domain.domain,
        verified: true,
        emailSent,
      });
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
