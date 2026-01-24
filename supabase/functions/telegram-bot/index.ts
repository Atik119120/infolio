import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN')!;
const TELEGRAM_ADMIN_CHAT_ID = Deno.env.get('TELEGRAM_ADMIN_CHAT_ID')!;
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Send message to Telegram
async function sendTelegramMessage(chatId: string, text: string, replyMarkup?: object) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  
  const body: Record<string, unknown> = {
    chat_id: chatId,
    text: text,
    parse_mode: 'HTML',
  };
  
  if (replyMarkup) {
    body.reply_markup = JSON.stringify(replyMarkup);
  }
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  
  const result = await response.json();
  console.log('Telegram API response:', result);
  return result;
}

// Edit Telegram message
async function editTelegramMessage(chatId: string, messageId: number, text: string) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/editMessageText`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      message_id: messageId,
      text: text,
      parse_mode: 'HTML',
    }),
  });
  
  return response.json();
}

// Answer callback query
async function answerCallbackQuery(callbackQueryId: string, text?: string) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/answerCallbackQuery`;
  
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      callback_query_id: callbackQueryId,
      text: text || 'Action completed',
    }),
  });
}

// Handle different notification types
async function handleNotification(type: string, data: Record<string, unknown>) {
  let message = '';
  let inlineKeyboard = null;
  
  switch (type) {
    case 'new_user':
      {
        const displayName = (data.displayName ?? data.userName ?? 'N/A') as string;
        const email = (data.email ?? data.userEmail ?? 'N/A') as string;
        const phone = (data.phone ?? 'N/A') as string;
        const username = (data.username ?? 'N/A') as string;
        const userId = (data.userId ?? data.user_id ?? 'N/A') as string;

        message = `🆕 <b>নতুন ইউজার রেজিস্ট্রেশন!</b>\n\n` +
          `👤 নাম: ${displayName}\n` +
          `📧 ইমেইল: ${email}\n` +
          `📱 ফোন: ${phone}\n` +
          `🔗 Username: @${username}\n` +
          `🆔 User ID: <code>${userId}</code>`;
        
        inlineKeyboard = {
          inline_keyboard: [
            [
              { text: '✅ Approve', callback_data: `approve_user:${userId}` },
              { text: '❌ Reject', callback_data: `reject_user:${userId}` }
            ]
          ]
        };
      }
      
      break;
      
    case 'publish_request':
      {
        const displayName = (data.displayName ?? data.userName ?? data.username ?? 'N/A') as string;
        const email = (data.email ?? data.userEmail ?? 'N/A') as string;
        const username = (data.username ?? 'N/A') as string;
        const userId = (data.userId ?? data.user_id ?? 'N/A') as string;

        message = `📤 <b>Portfolio Publish Request!</b>\n\n` +
          `👤 ইউজার: ${displayName}\n` +
          `📧 ইমেইল: ${email}\n` +
          `🔗 Username: @${username}\n` +
          `🆔 User ID: <code>${userId}</code>`;
      
        inlineKeyboard = {
          inline_keyboard: [
            [
              { text: '✅ Approve Publish', callback_data: `approve_publish:${userId}` },
              { text: '❌ Reject Publish', callback_data: `reject_publish:${userId}` }
            ],
            [
              { text: '👁 View Portfolio', url: `https://alphaportfolio0.lovable.app/u/${username}` }
            ]
          ]
        };
      }
      break;
      
    case 'theme_purchase':
      {
        const displayName = (data.displayName ?? data.userName ?? data.username ?? 'N/A') as string;
        const email = (data.email ?? data.userEmail ?? 'N/A') as string;
        const themeName = (data.themeName ?? 'N/A') as string;
        const amount = (data.amount ?? 'N/A') as string;
        const paymentMethod = (data.paymentMethod ?? 'N/A') as string;
        const transactionId = (data.transactionId ?? 'N/A') as string;
        const purchaseId = (data.purchaseId ?? data.id ?? 'N/A') as string;
        
        message = `💰 <b>নতুন Theme Purchase Request!</b>\n\n` +
          `👤 ইউজার: ${displayName}\n` +
          `📧 ইমেইল: ${email}\n` +
          `🎨 Theme: ${themeName}\n` +
          `💵 Amount: ৳${amount}\n` +
          `💳 Payment Method: ${paymentMethod}\n` +
          `🧾 Transaction ID: <code>${transactionId}</code>\n` +
          `🆔 Purchase ID: <code>${purchaseId}</code>`;
      
        inlineKeyboard = {
          inline_keyboard: [
            [
              { text: '✅ Approve Purchase', callback_data: `approve_theme:${purchaseId}` },
              { text: '❌ Reject Purchase', callback_data: `reject_theme:${purchaseId}` }
            ]
          ]
        };
      }
      break;
      
    case 'support_message':
      {
        const userName = (data.userName ?? data.displayName ?? 'N/A') as string;
        const userEmail = (data.userEmail ?? data.email ?? 'N/A') as string;
        const issueType = (data.issueType ?? 'N/A') as string;
        const subject = (data.subject ?? 'N/A') as string;
        const bodyMessage = (data.message ?? 'N/A') as string;
        const messageId = (data.messageId ?? data.id ?? 'N/A') as string;

        message = `📩 <b>নতুন Support Message!</b>\n\n` +
          `👤 ইউজার: ${userName}\n` +
          `📧 ইমেইল: ${userEmail}\n` +
          `📌 Issue Type: ${issueType}\n` +
          `📝 Subject: ${subject}\n\n` +
          `💬 Message:\n${bodyMessage}\n\n` +
          `🆔 Message ID: <code>${messageId}</code>`;
      
        inlineKeyboard = {
          inline_keyboard: [
            [
              { text: '💬 Reply', callback_data: `reply_support:${messageId}` },
              { text: '✅ Resolve', callback_data: `resolve_support:${messageId}` }
            ],
            [
              { text: '🔒 Close', callback_data: `close_support:${messageId}` }
            ]
          ]
        };
      }
      break;
      
    case 'contact_message':
      message = `✉️ <b>নতুন Contact Message!</b>\n\n` +
        `👤 From: ${data.senderName}\n` +
        `📧 Email: ${data.senderEmail}\n` +
        `📝 Message:\n${data.message}\n\n` +
        `🎯 To Portfolio: ${data.portfolioOwner}\n` +
        `🆔 Message ID: <code>${data.messageId}</code>`;
      break;
      
    default:
      message = `📢 <b>Notification</b>\n\n${JSON.stringify(data, null, 2)}`;
  }
  
  return sendTelegramMessage(TELEGRAM_ADMIN_CHAT_ID, message, inlineKeyboard || undefined);
  
  
}

