import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Package, Search, Loader2, X } from "lucide-react";

interface Product {
  id: string;
  user_id: string;
  title: string;
  slug: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  image_url: string | null;
  stock: number;
  category: string | null;
  badge: string | null;
  status: string;
  featured: boolean;
  display_order: number;
  created_at: string;
}

const blank = (): Partial<Product> => ({
  title: "",
  slug: "",
  description: "",
  price: 0,
  compare_at_price: null,
  image_url: "",
  stock: 0,
  category: "",
  badge: "",
  status: "active",
  featured: false,
});

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");

export default function DashboardProducts() {
  const { user } = useAuth();
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Partial<Product> | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("products" as any)
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setLoading(false);
    if (error) return toast.error(error.message);
    setItems((data as any) || []);
  };

  useEffect(() => { load(); }, [user]);

  const filtered = items.filter((p) =>
    !q || `${p.title} ${p.category || ""}`.toLowerCase().includes(q.toLowerCase())
  );

  const save = async () => {
    if (!user || !editing) return;
    if (!editing.title?.trim()) return toast.error("Title required");
    setSaving(true);

    const payload: any = {
      user_id: user.id,
      title: editing.title!.trim(),
      slug: editing.slug?.trim() || slugify(editing.title!),
      description: editing.description || null,
      price: Number(editing.price) || 0,
      compare_at_price: editing.compare_at_price ? Number(editing.compare_at_price) : null,
      image_url: editing.image_url || null,
      stock: Number(editing.stock) || 0,
      category: editing.category || null,
      badge: editing.badge || null,
      status: editing.status || "active",
      featured: !!editing.featured,
    };

    let error;
    if (editing.id) {
      ({ error } = await supabase.from("products" as any).update(payload).eq("id", editing.id));
    } else {
      ({ error } = await supabase.from("products" as any).insert(payload));
    }
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(editing.id ? "Updated" : "Product added");
    setEditing(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products" as any).delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  };

  return (
    <div className="p-6 space-y-5 text-white">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Package className="w-6 h-6 text-pink-500" /> Products
          </h1>
          <p className="text-sm text-white/50">Manage your store inventory.</p>
        </div>
        <button
          onClick={() => setEditing(blank())}
          className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-gradient-to-r from-pink-600 to-fuchsia-600 text-sm font-semibold shadow-lg shadow-pink-600/30 hover:brightness-110"
        >
          <Plus className="w-4 h-4" /> Add product
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search products..."
          className="w-full h-10 pl-9 pr-3 rounded-lg bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-pink-500"
        />
      </div>

      {loading ? (
        <div className="py-16 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-white/40" /></div>
      ) : filtered.length === 0 ? (
        <div className="border border-dashed border-white/10 rounded-2xl p-12 text-center text-white/50">
          <Package className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No products yet. Click "Add product" to start.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((p) => (
            <div key={p.id} className="rounded-xl bg-white/5 border border-white/10 overflow-hidden hover:border-pink-500/40 transition group">
              <div className="aspect-square bg-white/5 relative">
                {p.image_url ? (
                  <img src={p.image_url} alt={p.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/20">
                    <Package className="w-10 h-10" />
                  </div>
                )}
                <span className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  p.status === "active" ? "bg-green-500/20 text-green-300" :
                  p.status === "draft" ? "bg-yellow-500/20 text-yellow-300" :
                  "bg-white/10 text-white/60"
                }`}>{p.status}</span>
              </div>
              <div className="p-3">
                <p className="text-sm font-semibold truncate">{p.title}</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-sm font-bold text-pink-400">${Number(p.price).toFixed(2)}</span>
                  {p.compare_at_price && (
                    <span className="text-xs text-white/30 line-through">${Number(p.compare_at_price).toFixed(2)}</span>
                  )}
                </div>
                <p className="text-[11px] text-white/40 mt-1">
                  Stock: {p.stock} {p.category ? `· ${p.category}` : ""}
                </p>
                <div className="flex gap-1.5 mt-3">
                  <button
                    onClick={() => setEditing(p)}
                    className="flex-1 inline-flex items-center justify-center gap-1 h-8 rounded-md bg-white/5 hover:bg-white/10 text-xs"
                  >
                    <Pencil className="w-3 h-3" /> Edit
                  </button>
                  <button
                    onClick={() => remove(p.id)}
                    className="h-8 w-8 inline-flex items-center justify-center rounded-md bg-white/5 hover:bg-red-500/20 text-white/60 hover:text-red-300"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor modal */}
      {editing && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-slate-950 flex items-center justify-between p-5 border-b border-white/10">
              <h2 className="font-bold">{editing.id ? "Edit product" : "New product"}</h2>
              <button onClick={() => setEditing(null)} className="h-8 w-8 grid place-items-center rounded-full hover:bg-white/10">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 grid grid-cols-2 gap-4 text-sm">
              <Field label="Title *" full>
                <input value={editing.title || ""} onChange={(e) => setEditing({ ...editing, title: e.target.value, slug: editing.id ? editing.slug : slugify(e.target.value) })} className={input} />
              </Field>
              <Field label="Slug">
                <input value={editing.slug || ""} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} className={input} />
              </Field>
              <Field label="Category">
                <input value={editing.category || ""} onChange={(e) => setEditing({ ...editing, category: e.target.value })} className={input} />
              </Field>
              <Field label="Price *">
                <input type="number" step="0.01" value={editing.price ?? 0} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} className={input} />
              </Field>
              <Field label="Compare-at price">
                <input type="number" step="0.01" value={editing.compare_at_price ?? ""} onChange={(e) => setEditing({ ...editing, compare_at_price: e.target.value ? Number(e.target.value) : null })} className={input} />
              </Field>
              <Field label="Stock">
                <input type="number" value={editing.stock ?? 0} onChange={(e) => setEditing({ ...editing, stock: Number(e.target.value) })} className={input} />
              </Field>
              <Field label="Badge (e.g. New, Sale)">
                <input value={editing.badge || ""} onChange={(e) => setEditing({ ...editing, badge: e.target.value })} className={input} />
              </Field>
              <Field label="Image URL" full>
                <input value={editing.image_url || ""} onChange={(e) => setEditing({ ...editing, image_url: e.target.value })} className={input} placeholder="https://..." />
              </Field>
              <Field label="Description" full>
                <textarea rows={3} value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className={input + " min-h-[80px]"} />
              </Field>
              <Field label="Status">
                <select value={editing.status || "active"} onChange={(e) => setEditing({ ...editing, status: e.target.value })} className={input}>
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="archived">Archived</option>
                </select>
              </Field>
              <Field label="Featured">
                <label className="inline-flex items-center gap-2 h-10">
                  <input type="checkbox" checked={!!editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} />
                  <span className="text-white/70">Show in featured grid</span>
                </label>
              </Field>
            </div>
            <div className="sticky bottom-0 bg-slate-950 p-4 border-t border-white/10 flex justify-end gap-2">
              <button onClick={() => setEditing(null)} className="h-10 px-4 rounded-lg bg-white/5 hover:bg-white/10 text-sm">Cancel</button>
              <button onClick={save} disabled={saving} className="h-10 px-5 rounded-lg bg-gradient-to-r from-pink-600 to-fuchsia-600 text-sm font-semibold inline-flex items-center gap-2 disabled:opacity-50">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {editing.id ? "Save changes" : "Create product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const input = "w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-pink-500";

const Field = ({ label, full, children }: { label: string; full?: boolean; children: React.ReactNode }) => (
  <label className={`block ${full ? "col-span-2" : ""}`}>
    <span className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-1.5">{label}</span>
    {children}
  </label>
);
