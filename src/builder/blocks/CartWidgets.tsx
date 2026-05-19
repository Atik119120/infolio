import { CSSProperties, useEffect, useState } from "react";
import { ShoppingBag, X, Plus, Minus, Trash2, CheckCircle2, CreditCard, Truck, ShieldCheck, Loader2 } from "lucide-react";
import type { Block } from "../types";
import { useCartStore, cartTotals, formatPrice, parsePrice } from "../cart/cartStore";
import { supabase } from "@/integrations/supabase/client";

type Common = { block: Block; css: CSSProperties };

/* ============= Floating Cart (button + drawer) ============= */
export function CartFloatingWidget({ block, css }: Common) {
  const accent = block.content.accentColor || "#0f172a";
  const currency = block.content.currency || "$";
  const position = block.content.position || "bottom-right";
  const label = block.content.label || "Cart";

  const items = useCartStore((s) => s.items);
  const open = useCartStore((s) => s.open);
  const setOpen = useCartStore((s) => s.setOpen);
  const remove = useCartStore((s) => s.remove);
  const setQty = useCartStore((s) => s.setQty);
  const clear = useCartStore((s) => s.clear);
  const { subtotal, count } = cartTotals(items);

  const posClass =
    position === "bottom-left"
      ? "left-5 bottom-5"
      : position === "top-right"
      ? "right-5 top-5"
      : "right-5 bottom-5";

  return (
    <div style={css}>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className={`fixed ${posClass} z-[60] h-14 w-14 rounded-full text-white shadow-2xl grid place-items-center hover:scale-105 active:scale-95 transition-all`}
        style={{ background: accent }}
        aria-label={label}
      >
        <ShoppingBag className="w-5 h-5" />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[22px] h-[22px] px-1.5 rounded-full bg-white text-[11px] font-bold grid place-items-center shadow"
            style={{ color: accent }}>
            {count}
          </span>
        )}
      </button>

      {/* Drawer overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-[70] backdrop-blur-sm animate-in fade-in"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer panel */}
      <aside
        className={`fixed top-0 right-0 h-screen w-full sm:w-[420px] bg-white z-[71] shadow-2xl transform transition-transform duration-300 flex flex-col ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between p-5 border-b">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" style={{ color: accent }} />
            <h3 className="text-lg font-bold text-neutral-900">Your Cart</h3>
            <span className="text-xs text-neutral-500">({count})</span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="h-9 w-9 grid place-items-center rounded-full hover:bg-neutral-100"
          >
            <X className="w-4 h-4" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-neutral-500 py-20">
              <ShoppingBag className="w-12 h-12 mb-3 opacity-30" />
              <p className="text-sm">Your cart is empty</p>
            </div>
          ) : (
            items.map((it) => (
              <div key={it.id} className="flex gap-3 group">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-neutral-100 flex-shrink-0">
                  {it.image && (
                    <img src={it.image} alt={it.title} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-neutral-900 line-clamp-2">{it.title}</h4>
                  <p className="text-sm font-bold mt-1" style={{ color: accent }}>
                    {formatPrice(it.price, currency)}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="inline-flex items-center border rounded-full">
                      <button
                        onClick={() => setQty(it.id, it.qty - 1)}
                        className="h-7 w-7 grid place-items-center hover:bg-neutral-100 rounded-l-full"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-semibold w-6 text-center">{it.qty}</span>
                      <button
                        onClick={() => setQty(it.id, it.qty + 1)}
                        className="h-7 w-7 grid place-items-center hover:bg-neutral-100 rounded-r-full"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <button
                      onClick={() => remove(it.id)}
                      className="text-neutral-400 hover:text-red-500 ml-auto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <footer className="border-t p-5 space-y-3 bg-neutral-50">
            <div className="flex items-center justify-between text-sm text-neutral-600">
              <span>Subtotal</span>
              <span className="font-semibold">{formatPrice(subtotal, currency)}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-neutral-500">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="flex items-center justify-between text-base font-bold text-neutral-900 pt-2 border-t">
              <span>Total</span>
              <span style={{ color: accent }}>{formatPrice(subtotal, currency)}</span>
            </div>
            <button
              onClick={() => {
                setOpen(false);
                const el = document.getElementById("checkout");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="w-full h-12 rounded-xl text-white font-semibold inline-flex items-center justify-center gap-2 shadow-lg hover:opacity-90 transition"
              style={{ background: accent }}
            >
              <CreditCard className="w-4 h-4" /> Checkout
            </button>
            <button
              onClick={clear}
              className="w-full text-xs text-neutral-500 hover:text-neutral-700"
            >
              Clear cart
            </button>
          </footer>
        )}
      </aside>
    </div>
  );
}

/* ============= Checkout Block ============= */
export function CheckoutWidget({ block, css }: Common) {
  const accent = block.content.accentColor || "#0f172a";
  const currency = block.content.currency || "$";
  const shipping = parsePrice(block.content.shippingFee);
  const taxRate = Number(block.content.taxRate) || 0;
  const title = block.content.title || "Checkout";
  const storeOwnerId: string | undefined = block.content.storeOwnerId;

  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);
  const { subtotal, count } = cartTotals(items);

  const [success, setSuccess] = useState<null | string>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zip: "",
    country: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
    notes: "",
    method: "card",
  });

  useEffect(() => {
    if (success) {
      const t = setTimeout(() => setSuccess(null), 8000);
      return () => clearTimeout(t);
    }
  }, [success]);

  const tax = subtotal * (taxRate / 100);
  const total = subtotal + (subtotal > 0 ? shipping : 0) + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0 || submitting) return;
    setSubmitting(true);

    // Resolve store owner: from block content, else first active store
    let ownerId = storeOwnerId;
    if (!ownerId) {
      const { data: store } = await supabase
        .from("stores" as any)
        .select("user_id")
        .eq("is_active", true)
        .limit(1)
        .maybeSingle();
      ownerId = (store as any)?.user_id;
    }

    if (!ownerId) {
      setSubmitting(false);
      alert("This store is not yet configured. Please contact the owner.");
      return;
    }

    const { data: order, error } = await supabase
      .from("orders" as any)
      .insert({
        store_owner_id: ownerId,
        customer_name: form.name,
        customer_email: form.email,
        customer_phone: form.phone || null,
        shipping_address: form.address || null,
        shipping_city: form.city || null,
        shipping_zip: form.zip || null,
        shipping_country: form.country || null,
        notes: form.notes || null,
        subtotal,
        shipping_fee: shipping,
        tax,
        total,
        currency: currency === "$" ? "USD" : currency,
        payment_method: form.method,
        transaction_id: form.method === "card" && form.cardNumber ? `card-****${form.cardNumber.slice(-4)}` : null,
        status: form.method === "card" ? "paid" : "pending",
      })
      .select()
      .single();

    if (error || !order) {
      setSubmitting(false);
      alert(`Order failed: ${error?.message || "unknown error"}`);
      return;
    }

    const orderId = (order as any).id;
    await supabase.from("order_items" as any).insert(
      items.map((it) => ({
        order_id: orderId,
        title: it.title,
        image_url: it.image || null,
        price: it.price,
        qty: it.qty,
      }))
    );

    setSubmitting(false);
    setSuccess((order as any).order_number);
    clear();
  };


  const Field = ({
    label, name, type = "text", required = true, full = false,
  }: { label: string; name: keyof typeof form; type?: string; required?: boolean; full?: boolean }) => (
    <label className={`block ${full ? "sm:col-span-2" : ""}`}>
      <span className="block text-xs font-semibold text-neutral-700 mb-1.5 uppercase tracking-wider">{label}</span>
      <input
        type={type}
        required={required}
        value={form[name]}
        onChange={(e) => setForm({ ...form, [name]: e.target.value })}
        className="w-full h-11 px-3 rounded-lg border border-neutral-200 bg-white text-sm focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition"
      />
    </label>
  );

  return (
    <section id="checkout" style={css} className="px-4 sm:px-6 py-16 bg-neutral-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 text-center mb-2">{title}</h2>
        <p className="text-center text-neutral-500 text-sm mb-10">Secure checkout — your data is encrypted.</p>

        {success && (
          <div className="max-w-2xl mx-auto mb-8 p-5 rounded-2xl bg-green-50 border border-green-200 flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-green-900">Order placed successfully!</p>
              <p className="text-xs text-green-700">A confirmation email is on its way.</p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-[1fr_400px] gap-8">
          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-neutral-100 space-y-8">
            <div>
              <h3 className="text-base font-bold text-neutral-900 mb-4">Contact</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Full name" name="name" />
                <Field label="Email" name="email" type="email" />
              </div>
            </div>

            <div>
              <h3 className="text-base font-bold text-neutral-900 mb-4">Shipping address</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Address" name="address" full />
                <Field label="City" name="city" />
                <Field label="ZIP / Postal" name="zip" />
                <Field label="Country" name="country" full />
              </div>
            </div>

            <div>
              <h3 className="text-base font-bold text-neutral-900 mb-4">Payment</h3>
              <div className="flex gap-2 mb-4 flex-wrap">
                {[
                  { id: "card", label: "Card", icon: CreditCard },
                  { id: "cod", label: "Cash on delivery", icon: Truck },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setForm({ ...form, method: m.id })}
                    className={`px-4 h-11 rounded-lg border text-sm font-medium inline-flex items-center gap-2 transition ${
                      form.method === m.id
                        ? "border-neutral-900 bg-neutral-900 text-white"
                        : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400"
                    }`}
                  >
                    <m.icon className="w-4 h-4" /> {m.label}
                  </button>
                ))}
              </div>
              {form.method === "card" && (
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Card number" name="cardNumber" full />
                  <Field label="Expiry (MM/YY)" name="expiry" />
                  <Field label="CVC" name="cvc" />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={items.length === 0}
              className="w-full h-12 rounded-xl text-white font-semibold inline-flex items-center justify-center gap-2 shadow-lg hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: accent }}
            >
              <ShieldCheck className="w-4 h-4" />
              Place order — {formatPrice(total, currency)}
            </button>
          </form>

          {/* Summary */}
          <aside className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 h-fit lg:sticky lg:top-6">
            <h3 className="text-base font-bold text-neutral-900 mb-4">Order summary</h3>
            {items.length === 0 ? (
              <p className="text-sm text-neutral-500 py-6 text-center">Your cart is empty.</p>
            ) : (
              <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                {items.map((it) => (
                  <div key={it.id} className="flex gap-3">
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0">
                      {it.image && <img src={it.image} alt="" className="w-full h-full object-cover" />}
                      <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold grid place-items-center text-white" style={{ background: accent }}>
                        {it.qty}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900 line-clamp-1">{it.title}</p>
                      <p className="text-xs text-neutral-500 mt-0.5">{formatPrice(it.price, currency)} × {it.qty}</p>
                    </div>
                    <p className="text-sm font-semibold text-neutral-900">
                      {formatPrice(it.price * it.qty, currency)}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t mt-5 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal ({count})</span>
                <span>{formatPrice(subtotal, currency)}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Shipping</span>
                <span>{subtotal > 0 ? formatPrice(shipping, currency) : "—"}</span>
              </div>
              {taxRate > 0 && (
                <div className="flex justify-between text-neutral-600">
                  <span>Tax ({taxRate}%)</span>
                  <span>{formatPrice(tax, currency)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base pt-2 border-t mt-2">
                <span>Total</span>
                <span style={{ color: accent }}>{formatPrice(total, currency)}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
