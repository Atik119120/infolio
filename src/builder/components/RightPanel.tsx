import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PageThemePanel } from "./PageThemePanel";
import { StructurePanel } from "./StructurePanel";

export function RightPanel() {
  const [tab, setTab] = useState("structure");
  return (
    <div className="h-full bg-slate-950/95 backdrop-blur-xl border-l border-white/10 text-white flex flex-col">
      <Tabs value={tab} onValueChange={setTab} className="flex-1 flex flex-col min-h-0">
        <TabsList className="grid grid-cols-2 mx-3 mt-3 bg-white/5 h-8 shrink-0">
          <TabsTrigger value="structure" className="text-[11px] h-6">Structure</TabsTrigger>
          <TabsTrigger value="page" className="text-[11px] h-6">Page</TabsTrigger>
        </TabsList>
        <TabsContent value="structure" className="flex-1 min-h-0 mt-2">
          <StructurePanel />
        </TabsContent>
        <TabsContent value="page" className="flex-1 min-h-0 mt-2 overflow-y-auto">
          <PageThemePanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
