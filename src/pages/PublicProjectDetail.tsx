import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ArrowLeft, ExternalLink, Calendar, User as UserIcon, ChevronLeft, ChevronRight, X } from "lucide-react";
import { layoutOf, getCategoryLabel, type FullProject, type GalleryImage } from "@/lib/projectTypes";

export default function PublicProjectDetail() {
  const { username, slug } = useParams<{ username: string; slug: string }>();
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<FullProject | null>(null);
  const [ownerName, setOwnerName] = useState<string>("");
  const [notFound, setNotFound] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      if (!username || !slug) return;
      const { data: profile } = await supabase
        .from("profiles")
        .select("user_id, display_name")
        .eq("username", username)
        .maybeSingle();
      if (!profile) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      setOwnerName(profile.display_name || username);
      const { data: p } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", profile.user_id)
        .eq("slug", slug)
        .maybeSingle();
      if (!p) {
        setNotFound(true);
      } else {
        setProject(p as any);
        document.title = `${p.title} — ${profile.display_name || username}`;
      }
      setLoading(false);
    })();
  }, [username, slug]);

  useEffect(() => {
    if (lightbox === null || !project) return;
    const imgs = images;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox((i) => (i === null ? null : (i + 1) % imgs.length));
      if (e.key === "ArrowLeft") setLightbox((i) => (i === null ? null : (i - 1 + imgs.length) % imgs.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, project]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }
  if (notFound || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-3">Project not found</h1>
          <Link to={`/u/${username}`} className="text-primary underline">Back to portfolio</Link>
        </div>
      </div>
    );
  }

  const layout = layoutOf(project.project_type);
  const cover = project.cover_image || project.image_url;
  const gallery: GalleryImage[] = Array.isArray(project.gallery) ? project.gallery : [];
  const images: GalleryImage[] = cover ? [{ url: cover }, ...gallery] : gallery;
  const ext = project.external_links || {};
  const links: Array<{ key: string; label: string; href?: string }> = [
    { key: "live", label: "Live Project", href: ext.live || project.live_url || undefined },
    { key: "website", label: "Website", href: ext.website },
    { key: "behance", label: "Behance", href: ext.behance },
    { key: "dribbble", label: "Dribbble", href: ext.dribbble },
    { key: "facebook", label: "Facebook", href: ext.facebook },
    { key: "github", label: "GitHub", href: project.github_url || undefined },
  ].filter((l) => !!l.href) as any;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top nav */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur border-b">
        <div className="container mx-auto px-6 sm:px-8 py-4 flex items-center justify-between">
          <Link to={`/u/${username}`} className="inline-flex items-center gap-2 text-sm font-semibold hover:text-primary">
            <ArrowLeft className="w-4 h-4" /> Back to {ownerName}
          </Link>
          <span className="text-xs uppercase tracking-wider text-muted-foreground">{getCategoryLabel(project)}</span>
        </div>
      </header>

      {/* HERO */}
      <section className="relative">
        {cover && (
          <div className="aspect-[21/9] md:aspect-[21/8] w-full overflow-hidden">
            <img src={cover} alt={project.title} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="container mx-auto px-6 sm:px-8 py-10">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">{project.title}</h1>
          {project.description && <p className="text-lg md:text-xl text-muted-foreground max-w-3xl">{project.description}</p>}

          <div className="flex flex-wrap gap-6 mt-8 text-sm">
            {project.client_name && (
              <Meta label="Client" value={project.client_name} icon={<UserIcon className="w-4 h-4" />} />
            )}
            {project.project_date && (
              <Meta label="Date" value={new Date(project.project_date).toLocaleDateString("en-US", { year: "numeric", month: "long" })} icon={<Calendar className="w-4 h-4" />} />
            )}
            {project.tools && project.tools.length > 0 && (
              <Meta label="Tools" value={project.tools.join(", ")} />
            )}
          </div>

          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {project.tags.map((t) => (
                <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary">#{t}</span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CONTENT — layout-aware */}
      {layout === "photographer" && (
        <PhotographerLayout images={images} onOpen={setLightbox} />
      )}
      {layout === "case_study" && (
        <CaseStudyLayout project={project} gallery={gallery} onOpen={(i) => setLightbox(cover ? i + 1 : i)} />
      )}
      {layout === "campaign" && (
        <CampaignLayout project={project} gallery={gallery} onOpen={(i) => setLightbox(cover ? i + 1 : i)} />
      )}
      {layout === "default" && (
        <DefaultLayout project={project} gallery={gallery} onOpen={(i) => setLightbox(cover ? i + 1 : i)} />
      )}

      {/* LINKS */}
      {links.length > 0 && (
        <section className="container mx-auto px-6 sm:px-8 py-12 border-t">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Project Links</h3>
          <div className="flex flex-wrap gap-3">
            {links.map((l) => (
              <a key={l.key} href={l.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-full border hover:bg-primary hover:text-primary-foreground hover:border-primary transition text-sm font-medium">
                {l.label} <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ))}
          </div>
        </section>
      )}

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <Link to={`/u/${username}`} className="hover:text-primary">View all projects by {ownerName}</Link>
      </footer>

      {/* Lightbox */}
      {lightbox !== null && images[lightbox] && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full" onClick={() => setLightbox(null)}><X className="w-6 h-6" /></button>
          {images.length > 1 && (
            <>
              <button className="absolute left-4 text-white p-2 hover:bg-white/10 rounded-full" onClick={(e) => { e.stopPropagation(); setLightbox((i) => i === null ? null : (i - 1 + images.length) % images.length); }}><ChevronLeft className="w-7 h-7" /></button>
              <button className="absolute right-4 text-white p-2 hover:bg-white/10 rounded-full" onClick={(e) => { e.stopPropagation(); setLightbox((i) => i === null ? null : (i + 1) % images.length); }}><ChevronRight className="w-7 h-7" /></button>
            </>
          )}
          <img src={images[lightbox].url} className="max-w-full max-h-full object-contain" onClick={(e) => e.stopPropagation()} />
          {images[lightbox].caption && <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/90 text-sm bg-black/40 px-3 py-1 rounded">{images[lightbox].caption}</div>}
        </div>
      )}
    </div>
  );
}

function Meta({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1 flex items-center gap-1.5">{icon}{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}

/* ------- LAYOUTS ------- */

function PhotographerLayout({ images, onOpen }: { images: GalleryImage[]; onOpen: (i: number) => void }) {
  return (
    <section className="container mx-auto px-6 sm:px-8 py-10">
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 [&>*]:mb-4">
        {images.map((g, i) => (
          <button key={i} onClick={() => onOpen(i)} className="block w-full overflow-hidden rounded-lg group">
            <img src={g.url} alt={g.caption || ""} className="w-full h-auto group-hover:scale-[1.02] transition-transform duration-500" />
          </button>
        ))}
      </div>
    </section>
  );
}

function CaseStudyLayout({ project, gallery, onOpen }: { project: FullProject; gallery: GalleryImage[]; onOpen: (i: number) => void }) {
  const sections = Array.isArray(project.sections) ? project.sections : [];
  return (
    <section className="container mx-auto px-6 sm:px-8 py-10 max-w-4xl">
      {sections.map((sec: any, i: number) => {
        if (sec.type === "heading") return <h2 key={i} className="text-2xl md:text-3xl font-bold mt-12 mb-4">{sec.content}</h2>;
        if (sec.type === "text") return <p key={i} className="text-base md:text-lg leading-relaxed text-muted-foreground mb-6 whitespace-pre-wrap">{sec.content}</p>;
        if (sec.type === "image" && sec.image_url) return (
          <figure key={i} className="my-10 -mx-6 sm:mx-0">
            <img src={sec.image_url} alt={sec.caption || ""} className="w-full rounded-lg" />
            {sec.caption && <figcaption className="text-center text-sm text-muted-foreground mt-3">{sec.caption}</figcaption>}
          </figure>
        );
        return null;
      })}

      {gallery.length > 0 && (
        <div className="mt-16">
          <h3 className="text-xl font-semibold mb-6">Gallery</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {gallery.map((g, i) => (
              <button key={i} onClick={() => onOpen(i)} className="overflow-hidden rounded-lg block">
                <img src={g.url} alt="" className="w-full h-auto" />
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function CampaignLayout({ project, gallery, onOpen }: { project: FullProject; gallery: GalleryImage[]; onOpen: (i: number) => void }) {
  const sections = Array.isArray(project.sections) ? project.sections : [];
  return (
    <section className="container mx-auto px-6 sm:px-8 py-10 max-w-5xl">
      {gallery.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-12">
          {gallery.map((g, i) => (
            <button key={i} onClick={() => onOpen(i)} className="overflow-hidden rounded-lg aspect-square">
              <img src={g.url} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </button>
          ))}
        </div>
      )}
      <div className="max-w-3xl">
        {sections.map((sec: any, i: number) => {
          if (sec.type === "heading") return <h2 key={i} className="text-2xl font-bold mt-8 mb-3">{sec.content}</h2>;
          if (sec.type === "text") return <p key={i} className="text-base leading-relaxed text-muted-foreground mb-4 whitespace-pre-wrap">{sec.content}</p>;
          if (sec.type === "image" && sec.image_url) return <img key={i} src={sec.image_url} className="w-full rounded-lg my-6" />;
          return null;
        })}
      </div>
    </section>
  );
}

function DefaultLayout({ project, gallery, onOpen }: { project: FullProject; gallery: GalleryImage[]; onOpen: (i: number) => void }) {
  const sections = Array.isArray(project.sections) ? project.sections : [];
  return (
    <section className="container mx-auto px-6 sm:px-8 py-10 max-w-4xl">
      {sections.map((sec: any, i: number) => {
        if (sec.type === "heading") return <h2 key={i} className="text-2xl font-bold mt-10 mb-3">{sec.content}</h2>;
        if (sec.type === "text") return <p key={i} className="text-base leading-relaxed text-muted-foreground mb-4 whitespace-pre-wrap">{sec.content}</p>;
        if (sec.type === "image" && sec.image_url) return <img key={i} src={sec.image_url} className="w-full rounded-lg my-6" />;
        return null;
      })}
      {gallery.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-4 mt-10">
          {gallery.map((g, i) => (
            <button key={i} onClick={() => onOpen(i)} className="overflow-hidden rounded-lg">
              <img src={g.url} className="w-full h-auto" />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
