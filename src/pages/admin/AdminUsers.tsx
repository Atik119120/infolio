import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Search, Users, Eye, ExternalLink, Loader2, CheckCircle, XCircle, Clock, 
  Phone, Trash2, ShieldPlus, Download, MoreHorizontal, Filter, X, CheckCheck,
  FileDown, UserX
} from "lucide-react";
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

type FilterStatus = "all" | "approved" | "pending" | "published" | "draft";
type SortField = "created_at" | "display_name" | "username" | "email";
type SortOrder = "asc" | "desc";

export default function AdminUsers() {
  const [users, setUsers] = useState<UserWithPortfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [adminDialogOpen, setAdminDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<UserWithPortfolio | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // First get all admin user IDs to exclude them
      const { data: adminRoles } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "admin");

      const adminUserIds = new Set((adminRoles || []).map(r => r.user_id));

      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Filter out admin users - admins should not appear in users list
      const nonAdminProfiles = (profiles || []).filter(p => !adminUserIds.has(p.user_id));

      const usersWithPortfolios = await Promise.all(
        nonAdminProfiles.map(async (profile) => {
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

  // Filtered and sorted users
  const filteredUsers = useMemo(() => {
    let result = users.filter(
      (user) =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phone_number?.includes(searchQuery)
    );

    // Apply status filter
    switch (filterStatus) {
      case "approved":
        result = result.filter(u => u.is_approved);
        break;
      case "pending":
        result = result.filter(u => !u.is_approved);
        break;
      case "published":
        result = result.filter(u => u.portfolio?.is_published);
        break;
      case "draft":
        result = result.filter(u => !u.portfolio?.is_published);
        break;
    }

    // Apply sorting
    result.sort((a, b) => {
      let aVal: string | null = null;
      let bVal: string | null = null;

      switch (sortField) {
        case "created_at":
          aVal = a.created_at;
          bVal = b.created_at;
          break;
        case "display_name":
          aVal = a.display_name || a.username;
          bVal = b.display_name || b.username;
          break;
        case "username":
          aVal = a.username;
          bVal = b.username;
          break;
        case "email":
          aVal = a.email;
          bVal = b.email;
          break;
      }

      if (!aVal && !bVal) return 0;
      if (!aVal) return 1;
      if (!bVal) return -1;

      const comparison = aVal.localeCompare(bVal);
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [users, searchQuery, filterStatus, sortField, sortOrder]);

  const pendingApprovalUsers = filteredUsers.filter((u) => !u.is_approved);
  const pendingPublishUsers = filteredUsers.filter((u) => u.portfolio?.pending_publish);

  // Selection handlers
  const toggleSelectAll = () => {
    if (selectedUsers.size === filteredUsers.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(filteredUsers.map(u => u.id)));
    }
  };

  const toggleSelectUser = (userId: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  // Export functions
  const exportToCSV = () => {
    const headers = ["Username", "Display Name", "Email", "Phone", "Account Status", "Site Status", "Theme", "Joined"];
    const rows = filteredUsers.map(user => [
      user.username,
      user.display_name || "",
      user.email || "",
      user.phone_number || "",
      user.is_approved ? "Approved" : "Pending",
      user.portfolio?.is_published ? "Published" : user.portfolio?.pending_publish ? "Pending Publish" : "Draft",
      user.portfolio?.theme || "default",
      format(new Date(user.created_at), "yyyy-MM-dd HH:mm")
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `users-export-${format(new Date(), "yyyy-MM-dd")}.csv`;
    link.click();

    toast({
      title: "Export Complete",
      description: `Exported ${filteredUsers.length} users to CSV`,
    });
  };

  const exportToJSON = () => {
    const data = filteredUsers.map(user => ({
      username: user.username,
      display_name: user.display_name,
      email: user.email,
      phone_number: user.phone_number,
      is_approved: user.is_approved,
      portfolio_status: user.portfolio?.is_published ? "published" : user.portfolio?.pending_publish ? "pending" : "draft",
      theme: user.portfolio?.theme || "default",
      created_at: user.created_at,
    }));

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `users-export-${format(new Date(), "yyyy-MM-dd")}.json`;
    link.click();

    toast({
      title: "Export Complete",
      description: `Exported ${filteredUsers.length} users to JSON`,
    });
  };

  // Bulk actions
  const handleBulkApprove = async () => {
    if (selectedUsers.size === 0) return;

    setBulkActionLoading(true);
    const selectedUsersList = users.filter(u => selectedUsers.has(u.id) && !u.is_approved);
    let successCount = 0;

    for (const user of selectedUsersList) {
      try {
        await supabase
          .from("profiles")
          .update({
            is_approved: true,
            approved_at: new Date().toISOString(),
            approved_by: currentUser?.id,
          })
          .eq("id", user.id);

        await supabase.functions.invoke("admin-manage-user", {
          body: { action: "confirm_email", targetUserId: user.user_id },
        });

        successCount++;
      } catch (error) {
        console.error(`Failed to approve user ${user.username}:`, error);
      }
    }

    setBulkActionLoading(false);
    setSelectedUsers(new Set());
    fetchUsers();

    toast({
      title: "Bulk Approve Complete",
      description: `Successfully approved ${successCount} of ${selectedUsersList.length} users`,
    });
  };

  const handleBulkDelete = async () => {
    if (selectedUsers.size === 0) return;

    setBulkActionLoading(true);
    const selectedUsersList = users.filter(u => selectedUsers.has(u.id) && u.user_id !== currentUser?.id);
    let successCount = 0;

    for (const user of selectedUsersList) {
      try {
        const { data, error } = await supabase.functions.invoke("admin-manage-user", {
          body: { action: "delete_user", targetUserId: user.user_id },
        });

        if (!error && !data.error) {
          successCount++;
        }
      } catch (error) {
        console.error(`Failed to delete user ${user.username}:`, error);
      }
    }

    setBulkActionLoading(false);
    setSelectedUsers(new Set());
    setShowBulkDeleteConfirm(false);
    fetchUsers();

    toast({
      title: "Bulk Delete Complete",
      description: `Successfully deleted ${successCount} of ${selectedUsersList.length} users`,
    });
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

      const { data: confirmData, error: confirmError } = await supabase.functions.invoke(
        "admin-manage-user",
        {
          body: { action: "confirm_email", targetUserId: user.user_id },
        }
      );

      if (confirmError) throw confirmError;
      if (confirmData?.error) throw new Error(confirmData.error);

      await supabase.functions.invoke("send-notification", {
        body: {
          type: "account_approved",
          userEmail: user.email,
          userName: user.display_name || user.username,
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
      await supabase.functions.invoke("send-notification", {
        body: {
          type: "account_rejected",
          userEmail: user.email,
          userName: user.display_name || user.username,
        },
      });

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

      await supabase.functions.invoke("send-notification", {
        body: {
          type: "publish_approved",
          userEmail: user.email,
          userName: user.display_name || user.username,
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

  const clearFilters = () => {
    setSearchQuery("");
    setFilterStatus("all");
    setSortField("created_at");
    setSortOrder("desc");
  };

  const hasActiveFilters = searchQuery || filterStatus !== "all" || sortField !== "created_at" || sortOrder !== "desc";

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">Users & Portfolios</h2>
          <p className="text-sm text-muted-foreground">
            Manage {users.length} registered users
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={exportToCSV}>
                <FileDown className="w-4 h-4 mr-2" />
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportToJSON}>
                <FileDown className="w-4 h-4 mr-2" />
                Export as JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAdminDialogOpen(true)}
            className="gap-2"
          >
            <ShieldPlus className="w-4 h-4" />
            Manage Admins
          </Button>
        </div>
      </div>

      {/* Pending Approvals Section */}
      {pendingApprovalUsers.length > 0 && (
        <Card className="border-yellow-500/50 bg-yellow-500/5">
          <CardHeader className="py-3 px-4">
            <CardTitle className="flex items-center gap-2 text-base text-yellow-600 dark:text-yellow-400">
              <Clock className="w-4 h-4" />
              Pending Account Approvals ({pendingApprovalUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-3">
            <div className="space-y-2">
              {pendingApprovalUsers.slice(0, 3).map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-background border"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={user.avatar_url || undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {(user.display_name || user.username).charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{user.display_name || user.username}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleApprove(user)}
                      disabled={actionLoading === user.id}
                      className="bg-green-600 hover:bg-green-700 h-8"
                    >
                      {actionLoading === user.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Approve
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleReject(user)}
                      disabled={actionLoading === user.id}
                      className="h-8"
                    >
                      <XCircle className="w-3 h-3 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
              {pendingApprovalUsers.length > 3 && (
                <p className="text-xs text-center text-muted-foreground py-1">
                  +{pendingApprovalUsers.length - 3} more pending...
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pending Publish Section */}
      {pendingPublishUsers.length > 0 && (
        <Card className="border-purple-500/50 bg-purple-500/5">
          <CardHeader className="py-3 px-4">
            <CardTitle className="flex items-center gap-2 text-base text-purple-600 dark:text-purple-400">
              <Eye className="w-4 h-4" />
              Pending Publish Requests ({pendingPublishUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-3">
            <div className="space-y-2">
              {pendingPublishUsers.slice(0, 3).map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-background border"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={user.avatar_url || undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {(user.display_name || user.username).charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{user.display_name || user.username}</p>
                      <p className="text-xs text-muted-foreground">@{user.username}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(`/u/${user.username}`, "_blank")}
                      className="h-8"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Preview
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleApprovePublish(user)}
                      disabled={actionLoading === user.id}
                      className="bg-purple-600 hover:bg-purple-700 h-8"
                    >
                      {actionLoading === user.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Publish
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
        <CardHeader className="py-3 px-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="w-4 h-4" />
                All Users ({filteredUsers.length})
              </CardTitle>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7 text-xs">
                  <X className="w-3 h-3 mr-1" />
                  Clear Filters
                </Button>
              )}
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>
              <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as FilterStatus)}>
                <SelectTrigger className="w-[140px] h-9">
                  <Filter className="w-3 h-3 mr-2" />
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortField} onValueChange={(v) => setSortField(v as SortField)}>
                <SelectTrigger className="w-[130px] h-9">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at">Join Date</SelectItem>
                  <SelectItem value="display_name">Name</SelectItem>
                  <SelectItem value="username">Username</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-3"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              >
                {sortOrder === "asc" ? "↑" : "↓"}
              </Button>
            </div>

            {/* Bulk Actions */}
            {selectedUsers.size > 0 && (
              <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                <span className="text-sm font-medium">
                  {selectedUsers.size} selected
                </span>
                <div className="flex-1" />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleBulkApprove}
                  disabled={bulkActionLoading}
                  className="h-7 text-xs"
                >
                  {bulkActionLoading ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <>
                      <CheckCheck className="w-3 h-3 mr-1" />
                      Approve All
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => setShowBulkDeleteConfirm(true)}
                  disabled={bulkActionLoading}
                  className="h-7 text-xs"
                >
                  <UserX className="w-3 h-3 mr-1" />
                  Delete All
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelectedUsers(new Set())}
                  className="h-7 text-xs"
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px]">
                      <Checkbox
                        checked={selectedUsers.size === filteredUsers.length && filteredUsers.length > 0}
                        onCheckedChange={toggleSelectAll}
                      />
                    </TableHead>
                    <TableHead>User</TableHead>
                    <TableHead className="hidden md:table-cell">Contact</TableHead>
                    <TableHead className="hidden lg:table-cell">Theme</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden sm:table-cell">Joined</TableHead>
                    <TableHead className="text-right w-[80px]">Actions</TableHead>
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
                      <TableRow key={user.id} className={selectedUsers.has(user.id) ? "bg-muted/30" : ""}>
                        <TableCell>
                          <Checkbox
                            checked={selectedUsers.has(user.id)}
                            onCheckedChange={() => toggleSelectUser(user.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={user.avatar_url || undefined} />
                              <AvatarFallback className="text-xs">
                                {user.display_name?.[0]?.toUpperCase() || user.username[0].toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <p className="font-medium text-sm truncate">{user.display_name || user.username}</p>
                              <p className="text-xs text-muted-foreground truncate">@{user.username}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="text-xs">
                            <p className="truncate max-w-[150px]">{user.email}</p>
                            {user.phone_number && (
                              <p className="text-muted-foreground flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {user.phone_number}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <Badge variant="outline" className="text-xs capitalize">
                            {user.portfolio?.theme || "default"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            {user.is_approved ? (
                              <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20 text-xs w-fit">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Approved
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-700 text-xs w-fit">
                                <Clock className="w-3 h-3 mr-1" />
                                Pending
                              </Badge>
                            )}
                            {user.portfolio?.is_published ? (
                              <Badge className="bg-green-500/10 text-green-600 text-xs w-fit">Published</Badge>
                            ) : user.portfolio?.pending_publish ? (
                              <Badge className="bg-purple-500/10 text-purple-600 text-xs w-fit">Pending</Badge>
                            ) : (
                              <Badge variant="secondary" className="text-xs w-fit">Draft</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs hidden sm:table-cell">
                          {format(new Date(user.created_at), "MMM d, yy")}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => window.open(`/u/${user.username}`, "_blank")}>
                                <Eye className="w-4 h-4 mr-2" />
                                View Portfolio
                              </DropdownMenuItem>
                              {!user.is_approved && (
                                <DropdownMenuItem onClick={() => handleApprove(user)}>
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Approve User
                                </DropdownMenuItem>
                              )}
                              {user.portfolio?.pending_publish && (
                                <DropdownMenuItem onClick={() => handleApprovePublish(user)}>
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Approve Publish
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => setDeleteTarget(user)}
                                disabled={user.user_id === currentUser?.id}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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
              This will permanently delete <span className="font-medium">{deleteTarget?.display_name || deleteTarget?.username}</span> and all their data.
              <p className="mt-2 font-medium text-destructive">This action cannot be undone!</p>
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
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation */}
      <AlertDialog open={showBulkDeleteConfirm} onOpenChange={setShowBulkDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <UserX className="w-5 h-5" />
              Delete {selectedUsers.size} Users?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all selected users and their data.
              <p className="mt-2 font-medium text-destructive">This action cannot be undone!</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {bulkActionLoading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <UserX className="w-4 h-4 mr-2" />
              )}
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
