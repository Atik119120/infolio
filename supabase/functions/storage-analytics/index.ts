import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BucketStats {
  name: string;
  fileCount: number;
  totalSize: number;
  files: Array<{
    name: string;
    size: number;
    created_at: string;
  }>;
}

interface StorageAnalytics {
  totalFiles: number;
  totalSize: number;
  buckets: BucketStats[];
  recentUploads: Array<{
    name: string;
    bucket: string;
    size: number;
    created_at: string;
  }>;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Create admin client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get auth header to verify admin
    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      
      if (authError || !user) {
        return new Response(
          JSON.stringify({ error: "Unauthorized" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Check if user is admin
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .single();

      if (!roleData) {
        return new Response(
          JSON.stringify({ error: "Admin access required" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Get bucket list
    const bucketNames = ["avatars", "projects"];
    const buckets: BucketStats[] = [];
    const allFiles: Array<{ name: string; bucket: string; size: number; created_at: string }> = [];

    for (const bucketName of bucketNames) {
      const { data: files, error } = await supabase.storage
        .from(bucketName)
        .list("", { limit: 1000, sortBy: { column: "created_at", order: "desc" } });

      if (error) {
        console.error(`Error fetching ${bucketName}:`, error);
        continue;
      }

      // For nested folders, we need to recursively list
      const allBucketFiles: Array<{ name: string; size: number; created_at: string }> = [];
      
      // Get files from root and subfolders
      for (const item of files || []) {
        if (item.id) {
          // It's a file
          allBucketFiles.push({
            name: item.name,
            size: item.metadata?.size || 0,
            created_at: item.created_at || new Date().toISOString(),
          });
          allFiles.push({
            name: item.name,
            bucket: bucketName,
            size: item.metadata?.size || 0,
            created_at: item.created_at || new Date().toISOString(),
          });
        } else {
          // It's a folder, list its contents
          const { data: folderFiles } = await supabase.storage
            .from(bucketName)
            .list(item.name, { limit: 1000 });

          for (const file of folderFiles || []) {
            if (file.id) {
              allBucketFiles.push({
                name: `${item.name}/${file.name}`,
                size: file.metadata?.size || 0,
                created_at: file.created_at || new Date().toISOString(),
              });
              allFiles.push({
                name: `${item.name}/${file.name}`,
                bucket: bucketName,
                size: file.metadata?.size || 0,
                created_at: file.created_at || new Date().toISOString(),
              });
            }
          }
        }
      }

      const totalSize = allBucketFiles.reduce((sum, f) => sum + f.size, 0);

      buckets.push({
        name: bucketName,
        fileCount: allBucketFiles.length,
        totalSize,
        files: allBucketFiles.slice(0, 10), // Only return first 10 files per bucket
      });
    }

    // Sort all files by date and get recent uploads
    allFiles.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    const analytics: StorageAnalytics = {
      totalFiles: allFiles.length,
      totalSize: buckets.reduce((sum, b) => sum + b.totalSize, 0),
      buckets,
      recentUploads: allFiles.slice(0, 10),
    };

    console.log("Storage analytics fetched:", {
      totalFiles: analytics.totalFiles,
      totalSize: analytics.totalSize,
    });

    return new Response(
      JSON.stringify(analytics),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching storage analytics:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
