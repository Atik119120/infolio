import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  title: string;
  price: number;
  image?: string;
  qty: number;
}

interface CartState {
  items: CartItem[];
  open: boolean;
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  setOpen: (v: boolean) => void;
  toggle: () => void;
}

// Parse "$129.00" / "129" / "৳1,200" -> number
export const parsePrice = (s: string | number | undefined): number => {
  if (typeof s === "number") return s;
  if (!s) return 0;
  const n = parseFloat(String(s).replace(/[^\d.]/g, ""));
  return isNaN(n) ? 0 : n;
};

export const formatPrice = (n: number, currency = "$") =>
  `${currency}${n.toFixed(2)}`;

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      open: false,
      add: (item, qty = 1) => {
        const items = [...get().items];
        const idx = items.findIndex((i) => i.id === item.id);
        if (idx >= 0) items[idx] = { ...items[idx], qty: items[idx].qty + qty };
        else items.push({ ...item, qty });
        set({ items, open: true });
      },
      remove: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      setQty: (id, qty) =>
        set({
          items: get()
            .items.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i)),
        }),
      clear: () => set({ items: [] }),
      setOpen: (v) => set({ open: v }),
      toggle: () => set({ open: !get().open }),
    }),
    { name: "commerce-cart" }
  )
);

export const cartTotals = (items: CartItem[]) => {
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);
  return { subtotal, count };
};
