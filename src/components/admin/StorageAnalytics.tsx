import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HardDrive, FolderOpen, Image, RefreshCw, Loader2, TrendingUp, AlertTriangle } from "lucide-react";
import { formatFileSize } from "@/lib/imageCompression";
import { format } from "date-fns";

interface BucketStats {
  name: string;
  fileCount: number;
  totalSize: number;
}

interface RecentUpload {
  name: string;
  bucket: string;
  size: number;
  created_at: string;
}

interface StorageAnalytics {
  totalFiles: number;
  totalSize: number;
  buckets: BucketStats[];
  recentUploads: RecentUpload[];
}

// Free tier limits
const FREE_STORAGE_LIMIT = 1 * 1024 * 1024 * 1024; // 1 GB
const WARNING_THRESHOLD = 0.8; // 80%

export default function StorageAnalytics() {
  const [analytics, setAnalytics] = useState<StorageAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: fnError } = await supabase.functions.invoke("storage-analytics");
      
      if (fnError) throw fnError;
      setAnalytics(data);
    } catch (err) {
      console.error("Error fetching storage analytics:", err);
      setError("Failed to fetch storage analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const usagePercentage = analytics ? (analytics.totalSize / FREE_STORAGE_LIMIT) * 100 : 0;
  const isWarning = usagePercentage >= WARNING_THRESHOLD * 100;
  const isCritical = usagePercentage >= 90;

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="flex flex-col items-center justify-center py-12 gap-4">
          <AlertTriangle className="w-8 h-8 text-destructive" />
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={fetchAnalytics} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Storage Card */}
      <Card className={isCritical ? "border-destructive" : isWarning ? "border-yellow-500" : ""}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <HardDrive className="w-5 h-5" />
                Storage Usage
              </CardTitle>
              <CardDescription>
                Monitor your storage consumption
              </CardDescription>
            </div>
            <Button onClick={fetchAnalytics} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Usage Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">
                {formatFileSize(analytics?.totalSize || 0)} used
              </span>
              <span className="text-muted-foreground">
                {formatFileSize(FREE_STORAGE_LIMIT)} total
              </span>
            </div>
            <Progress 
              value={usagePercentage} 
              className={`h-3 ${isCritical ? "[&>div]:bg-destructive" : isWarning ? "[&>div]:bg-yellow-500" : ""}`}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{usagePercentage.toFixed(1)}% used</span>
              <span>{formatFileSize(FREE_STORAGE_LIMIT - (analytics?.totalSize || 0))} remaining</span>
            </div>
          </div>

          {/* Warning Message */}
          {isWarning && (
            <div className={`p-3 rounded-lg ${isCritical ? "bg-destructive/10 text-destructive" : "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"}`}>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                <span className="font-medium">
                  {isCritical ? "Storage almost full!" : "Storage usage is high"}
                </span>
              </div>
              <p className="text-sm mt-1 opacity-80">
                {isCritical 
                  ? "Consider deleting unused files or upgrading your plan."
                  : "Monitor your usage to avoid running out of storage."}
              </p>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Image className="w-4 h-4" />
                Total Files
              </div>
              <p className="text-2xl font-bold mt-1">{analytics?.totalFiles || 0}</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FolderOpen className="w-4 h-4" />
                Buckets
              </div>
              <p className="text-2xl font-bold mt-1">{analytics?.buckets.length || 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bucket Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5" />
            Storage Buckets
          </CardTitle>
          <CardDescription>Usage breakdown by bucket</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics?.buckets.map((bucket) => {
              const bucketPercentage = analytics.totalSize > 0 
                ? (bucket.totalSize / analytics.totalSize) * 100 
                : 0;
              
              return (
                <div key={bucket.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="capitalize">
                        {bucket.name}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {bucket.fileCount} files
                      </span>
                    </div>
                    <span className="font-medium">{formatFileSize(bucket.totalSize)}</span>
                  </div>
                  <Progress value={bucketPercentage} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Uploads */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Recent Uploads
          </CardTitle>
          <CardDescription>Latest files uploaded to storage</CardDescription>
        </CardHeader>
        <CardContent>
          {analytics?.recentUploads.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No uploads yet</p>
          ) : (
            <div className="space-y-3">
              {analytics?.recentUploads.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Image className="w-8 h-8 text-muted-foreground shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium truncate">{file.name.split("/").pop()}</p>
                      <p className="text-xs text-muted-foreground">
                        {file.bucket} • {format(new Date(file.created_at), "MMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground shrink-0">
                    {formatFileSize(file.size)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
