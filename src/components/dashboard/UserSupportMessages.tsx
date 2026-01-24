import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import {
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  MessageCircle,
  ChevronRight,
  Headphones,
  ArrowLeft,
  Bell,
  Volume2,
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

export default function UserSupportMessages() {
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState<SupportMessage | null>(null);
  const [newReplyIds, setNewReplyIds] = useState<Set<string>>(new Set());
  const { user } = useAuth();
  const previousMessagesRef = useRef<Map<string, SupportMessage>>(new Map());

  useEffect(() => {
    if (user) {
      fetchMessages();
      
      // Set up realtime subscription
      const channel = supabase
        .channel('support-messages-changes')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'support_messages',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            console.log('Realtime update received:', payload);
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
                    <p className="text-sm opacity-80 truncate max-w-[200px]">{updatedMessage.subject}</p>
                  </div>
                </div>,
                {
                  duration: 8000,
                  action: {
                    label: "View",
                    onClick: () => setSelectedChat(updatedMessage)
                  }
                }
              );
              
              // Mark as new reply
              setNewReplyIds(prev => new Set([...prev, updatedMessage.id]));
              
              // Play notification sound (optional)
              try {
                const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdH2Onp+ZjYF3cXN8iZWdoJyVi4F4cXR+i5aho5yTiX95c3Z/jJihn5qRh355dHd/jJeeoJqRh394c3Z+i5WcnZiPhn52c3V9ipOZmpaOhH10c3R8iJGWlZKLgnt1c3N6hY6Tk5CLgHp0c3J5hIyQkI2IfXdzcnV4goqNjYuGfHZzc3R2gIiKiomEent2dHNzdoGGiIiGgnt5dnNyc3eAhYaFgn15dnRyc3R4foOEg4B7eHV0cnJ0d3yBgoGAe3h2dHJyc3V5fX9/fnx5d3VzcnN0dnh7fX18enh2dHNyc3R2eHp7e3p5d3Z0c3Jyc3R2eHl5eXl4d3Z0c3JycnN1dnd4eHh3dnV0c3JycnN0dXZ3d3d3dnVzc3NycnJzdHV1dnZ2dnV0c3JycnJyc3R0dXV1dXV0c3JycnJyc3N0dHR0dHRzc3JycnJyc3NzdHR0dHNzc3JycnFxcnJyc3NzdHNzc3Jyc');
                audio.volume = 0.3;
                audio.play().catch(() => {});
              } catch (e) {}
            }
            
            // Update messages list
            setMessages(prev => 
              prev.map(msg => 
                msg.id === updatedMessage.id ? updatedMessage : msg
              )
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
  }, [user]);

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
      (data || []).forEach(msg => {
        previousMessagesRef.current.set(msg.id, msg);
      });
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
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

  const unrepliedCount = messages.filter(m => !m.admin_reply && m.status !== 'closed').length;

  if (loading) {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardContent className="flex items-center justify-center py-8">
          <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  // Chat View Component
  const ChatView = ({ chat, onBack }: { chat: SupportMessage; onBack: () => void }) => (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center gap-3 p-3 border-b border-border/50 bg-muted/30">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{chat.subject}</p>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] h-4">{chat.issue_type}</Badge>
            {getStatusBadge(chat.status)}
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {/* User's Message */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-end"
          >
            <div className="max-w-[85%]">
              <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-2.5 shadow-sm">
                <p className="text-sm whitespace-pre-wrap">{chat.message}</p>
              </div>
              <div className="flex items-center justify-end gap-1 mt-1">
                <span className="text-[10px] text-muted-foreground">
                  {format(new Date(chat.created_at), "MMM dd, h:mm a")}
                </span>
                <CheckCircle className="w-3 h-3 text-primary" />
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
              <div className="max-w-[85%]">
                <div className="flex items-end gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                    <Headphones className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-2.5 shadow-sm">
                    <p className="text-sm whitespace-pre-wrap">{chat.admin_reply}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-1 ml-9">
                  <span className="text-[10px] text-muted-foreground">
                    Admin • {chat.replied_at ? format(new Date(chat.replied_at), "MMM dd, h:mm a") : ""}
                  </span>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center py-4"
            >
              <div className="flex items-center gap-2 text-muted-foreground bg-muted/50 px-4 py-2 rounded-full">
                <Clock className="w-4 h-4 text-yellow-500 animate-pulse" />
                <span className="text-xs">Waiting for admin reply...</span>
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      {/* Status Footer */}
      <div className="p-3 border-t border-border/50 bg-muted/20">
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          {chat.status === 'resolved' ? (
            <>
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>This conversation has been resolved</span>
            </>
          ) : chat.status === 'closed' ? (
            <>
              <XCircle className="w-4 h-4 text-slate-500" />
              <span>This conversation is closed</span>
            </>
          ) : (
            <>
              <MessageCircle className="w-4 h-4 text-primary" />
              <span>Send a new message to continue the conversation</span>
            </>
          )}
        </div>
      </div>
    </div>
  );

  // Chat List Item
  const ChatListItem = ({ msg, onClick }: { msg: SupportMessage; onClick: () => void }) => {
    const isNewReply = newReplyIds.has(msg.id);
    
    const handleClick = () => {
      // Clear new reply indicator when viewed
      if (isNewReply) {
        setNewReplyIds(prev => {
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
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={handleClick}
        className={cn(
          "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all relative",
          "hover:bg-muted/50 border border-transparent hover:border-border/50",
          isNewReply && "bg-green-500/10 border-green-500/30 animate-pulse"
        )}
      >
      {/* Avatar */}
      <div className={cn(
        "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
        msg.admin_reply 
          ? "bg-gradient-to-br from-green-500 to-emerald-600" 
          : "bg-gradient-to-br from-yellow-500 to-orange-500"
      )}>
        {msg.admin_reply ? (
          <CheckCircle className="w-5 h-5 text-white" />
        ) : (
          <Clock className="w-5 h-5 text-white" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="font-medium text-sm truncate">{msg.subject}</p>
          <span className="text-[10px] text-muted-foreground flex-shrink-0">
            {format(new Date(msg.created_at), "MMM dd")}
          </span>
        </div>
        <p className="text-xs text-muted-foreground truncate mt-0.5">
          {msg.admin_reply ? `Admin: ${msg.admin_reply.substring(0, 40)}...` : msg.message.substring(0, 40) + "..."}
        </p>
        <div className="flex items-center gap-2 mt-1">
          {getStatusBadge(msg.status)}
        </div>
      </div>

      {/* New Reply Indicator */}
      {isNewReply && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping" />
      )}

      {/* Arrow */}
      <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
    </motion.div>
  );
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                Support Chat
                {unrepliedCount > 0 && (
                  <Badge className="bg-yellow-500 text-white text-[10px] px-1.5">
                    {unrepliedCount} pending
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>Your conversations with support</CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchMessages}
            className="text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <AnimatePresence mode="wait">
          {selectedChat ? (
            <motion.div
              key="chat"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-[400px]"
            >
              <ChatView chat={selectedChat} onBack={() => setSelectedChat(null)} />
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {messages.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
                    <MessageCircle className="w-8 h-8 text-muted-foreground/50" />
                  </div>
                  <p className="text-muted-foreground font-medium">No conversations yet</p>
                  <p className="text-sm text-muted-foreground/70 mt-1">
                    Send a message to start a conversation
                  </p>
                </div>
              ) : (
                <ScrollArea className="h-[400px]">
                  <div className="p-3 space-y-1">
                    {messages.map((msg, index) => (
                      <ChatListItem
                        key={msg.id}
                        msg={msg}
                        onClick={() => setSelectedChat(msg)}
                      />
                    ))}
                  </div>
                </ScrollArea>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