// Handle Telegram callback (button clicks)
async function handleCallback(callbackQuery: Record<string, unknown>) {
  const callbackData = callbackQuery.data as string;
  const messageId = (callbackQuery.message as Record<string, unknown>)?.message_id as number;
  const chatId = ((callbackQuery.message as Record<string, unknown>)?.chat as Record<string, unknown>)?.id as string;
  
  console.log('Callback data:', callbackData);
  
  const [action, rawId] = callbackData.split(':');
  const id = rawId?.trim();
  if (!id || id === 'undefined' || id === 'null') {
    await answerCallbackQuery(callbackQuery.id as string, '❌ Invalid request (missing ID).');
    return;
  }
  let responseText = '';
  let updatedMessage = '';
  
  try {
    switch (action) {
      case 'approve_user': {
        const { error } = await supabase
          .from('profiles')
          .update({ is_approved: true, approved_at: new Date().toISOString() })
          .eq('user_id', id);
        
        if (error) throw error;
        
        // Get user email for notification
        const { data: profile } = await supabase
          .from('profiles')
          .select('email, display_name')
          .eq('user_id', id)
          .single();
        
        responseText = '✅ User approved!';
        updatedMessage = `✅ <b>USER APPROVED</b>\n\nUser ID: <code>${id}</code>\nApproved via Telegram`;
        
        // Send email notification
        if (profile?.email) {
          await fetch(`${SUPABASE_URL}/functions/v1/send-notification`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'account_approved',
              userEmail: profile.email,
              userName: profile.display_name || 'User'
            })
          });
        }
        break;
      }
      
      case 'reject_user': {
        const { error } = await supabase
          .from('profiles')
          .update({ is_approved: false })
          .eq('user_id', id);
        
        if (error) throw error;
        
        const { data: profile } = await supabase
          .from('profiles')
          .select('email, display_name')
          .eq('user_id', id)
          .single();
        
        responseText = '❌ User rejected!';
        updatedMessage = `❌ <b>USER REJECTED</b>\n\nUser ID: <code>${id}</code>\nRejected via Telegram`;
        
        if (profile?.email) {
          await fetch(`${SUPABASE_URL}/functions/v1/send-notification`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'account_rejected',
              userEmail: profile.email,
              userName: profile.display_name || 'User'
            })
          });
        }
        break;
      }
      
      case 'approve_publish': {
        const { error } = await supabase
          .from('portfolios')
          .update({ is_published: true, pending_publish: false })
          .eq('user_id', id);
        
        if (error) throw error;
        
        const { data: profile } = await supabase
          .from('profiles')
          .select('email, display_name, username')
          .eq('user_id', id)
          .single();
        
        responseText = '✅ Portfolio published!';
        updatedMessage = `✅ <b>PORTFOLIO PUBLISHED</b>\n\nUser: @${profile?.username}\nApproved via Telegram`;
        
        if (profile?.email) {
          await fetch(`${SUPABASE_URL}/functions/v1/send-notification`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'publish_approved',
              userEmail: profile.email,
              userName: profile.display_name || profile.username || 'User',
              username: profile.username
            })
          });
        }
        break;
      }
      
      case 'reject_publish': {
        const { error } = await supabase
          .from('portfolios')
          .update({ pending_publish: false })
          .eq('user_id', id);
        
        if (error) throw error;
        
        responseText = '❌ Publish request rejected!';
        updatedMessage = `❌ <b>PUBLISH REJECTED</b>\n\nUser ID: <code>${id}</code>\nRejected via Telegram`;
        break;
      }
      
      case 'approve_theme': {
        const { data: purchase, error: fetchError } = await supabase
          .from('theme_purchases')
          .select('*, profiles!theme_purchases_user_id_fkey(email, display_name)')
          .eq('id', id)
          .single();
        
        if (fetchError) {
          // Try without foreign key
          const { data: purchaseOnly, error: error2 } = await supabase
            .from('theme_purchases')
            .select('*')
            .eq('id', id)
            .single();
          
          if (error2) throw error2;
          
          const { error: updateError } = await supabase
            .from('theme_purchases')
            .update({ status: 'approved', approved_at: new Date().toISOString() })
            .eq('id', id);
          
          if (updateError) throw updateError;
        } else {
          const { error: updateError } = await supabase
            .from('theme_purchases')
            .update({ status: 'approved', approved_at: new Date().toISOString() })
            .eq('id', id);
          
          if (updateError) throw updateError;
        }
        
        responseText = '✅ Theme purchase approved!';
        updatedMessage = `✅ <b>THEME PURCHASE APPROVED</b>\n\nPurchase ID: <code>${id}</code>\nApproved via Telegram`;
        break;
      }
      
      case 'reject_theme': {
        const { error } = await supabase
          .from('theme_purchases')
          .update({ status: 'rejected' })
          .eq('id', id);
        
        if (error) throw error;
        
        responseText = '❌ Theme purchase rejected!';
        updatedMessage = `❌ <b>THEME PURCHASE REJECTED</b>\n\nPurchase ID: <code>${id}</code>\nRejected via Telegram`;
        break;
      }
      
      case 'resolve_support': {
        const { error } = await supabase
          .from('support_messages')
          .update({ status: 'resolved', updated_at: new Date().toISOString() })
          .eq('id', id);
        
        if (error) throw error;
        
        responseText = '✅ Support message resolved!';
        updatedMessage = `✅ <b>SUPPORT RESOLVED</b>\n\nMessage ID: <code>${id}</code>\nResolved via Telegram`;
        break;
      }
      
      case 'close_support': {
        const { error } = await supabase
          .from('support_messages')
          .update({ status: 'closed', updated_at: new Date().toISOString() })
          .eq('id', id);
        
        if (error) throw error;
        
        responseText = '🔒 Support message closed!';
        updatedMessage = `🔒 <b>SUPPORT CLOSED</b>\n\nMessage ID: <code>${id}</code>\nClosed via Telegram`;
        break;
      }
      
      case 'reply_support': {
        // Store the message ID for reply tracking
        await supabase
          .from('support_messages')
          .update({ status: 'in_progress', updated_at: new Date().toISOString() })
          .eq('id', id);
        
        responseText = '💬 Please reply to this message with your response. It will be sent to the user.';
        
        // Send instruction message
        await sendTelegramMessage(
          chatId,
          `💬 <b>Reply Mode Activated</b>\n\nReply to this message with your response for support ticket:\n<code>${id}</code>\n\nYour reply will be sent to the user via email.`
        );
        break;
      }
      
      default:
        responseText = 'Unknown action';
    }
    
    // Answer the callback
    await answerCallbackQuery(callbackQuery.id as string, responseText);
    
    // Update the original message if we have an updated message
    if (updatedMessage && messageId) {
      await editTelegramMessage(chatId, messageId, updatedMessage);
    }
    
  } catch (error) {
    console.error('Error handling callback:', error);
    await answerCallbackQuery(callbackQuery.id as string, `❌ Error: ${(error as Error).message}`);
  }
}

