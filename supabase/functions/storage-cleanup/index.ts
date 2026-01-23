import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrphanFile {
  name: string;
  bucket: string;
  size: number;
  created_at: string;
}

interface CleanupResult {
  orphanFiles: OrphanFile[];
  deletedFiles: string[];
  totalFreed: number;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify admin access
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

      // Check admin role
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

    const { action } = await req.json();

    // Get all project image URLs from database
    const { data: projects } = await supabase
      .from("projects")
      .select("image_url");

    const projectImageUrls = new Set(
      (projects || [])
        .filter((p) => p.image_url)
        .map((p) => p.image_url)
    );

    // Get all avatar and logo URLs from database
    const { data: profiles } = await supabase
      .from("profiles")
      .select("avatar_url");

    const { data: portfolios } = await supabase
      .from("portfolios")
      .select("logo_url");

    const avatarUrls = new Set(
      (profiles || [])
        .filter((p) => p.avatar_url)
        .map((p) => p.avatar_url)
    );

    const logoUrls = new Set(
      (portfolios || [])
        .filter((p) => p.logo_url)
        .map((p) => p.logo_url)
    );

    const orphanFiles: OrphanFile[] = [];

    // Check projects bucket
    const { data: projectFolders } = await supabase.storage
      .from("projects")
      .list("", { limit: 1000 });

    for (const folder of projectFolders || []) {
      if (!folder.id) {
        // It's a folder
        const { data: files } = await supabase.storage
          .from("projects")
          .list(folder.name, { limit: 1000 });

        for (const file of files || []) {
          if (file.id) {
            const fullPath = `${folder.name}/${file.name}`;
            const { data: urlData } = supabase.storage.from("projects").getPublicUrl(fullPath);
            
            // Check if this URL is used - strip query params for comparison
            const baseUrl = urlData.publicUrl.split("?")[0];
            const isUsed = Array.from(projectImageUrls).some((url) => 
              url && url.split("?")[0] === baseUrl
            );

            if (!isUsed) {
              orphanFiles.push({
                name: fullPath,
                bucket: "projects",
                size: file.metadata?.size || 0,
                created_at: file.created_at || new Date().toISOString(),
              });
            }
          }
        }
      }
    }

    // Check avatars bucket
    const { data: avatarFolders } = await supabase.storage
      .from("avatars")
      .list("", { limit: 1000 });

    for (const folder of avatarFolders || []) {
      if (!folder.id) {
        const { data: files } = await supabase.storage
          .from("avatars")
          .list(folder.name, { limit: 1000 });

        for (const file of files || []) {
          if (file.id) {
            const fullPath = `${folder.name}/${file.name}`;
            const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(fullPath);
            
            const baseUrl = urlData.publicUrl.split("?")[0];
            const isUsedAsAvatar = Array.from(avatarUrls).some((url) => 
              url && url.split("?")[0] === baseUrl
            );
            const isUsedAsLogo = Array.from(logoUrls).some((url) => 
              url && url.split("?")[0] === baseUrl
            );

            if (!isUsedAsAvatar && !isUsedAsLogo) {
              orphanFiles.push({
                name: fullPath,
                bucket: "avatars",
                size: file.metadata?.size || 0,
                created_at: file.created_at || new Date().toISOString(),
              });
            }
          }
        }
      }
    }

    const result: CleanupResult = {
      orphanFiles,
      deletedFiles: [],
      totalFreed: 0,
    };

    // If action is "delete", remove orphan files
    if (action === "delete" && orphanFiles.length > 0) {
      // Group by bucket
      const projectOrphans = orphanFiles.filter((f) => f.bucket === "projects").map((f) => f.name);
      const avatarOrphans = orphanFiles.filter((f) => f.bucket === "avatars").map((f) => f.name);

      if (projectOrphans.length > 0) {
        const { error } = await supabase.storage.from("projects").remove(projectOrphans);
        if (!error) {
          result.deletedFiles.push(...projectOrphans);
        } else {
          console.error("Error deleting project orphans:", error);
        }
      }

      if (avatarOrphans.length > 0) {
        const { error } = await supabase.storage.from("avatars").remove(avatarOrphans);
        if (!error) {
          result.deletedFiles.push(...avatarOrphans);
        } else {
          console.error("Error deleting avatar orphans:", error);
        }
      }

      result.totalFreed = orphanFiles
        .filter((f) => result.deletedFiles.includes(f.name))
        .reduce((sum, f) => sum + f.size, 0);

      console.log(`Cleanup completed: deleted ${result.deletedFiles.length} files, freed ${result.totalFreed} bytes`);
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in storage cleanup:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
