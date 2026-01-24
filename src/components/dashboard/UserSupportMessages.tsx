import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { format } from "date-fns";
import {
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  MessageCircle,
  Send,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";

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
  open: { label: "Pending", color: "bg-yellow-500", icon: AlertCircle, textColor: "text-yellow-500" },
  in_progress: { label: "In Progress", color: "bg-blue-500", icon: Clock, textColor: "text-blue-500" },
  resolved: { label: "Resolved", color: "bg-green-500", icon: CheckCircle, textColor: "text-green-500" },
  closed: { label: "Closed", color: "bg-slate-500", icon: XCircle, textColor: "text-slate-500" },
};

export default function UserSupportMessages() {
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchMessages();
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
      <Badge className={`${config.color} text-white text-xs`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const unrepliedCount = messages.filter(m => !m.admin_reply && m.status !== 'closed').length;
  const repliedCount = messages.filter(m => m.admin_reply).length;

  if (loading) {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardContent className="flex items-center justify-center py-8">
          <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">My Support Messages</CardTitle>
              <CardDescription>View your inquiries and admin replies</CardDescription>
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
      <CardContent>
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <p className="text-2xl font-bold text-foreground">{messages.length}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-yellow-500/10">
            <p className="text-2xl font-bold text-yellow-500">{unrepliedCount}</p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-green-500/10">
            <p className="text-2xl font-bold text-green-500">{repliedCount}</p>
            <p className="text-xs text-muted-foreground">Replied</p>
          </div>
        </div>

        {messages.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
            <p className="text-muted-foreground">No support messages yet</p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Use the "Send Message" card to contact support
            </p>
          </div>
        ) : (
          <Accordion type="single" collapsible className="space-y-2">
            {messages.map((msg, index) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <AccordionItem
                  value={msg.id}
                  className="border border-border/50 rounded-lg px-4 bg-background/50"
                >
                  <AccordionTrigger className="hover:no-underline py-3">
                    <div className="flex items-center gap-3 flex-1 text-left">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {getStatusBadge(msg.status)}
                          {msg.admin_reply && (
                            <Badge variant="outline" className="text-xs border-green-500/50 text-green-500">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Replied
                            </Badge>
                          )}
                        </div>
                        <p className="font-medium text-sm truncate">{msg.subject}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(msg.created_at), "MMM dd, yyyy 'at' h:mm a")}
                        </p>
                      </div>
                      {msg.admin_reply && (
                        <div className="flex items-center text-green-500">
                          <MessageCircle className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <div className="space-y-4">
                      {/* Original Message */}
                      <div className="bg-muted/30 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Send className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium">Your Message</span>
                          <Badge variant="outline" className="text-xs">{msg.issue_type}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {msg.message}
                        </p>
                      </div>

                      {/* Admin Reply */}
                      {msg.admin_reply ? (
                        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <MessageCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm font-medium text-green-500">Admin Reply</span>
                            {msg.replied_at && (
                              <span className="text-xs text-muted-foreground">
                                {format(new Date(msg.replied_at), "MMM dd, yyyy 'at' h:mm a")}
                              </span>
                            )}
                          </div>
                          <p className="text-sm whitespace-pre-wrap">{msg.admin_reply}</p>
                        </div>
                      ) : (
                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 text-center">
                          <Clock className="w-5 h-5 mx-auto mb-1 text-yellow-500" />
                          <p className="text-sm text-yellow-600 dark:text-yellow-400">
                            Waiting for admin reply...
                          </p>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}
