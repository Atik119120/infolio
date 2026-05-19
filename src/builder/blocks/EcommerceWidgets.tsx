import { CSSProperties, useState } from "react";
import { ShoppingCart, Heart, Eye, Star, Tag, Check } from "lucide-react";
import type { Block } from "../types";
import { useCartStore, parsePrice } from "../cart/cartStore";

type Common = { block: Block; css: CSSProperties; editable?: boolean; onEditText?: (f: string, v: string) => void };

interface Product {
  title: string;
  price: string;
  oldPrice?: string;
  image: string;
  hoverImage?: string;
  badge?: string;
  rating?: number;
  inStock?: boolean;
  link?: string;
}

interface Category {
  name: string;
  image: string;
  count?: string;
  link?: string;
}

/* ---------------- Single Product Card ---------------- */
function ProductCardItem({ p, accent = "#0f172a" }: { p: Product; accent?: string }) {
  const [hover, setHover] = useState(false);
  const [added, setAdded] = useState(false);
  const add = useCartStore((s) => s.add);
  const img = hover && p.hoverImage ? p.hoverImage : p.image;
  const ratingNum = Math.min(5, Math.max(0, Number(p.rating) || 0));

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (p.inStock === false) return;
    add({
      id: `${p.title}-${p.price}`.replace(/\s+/g, "-").toLowerCase(),
      title: p.title,
      price: parsePrice(p.price),
      image: p.image,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="group relative rounded-2xl overflow-hidden bg-white border border-black/[0.06] shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] transition-all duration-500"
    >
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
        {img ? (
          <img
            src={img}
            alt={p.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-300 text-xs">
            No image
          </div>
        )}

        {/* Badges */}
        {p.badge && (
          <span
            className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white shadow-md"
            style={{ background: accent }}
          >
            {p.badge}
          </span>
        )}
        {p.inStock === false && (
          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/70 text-white">
            Sold out
          </span>
        )}

        {/* Action buttons */}
        <div className="absolute right-3 top-12 flex flex-col gap-2 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
          <button className="h-9 w-9 rounded-full bg-white shadow-lg hover:bg-black hover:text-white grid place-items-center transition" title="Wishlist">
            <Heart className="w-4 h-4" />
          </button>
          <button className="h-9 w-9 rounded-full bg-white shadow-lg hover:bg-black hover:text-white grid place-items-center transition" title="Quick view">
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Add to cart */}
        <button
          className="absolute left-3 right-3 bottom-3 h-10 rounded-xl text-white text-xs font-semibold uppercase tracking-wider inline-flex items-center justify-center gap-2 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-lg"
          style={{ background: accent }}
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          Add to cart
        </button>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-[14px] font-semibold text-neutral-900 line-clamp-1">{p.title}</h3>
        {ratingNum > 0 && (
          <div className="flex items-center gap-0.5 mt-1.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={"w-3 h-3 " + (i < ratingNum ? "fill-amber-400 text-amber-400" : "text-neutral-300")}
              />
            ))}
          </div>
        )}
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-[15px] font-bold" style={{ color: accent }}>{p.price}</span>
          {p.oldPrice && (
            <span className="text-[12px] text-neutral-400 line-through">{p.oldPrice}</span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Product Grid ---------------- */
export function ProductGridWidget({ block, css }: Common) {
  const items: Product[] = block.content.items || [];
  const columns = Number(block.content.columns) || 4;
  const title = block.content.title;
  const eyebrow = block.content.eyebrow;
  const subtitle = block.content.subtitle;
  const accent = block.content.accentColor || "#0f172a";
  const colClass =
    columns === 2 ? "sm:grid-cols-2"
    : columns === 3 ? "sm:grid-cols-2 lg:grid-cols-3"
    : "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

  return (
    <section style={css} className="px-4 sm:px-6 py-16">
      {(eyebrow || title || subtitle) && (
        <div className="max-w-3xl mx-auto text-center mb-10">
          {eyebrow && (
            <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500 mb-3">
              {eyebrow}
            </span>
          )}
          {title && (
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900">{title}</h2>
          )}
          {subtitle && (
            <p className="text-neutral-500 mt-3 text-sm sm:text-base">{subtitle}</p>
          )}
        </div>
      )}

      <div className={`max-w-7xl mx-auto grid grid-cols-1 ${colClass} gap-5`}>
        {items.map((p, i) => (
          <ProductCardItem key={i} p={p} accent={accent} />
        ))}
      </div>
    </section>
  );
}

/* ---------------- Standalone Single Card ---------------- */
export function ProductCardWidget({ block, css }: Common) {
  const accent = block.content.accentColor || "#0f172a";
  const p: Product = {
    title: block.content.title || "Product",
    price: block.content.price || "$0",
    oldPrice: block.content.oldPrice,
    image: block.content.image,
    hoverImage: block.content.hoverImage,
    badge: block.content.badge,
    rating: block.content.rating,
    inStock: block.content.inStock !== false,
  };
  return (
    <div style={css} className="max-w-xs mx-auto px-4 py-6">
      <ProductCardItem p={p} accent={accent} />
    </div>
  );
}

/* ---------------- Category Grid ---------------- */
export function CategoryGridWidget({ block, css }: Common) {
  const items: Category[] = block.content.items || [];
  const columns = Number(block.content.columns) || 4;
  const title = block.content.title;
  const eyebrow = block.content.eyebrow;
  const colClass =
    columns === 2 ? "sm:grid-cols-2"
    : columns === 3 ? "sm:grid-cols-2 lg:grid-cols-3"
    : "sm:grid-cols-2 lg:grid-cols-4";

  return (
    <section style={css} className="px-4 sm:px-6 py-16">
      {(eyebrow || title) && (
        <div className="max-w-3xl mx-auto text-center mb-10">
          {eyebrow && (
            <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500 mb-3">
              {eyebrow}
            </span>
          )}
          {title && <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900">{title}</h2>}
        </div>
      )}

      <div className={`max-w-7xl mx-auto grid grid-cols-2 ${colClass} gap-4`}>
        {items.map((c, i) => (
          <a
            key={i}
            href={c.link || "#"}
            className="group relative aspect-square rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500"
          >
            {c.image ? (
              <img
                src={c.image}
                alt={c.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-neutral-200 to-neutral-300" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4">
              <h3 className="text-white text-base font-bold flex items-center gap-2">
                <Tag className="w-4 h-4" /> {c.name}
              </h3>
              {c.count && (
                <p className="text-white/70 text-xs mt-0.5">{c.count}</p>
              )}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
