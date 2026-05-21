import { useState } from "react";
import { useWorkspace } from "@/hooks/useWorkspace";
import { ENGINE_META, WEBSITE_TYPES, type Engine, type WebsiteType } from "@/lib/features";
import { Loader2, Lock, CheckCircle2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function DashboardEngine() {
  const w = useWorkspace();
  const [pending, setPending] = useState<Engine | null>(null);
  const [switching, setSwitching] = useState(false);

  const engines: Engine[] = ["theme", "builder", "react"];

  const canUse = (e: Engine) => {
    if (e === "theme") return w.features.themeEngine;
    if (e === "builder") return w.features.builderEngine;
    if (e === "react") return w.features.reactEngine;
    return false;
  };

  const confirmSwitch = async () => {
    if (!pending) return;
    setSwitching(true);
    await w.setEngine(pending);
    setSwitching(false);
    toast.success(`Active engine switched to ${ENGINE_META[pending].label}`);
    setPending(null);
  };

  if (w.loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-white/60" /></div>;
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold text-white">Website Engine</h1>
        <p className="text-sm text-white/60 mt-1">
          Only one engine can be active at a time. Switching creates a backup of the previous engine.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {engines.map((eng) => {
          const meta = ENGINE_META[eng];
          const active = w.engine === eng;
          const locked = !canUse(eng);
          return (
            <div
              key={eng}
              className={`relative rounded-2xl border p-6 transition-all ${
                active
                  ? "border-emerald-400/50 bg-emerald-500/10 shadow-[0_0_30px_-10px_rgba(16,185,129,0.6)]"
                  : "border-white/10 bg-white/[0.03] hover:border-white/20"
              }`}
            >
              {active && (
                <span className="absolute top-4 right-4 px-2 py-0.5 rounded-full bg-emerald-500 text-[10px] font-bold text-black flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> ACTIVE
                </span>
              )}
              {locked && !active && (
                <span className="absolute top-4 right-4 px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-bold text-white/60 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> UPGRADE
                </span>
              )}
              <div className="text-4xl mb-3">{meta.icon}</div>
              <h3 className="text-lg font-bold text-white">{meta.label}</h3>
              <p className="text-xs text-white/60 mt-1 min-h-[36px]">{meta.description}</p>
              <button
                disabled={active || locked}
                onClick={() => setPending(eng)}
                className={`w-full mt-5 h-10 rounded-lg text-sm font-medium transition ${
                  active
                    ? "bg-white/10 text-white/50 cursor-default"
                    : locked
                    ? "bg-white/5 text-white/40 cursor-not-allowed"
                    : "bg-white text-black hover:bg-white/90"
                }`}
              >
                {active ? "Currently Active" : locked ? "Locked" : "Activate"}
              </button>
            </div>
          );
        })}
      </div>

      {/* Website Type */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="text-lg font-semibold text-white">Website Type</h2>
        <p className="text-xs text-white/50 mt-1 mb-4">
          Your dashboard widgets and menus adapt based on this type.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {WEBSITE_TYPES.map((t) => {
            const active = w.websiteType === t.value;
            return (
              <button
                key={t.value}
                onClick={async () => {
                  await w.setWebsiteType(t.value as WebsiteType);
                  toast.success(`Switched to ${t.label}`);
                }}
                className={`rounded-xl border p-3 text-left transition ${
                  active
                    ? "border-emerald-400/60 bg-emerald-500/10"
                    : "border-white/10 bg-white/[0.02] hover:border-white/20"
                }`}
              >
                <div className="text-2xl">{t.emoji}</div>
                <p className="text-xs font-medium text-white mt-1">{t.label}</p>
              </button>
            );
          })}
        </div>
      </div>

      <AlertDialog open={!!pending} onOpenChange={(o) => !o && setPending(null)}>
        <AlertDialogContent className="bg-neutral-900 border-white/10 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              Switch Active Engine?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-white/60">
              You're about to switch from <b>{ENGINE_META[w.engine].label}</b> to{" "}
              <b>{pending && ENGINE_META[pending].label}</b>. A backup of your current engine
              configuration will be saved. SEO, domain and analytics settings are preserved.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmSwitch}
              disabled={switching}
              className="bg-emerald-500 text-black hover:bg-emerald-400"
            >
              {switching ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm Switch"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
