import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import { layoutOf, getCategoryLabel, PROJECT_TYPES, type FullProject, type GalleryImage } from "@/lib/projectTypes";

interface S {
  primary: string; surface: string; text: string; textMuted: string; border: string; background: string;
}

interface Props {
  projects: FullProject[];
  username?: string;
  s: S;
  basePath?: string; // e.g. /u/username — defaults to current
}

const fadeUp = { initial: { opacity: 0, y: 18 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-60px" }, transition: { duration: 0.5 } };

export function ProjectsSection({ projects, username, s, basePath }: Props) {
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(6);
  const [lightbox, setLightbox] = useState<{ images: GalleryImage[]; index: number } | null>(null);

  const sorted = [...projects]
    .filter((p) => p.is_visible !== false)
    .sort((a, b) => (Number(b.featured) - Number(a.featured)) || ((a.display_order ?? 0) - (b.display_order ?? 0)));

  const types = Array.from(new Set(sorted.map((p) => p.project_type))).filter(Boolean);

  const filtered = sorted.filter((p) => {
    if (filter !== "all" && p.project_type !== filter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const hay = [p.title, p.description, getCategoryLabel(p), ...(p.tags || []), ...(p.tools || [])].filter(Boolean).join(" ").toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  const shown = filtered.slice(0, visibleCount);
  const baseURL = basePath || (username ? `/u/${username}` : "");

  const openLightbox = (images: GalleryImage[], index: number) => setLightbox({ images, index });
  const closeLightbox = () => setLightbox(null);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") setLightbox((l) => l ? { ...l, index: (l.index + 1) % l.images.length } : l);
      if (e.key === "ArrowLeft") setLightbox((l) => l ? { ...l, index: (l.index - 1 + l.images.length) % l.images.length } : l);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  if (sorted.length === 0) return null;

  return (
    <section id="works" className="py-8 md:py-10">
      <div className="container mx-auto px-6 sm:px-8">
        <motion.div {...fadeUp} className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div>
            <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full" style={{ color: s.primary, background: `${s.primary}15` }}>Selected Works</span>
            <h2 className="t-display text-3xl md:text-5xl font-bold mt-3">Recent projects</h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: s.textMuted }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search projects..."
                className="pl-9 pr-3 py-2 text-sm rounded-full outline-none focus:ring-2 transition w-full md:w-56"
                style={{ background: s.surface, color: s.text, border: `1px solid ${s.border}` }}
              />
            </div>
          </div>
        </motion.div>

        {types.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-5">
            <FilterChip active={filter === "all"} onClick={() => setFilter("all")} s={s}>All</FilterChip>
            {types.map((t) => (
              <FilterChip key={t} active={filter === t} onClick={() => setFilter(t)} s={s}>
                {PROJECT_TYPES.find((x) => x.value === t)?.label || t}
              </FilterChip>
            ))}
          </div>
        )}

        {/* Cards — type-aware */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {shown.map((p, i) => (
            <ProjectCard key={p.id} project={p} s={s} baseURL={baseURL} onPhotoClick={openLightbox} index={i} />
          ))}
        </div>

        {visibleCount < filtered.length && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setVisibleCount((c) => c + 6)}
              className="px-6 py-2.5 text-sm font-semibold rounded-full transition hover:scale-[1.02]"
              style={{ background: s.primary, color: "#fff" }}
            >
              Load More ({filtered.length - visibleCount})
            </button>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-12" style={{ color: s.textMuted }}>No projects match your filters.</div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4" onClick={closeLightbox}>
          <button className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full" onClick={closeLightbox}><X className="w-6 h-6" /></button>
          {lightbox.images.length > 1 && (
            <>
              <button className="absolute left-4 text-white p-2 hover:bg-white/10 rounded-full" onClick={(e) => { e.stopPropagation(); setLightbox((l) => l ? { ...l, index: (l.index - 1 + l.images.length) % l.images.length } : l); }}><ChevronLeft className="w-7 h-7" /></button>
              <button className="absolute right-4 text-white p-2 hover:bg-white/10 rounded-full" onClick={(e) => { e.stopPropagation(); setLightbox((l) => l ? { ...l, index: (l.index + 1) % l.images.length } : l); }}><ChevronRight className="w-7 h-7" /></button>
            </>
          )}
          <img src={lightbox.images[lightbox.index].url} alt="" className="max-w-full max-h-full object-contain" onClick={(e) => e.stopPropagation()} />
          {lightbox.images[lightbox.index].caption && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/90 text-sm bg-black/40 px-3 py-1 rounded">{lightbox.images[lightbox.index].caption}</div>
          )}
        </div>
      )}
    </section>
  );
}

function FilterChip({ active, onClick, children, s }: any) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 text-xs font-medium rounded-full transition"
      style={{
        background: active ? s.primary : s.surface,
        color: active ? "#fff" : s.text,
        border: `1px solid ${active ? s.primary : s.border}`,
      }}
    >
      {children}
    </button>
  );
}

