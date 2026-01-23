import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { History, RefreshCw, CheckCircle, XCircle, AlertTriangle, Clock, Trash2, HardDrive } from "lucide-react";
import { format } from "date-fns";

interface CleanupLog {
  id: string;
  created_at: string;
  orphan_files_found: number;
  files_deleted: number;
  space_freed_bytes: number;
  triggered_by: string;
  status: string;
  error_message: string | null;
}

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "success":
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case "error":
      return <XCircle className="w-4 h-4 text-red-500" />;
    case "partial":
      return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    default:
      return <Clock className="w-4 h-4 text-muted-foreground" />;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "success":
      return <Badge variant="default" className="bg-green-500/10 text-green-600 border-green-500/20">Success</Badge>;
    case "error":
      return <Badge variant="destructive">Error</Badge>;
    case "partial":
      return <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">Partial</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const getTriggerBadge = (trigger: string) => {
  switch (trigger) {
    case "manual":
      return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20">Manual</Badge>;
    case "scheduled":
      return <Badge variant="outline" className="bg-purple-500/10 text-purple-600 border-purple-500/20">Scheduled</Badge>;
    default:
      return <Badge variant="outline">{trigger}</Badge>;
  }
};

export function CleanupHistory() {
  const [logs, setLogs] = useState<CleanupLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLogs = async () => {
    try {
      const { data, error } = await supabase
        .from("cleanup_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error("Error fetching cleanup logs:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchLogs();
  };

  // Calculate summary stats
  const totalCleanups = logs.length;
  const successfulCleanups = logs.filter(l => l.status === "success").length;
  const totalSpaceFreed = logs.reduce((sum, l) => sum + l.space_freed_bytes, 0);
  const totalFilesDeleted = logs.reduce((sum, l) => sum + l.files_deleted, 0);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5 text-orange-500" />
            Cleanup History
          </CardTitle>
          <CardDescription>
            View past storage cleanup operations and their results
          </CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <History className="w-4 h-4" />
              <span className="text-sm">Total Cleanups</span>
            </div>
            <p className="text-2xl font-bold">{totalCleanups}</p>
          </div>
          <div className="p-4 rounded-lg bg-green-500/10">
            <div className="flex items-center gap-2 text-green-600 mb-1">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">Successful</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{successfulCleanups}</p>
          </div>
          <div className="p-4 rounded-lg bg-blue-500/10">
            <div className="flex items-center gap-2 text-blue-600 mb-1">
              <Trash2 className="w-4 h-4" />
              <span className="text-sm">Files Deleted</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">{totalFilesDeleted}</p>
          </div>
          <div className="p-4 rounded-lg bg-purple-500/10">
            <div className="flex items-center gap-2 text-purple-600 mb-1">
              <HardDrive className="w-4 h-4" />
              <span className="text-sm">Space Freed</span>
            </div>
            <p className="text-2xl font-bold text-purple-600">{formatBytes(totalSpaceFreed)}</p>
          </div>
        </div>

        {/* Logs Table */}
        {logs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <History className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No cleanup history yet</p>
            <p className="text-sm">Run a cleanup from the Storage Analytics section to see logs here</p>
          </div>
        ) : (
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Trigger</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Found</TableHead>
                  <TableHead className="text-right">Deleted</TableHead>
                  <TableHead className="text-right">Space Freed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(log.status)}
                        <div>
                          <p>{format(new Date(log.created_at), "MMM d, yyyy")}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(log.created_at), "h:mm a")}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getTriggerBadge(log.triggered_by)}</TableCell>
                    <TableCell>
                      <div>
                        {getStatusBadge(log.status)}
                        {log.error_message && (
                          <p className="text-xs text-destructive mt-1 max-w-[200px] truncate" title={log.error_message}>
                            {log.error_message}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{log.orphan_files_found}</TableCell>
                    <TableCell className="text-right">{log.files_deleted}</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatBytes(log.space_freed_bytes)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
