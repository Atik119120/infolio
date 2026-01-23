import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Search, Users, Eye, ExternalLink, Loader2, CheckCircle, XCircle, Clock, Phone, Trash2, ShieldPlus } from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { AddAdminDialog } from "@/components/admin/AddAdminDialog";

interface UserWithPortfolio {
  id: string;
  user_id: string;
  username: string;
  display_name: string | null;
  email: string | null;
  phone_number: string | null;
  avatar_url: string | null;
  is_approved: boolean;
  approved_at: string | null;
  created_at: string;
  portfolio?: {
    is_published: boolean;
    pending_publish: boolean;
    theme: string | null;
  };
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserWithPortfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [adminDialogOpen, setAdminDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<UserWithPortfolio | null>(null);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const usersWithPortfolios = await Promise.all(
        (profiles || []).map(async (profile) => {
          const { data: portfolio } = await supabase
            .from("portfolios")
            .select("is_published, pending_publish, theme")
            .eq("user_id", profile.user_id)
            .single();

          return {
            ...profile,
            portfolio: portfolio || undefined,
          };
        })
      );

      setUsers(usersWithPortfolios);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (user: UserWithPortfolio) => {
    setActionLoading(user.id);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          is_approved: true,
          approved_at: new Date().toISOString(),
          approved_by: currentUser?.id,
        })
        .eq("id", user.id);

      if (error) throw error;

      // Send approval email
      await supabase.functions.invoke("send-notification", {
        body: {
          type: "account_approved",
          to: user.email,
          data: {
            name: user.display_name || user.username,
            username: user.username,
          },
        },
      });

      toast({
        title: "User Approved",
        description: `${user.display_name || user.username} has been approved successfully.`,
      });

