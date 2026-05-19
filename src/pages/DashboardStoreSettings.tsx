import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Store, Wallet, Save } from "lucide-react";

interface PaymentMethod {
  type: string; // bkash | nagad | rocket | bank | cod | other
  label?: string;
  number?: string;
  account_type?: string; // personal / merchant / agent
  instructions?: string;
}

interface StoreRow {
  id?: string;
  user_id?: string;
  name: string;
  currency: string;
  currency_symbol: string;
  shipping_fee: number;
  tax_rate: number;
  payment_methods: PaymentMethod[];
  payment_instructions: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  is_active: boolean;
}

const blankStore = (): StoreRow => ({
  name: "My Store",
  currency: "BDT",
  currency_symbol: "৳",
  shipping_fee: 60,
  tax_rate: 0,
  payment_methods: [
    { type: "bkash", label: "bKash", number: "", account_type: "personal", instructions: "Send money and share Transaction ID." },
    { type: "nagad", label: "Nagad", number: "", account_type: "personal", instructions: "Send money and share Transaction ID." },
    { type: "cod", label: "Cash on Delivery", instructions: "Pay when you receive your order." },
  ],
  payment_instructions: "",
  contact_email: "",
  contact_phone: "",
  is_active: true,
});

const methodTypes = [
  { value: "bkash", label: "bKash" },
  { value: "nagad", label: "Nagad" },
  { value: "rocket", label: "Rocket" },
  { value: "upay", label: "Upay" },
  { value: "bank", label: "Bank Transfer" },
  { value: "cod", label: "Cash on Delivery" },
  { value: "other", label: "Other" },
];

