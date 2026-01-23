import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

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

    const { action, targetUserId, email, role } = await req.json();

    // Delete user and all their data
    if (action === "delete_user") {
      if (!targetUserId) {
        return new Response(
          JSON.stringify({ error: "Target user ID required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log(`Deleting user ${targetUserId} and all their data...`);

      // Get user's profile for storage cleanup
      const { data: profile } = await supabase
        .from("profiles")
        .select("user_id, avatar_url")
        .eq("user_id", targetUserId)
        .single();

      // Get user's projects for storage cleanup
      const { data: projects } = await supabase
        .from("projects")
        .select("image_url")
        .eq("user_id", targetUserId);

      // Delete storage files
      const filesToDelete: { bucket: string; path: string }[] = [];

      if (profile?.avatar_url) {
        // Extract path from URL
        const avatarPath = profile.avatar_url.split("/avatars/")[1]?.split("?")[0];
        if (avatarPath) {
          filesToDelete.push({ bucket: "avatars", path: decodeURIComponent(avatarPath) });
        }
      }

      if (projects) {
        for (const project of projects) {
          if (project.image_url) {
            const imagePath = project.image_url.split("/projects/")[1]?.split("?")[0];
            if (imagePath) {
              filesToDelete.push({ bucket: "projects", path: decodeURIComponent(imagePath) });
            }
          }
        }
      }

      // Delete files from storage
      for (const file of filesToDelete) {
        const { error: storageError } = await supabase.storage
          .from(file.bucket)
          .remove([file.path]);
        if (storageError) {
          console.warn(`Failed to delete ${file.bucket}/${file.path}:`, storageError);
        }
      }

      // Delete related data in order (respecting foreign keys)
      const tables = [
        "contact_messages",
        "domains",
        "education",
        "experiences",
        "projects",
        "skills",
        "social_links",
        "portfolios",
        "user_roles",
        "profiles",
      ];

      for (const table of tables) {
        const column = table === "contact_messages" ? "portfolio_owner_id" : "user_id";
        const { error } = await supabase
          .from(table)
          .delete()
          .eq(column, targetUserId);

        if (error) {
          console.warn(`Failed to delete from ${table}:`, error);
        } else {
          console.log(`Deleted from ${table}`);
        }
      }

      // Finally, delete the auth user
      const { error: deleteAuthError } = await supabase.auth.admin.deleteUser(targetUserId);
      
      if (deleteAuthError) {
        console.error("Failed to delete auth user:", deleteAuthError);
        return new Response(
          JSON.stringify({ error: "Failed to delete auth user", details: deleteAuthError.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log(`Successfully deleted user ${targetUserId}`);

      return new Response(
        JSON.stringify({ success: true, message: "User and all data deleted successfully" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Add admin role
    if (action === "add_admin") {
      if (!email) {
        return new Response(
          JSON.stringify({ error: "Email required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log(`Adding admin role for email: ${email}`);

      // Find user by email
      const { data: targetProfile } = await supabase
        .from("profiles")
        .select("user_id")
        .eq("email", email)
        .single();

      if (!targetProfile) {
        return new Response(
          JSON.stringify({ error: "User not found with this email" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Check if already admin
      const { data: existingRole } = await supabase
        .from("user_roles")
        .select("id")
        .eq("user_id", targetProfile.user_id)
        .eq("role", "admin")
        .single();

      if (existingRole) {
        return new Response(
          JSON.stringify({ error: "User is already an admin" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Add admin role
      const { error: insertError } = await supabase
        .from("user_roles")
        .insert({ user_id: targetProfile.user_id, role: "admin" });

      if (insertError) {
        console.error("Failed to add admin role:", insertError);
        return new Response(
          JSON.stringify({ error: "Failed to add admin role" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, message: "Admin role added successfully" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Remove admin role
    if (action === "remove_admin") {
      if (!targetUserId) {
        return new Response(
          JSON.stringify({ error: "Target user ID required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Don't allow removing own admin role
      if (targetUserId === user.id) {
        return new Response(
          JSON.stringify({ error: "Cannot remove your own admin role" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { error: deleteError } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", targetUserId)
        .eq("role", "admin");

      if (deleteError) {
        console.error("Failed to remove admin role:", deleteError);
        return new Response(
          JSON.stringify({ error: "Failed to remove admin role" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, message: "Admin role removed successfully" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // List admins
    if (action === "list_admins") {
      const { data: admins, error } = await supabase
        .from("user_roles")
        .select(`
          user_id,
          created_at,
          profiles:user_id (
            email,
            display_name,
            username,
            avatar_url
          )
        `)
        .eq("role", "admin");

      if (error) {
        console.error("Failed to list admins:", error);
        return new Response(
          JSON.stringify({ error: "Failed to list admins" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ admins }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in admin-manage-user:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