      fetchUsers();
    } catch (error) {
      console.error("Error approving user:", error);
      toast({
        title: "Error",
        description: "Failed to approve user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (user: UserWithPortfolio) => {
    setActionLoading(user.id);
    try {
      // Send rejection email first
      await supabase.functions.invoke("send-notification", {
        body: {
          type: "account_rejected",
          to: user.email,
          data: {
            name: user.display_name || user.username,
          },
        },
      });

      // Delete user and all their data
      const { data, error } = await supabase.functions.invoke("admin-manage-user", {
        body: { action: "delete_user", targetUserId: user.user_id },
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      toast({
        title: "User Rejected & Deleted",
        description: `${user.display_name || user.username} has been removed from the platform.`,
      });

      fetchUsers();
    } catch (error) {
      console.error("Error rejecting user:", error);
      toast({
        title: "Error",
        description: "Failed to reject user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteTarget) return;

    setActionLoading(deleteTarget.id);
    try {
      const { data, error } = await supabase.functions.invoke("admin-manage-user", {
        body: { action: "delete_user", targetUserId: deleteTarget.user_id },
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      toast({
        title: "User Deleted",
        description: `${deleteTarget.display_name || deleteTarget.username} and all their data has been removed.`,
      });

      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
      setDeleteTarget(null);
    }
  };

  const handleApprovePublish = async (user: UserWithPortfolio) => {
    setActionLoading(user.id);
    try {
      const { error } = await supabase
        .from("portfolios")
        .update({
          is_published: true,
          pending_publish: false,
        })
        .eq("user_id", user.user_id);

      if (error) throw error;

      // Send publish approval email
      await supabase.functions.invoke("send-notification", {
        body: {
          type: "publish_approved",
          to: user.email,
          data: {
            name: user.display_name || user.username,
            username: user.username,
          },
        },
      });

      toast({
        title: "Portfolio Published",
        description: `${user.display_name || user.username}'s portfolio is now live.`,
      });

      fetchUsers();
    } catch (error) {
      console.error("Error approving publish:", error);
      toast({
        title: "Error",
        description: "Failed to approve publishing. Please try again.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone_number?.includes(searchQuery)
  );

  const pendingApprovalUsers = filteredUsers.filter((u) => !u.is_approved);
  const pendingPublishUsers = filteredUsers.filter((u) => u.portfolio?.pending_publish);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Users & Portfolios</h2>
        <p className="text-muted-foreground">
          Manage all registered users and their portfolios
        </p>
      </div>

      {/* Pending Approvals Section */}
      {pendingApprovalUsers.length > 0 && (
        <Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
              <Clock className="w-5 h-5" />
              Pending Account Approvals ({pendingApprovalUsers.length})
            </CardTitle>
            <CardDescription>These users are waiting for account approval</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingApprovalUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-background border"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={user.avatar_url || undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {(user.display_name || user.username).charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{user.display_name || user.username}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      {user.phone_number && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {user.phone_number}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground mr-2">
                      {format(new Date(user.created_at), "MMM d, yyyy")}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => handleApprove(user)}
                      disabled={actionLoading === user.id}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {actionLoading === user.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </>
                      )}
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={actionLoading === user.id}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Reject User?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will send a rejection email to {user.email}. The user will need to contact support if they want to appeal.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleReject(user)}
                            className="bg-destructive text-destructive-foreground"
                          >
                            Reject
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pending Publish Section */}
      {pendingPublishUsers.length > 0 && (
        <Card className="border-purple-500 bg-purple-50 dark:bg-purple-900/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-400">
              <Eye className="w-5 h-5" />
              Pending Publish Requests ({pendingPublishUsers.length})
            </CardTitle>
            <CardDescription>These users want to publish their portfolios</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingPublishUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-background border"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={user.avatar_url || undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {(user.display_name || user.username).charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{user.display_name || user.username}</p>
                      <p className="text-sm text-muted-foreground">@{user.username}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(`/u/${user.username}`, "_blank")}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleApprovePublish(user)}
                      disabled={actionLoading === user.id}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      {actionLoading === user.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve Publish
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Users Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                All Users ({users.length})
              </CardTitle>
              <CardDescription>View and manage user accounts</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setAdminDialogOpen(true)}
                className="gap-2"
              >
                <ShieldPlus className="w-4 h-4" />
                Manage Admins
              </Button>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Theme</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead>Site</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={user.avatar_url || undefined} />
                              <AvatarFallback>
                                {user.display_name?.[0]?.toUpperCase() || user.username[0].toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.display_name || user.username}</p>
                              <p className="text-xs text-muted-foreground">@{user.username}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>{user.email}</p>
                            {user.phone_number && (
                              <p className="text-muted-foreground flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {user.phone_number}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {user.portfolio?.theme || "default"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.is_approved ? (
                            <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Approved
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-700">
                              <Clock className="w-3 h-3 mr-1" />
                              Pending
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {user.portfolio?.is_published ? (
                            <Badge className="bg-green-500/10 text-green-600">Published</Badge>
                          ) : user.portfolio?.pending_publish ? (
                            <Badge className="bg-purple-500/10 text-purple-600">Pending Publish</Badge>
                          ) : (
                            <Badge variant="secondary">Draft</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {format(new Date(user.created_at), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            {!user.is_approved && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleApprove(user)}
                                disabled={actionLoading === user.id}
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              >
                                {actionLoading === user.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <CheckCircle className="w-4 h-4" />
                                )}
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(`/u/${user.username}`, "_blank")}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => setDeleteTarget(user)}
                              disabled={user.user_id === currentUser?.id}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Admin Dialog */}
      <AddAdminDialog open={adminDialogOpen} onOpenChange={setAdminDialogOpen} />

      {/* Delete User Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="w-5 h-5" />
              Delete User?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <span className="font-medium">{deleteTarget?.display_name || deleteTarget?.username}</span> and all their data including:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Profile and portfolio</li>
                <li>All projects, skills, and experiences</li>
                <li>Uploaded images and files</li>
                <li>Custom domains and settings</li>
              </ul>
              <p className="mt-3 font-medium text-destructive">This action cannot be undone!</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {actionLoading === deleteTarget?.id ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Trash2 className="w-4 h-4 mr-2" />
              )}
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
