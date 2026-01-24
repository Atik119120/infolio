import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const ADMIN_EMAIL = "atik.magicbox@gmail.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  type: "welcome" | "publish_request" | "support" | "account_approved" | "account_rejected" | "publish_approved" | "theme_purchase";
  userId?: string;
  userEmail?: string;
  userName?: string;
  message?: string;
  subject?: string;
  // Theme purchase fields
  themeId?: string;
  themeName?: string;
  transactionId?: string;
  paymentMethod?: string;
  amount?: number;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { 
      type, userId, userEmail, userName, message, subject,
      themeId, themeName, transactionId, paymentMethod, amount 
    }: NotificationRequest = await req.json();

    console.log(`Processing notification: ${type} for user: ${userEmail || userId}`);

    let emailTo: string;
    let emailSubject: string;
    let emailHtml: string;

    switch (type) {
      case "welcome":
        // Send welcome email to new user
        emailTo = userEmail!;
        emailSubject = "🎉 Welcome to Alpha Portfolio!";
        emailHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
              .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
              .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Welcome to Alpha Portfolio!</h1>
              </div>
              <div class="content">
                <h2>Hi ${userName || 'there'}! 👋</h2>
                <p>Thank you for joining Alpha Portfolio. We're excited to have you on board!</p>
                <p>Here's what happens next:</p>
                <ol>
                  <li>✅ Your email has been verified</li>
                  <li>⏳ Your account is pending admin approval</li>
                  <li>🚀 Once approved, you can publish your portfolio</li>
                </ol>
                <p>In the meantime, you can start building your portfolio and explore our beautiful themes.</p>
                <a href="https://alphaportfolio.com/dashboard" class="button">Go to Dashboard</a>
                <p style="margin-top: 20px;">If you have any questions, feel free to reach out to us.</p>
              </div>
              <div class="footer">
                <p>© 2024 Alpha Portfolio. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `;

        // Also notify admin about new user
        await resend.emails.send({
          from: "Alpha Portfolio <onboarding@resend.dev>",
          to: [ADMIN_EMAIL],
          subject: `🆕 New User Registration: ${userName || userEmail}`,
          html: `
            <h2>New User Registration</h2>
            <p><strong>Name:</strong> ${userName}</p>
            <p><strong>Email:</strong> ${userEmail}</p>
            <p>Please review and approve this account in the admin panel.</p>
            <a href="https://alphaportfolio.com/admin/users">View in Admin Panel</a>
          `,
        });
        break;

      case "publish_request":
        // Send to admin when user requests to publish
        emailTo = ADMIN_EMAIL;
        emailSubject = `📝 Publish Request from ${userName || userEmail}`;
        emailHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
              .button { display: inline-block; background: #f5576c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>New Publish Request</h1>
              </div>
              <div class="content">
                <h2>User Details:</h2>
                <p><strong>Name:</strong> ${userName}</p>
                <p><strong>Email:</strong> ${userEmail}</p>
                <p><strong>Message:</strong> ${message || 'No message provided'}</p>
                <a href="https://alphaportfolio.com/admin/users" class="button">Review in Admin Panel</a>
              </div>
            </div>
          </body>
          </html>
        `;

        // Also send confirmation to user
        if (userEmail) {
          await resend.emails.send({
            from: "Alpha Portfolio <onboarding@resend.dev>",
            to: [userEmail],
            subject: "📬 Publish Request Received - Alpha Portfolio",
            html: `
              <h2>Your publish request has been received!</h2>
              <p>Hi ${userName},</p>
              <p>We've received your request to publish your portfolio. Our team will review it shortly.</p>
              <p>You'll receive an email once your portfolio is approved.</p>
              <p>Thank you for your patience!</p>
            `,
          });
        }
        break;

      case "support":
        // Send support message to admin
        emailTo = ADMIN_EMAIL;
        emailSubject = subject || `🆘 Support Request from ${userName || userEmail}`;
        emailHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%); color: #333; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
              .message-box { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #ff9a9e; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Support Request</h1>
              </div>
              <div class="content">
                <h2>From:</h2>
                <p><strong>Name:</strong> ${userName}</p>
                <p><strong>Email:</strong> ${userEmail}</p>
                <div class="message-box">
                  <h3>Message:</h3>
                  <p>${message}</p>
                </div>
                <p>Reply directly to this email to respond to the user.</p>
              </div>
            </div>
          </body>
          </html>
        `;

        // Send confirmation to user
        if (userEmail) {
          await resend.emails.send({
            from: "Alpha Portfolio <onboarding@resend.dev>",
            to: [userEmail],
            subject: "✅ Support Request Received - Alpha Portfolio",
            html: `
              <h2>We've received your message!</h2>
              <p>Hi ${userName},</p>
              <p>Thank you for reaching out. Our team will get back to you as soon as possible.</p>
              <p>Your message:</p>
              <blockquote style="background: #f5f5f5; padding: 15px; border-left: 4px solid #667eea;">${message}</blockquote>
              <p>Best regards,<br>Alpha Portfolio Team</p>
            `,
          });
        }
        break;

      case "account_approved":
        // Send approval notification to user
        emailTo = userEmail!;
        emailSubject = "🎉 Your Account is Approved! - Alpha Portfolio";
        emailHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
              .button { display: inline-block; background: #11998e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎉 Account Approved!</h1>
              </div>
              <div class="content">
                <h2>Congratulations, ${userName}!</h2>
                <p>Great news! Your Alpha Portfolio account has been approved by our admin team.</p>
                <p>You can now:</p>
                <ul>
                  <li>✅ Publish your portfolio</li>
                  <li>✅ Get your own subdomain</li>
                  <li>✅ Connect custom domains</li>
                </ul>
                <a href="https://alphaportfolio.com/dashboard" class="button">Go to Dashboard</a>
              </div>
            </div>
          </body>
          </html>
        `;
        break;

      case "publish_approved":
        // Send publish approval notification to user
        emailTo = userEmail!;
        emailSubject = "🚀 Your Portfolio is Now Live! - Alpha Portfolio";
        emailHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
              .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🚀 Portfolio Published!</h1>
              </div>
              <div class="content">
                <h2>Congratulations, ${userName}!</h2>
                <p>Your portfolio has been approved and is now live for the world to see!</p>
                <p>Share your portfolio link with friends, colleagues, and potential employers.</p>
                <a href="https://alphaportfolio.com/dashboard" class="button">View Your Portfolio</a>
              </div>
            </div>
          </body>
          </html>
        `;
        break;

      case "account_rejected":
        emailTo = userEmail!;
        emailSubject = "Account Status Update - Alpha Portfolio";
        emailHtml = `
          <h2>Account Status Update</h2>
          <p>Hi ${userName},</p>
          <p>Unfortunately, your account approval request was not approved at this time.</p>
          <p>${message || 'Please contact support for more information.'}</p>
        `;
        break;

      case "theme_purchase":
        // Send to admin when user purchases a theme
        emailTo = ADMIN_EMAIL;
        emailSubject = `💰 New Theme Purchase: ${themeName}`;
        emailHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
              .info-box { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0; }
              .button { display: inline-block; background: #f59e0b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>💰 New Theme Purchase</h1>
              </div>
              <div class="content">
                <div class="info-box">
                  <h3>Purchase Details:</h3>
                  <p><strong>Theme:</strong> ${themeName}</p>
                  <p><strong>Amount:</strong> ৳${amount}</p>
                  <p><strong>Payment Method:</strong> ${paymentMethod?.toUpperCase()}</p>
                  <p><strong>Transaction ID:</strong> ${transactionId}</p>
                </div>
                <p>Please verify the payment and approve/reject the purchase request in the admin panel.</p>
                <a href="https://alphaportfolio.com/admin/themes" class="button">Review in Admin Panel</a>
              </div>
            </div>
          </body>
          </html>
        `;
        break;

      default:
        throw new Error("Invalid notification type");
    }

    const emailResponse = await resend.emails.send({
      from: "Alpha Portfolio <onboarding@resend.dev>",
      to: [emailTo],
      subject: emailSubject,
      html: emailHtml,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);