import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Generate 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

interface OTPRequest {
  action: "send" | "verify" | "send_reset" | "verify_reset" | "reset_password";
  email: string;
  code?: string;
  userName?: string;
  newPassword?: string;
}

// Email template for signup verification
function getSignupEmailTemplate(otpCode: string, userName: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          padding: 40px 20px;
        }
        .container { 
          max-width: 500px; 
          margin: 0 auto; 
          background: #ffffff;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        .header { 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white; 
          padding: 40px 30px;
          text-align: center; 
        }
        .logo {
          width: 60px;
          height: 60px;
          background: rgba(255,255,255,0.2);
          border-radius: 15px;
          margin: 0 auto 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
        }
        .header h1 { 
          font-size: 24px; 
          font-weight: 700;
          margin-bottom: 5px;
        }
        .header p {
          opacity: 0.9;
          font-size: 14px;
        }
        .content { 
          padding: 40px 30px; 
          text-align: center;
        }
        .greeting {
          font-size: 20px;
          color: #1a1a2e;
          margin-bottom: 15px;
        }
        .message {
          color: #64748b;
          font-size: 15px;
          line-height: 1.6;
          margin-bottom: 30px;
        }
        .otp-box {
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          border: 2px dashed #e2e8f0;
          border-radius: 16px;
          padding: 25px;
          margin: 25px 0;
        }
        .otp-label {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: #64748b;
          margin-bottom: 12px;
        }
        .otp-code {
          font-size: 36px;
          font-weight: 800;
          letter-spacing: 8px;
          color: #667eea;
          font-family: 'Courier New', monospace;
        }
        .expires {
          margin-top: 15px;
          font-size: 13px;
          color: #94a3b8;
        }
        .expires strong {
          color: #f59e0b;
        }
        .warning {
          background: #fef3c7;
          border-left: 4px solid #f59e0b;
          padding: 15px;
          border-radius: 8px;
          margin-top: 25px;
          text-align: left;
        }
        .warning-text {
          color: #92400e;
          font-size: 13px;
        }
        .footer { 
          text-align: center; 
          padding: 25px;
          background: #f8fafc;
          border-top: 1px solid #e2e8f0;
        }
        .footer-text {
          color: #94a3b8;
          font-size: 12px;
        }
        .footer-brand {
          color: #667eea;
          font-weight: 600;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">α</div>
          <h1>Alpha Portfolio</h1>
          <p>Professional Portfolio Builder</p>
        </div>
        <div class="content">
          <h2 class="greeting">Hi ${userName || 'there'}! 👋</h2>
          <p class="message">
            Thanks for signing up! Use the verification code below to complete your registration and start building your amazing portfolio.
          </p>
          
          <div class="otp-box">
            <div class="otp-label">Your Verification Code</div>
            <div class="otp-code">${otpCode}</div>
            <p class="expires">Expires in <strong>10 minutes</strong></p>
          </div>
          
          <div class="warning">
            <p class="warning-text">
              🔒 Never share this code with anyone. Alpha Portfolio team will never ask for your verification code.
            </p>
          </div>
        </div>
        <div class="footer">
          <p class="footer-text">
            © ${new Date().getFullYear()} <a href="https://alphaportfolio.com" class="footer-brand">Alpha Portfolio</a>. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Email template for password reset
function getPasswordResetEmailTemplate(otpCode: string, userName: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          min-height: 100vh;
          padding: 40px 20px;
        }
        .container { 
          max-width: 500px; 
          margin: 0 auto; 
          background: #ffffff;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        .header { 
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          color: white; 
          padding: 40px 30px;
          text-align: center; 
        }
        .logo {
          width: 60px;
          height: 60px;
          background: rgba(255,255,255,0.2);
          border-radius: 15px;
          margin: 0 auto 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
        }
        .header h1 { 
          font-size: 24px; 
          font-weight: 700;
          margin-bottom: 5px;
        }
        .header p {
          opacity: 0.9;
          font-size: 14px;
        }
        .content { 
          padding: 40px 30px; 
          text-align: center;
        }
        .greeting {
          font-size: 20px;
          color: #1a1a2e;
          margin-bottom: 15px;
        }
        .message {
          color: #64748b;
          font-size: 15px;
          line-height: 1.6;
          margin-bottom: 30px;
        }
        .otp-box {
          background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
          border: 2px dashed #fecaca;
          border-radius: 16px;
          padding: 25px;
          margin: 25px 0;
        }
        .otp-label {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: #64748b;
          margin-bottom: 12px;
        }
        .otp-code {
          font-size: 36px;
          font-weight: 800;
          letter-spacing: 8px;
          color: #f5576c;
          font-family: 'Courier New', monospace;
        }
        .expires {
          margin-top: 15px;
          font-size: 13px;
          color: #94a3b8;
        }
        .expires strong {
          color: #f59e0b;
        }
        .warning {
          background: #fef3c7;
          border-left: 4px solid #f59e0b;
          padding: 15px;
          border-radius: 8px;
          margin-top: 25px;
          text-align: left;
        }
        .warning-text {
          color: #92400e;
          font-size: 13px;
        }
        .info {
          background: #f0f9ff;
          border-left: 4px solid #0ea5e9;
          padding: 15px;
          border-radius: 8px;
          margin-top: 15px;
          text-align: left;
        }
        .info-text {
          color: #0369a1;
          font-size: 13px;
        }
        .footer { 
          text-align: center; 
          padding: 25px;
          background: #f8fafc;
          border-top: 1px solid #e2e8f0;
        }
        .footer-text {
          color: #94a3b8;
          font-size: 12px;
        }
        .footer-brand {
          color: #f5576c;
          font-weight: 600;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🔑</div>
          <h1>Password Reset</h1>
          <p>Alpha Portfolio</p>
        </div>
        <div class="content">
          <h2 class="greeting">Hi ${userName || 'there'}! 👋</h2>
          <p class="message">
            We received a request to reset your password. Use the code below to verify it's you.
          </p>
          
          <div class="otp-box">
            <div class="otp-label">Password Reset Code</div>
            <div class="otp-code">${otpCode}</div>
            <p class="expires">Expires in <strong>10 minutes</strong></p>
          </div>
          
          <div class="info">
            <p class="info-text">
              📧 If you didn't request a password reset, you can safely ignore this email. Your password won't be changed.
            </p>
          </div>
          
          <div class="warning">
            <p class="warning-text">
              🔒 Never share this code with anyone. Alpha Portfolio team will never ask for your reset code.
            </p>
          </div>
        </div>
        <div class="footer">
          <p class="footer-text">
            © ${new Date().getFullYear()} <a href="https://alphaportfolio.com" class="footer-brand">Alpha Portfolio</a>. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { action, email, code, userName, newPassword }: OTPRequest = await req.json();

    console.log(`OTP Action: ${action} for email: ${email}`);

    // SEND OTP FOR SIGNUP
    if (action === "send") {
      await supabase.from("otp_codes").delete().lt("expires_at", new Date().toISOString());
      await supabase.from("otp_codes").delete().eq("email", email);

      const otpCode = generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      const { error: insertError } = await supabase.from("otp_codes").insert({
        email,
        code: otpCode,
        expires_at: expiresAt.toISOString(),
      });

      if (insertError) {
        console.error("Error storing OTP:", insertError);
        throw new Error("Failed to generate verification code");
      }

      const emailHtml = getSignupEmailTemplate(otpCode, userName || "");

      const emailResponse = await resend.emails.send({
        from: "Alpha Portfolio <onboarding@resend.dev>",
        to: [email],
        subject: `${otpCode} - Your Alpha Portfolio Verification Code`,
        html: emailHtml,
      });

      console.log("OTP email sent:", emailResponse);

      return new Response(
        JSON.stringify({ success: true, message: "Verification code sent" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // VERIFY OTP FOR SIGNUP
    if (action === "verify") {
      if (!code) {
        throw new Error("Verification code is required");
      }

      const { data: otpRecord, error: findError } = await supabase
        .from("otp_codes")
        .select("*")
        .eq("email", email)
        .eq("code", code)
        .eq("verified", false)
        .gt("expires_at", new Date().toISOString())
        .maybeSingle();

      if (findError || !otpRecord) {
        return new Response(
          JSON.stringify({ success: false, error: "Invalid or expired verification code" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      await supabase
        .from("otp_codes")
        .update({ verified: true })
        .eq("id", otpRecord.id);

      console.log("OTP verified successfully for:", email);

      return new Response(
        JSON.stringify({ success: true, message: "Email verified successfully" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // SEND OTP FOR PASSWORD RESET
    if (action === "send_reset") {
      // Check if user exists
      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name, email")
        .eq("email", email)
        .maybeSingle();

      // Always return success to prevent email enumeration
      if (!profile) {
        console.log("Password reset requested for non-existent email:", email);
        return new Response(
          JSON.stringify({ success: true, message: "If the email exists, a reset code has been sent" }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      await supabase.from("otp_codes").delete().lt("expires_at", new Date().toISOString());
      await supabase.from("otp_codes").delete().eq("email", email);

      const otpCode = generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      const { error: insertError } = await supabase.from("otp_codes").insert({
        email,
        code: otpCode,
        expires_at: expiresAt.toISOString(),
      });

      if (insertError) {
        console.error("Error storing reset OTP:", insertError);
        throw new Error("Failed to generate reset code");
      }

      const emailHtml = getPasswordResetEmailTemplate(otpCode, profile.display_name || "");

      const emailResponse = await resend.emails.send({
        from: "Alpha Portfolio <onboarding@resend.dev>",
        to: [email],
        subject: `${otpCode} - Reset Your Alpha Portfolio Password`,
        html: emailHtml,
      });

      console.log("Password reset OTP email sent:", emailResponse);

      return new Response(
        JSON.stringify({ success: true, message: "Reset code sent" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // VERIFY OTP FOR PASSWORD RESET
    if (action === "verify_reset") {
      if (!code) {
        throw new Error("Reset code is required");
      }

      const { data: otpRecord, error: findError } = await supabase
        .from("otp_codes")
        .select("*")
        .eq("email", email)
        .eq("code", code)
        .eq("verified", false)
        .gt("expires_at", new Date().toISOString())
        .maybeSingle();

      if (findError || !otpRecord) {
        return new Response(
          JSON.stringify({ success: false, error: "Invalid or expired reset code" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Mark OTP as verified
      await supabase
        .from("otp_codes")
        .update({ verified: true })
        .eq("id", otpRecord.id);

      console.log("Reset OTP verified for:", email);

      return new Response(
        JSON.stringify({ success: true, message: "Code verified, you can now reset your password" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // RESET PASSWORD
    if (action === "reset_password") {
      if (!code || !newPassword) {
        throw new Error("Code and new password are required");
      }

      // Verify the OTP was verified
      const { data: otpRecord, error: findError } = await supabase
        .from("otp_codes")
        .select("*")
        .eq("email", email)
        .eq("code", code)
        .eq("verified", true)
        .gt("expires_at", new Date().toISOString())
        .maybeSingle();

      if (findError || !otpRecord) {
        return new Response(
          JSON.stringify({ success: false, error: "Invalid or expired session. Please start over." }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Get user by email
      const { data: userData } = await supabase.auth.admin.listUsers();
      const user = userData?.users?.find(u => u.email === email);

      if (!user) {
        return new Response(
          JSON.stringify({ success: false, error: "User not found" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Update password
      const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
        password: newPassword,
      });

      if (updateError) {
        console.error("Error updating password:", updateError);
        throw new Error("Failed to update password");
      }

      // Delete the OTP record
      await supabase.from("otp_codes").delete().eq("id", otpRecord.id);

      console.log("Password reset successfully for:", email);

      return new Response(
        JSON.stringify({ success: true, message: "Password updated successfully" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    throw new Error("Invalid action");
  } catch (error: any) {
    console.error("OTP verification error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
