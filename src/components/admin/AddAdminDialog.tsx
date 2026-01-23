import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Loader2, UserPlus, Trash2, ShieldCheck, AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/contexts/AuthContext";

interface Admin {
  user_id: string;
  created_at: string;
  profiles: {
    email: string | null;
    display_name: string | null;
    username: string;
    avatar_url: string | null;
  } | null;
}

interface AddAdminDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddAdminDialog({ open, onOpenChange }: AddAdminDialogProps) {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingAdmins, setLoadingAdmins] = useState(true);
  const [removeTarget, setRemoveTarget] = useState<Admin | null>(null);
  const { user: currentUser } = useAuth();

  const fetchAdmins = async () => {
    setLoadingAdmins(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-manage-user", {
        body: { action: "list_admins" },
      });

      if (error) throw error;
      setAdmins(data.admins || []);
    } catch (error) {
      console.error("Error fetching admins:", error);
    } finally {
      setLoadingAdmins(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchAdmins();
    }
  }, [open]);

  const handleAddAdmin = async () => {
    if (!email.trim()) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-manage-user", {
        body: { action: "add_admin", email: email.trim() },
      });

      if (error) throw error;

      if (data.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.error,
        });
      } else {
        toast({
          title: "Admin Added",
          description: `${email} is now an admin.`,
        });
        setEmail("");
        fetchAdmins();
      }
    } catch (error) {
      console.error("Error adding admin:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add admin",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAdmin = async () => {
    if (!removeTarget) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-manage-user", {
        body: { action: "remove_admin", targetUserId: removeTarget.user_id },
      });

      if (error) throw error;

      if (data.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.error,
        });
      } else {
        toast({
          title: "Admin Removed",
          description: `Admin role has been removed.`,
        });
        fetchAdmins();
      }
    } catch (error) {
      console.error("Error removing admin:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove admin",
      });
    } finally {
      setLoading(false);
      setRemoveTarget(null);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-orange-500" />
              Manage Admins
            </DialogTitle>
            <DialogDescription>
              Add or remove admin users. Admins can manage all users and platform settings.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Add New Admin */}
            <div className="space-y-3">
              <Label>Add New Admin</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter user email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                />
                <Button onClick={handleAddAdmin} disabled={loading || !email.trim()}>
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add
                    </>
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                User must already have an account on the platform.
              </p>
            </div>

            {/* Current Admins */}
            <div className="space-y-3">
              <Label>Current Admins ({admins.length})</Label>
              <div className="border rounded-lg divide-y max-h-64 overflow-y-auto">
                {loadingAdmins ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                ) : admins.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    No admins found
                  </div>
                ) : (
                  admins.map((admin) => (
                    <div
                      key={admin.user_id}
                      className="flex items-center justify-between p-3 hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={admin.profiles?.avatar_url || undefined} />
                          <AvatarFallback className="bg-orange-500/10 text-orange-600">
                            {(admin.profiles?.display_name || admin.profiles?.username || "A")[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">
                            {admin.profiles?.display_name || admin.profiles?.username}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {admin.profiles?.email}
                          </p>
                        </div>
                      </div>
                      {admin.user_id === currentUser?.id ? (
                        <Badge variant="outline" className="text-xs">You</Badge>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => setRemoveTarget(admin)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Admin Confirmation */}
      <AlertDialog open={!!removeTarget} onOpenChange={() => setRemoveTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Remove Admin?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove admin privileges from{" "}
              <span className="font-medium">{removeTarget?.profiles?.display_name || removeTarget?.profiles?.email}</span>?
              They will no longer be able to access the admin panel.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveAdmin}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove Admin
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
