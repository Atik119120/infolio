import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import {
  MessageSquare,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Search,
  RefreshCw,
  User,
  Mail,
  MessageCircle,
  ArrowLeft,
  Loader2,
  Headphones,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface SupportMessage {
  id: string;
  user_id: string;
  subject: string;
  issue_type: string;
  message: string;
  status: string;
  admin_reply: string | null;
  replied_at: string | null;
  replied_by: string | null;
  created_at: string;
  updated_at: string;
  profile?: {
    display_name: string | null;
    email: string | null;
    username: string;
  };
}

const STATUS_CONFIG = {
  open: { label: "Open", color: "bg-yellow-500", icon: AlertCircle },
  in_progress: { label: "In Progress", color: "bg-blue-500", icon: Clock },
  resolved: { label: "Resolved", color: "bg-green-500", icon: CheckCircle },
  closed: { label: "Closed", color: "bg-slate-500", icon: XCircle },
};

export default function AdminSupport() {
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedMessage, setSelectedMessage] = useState<SupportMessage | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replying, setReplying] = useState(false);
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();

    // Set up realtime subscription
    const channel = supabase
      .channel("admin-support-messages")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "support_messages",
        },
        () => {
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data: messagesData, error: messagesError } = await supabase
        .from("support_messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (messagesError) throw messagesError;

      if (!messagesData || messagesData.length === 0) {
        setMessages([]);
        return;
      }

      const userIds = [...new Set(messagesData.map((m) => m.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, display_name, email, username")
        .in("user_id", userIds);

      const profileMap = new Map(
        profiles?.map((p) => [
          p.user_id,
          {
            display_name: p.display_name,
            email: p.email,
            username: p.username,
          },
        ])
      );

      const messagesWithProfiles = messagesData.map((m) => ({
        ...m,
        profile: profileMap.get(m.user_id) || undefined,
      }));

      setMessages(messagesWithProfiles);

      // Update selected message if viewing
      if (selectedMessage) {
        const updated = messagesWithProfiles.find((m) => m.id === selectedMessage.id);
        if (updated) setSelectedMessage(updated);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load support messages");
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async () => {
    if (!selectedMessage || !replyText.trim()) return;

    setReplying(true);
    try {
      const { error } = await supabase
        .from("support_messages")
        .update({
          admin_reply: replyText,
          replied_at: new Date().toISOString(),
          replied_by: user?.id,
          status: "resolved",
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedMessage.id);

      if (error) throw error;

      // Send email notification
      const profile = selectedMessage.profile;
      if (profile?.email) {
        await supabase.functions.invoke("send-notification", {
          body: {
            type: "support_reply",
            userEmail: profile.email,
            userName: profile.display_name || profile.username,
            subject: selectedMessage.subject,
            message: replyText,
          },
        });
      }

      toast.success("Reply sent successfully!");
      setReplyText("");
      fetchMessages();
    } catch (error) {
      console.error("Error sending reply:", error);
      toast.error("Failed to send reply");
    } finally {
      setReplying(false);
    }
  };

  const handleStatusChange = async (messageId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("support_messages")
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", messageId);

      if (error) throw error;

      toast.success(
        `Status updated to ${STATUS_CONFIG[newStatus as keyof typeof STATUS_CONFIG]?.label || newStatus}`
      );
      fetchMessages();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const filteredMessages = messages.filter((msg) => {
    const matchesSearch =
      msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.profile?.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.profile?.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || msg.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: messages.length,
    open: messages.filter((m) => m.status === "open").length,
    inProgress: messages.filter((m) => m.status === "in_progress").length,
    resolved: messages.filter((m) => m.status === "resolved").length,
  };

  const getStatusBadge = (status: string) => {
    const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.open;
    const Icon = config.icon;
    return (
      <Badge className={`${config.color} text-white text-[10px]`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  // Chat List Item
  const ChatListItem = ({
    msg,
    isSelected,
    onClick,
  }: {
    msg: SupportMessage;
    isSelected: boolean;
    onClick: () => void;
  }) => (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.01, x: 4 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all",
        "hover:bg-slate-800/50 border border-transparent",
        isSelected && "bg-orange-500/10 border-orange-500/30",
        !msg.admin_reply && msg.status === "open" && "bg-yellow-500/5"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0",
          msg.admin_reply
            ? "bg-gradient-to-br from-green-500 to-emerald-600"
            : "bg-gradient-to-br from-orange-500 to-red-500"
        )}
      >
        <span className="text-white font-semibold">
          {msg.profile?.display_name?.[0]?.toUpperCase() || "U"}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="font-semibold text-white truncate">
            {msg.profile?.display_name || "Unknown User"}
          </p>
          <span className="text-xs text-slate-500 flex-shrink-0">
            {format(new Date(msg.created_at), "MMM dd")}
          </span>
        </div>
        <p className="text-sm text-slate-400 truncate">{msg.subject}</p>
        <div className="flex items-center gap-2 mt-1">{getStatusBadge(msg.status)}</div>
      </div>

      {/* Unread indicator */}
      {!msg.admin_reply && msg.status === "open" && (
        <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse" />
      )}
    </motion.div>
  );

  // Chat View
  const ChatView = ({ chat }: { chat: SupportMessage }) => (
    <div className="flex flex-col h-full bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-slate-800 bg-slate-800/30">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-full lg:hidden text-slate-400"
          onClick={() => setSelectedMessage(null)}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
          <span className="text-white font-semibold">
            {chat.profile?.display_name?.[0]?.toUpperCase() || "U"}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-white truncate">
            {chat.profile?.display_name || "Unknown User"}
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Mail className="w-3 h-3" />
            <span className="truncate">{chat.profile?.email}</span>
          </div>
        </div>
        <Select
          value={chat.status}
          onValueChange={(value) => handleStatusChange(chat.id, value)}
        >
          <SelectTrigger className="w-32 h-8 bg-slate-800 border-slate-700 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 max-w-2xl mx-auto">
          {/* Date */}
          <div className="flex justify-center">
            <span className="text-[11px] text-slate-500 bg-slate-800/50 px-3 py-1 rounded-full">
              {format(new Date(chat.created_at), "MMMM dd, yyyy")}
            </span>
          </div>

          {/* Subject Badge */}
          <div className="flex justify-center">
            <Badge variant="outline" className="border-slate-700 text-slate-400">
              {chat.issue_type} • {chat.subject}
            </Badge>
          </div>

          {/* User's Message */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="max-w-[80%]">
              <div className="flex items-end gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-tl-md px-4 py-3">
                  <p className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
                    {chat.message}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 mt-1.5 ml-10 px-1">
                <span className="text-[11px] text-slate-500">
                  {chat.profile?.display_name} • {format(new Date(chat.created_at), "h:mm a")}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Admin Reply */}
          {chat.admin_reply && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex justify-end"
            >
              <div className="max-w-[80%]">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl rounded-tr-md px-4 py-3 shadow-lg shadow-orange-500/20">
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{chat.admin_reply}</p>
                </div>
                <div className="flex items-center justify-end gap-1.5 mt-1.5 px-1">
                  <span className="text-[11px] text-slate-500">
                    Admin • {chat.replied_at ? format(new Date(chat.replied_at), "h:mm a") : ""}
                  </span>
                  <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Reply Input */}
      <div className="p-4 border-t border-slate-800 bg-slate-800/30">
        <div className="flex gap-3">
          <Textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Type your reply..."
            className="flex-1 min-h-[60px] max-h-[120px] bg-slate-800 border-slate-700 rounded-xl resize-none text-white placeholder:text-slate-500"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleReply();
              }
            }}
          />
          <Button
            onClick={handleReply}
            disabled={!replyText.trim() || replying}
            className="h-auto bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-xl px-6"
          >
            {replying ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
        <p className="text-[11px] text-slate-500 mt-2 text-center">
          Press Enter to send • Shift + Enter for new line
        </p>
      </div>
    </div>
  );

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-4">
      {/* Sidebar - Chat List */}
      <div
        className={cn(
          "lg:w-[400px] flex-shrink-0 bg-slate-900/50 backdrop-blur rounded-2xl border border-slate-800 overflow-hidden flex flex-col",
          selectedMessage && "hidden lg:flex"
        )}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-800/30">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-white">Support</h1>
                <p className="text-xs text-slate-400">
                  {stats.open} open • {stats.inProgress} in progress
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={fetchMessages} className="rounded-full text-slate-400">
              <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
            </Button>
          </div>

          {/* Search & Filter */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 rounded-lg"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-28 h-9 bg-slate-800 border-slate-700 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Chat List */}
        <ScrollArea className="flex-1">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin text-orange-400" />
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center">
                <MessageCircle className="w-8 h-8 text-slate-600" />
              </div>
              <p className="text-slate-400 font-medium">No messages found</p>
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {filteredMessages.map((msg) => (
                <ChatListItem
                  key={msg.id}
                  msg={msg}
                  isSelected={selectedMessage?.id === msg.id}
                  onClick={() => setSelectedMessage(msg)}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Main Content - Chat View */}
      <div className={cn("flex-1 min-h-0", !selectedMessage && "hidden lg:block")}>
        <AnimatePresence mode="wait">
          {selectedMessage ? (
            <motion.div
              key={`chat-${selectedMessage.id}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full"
            >
              <ChatView chat={selectedMessage} />
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex items-center justify-center bg-slate-900/30 backdrop-blur rounded-2xl border border-slate-800"
            >
              <div className="text-center p-8">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center">
                  <Headphones className="w-10 h-10 text-orange-500" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Select a conversation</h3>
                <p className="text-slate-400">Choose a support ticket from the list to respond</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