export default function DashboardStoreSettings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [store, setStore] = useState<StoreRow>(blankStore());

  useEffect(() => {
    if (user) load();
  }, [user]);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("stores")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();
    if (error) {
      toast.error("Failed to load store");
    }
    if (data) {
      setStore({
        ...blankStore(),
        ...data,
        payment_methods: Array.isArray(data.payment_methods)
          ? (data.payment_methods as any)
          : blankStore().payment_methods,
      });
    }
    setLoading(false);
  };

  const save = async () => {
    if (!user) return;
    setSaving(true);
    const payload = {
      user_id: user.id,
      name: store.name,
      currency: store.currency,
      currency_symbol: store.currency_symbol,
      shipping_fee: Number(store.shipping_fee) || 0,
      tax_rate: Number(store.tax_rate) || 0,
      payment_methods: store.payment_methods as any,
      payment_instructions: store.payment_instructions,
      contact_email: store.contact_email,
      contact_phone: store.contact_phone,
      is_active: store.is_active,
    };

    let error;
    if (store.id) {
      ({ error } = await supabase.from("stores").update(payload).eq("id", store.id));
    } else {
      const res = await supabase.from("stores").insert(payload).select().single();
      error = res.error;
      if (res.data) setStore({ ...store, id: res.data.id });
    }
    setSaving(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Store settings saved");
    }
  };

  const updateMethod = (i: number, patch: Partial<PaymentMethod>) => {
    const next = [...store.payment_methods];
    next[i] = { ...next[i], ...patch };
    setStore({ ...store, payment_methods: next });
  };

  const removeMethod = (i: number) => {
    const next = store.payment_methods.filter((_, idx) => idx !== i);
    setStore({ ...store, payment_methods: next });
  };

  const addMethod = () => {
    setStore({
      ...store,
      payment_methods: [
        ...store.payment_methods,
        { type: "bkash", label: "bKash", number: "", account_type: "personal", instructions: "" },
      ],
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-white/60" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
            <Store className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Store Settings</h1>
            <p className="text-sm text-white/60">Configure your store, currency & payment methods</p>
          </div>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-medium flex items-center gap-2 disabled:opacity-60"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save
        </button>
      </div>

      {/* General */}
      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 space-y-4">
        <h2 className="text-lg font-semibold text-white">General</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Store name">
            <input
              className="input"
              value={store.name}
              onChange={(e) => setStore({ ...store, name: e.target.value })}
            />
          </Field>
          <Field label="Active">
            <select
              className="input"
              value={store.is_active ? "yes" : "no"}
              onChange={(e) => setStore({ ...store, is_active: e.target.value === "yes" })}
            >
              <option value="yes">Active (visible to customers)</option>
              <option value="no">Disabled</option>
            </select>
          </Field>
          <Field label="Currency code">
            <input
              className="input"
              value={store.currency}
              onChange={(e) => setStore({ ...store, currency: e.target.value.toUpperCase() })}
              placeholder="BDT"
            />
          </Field>
          <Field label="Currency symbol">
            <input
              className="input"
              value={store.currency_symbol}
              onChange={(e) => setStore({ ...store, currency_symbol: e.target.value })}
              placeholder="৳"
            />
          </Field>
          <Field label="Shipping fee">
            <input
              type="number"
              className="input"
              value={store.shipping_fee}
              onChange={(e) => setStore({ ...store, shipping_fee: parseFloat(e.target.value) || 0 })}
            />
          </Field>
          <Field label="Tax rate (%)">
            <input
              type="number"
              className="input"
              value={store.tax_rate}
              onChange={(e) => setStore({ ...store, tax_rate: parseFloat(e.target.value) || 0 })}
            />
          </Field>
          <Field label="Contact email">
            <input
              className="input"
              value={store.contact_email || ""}
              onChange={(e) => setStore({ ...store, contact_email: e.target.value })}
            />
          </Field>
          <Field label="Contact phone">
            <input
              className="input"
              value={store.contact_phone || ""}
              onChange={(e) => setStore({ ...store, contact_phone: e.target.value })}
            />
          </Field>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-semibold text-white">Payment Methods</h2>
          </div>
          <button
            onClick={addMethod}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-sm flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>

        <div className="space-y-3">
          {store.payment_methods.map((m, i) => (
            <div key={i} className="rounded-xl border border-white/10 bg-black/30 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <select
                    className="input !w-auto"
                    value={m.type}
                    onChange={(e) => {
                      const t = e.target.value;
                      const def = methodTypes.find((x) => x.value === t);
                      updateMethod(i, { type: t, label: def?.label || m.label });
                    }}
                  >
                    {methodTypes.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                  <input
                    className="input"
                    placeholder="Display label"
                    value={m.label || ""}
                    onChange={(e) => updateMethod(i, { label: e.target.value })}
                  />
                </div>
                <button
                  onClick={() => removeMethod(i)}
                  className="p-2 rounded-lg hover:bg-white/10 text-rose-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {m.type !== "cod" && (
                <div className="grid md:grid-cols-2 gap-3">
                  <Field label={m.type === "bank" ? "Account number" : "Number"}>
                    <input
                      className="input"
                      placeholder="01XXXXXXXXX"
                      value={m.number || ""}
                      onChange={(e) => updateMethod(i, { number: e.target.value })}
                    />
                  </Field>
                  {["bkash", "nagad", "rocket", "upay"].includes(m.type) && (
                    <Field label="Account type">
                      <select
                        className="input"
                        value={m.account_type || "personal"}
                        onChange={(e) => updateMethod(i, { account_type: e.target.value })}
                      >
                        <option value="personal">Personal</option>
                        <option value="agent">Agent</option>
                        <option value="merchant">Merchant</option>
                      </select>
                    </Field>
                  )}
                </div>
              )}

              <Field label="Instructions to customer">
                <textarea
                  className="input min-h-[60px]"
                  placeholder="e.g. Send money to the above number and share the Transaction ID."
                  value={m.instructions || ""}
                  onChange={(e) => updateMethod(i, { instructions: e.target.value })}
                />
              </Field>
            </div>
          ))}

          {store.payment_methods.length === 0 && (
            <p className="text-sm text-white/50">No payment methods. Click "Add" to create one.</p>
          )}
        </div>
      </section>

      {/* Global instructions */}
      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 space-y-3">
        <h2 className="text-lg font-semibold text-white">Global Payment Instructions</h2>
        <p className="text-xs text-white/50">
          Shown on the checkout page above payment options.
        </p>
        <textarea
          className="input min-h-[100px]"
          placeholder="e.g. After placing the order, please send payment via bKash/Nagad and share the Transaction ID via WhatsApp."
          value={store.payment_instructions || ""}
          onChange={(e) => setStore({ ...store, payment_instructions: e.target.value })}
        />
      </section>

      <div className="flex justify-end">
        <button
          onClick={save}
          disabled={saving}
          className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-medium flex items-center gap-2 disabled:opacity-60"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Settings
        </button>
      </div>

      <style>{`
        .input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          color: white;
          border-radius: 0.5rem;
          padding: 0.55rem 0.75rem;
          font-size: 0.875rem;
          outline: none;
          transition: border-color .15s;
        }
        .input:focus { border-color: rgba(16,185,129,0.6); }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium uppercase tracking-wider text-white/60">{label}</span>
      {children}
    </label>
  );
}
