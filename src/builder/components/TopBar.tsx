import { useState } from "react";
import { motion } from "framer-motion";
import { Monitor, Tablet, Smartphone, Undo2, Redo2, Save, Rocket, ArrowLeft, ExternalLink, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useBuilderStore } from "../store";
import { AiGenerateDialog } from "./AiGenerateDialog";
import { cn } from "@/lib/utils";
import type { DeviceMode } from "../types";

interface Props {
  onSave: () => void;
  onPublish: () => void;
  saving: boolean;
  publishing: boolean;
}

export function TopBar({ onSave, onPublish, saving, publishing }: Props) {
  const navigate = useNavigate();
  const { pageName, setName, device, setDevice, undo, redo, dirty, isPublished, pageSlug } =
    useBuilderStore();

  const devices: { key: DeviceMode; icon: any }[] = [
    { key: "desktop", icon: Monitor },
    { key: "tablet", icon: Tablet },
    { key: "mobile", icon: Smartphone },
  ];

  return (
    <div className="h-14 bg-slate-950/95 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-3 text-white">
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-white/70 hover:text-white hover:bg-white/10"
          onClick={() => navigate("/dashboard/builder")}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <input
          value={pageName}
          onChange={(e) => setName(e.target.value)}
          className="bg-transparent text-sm font-medium outline-none focus:bg-white/10 px-2 py-1 rounded min-w-0 max-w-xs"
        />
        {dirty && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" title="Unsaved" />}
      </div>

      <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
        {devices.map(({ key, icon: Icon }) => (
          <motion.button
            key={key}
            whileTap={{ scale: 0.92 }}
            onClick={() => setDevice(key)}
            className={cn(
              "h-7 w-9 rounded-md inline-flex items-center justify-center",
              device === key ? "bg-red-600 text-white" : "text-white/60 hover:text-white"
            )}
          >
            <Icon className="w-4 h-4" />
          </motion.button>
        ))}
      </div>

      <div className="flex items-center gap-1.5 flex-1 justify-end">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-white/70 hover:text-white hover:bg-white/10"
          onClick={undo}
          title="Undo"
        >
          <Undo2 className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-white/70 hover:text-white hover:bg-white/10"
          onClick={redo}
          title="Redo"
        >
          <Redo2 className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 gap-1.5 text-white/80 hover:text-white hover:bg-white/10"
          onClick={onSave}
          disabled={saving}
        >
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          Save
        </Button>
        {isPublished && pageSlug && (
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-white/70 hover:text-white hover:bg-white/10"
            onClick={() => window.open(`/p/${pageSlug}`, "_blank")}
            title="View live"
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        )}
        <Button
          size="sm"
          className="h-9 gap-1.5 bg-red-600 hover:bg-red-700"
          onClick={onPublish}
          disabled={publishing}
        >
          {publishing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Rocket className="w-3.5 h-3.5" />}
          Publish
        </Button>
      </div>
    </div>
  );
}
