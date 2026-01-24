import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import {
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  MessageCircle,
  Headphones,
  ArrowLeft,
  Send,
  Plus,
  Loader2,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface SupportMessage {
  id: string;
  subject: string;
  issue_type: string;
  message: string;
  status: string;
  admin_reply: string | null;
  replied_at: string | null;
  created_at: string;
}

const STATUS_CONFIG = {
  open: { label: "Pending", color: "bg-yellow-500", icon: AlertCircle },
  in_progress: { label: "In Progress", color: "bg-blue-500", icon: Clock },
  resolved: { label: "Resolved", color: "bg-green-500", icon: CheckCircle },
  closed: { label: "Closed", color: "bg-slate-500", icon: XCircle },
};

const ISSUE_TYPES = [
  { value: "theme_purchase", label: "Theme Purchase Issue" },
  { value: "account_approval", label: "Account Approval" },
  { value: "portfolio_issue", label: "Portfolio Problem" },
  { value: "payment_issue", label: "Payment Issue" },
  { value: "technical", label: "Technical Problem" },
  { value: "other", label: "Other" },
];

export default function DashboardSupport() {
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState<SupportMessage | null>(null);
  const [newReplyIds, setNewReplyIds] = useState<Set<string>>(new Set());
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [newMessageForm, setNewMessageForm] = useState({
    issueType: "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const { user } = useAuth();
  const previousMessagesRef = useRef<Map<string, SupportMessage>>(new Map());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      fetchMessages();

      // Set up realtime subscription
      const channel = supabase
        .channel("support-messages-changes")
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "support_messages",
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            console.log("Realtime update received:", payload);
            const updatedMessage = payload.new as SupportMessage;
            const oldMessage = previousMessagesRef.current.get(updatedMessage.id);

            // Check if this is a new reply
            if (updatedMessage.admin_reply && (!oldMessage || !oldMessage.admin_reply)) {
              // Show notification
              toast.success(
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                    <Headphones className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold">New Reply from Admin!</p>
                    <p className="text-sm opacity-80 truncate max-w-[200px]">
                      {updatedMessage.subject}
                    </p>
                  </div>
                </div>,
                {
                  duration: 8000,
                  action: {
                    label: "View",
                    onClick: () => setSelectedChat(updatedMessage),
                  },
                }
              );

              // Mark as new reply
              setNewReplyIds((prev) => new Set([...prev, updatedMessage.id]));

              // Play notification sound
              try {
                const audio = new Audio(
                  "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdH2Onp+ZjYF3cXN8iZWdoJyVi4F4cXR+i5aho5yTiX95c3Z/jJihn5qRh355dHd/jJeeoJqRh394c3Z+i5WcnZiPhn52c3V9ipOZmpaOhH10c3R8iJGWlZKLgnt1c3N6hY6Tk5CLgHp0c3J5hIyQkI2IfXdzcnV4goqNjYuGfHZzc3R2gIiKiomEent2dHNzdoGGiIiGgnt5dnNyc3eAhYaFgn15dnRyc3R4foOEg4B7eHV0cnJ0d3yBgoGAe3h2dHJyc3V5fX9/fnx5d3VzcnN0dnh7fX18enh2dHNyc3R2eHp7e3p5d3Z0c3Jyc3R2eHl5eXl4d3Z0c3JycnN1dnd4eHh3dnV0c3JycnN0dXZ3d3d3dnVzc3NycnJzdHV1dnZ2dnV0c3JycnJyc3R0dXV1dXV0c3JycnJyc3N0dHR0dHRzc3JycnJyc3NzdHR0dHNzc3JycnFxcnJyc3NzdHNzc3Jyc"
                );
                audio.volume = 0.3;
                audio.play().catch(() => {});
              } catch (e) {}
            }

            // Update messages list
            setMessages((prev) =>
              prev.map((msg) => (msg.id === updatedMessage.id ? updatedMessage : msg))
            );

            // Update selected chat if viewing the updated message
            if (selectedChat?.id === updatedMessage.id) {
              setSelectedChat(updatedMessage);
            }

            // Update previous messages ref
            previousMessagesRef.current.set(updatedMessage.id, updatedMessage);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, selectedChat]);

  const fetchMessages = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("support_messages")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMessages(data || []);

      // Store messages for comparison
      (data || []).forEach((msg) => {
        previousMessagesRef.current.set(msg.id, msg);
      });
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!user || !newMessageForm.issueType || !newMessageForm.subject.trim() || !newMessageForm.message.trim()) {
      toast.error("সব ফিল্ড পূরণ করুন");
      return;
    }

    setSending(true);
    try {
      // Get user profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name, email, username")
        .eq("user_id", user.id)
        .single();

      // Insert support message
      const { data: newMsg, error: insertError } = await supabase
        .from("support_messages")
        .insert({
          user_id: user.id,
          issue_type: newMessageForm.issueType,
          subject: newMessageForm.subject.trim(),
          message: newMessageForm.message.trim(),
          status: "open",
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Send notification to admin
      await supabase.functions.invoke("send-notification", {
        body: {
          type: "support_message",
          userId: user.id,
          userName: profile?.display_name || "User",
          userEmail: profile?.email || user.email,
          username: profile?.username,
          issueType: ISSUE_TYPES.find((t) => t.value === newMessageForm.issueType)?.label || newMessageForm.issueType,
          subject: newMessageForm.subject.trim(),
          message: newMessageForm.message.trim(),
        },
      });

      toast.success("মেসেজ পাঠানো হয়েছে! ✅");
      setNewMessageForm({ issueType: "", subject: "", message: "" });
      setShowNewMessage(false);
      fetchMessages();
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("মেসেজ পাঠাতে সমস্যা হয়েছে");
    } finally {
      setSending(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.open;
    const Icon = config.icon;
    return (
      <Badge className={`${config.color} text-white text-[10px] px-1.5 py-0`}>
        <Icon className="w-2.5 h-2.5 mr-0.5" />
        {config.label}
      </Badge>
    );
  };

  const unrepliedCount = messages.filter((m) => !m.admin_reply && m.status !== "closed").length;

  // Messenger-style Chat View
  const ChatView = ({ chat, onBack }: { chat: SupportMessage; onBack: () => void }) => (
    <div className="flex flex-col h-full bg-background rounded-2xl border border-border/50 overflow-hidden">
      {/* Chat Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border/50 bg-muted/30">
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
          <Headphones className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold truncate">{chat.subject}</p>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] h-5">
              {chat.issue_type}
            </Badge>
            {getStatusBadge(chat.status)}
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-4 bg-gradient-to-b from-muted/20 to-background">
        <div className="space-y-4 max-w-2xl mx-auto">
          {/* Date indicator */}
          <div className="flex justify-center">
            <span className="text-[11px] text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
              {format(new Date(chat.created_at), "MMMM dd, yyyy")}
            </span>
          </div>

          {/* User's Message */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-end"
          >
            <div className="max-w-[80%]">
              <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-md px-4 py-3 shadow-lg shadow-primary/20">
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{chat.message}</p>
              </div>
              <div className="flex items-center justify-end gap-1.5 mt-1.5 px-1">
                <span className="text-[11px] text-muted-foreground">
                  {format(new Date(chat.created_at), "h:mm a")}
                </span>
                <CheckCircle className="w-3.5 h-3.5 text-primary" />
              </div>
            </div>
          </motion.div>

          {/* Admin Reply or Waiting */}
          {chat.admin_reply ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex justify-start"
            >
              <div className="max-w-[80%]">
                <div className="flex items-end gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-green-500/20">
                    <Headphones className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-card border border-border/50 rounded-2xl rounded-tl-md px-4 py-3 shadow-lg">
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{chat.admin_reply}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-1.5 ml-10 px-1">
                  <span className="text-[11px] text-muted-foreground">
                    Admin • {chat.replied_at ? format(new Date(chat.replied_at), "h:mm a") : ""}
                  </span>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="flex items-end gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center flex-shrink-0 animate-pulse">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <div className="bg-muted/50 border border-border/30 rounded-2xl rounded-tl-md px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                      <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                      <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                    </div>
                    <span className="text-xs text-muted-foreground">Admin is typing...</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Status Footer */}
      <div className="p-4 border-t border-border/50 bg-muted/20">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          {chat.status === "resolved" ? (
            <>
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>This conversation has been resolved</span>
            </>
          ) : chat.status === "closed" ? (
            <>
              <XCircle className="w-5 h-5 text-slate-500" />
              <span>This conversation is closed</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-primary animate-pulse" />
              <span>Waiting for admin response...</span>
            </>
          )}
        </div>
      </div>
    </div>
  );

  // New Message Form
  const NewMessageView = ({ onBack }: { onBack: () => void }) => (
    <div className="flex flex-col h-full bg-background rounded-2xl border border-border/50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border/50 bg-muted/30">
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
          <Plus className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-semibold">New Message</p>
          <p className="text-xs text-muted-foreground">Send a new support request</p>
        </div>
      </div>

      {/* Form */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 max-w-lg mx-auto">
          <div className="space-y-2">
            <label className="text-sm font-medium">সমস্যার ধরন</label>
            <Select
              value={newMessageForm.issueType}
              onValueChange={(v) => setNewMessageForm((p) => ({ ...p, issueType: v }))}
            >
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue placeholder="সমস্যার ধরন নির্বাচন করুন" />
              </SelectTrigger>
              <SelectContent>
                {ISSUE_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">বিষয়</label>
            <Input
              placeholder="আপনার সমস্যার বিষয় লিখুন"
              value={newMessageForm.subject}
              onChange={(e) => setNewMessageForm((p) => ({ ...p, subject: e.target.value }))}
              className="h-12 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">বিস্তারিত বর্ণনা</label>
            <Textarea
              placeholder="আপনার সমস্যা বিস্তারিত লিখুন..."
              value={newMessageForm.message}
              onChange={(e) => setNewMessageForm((p) => ({ ...p, message: e.target.value }))}
              rows={6}
              className="rounded-xl resize-none"
            />
          </div>
        </div>
      </ScrollArea>

      {/* Send Button */}
      <div className="p-4 border-t border-border/50">
        <Button
          onClick={handleSendMessage}
          disabled={sending || !newMessageForm.issueType || !newMessageForm.subject.trim() || !newMessageForm.message.trim()}
          className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium"
        >
          {sending ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              মেসেজ পাঠান
            </>
          )}
        </Button>
      </div>
    </div>
  );

  // Chat List Item
  const ChatListItem = ({ msg, onClick }: { msg: SupportMessage; onClick: () => void }) => {
    const isNewReply = newReplyIds.has(msg.id);

    const handleClick = () => {
      if (isNewReply) {
        setNewReplyIds((prev) => {
          const next = new Set(prev);
          next.delete(msg.id);
          return next;
        });
      }
      onClick();
    };

    return (
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.01, x: 4 }}
        whileTap={{ scale: 0.99 }}
        onClick={handleClick}
        className={cn(
          "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all relative",
          "hover:bg-muted/50 border border-transparent",
          isNewReply && "bg-green-500/10 border-green-500/30"
        )}
      >
        {/* Avatar */}
        <div
          className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg",
            msg.admin_reply
              ? "bg-gradient-to-br from-green-500 to-emerald-600 shadow-green-500/20"
              : "bg-gradient-to-br from-yellow-500 to-orange-500 shadow-yellow-500/20"
          )}
        >
          {msg.admin_reply ? (
            <CheckCircle className="w-6 h-6 text-white" />
          ) : (
            <Clock className="w-6 h-6 text-white" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="font-semibold truncate">{msg.subject}</p>
            <span className="text-xs text-muted-foreground flex-shrink-0">
              {format(new Date(msg.created_at), "MMM dd")}
            </span>
          </div>
          <p className="text-sm text-muted-foreground truncate mt-0.5">
            {msg.admin_reply ? `Admin: ${msg.admin_reply.substring(0, 40)}...` : msg.message.substring(0, 40) + "..."}
          </p>
          <div className="flex items-center gap-2 mt-1.5">{getStatusBadge(msg.status)}</div>
        </div>

        {/* New Reply Indicator */}
        {isNewReply && (
          <>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-[10px] text-white font-bold">!</span>
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-ping" />
          </>
        )}
      </motion.div>
    );
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-4">
      {/* Sidebar - Chat List */}
      <div className="lg:w-[380px] flex-shrink-0 bg-card/50 backdrop-blur rounded-2xl border border-border/50 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border/50 bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg">Messages</h1>
                <p className="text-xs text-muted-foreground">Support Conversations</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {unrepliedCount > 0 && (
                <Badge className="bg-yellow-500 text-white">{unrepliedCount} pending</Badge>
              )}
              <Button variant="ghost" size="icon" onClick={fetchMessages} className="rounded-full">
                <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
              </Button>
            </div>
          </div>
        </div>

        {/* New Message Button */}
        <div className="p-3 border-b border-border/30">
          <Button
            onClick={() => {
              setShowNewMessage(true);
              setSelectedChat(null);
            }}
            className="w-full h-11 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Message
          </Button>
        </div>

        {/* Chat List */}
        <ScrollArea className="flex-1">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
                <MessageCircle className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <p className="font-medium text-muted-foreground">No conversations yet</p>
              <p className="text-sm text-muted-foreground/70 mt-1">Start a new conversation</p>
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {messages.map((msg) => (
                <ChatListItem
                  key={msg.id}
                  msg={msg}
                  onClick={() => {
                    setSelectedChat(msg);
                    setShowNewMessage(false);
                  }}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Main Content - Chat View */}
      <div className="flex-1 min-h-[500px] lg:min-h-0">
        <AnimatePresence mode="wait">
          {selectedChat ? (
            <motion.div
              key={`chat-${selectedChat.id}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full"
            >
              <ChatView chat={selectedChat} onBack={() => setSelectedChat(null)} />
            </motion.div>
          ) : showNewMessage ? (
            <motion.div
              key="new-message"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full"
            >
              <NewMessageView onBack={() => setShowNewMessage(false)} />
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex items-center justify-center bg-card/30 backdrop-blur rounded-2xl border border-border/30"
            >
              <div className="text-center p-8">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center">
                  <MessageSquare className="w-10 h-10 text-violet-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Select a conversation</h3>
                <p className="text-muted-foreground">Choose a conversation from the list or start a new one</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
