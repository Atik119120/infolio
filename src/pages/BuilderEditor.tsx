import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { useBuilderStore } from "@/builder/store";
import { LeftSidebar } from "@/builder/components/LeftSidebar";
import { Canvas } from "@/builder/components/Canvas";
import { RightPanel } from "@/builder/components/RightPanel";
import { TopBar } from "@/builder/components/TopBar";
import { Navigator } from "@/builder/components/Navigator";
import { useKeyboardShortcuts } from "@/builder/hooks/useKeyboardShortcuts";
import { Loader2 } from "lucide-react";

export default function BuilderEditor() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const store = useBuilderStore();
  const autosaveTimer = useRef<any>(null);

  // Load page
  useEffect(() => {
    if (!id || !user) return;
    (async () => {
      const { data, error } = await supabase
        .from("builder_pages")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .maybeSingle();
      if (error || !data) {
        toast.error("Page not found");
        navigate("/dashboard/builder");
        return;
      }
      store.loadPage({
        id: data.id,
        name: data.name,
        slug: data.slug,
        isPublished: data.is_published,
        content: (data.content as any) || { blocks: [] },
      });
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user]);

  const save = async (silent = false) => {
    if (!store.pageId || !user) return;
    setSaving(true);
    const { error } = await supabase
      .from("builder_pages")
      .update({
        name: store.pageName,
        content: store.content as any,
      })
      .eq("id", store.pageId)
      .eq("user_id", user.id);
    setSaving(false);
    if (error) {
      toast.error("Save failed");
      return;
    }
    store.markSaved();
    if (!silent) toast.success("Saved");
  };

  // Auto-save every 8s when dirty
  useEffect(() => {
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    if (!store.dirty || loading) return;
    autosaveTimer.current = setTimeout(() => save(true), 8000);
    return () => clearTimeout(autosaveTimer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.content, store.pageName, store.dirty]);

  const publish = async () => {
    if (!store.pageId || !user) return;
    setPublishing(true);
    const { error } = await supabase
      .from("builder_pages")
      .update({
        name: store.pageName,
        content: store.content as any,
        published_content: store.content as any,
        is_published: true,
        published_at: new Date().toISOString(),
      })
      .eq("id", store.pageId)
      .eq("user_id", user.id);
    setPublishing(false);
    if (error) {
      toast.error("Publish failed");
      return;
    }
    store.markPublished();
    toast.success("Published!", {
      action: {
        label: "View",
        onClick: () => window.open(`/p/${store.pageSlug}`, "_blank"),
      },
    });
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-slate-950 flex items-center justify-center text-white">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-900 flex flex-col text-white z-50">
      <TopBar onSave={() => save(false)} onPublish={publish} saving={saving} publishing={publishing} />
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={18} minSize={12} maxSize={28}>
          <LeftSidebar />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={60}>
          <Canvas />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={22} minSize={16} maxSize={32}>
          <RightPanel />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
