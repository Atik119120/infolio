import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { BlockRenderer } from "@/builder/blocks/BlockRenderer";
import { ThemeStyle } from "@/builder/components/ThemeStyle";
import type { PageContent } from "@/builder/types";

export default function PublicBuilderPage() {
  const { slug } = useParams<{ slug: string }>();
  const [content, setContent] = useState<PageContent | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    if (!slug) return;
    (async () => {
      const { data } = await supabase
        .from("builder_pages")
        .select("name,published_content,is_published")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();
      if (!data || !data.published_content) {
        setNotFound(true);
        return;
      }
      setContent(data.published_content as any);
      setName(data.name);
      document.title = `${data.name} — Infolio`;
    })();
  }, [slug]);

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-6">
        <div>
          <h1 className="text-2xl font-bold">Page not found</h1>
          <p className="text-muted-foreground mt-2">This page is not published or doesn't exist.</p>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const theme = content.theme || {};
  return (
    <div className="min-h-screen" style={{ background: theme.background || "#ffffff", fontFamily: theme.fontFamily }}>
      {content.blocks.map((b) => (
        <BlockRenderer key={b.id} block={b} />
      ))}
      <footer className="text-center text-xs text-slate-500 py-6 border-t">
        Built with{" "}
        <a href="/" className="text-red-600 hover:underline font-semibold">
          Infolio
        </a>
      </footer>
    </div>
  );
}