// Handle text message (for replies)
async function handleTextMessage(message: Record<string, unknown>) {
  const text = message.text as string;
  const replyTo = message.reply_to_message as Record<string, unknown> | undefined;
  
  if (!replyTo) {
    // Not a reply, might be a command
    if (text === '/start') {
      await sendTelegramMessage(
        (message.chat as Record<string, unknown>).id as string,
        `🤖 <b>Alpha Portfolio Admin Bot</b>\n\n` +
        `এই বটের মাধ্যমে আপনি ওয়েবসাইটের সব notifications পাবেন এবং Telegram থেকেই:\n\n` +
        `✅ User approve/reject করতে পারবেন\n` +
        `📤 Portfolio publish approve করতে পারবেন\n` +
        `💰 Theme purchase approve করতে পারবেন\n` +
        `💬 Support messages reply করতে পারবেন\n\n` +
        `All actions sync real-time with the website!`
      );
    } else if (text === '/stats') {
      // Get quick stats
      const [users, portfolios, purchases, support] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('is_approved', false),
        supabase.from('portfolios').select('id', { count: 'exact', head: true }).eq('pending_publish', true),
        supabase.from('theme_purchases').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('support_messages').select('id', { count: 'exact', head: true }).eq('status', 'open')
      ]);
      
      await sendTelegramMessage(
        (message.chat as Record<string, unknown>).id as string,
        `📊 <b>Quick Stats</b>\n\n` +
        `👤 Pending Users: ${users.count || 0}\n` +
        `📤 Pending Publishes: ${portfolios.count || 0}\n` +
        `💰 Pending Purchases: ${purchases.count || 0}\n` +
        `📩 Open Support: ${support.count || 0}`
      );
    }
    return;
  }
  
  // Check if this is a reply to a support message instruction
  const replyText = (replyTo.text as string) || '';
  const supportIdMatch = replyText.match(/support ticket:\n<code>([^<]+)<\/code>/);
  
  if (supportIdMatch) {
    const supportId = supportIdMatch[1];
    
    // Update support message with admin reply
    const { data: supportMsg, error: fetchError } = await supabase
      .from('support_messages')
      .select('*, profiles!support_messages_user_id_fkey(email, display_name)')
      .eq('id', supportId)
      .single();

    let supportRecord: Record<string, unknown> | null = supportMsg as unknown as Record<string, unknown> | null;
    let profileEmail: string | null = (supportMsg?.profiles as Record<string, unknown> | undefined)?.email as string | null;
    let profileName: string | null = (supportMsg?.profiles as Record<string, unknown> | undefined)?.display_name as string | null;

    if (fetchError || !supportRecord) {
      console.error('Error fetching support message (join):', fetchError);

      // Try without foreign key
      const { data: supportOnly, error: error2 } = await supabase
        .from('support_messages')
        .select('*')
        .eq('id', supportId)
        .single();

      if (error2 || !supportOnly) {
        await sendTelegramMessage(
          (message.chat as Record<string, unknown>).id as string,
          `❌ Support message not found: ${supportId}`
        );
        return;
      }

      supportRecord = supportOnly as unknown as Record<string, unknown>;

      // Fetch profile separately
      const userId = supportOnly.user_id as string;
      const { data: p } = await supabase
        .from('profiles')
        .select('email, display_name, username')
        .eq('user_id', userId)
        .maybeSingle();
      profileEmail = (p?.email as string | null) ?? null;
      profileName = ((p?.display_name as string | null) ?? (p?.username as string | null)) ?? null;
    }

    // Update the reply (this will trigger realtime updates for the user inbox)
    await supabase
      .from('support_messages')
      .update({
        admin_reply: text,
        replied_at: new Date().toISOString(),
        status: 'resolved',
        updated_at: new Date().toISOString(),
      })
      .eq('id', supportId);

    // Notify user (email) via send-notification using canonical fields
    const subject = (supportRecord?.subject as string | undefined) ?? 'Support Reply';
    if (profileEmail) {
      await fetch(`${SUPABASE_URL}/functions/v1/send-notification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'support_reply',
          userEmail: profileEmail,
          userName: profileName || 'User',
          subject,
          message: text,
        })
      });
    }
    
    await sendTelegramMessage(
      (message.chat as Record<string, unknown>).id as string,
      `✅ <b>Reply Sent!</b>\n\nYour reply has been sent to the user via email and saved to the support ticket.`
    );
  }
}

// Main handler
serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const body = await req.json();
    console.log('Received request:', JSON.stringify(body, null, 2));
    
    // Check if this is a Telegram webhook update
    if (body.callback_query) {
      await handleCallback(body.callback_query);
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    if (body.message) {
      await handleTextMessage(body.message);
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // This is a notification request from our system
    if (body.type) {
      const result = await handleNotification(body.type, body.data || body);
      return new Response(JSON.stringify({ success: true, result }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ error: 'Unknown request type' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
