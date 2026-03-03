"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { Look } from "@/types/looks";

interface LookTabsProps {
  looks: Look[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: (look: Look) => React.ReactNode;
}

export default function LookTabs({
  looks,
  activeTab,
  onTabChange,
  children,
}: LookTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} data-testid="look-tabs">
      <TabsList
        className="bg-oat/60 border border-stone-200 mx-auto"
        data-testid="look-tabs-list"
      >
        {looks.map((look) => (
          <TabsTrigger
            key={look.id}
            value={look.id}
            className="data-[state=active]:bg-cream data-[state=active]:text-fern-dark data-[state=active]:shadow-sm text-charcoal-light px-5"
            data-testid={`look-tab-${look.id}`}
          >
            {look.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {looks.map((look) => (
        <TabsContent key={look.id} value={look.id} data-testid={`look-content-${look.id}`}>
          {children(look)}
        </TabsContent>
      ))}
    </Tabs>
  );
}