function ProjectCard({ project: p, s, baseURL, onPhotoClick, index }: { project: FullProject; s: S; baseURL: string; onPhotoClick: (imgs: GalleryImage[], i: number) => void; index: number }) {
  const layout = layoutOf(p.project_type);
  const cover = p.cover_image || p.image_url;
  const gallery: GalleryImage[] = Array.isArray(p.gallery) ? p.gallery : [];
  const allImages: GalleryImage[] = cover ? [{ url: cover }, ...gallery] : gallery;
  const hasDetail = ["case_study", "campaign", "default"].includes(layout) || p.sections?.length > 0 || gallery.length > 0;
  const detailHref = baseURL && p.slug ? `${baseURL}/project/${p.slug}` : null;

  const cardBase = "t-card overflow-hidden group block cursor-pointer";
  const cardStyle = { background: s.surface, border: `1px solid ${s.border}` };

  // PHOTOGRAPHER — gallery card with lightbox
  if (layout === "photographer") {
    return (
      <motion.div {...fadeUp} transition={{ duration: 0.5, delay: index * 0.04 }} className={cardBase} style={cardStyle as any} onClick={() => allImages.length && onPhotoClick(allImages, 0)}>
        {cover ? (
          <div className="aspect-[4/5] overflow-hidden">
            <img src={cover} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          </div>
        ) : null}
        <div className="p-4">
          <h3 className="t-display text-base font-semibold truncate">{p.title}</h3>
          {gallery.length > 0 && <p className="text-xs mt-1" style={{ color: s.textMuted }}>{gallery.length + 1} photos</p>}
        </div>
      </motion.div>
    );
  }

  // CAMPAIGN — social post style
  if (layout === "campaign") {
    return (
      <motion.div {...fadeUp} transition={{ duration: 0.5, delay: index * 0.04 }} className={cardBase} style={cardStyle as any}>
        {cover && (
          <div className="aspect-square overflow-hidden">
            <img src={cover} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          </div>
        )}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: `${s.primary}15`, color: s.primary }}>{getCategoryLabel(p)}</span>
            {p.client_name && <span className="text-[11px]" style={{ color: s.textMuted }}>· {p.client_name}</span>}
          </div>
          <h3 className="t-display text-base font-semibold mb-1">{p.title}</h3>
          {p.description && <p className="text-xs line-clamp-2" style={{ color: s.textMuted }}>{p.description}</p>}
          {detailHref && (
            <a href={detailHref} className="inline-flex items-center gap-1 text-xs font-semibold mt-3" style={{ color: s.primary }}>
              View campaign <ArrowRight className="w-3 h-3" />
            </a>
          )}
        </div>
      </motion.div>
    );
  }

  // CASE STUDY / DEFAULT — Behance-style cover card
  const CardInner = (
    <>
      {cover && (
        <div className="aspect-[16/10] overflow-hidden" style={{ background: s.surface }}>
          <img src={cover} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        </div>
      )}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: `${s.primary}15`, color: s.primary }}>{getCategoryLabel(p)}</span>
        </div>
        <h3 className="t-display text-lg font-semibold mb-1.5">{p.title}</h3>
        {p.description && <p className="text-sm line-clamp-2 mb-3" style={{ color: s.textMuted }}>{p.description}</p>}
        {p.tools && p.tools.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {p.tools.slice(0, 4).map((t) => (
              <span key={t} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: `${s.primary}10`, color: s.primary }}>{t}</span>
            ))}
          </div>
        )}
      </div>
    </>
  );

  if (detailHref && hasDetail) {
    return (
      <motion.a {...fadeUp} transition={{ duration: 0.5, delay: index * 0.04 }} href={detailHref} className={cardBase} style={cardStyle as any}>
        {CardInner}
      </motion.a>
    );
  }

  const externalHref = p.external_links?.live || p.live_url || p.external_links?.behance || p.external_links?.dribbble || p.external_links?.website;
  if (externalHref) {
    return (
      <motion.a {...fadeUp} transition={{ duration: 0.5, delay: index * 0.04 }} href={externalHref} target="_blank" rel="noreferrer" className={cardBase} style={cardStyle as any}>
        {CardInner}
        <div className="px-5 pb-4 text-xs inline-flex items-center gap-1" style={{ color: s.primary }}>Visit <ExternalLink className="w-3 h-3" /></div>
      </motion.a>
    );
  }

  return (
    <motion.div {...fadeUp} transition={{ duration: 0.5, delay: index * 0.04 }} className={cardBase} style={cardStyle as any}>
      {CardInner}
    </motion.div>
  );
}
