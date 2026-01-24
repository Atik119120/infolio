import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { motion } from "framer-motion";
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
  Calendar,
  MessageCircle,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

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

const ISSUE_TYPES = [
  "Payment Issue",
  "Technical Issue",
  "Account Issue",
  "Theme Issue",
  "Other",
];

export default function AdminSupport() {
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedMessage, setSelectedMessage] = useState<SupportMessage | null>(null);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replying, setReplying] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      // Fetch support messages
      const { data: messagesData, error: messagesError } = await supabase
        .from("support_messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (messagesError) throw messagesError;

      if (!messagesData || messagesData.length === 0) {
        setMessages([]);
        return;
      }

      // Fetch profiles separately
      const userIds = [...new Set(messagesData.map(m => m.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, display_name, email, username")
        .in("user_id", userIds);

      const profileMap = new Map(profiles?.map(p => [p.user_id, {
        display_name: p.display_name,
        email: p.email,
        username: p.username
      }]));
      
      const messagesWithProfiles = messagesData.map(m => ({
        ...m,
        profile: profileMap.get(m.user_id) || undefined
      }));

      setMessages(messagesWithProfiles);
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

      // Send email notification to user
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
      setReplyDialogOpen(false);
      setReplyText("");
      setSelectedMessage(null);
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

      toast.success(`Status updated to ${STATUS_CONFIG[newStatus as keyof typeof STATUS_CONFIG]?.label || newStatus}`);
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
    closed: messages.filter((m) => m.status === "closed").length,
  };

  const getStatusBadge = (status: string) => {
    const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.open;
    const Icon = config.icon;
    return (
      <Badge className={`${config.color} text-white`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-orange-400" />
            Support Messages
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage user support requests and inquiries
          </p>
        </div>
        <Button
          onClick={fetchMessages}
          variant="outline"
          className="border-slate-700 hover:bg-slate-800"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Total", value: stats.total, color: "bg-slate-700" },
          { label: "Open", value: stats.open, color: "bg-yellow-500/20 text-yellow-400" },
          { label: "In Progress", value: stats.inProgress, color: "bg-blue-500/20 text-blue-400" },
          { label: "Resolved", value: stats.resolved, color: "bg-green-500/20 text-green-400" },
          { label: "Closed", value: stats.closed, color: "bg-slate-500/20 text-slate-400" },
        ].map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className={`${stat.color} border-0`}>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm opacity-80">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-800/50 border-slate-700"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48 bg-slate-800/50 border-slate-700">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Messages Table */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">All Messages</CardTitle>
          <CardDescription>
            {filteredMessages.length} message(s) found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin text-orange-400" />
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No support messages found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-800">
                    <TableHead className="text-slate-400">User</TableHead>
                    <TableHead className="text-slate-400">Subject</TableHead>
                    <TableHead className="text-slate-400">Issue Type</TableHead>
                    <TableHead className="text-slate-400">Status</TableHead>
                    <TableHead className="text-slate-400">Date</TableHead>
                    <TableHead className="text-slate-400">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMessages.map((msg) => (
                    <TableRow
                      key={msg.id}
                      className="border-slate-800 hover:bg-slate-800/50"
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white text-sm font-medium">
                            {msg.profile?.display_name?.[0]?.toUpperCase() || "U"}
                          </div>
                          <div>
                            <p className="text-white font-medium text-sm">
                              {msg.profile?.display_name || "Unknown User"}
                            </p>
                            <p className="text-slate-500 text-xs">
                              {msg.profile?.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-white font-medium text-sm truncate max-w-[200px]">
                          {msg.subject}
                        </p>
                        <p className="text-slate-500 text-xs truncate max-w-[200px]">
                          {msg.message.substring(0, 50)}...
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-slate-600 text-slate-300">
                          {msg.issue_type}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(msg.status)}</TableCell>
                      <TableCell className="text-slate-400 text-sm">
                        {format(new Date(msg.created_at), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                            onClick={() => {
                              setSelectedMessage(msg);
                              setReplyDialogOpen(true);
                            }}
                          >
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                          <Select
                            value={msg.status}
                            onValueChange={(value) => handleStatusChange(msg.id, value)}
                          >
                            <SelectTrigger className="w-28 h-8 bg-slate-800 border-slate-700 text-xs">
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
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reply Dialog */}
      <Dialog open={replyDialogOpen} onOpenChange={setReplyDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-orange-400" />
              Reply to Support Message
            </DialogTitle>
            <DialogDescription>
              Send a reply to {selectedMessage?.profile?.display_name || "the user"}
            </DialogDescription>
          </DialogHeader>

          {selectedMessage && (
            <div className="space-y-4">
              {/* Original Message */}
              <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <User className="w-4 h-4" />
                  <span>{selectedMessage.profile?.display_name}</span>
                  <span className="text-slate-600">•</span>
                  <Mail className="w-4 h-4" />
                  <span>{selectedMessage.profile?.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Calendar className="w-4 h-4" />
                  <span>{format(new Date(selectedMessage.created_at), "PPpp")}</span>
                </div>
                <div>
                  <Badge variant="outline" className="mb-2">{selectedMessage.issue_type}</Badge>
                  <h4 className="text-white font-medium">{selectedMessage.subject}</h4>
                  <p className="text-slate-300 mt-2 whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>

              {/* Previous Reply */}
              {selectedMessage.admin_reply && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <p className="text-green-400 text-sm font-medium mb-2">Previous Reply:</p>
                  <p className="text-slate-300">{selectedMessage.admin_reply}</p>
                  <p className="text-slate-500 text-xs mt-2">
                    Replied on {selectedMessage.replied_at ? format(new Date(selectedMessage.replied_at), "PPpp") : "N/A"}
                  </p>
                </div>
              )}

              {/* Reply Input */}
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Your Reply</label>
                <Textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply here..."
                  className="min-h-32 bg-slate-800/50 border-slate-700"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setReplyDialogOpen(false)}
              className="text-slate-400"
            >
              Cancel
            </Button>
            <Button
              onClick={handleReply}
              disabled={!replyText.trim() || replying}
              className="bg-gradient-to-r from-orange-500 to-red-500"
            >
              {replying ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Reply
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
