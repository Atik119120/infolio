import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MessageSquare, Send, HelpCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ISSUE_TYPES = [
  { value: "theme_purchase", label: "Theme Purchase Issue" },
  { value: "account_approval", label: "Account Approval" },
  { value: "portfolio_issue", label: "Portfolio Problem" },
  { value: "payment_issue", label: "Payment Issue" },
  { value: "technical", label: "Technical Problem" },
  { value: "other", label: "Other" },
];

export default function SupportMessageDialog() {
  const [open, setOpen] = useState(false);
  const [issueType, setIssueType] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!user || !issueType || !subject.trim() || !message.trim()) {
      toast({
        title: "সব ফিল্ড পূরণ করুন",
        description: "দয়া করে সব ফিল্ড সঠিকভাবে পূরণ করুন",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Get user profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name, email, username")
        .eq("user_id", user.id)
        .single();

      // Send notification to admin
      const { error } = await supabase.functions.invoke("send-notification", {
        body: {
          type: "support_message",
          userId: user.id,
          userName: profile?.display_name || "User",
          userEmail: profile?.email || user.email,
          username: profile?.username,
          issueType: ISSUE_TYPES.find(t => t.value === issueType)?.label || issueType,
          subject: subject.trim(),
          message: message.trim(),
        },
      });

      if (error) throw error;

      toast({
        title: "মেসেজ পাঠানো হয়েছে! ✅",
        description: "Admin আপনার সাথে শীঘ্রই যোগাযোগ করবেন",
      });

      // Reset form
      setIssueType("");
      setSubject("");
      setMessage("");
      setOpen(false);
    } catch (error) {
      console.error("Error sending support message:", error);
      toast({
        title: "Error",
        description: "মেসেজ পাঠাতে সমস্যা হয়েছে। আবার চেষ্টা করুন।",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Card className="border-dashed border-blue-500/30 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 hover:border-blue-500/50 cursor-pointer transition-all">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">Need Help?</p>
              <p className="text-xs text-muted-foreground">
                Admin কে মেসেজ করুন
              </p>
            </div>
            <HelpCircle className="w-5 h-5 text-blue-500" />
          </CardContent>
        </Card>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-500" />
            Admin কে মেসেজ করুন
          </DialogTitle>
          <DialogDescription>
            আপনার সমস্যা বা প্রশ্ন লিখুন, Admin শীঘ্রই উত্তর দেবেন
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="issueType">সমস্যার ধরন</Label>
            <Select value={issueType} onValueChange={setIssueType}>
              <SelectTrigger>
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
            <Label htmlFor="subject">বিষয়</Label>
            <Input
              id="subject"
              placeholder="আপনার সমস্যার বিষয় লিখুন"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">বিস্তারিত বর্ণনা</Label>
            <Textarea
              id="message"
              placeholder="আপনার সমস্যা বিস্তারিত লিখুন..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={loading || !issueType || !subject.trim() || !message.trim()}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                মেসেজ পাঠান
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
