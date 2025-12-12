import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Hammer, Wrench, Users, Coins, Star } from "lucide-react";
import { useRef, useEffect } from "react";

interface BottomControlPanelProps {
  buildPCContent?: React.ReactNode;
  upgradeContent?: React.ReactNode;
  workersContent?: React.ReactNode;
  tokensContent?: React.ReactNode;
  celebritiesContent?: React.ReactNode;
  onTabChange?: (tab: string) => void;
  activeTab?: string;
}

export default function BottomControlPanel({
  buildPCContent,
  upgradeContent,
  workersContent,
  tokensContent,
  celebritiesContent,
  onTabChange,
  activeTab
}: BottomControlPanelProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to top when active tab changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [activeTab]);

  return (
    <div className="relative h-64 md:h-48 bg-gradient-to-br from-orange-400 via-amber-400 to-yellow-400 border-t-4 border-orange-600/40 shadow-2xl" data-testid="bottom-control-panel">
      {/* Decorative bottom stripe */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-300 via-yellow-300 to-orange-300"></div>
      
      <Tabs value={activeTab} onValueChange={onTabChange} defaultValue="build" className="h-full flex flex-col">
        <TabsList className="w-full justify-start bg-white/20 backdrop-blur-sm border-b-2 border-white/30 px-2 md:px-4 gap-1 md:gap-2 h-12 md:h-14">
          <TabsTrigger 
            value="build" 
            className="gap-1.5 md:gap-2 px-3 md:px-5 h-9 md:h-10 rounded-lg font-bold text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-lg data-[state=inactive]:text-white/90 data-[state=inactive]:hover:bg-white/10 transition-all" 
            data-testid="tab-build" 
            data-tutorial-id="build-tab"
          >
            <Hammer className="h-4 w-4 md:h-5 md:w-5" strokeWidth={2.5} />
            <span className="hidden md:inline uppercase tracking-wide">Build</span>
          </TabsTrigger>
          <TabsTrigger 
            value="upgrade" 
            className="gap-1.5 md:gap-2 px-3 md:px-5 h-9 md:h-10 rounded-lg font-bold text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-lg data-[state=inactive]:text-white/90 data-[state=inactive]:hover:bg-white/10 transition-all" 
            data-testid="tab-upgrade"
          >
            <Wrench className="h-4 w-4 md:h-5 md:w-5" strokeWidth={2.5} />
            <span className="hidden md:inline uppercase tracking-wide">Upgrade</span>
          </TabsTrigger>
          <TabsTrigger 
            value="workers" 
            className="gap-1.5 md:gap-2 px-3 md:px-5 h-9 md:h-10 rounded-lg font-bold text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-lg data-[state=inactive]:text-white/90 data-[state=inactive]:hover:bg-white/10 transition-all" 
            data-testid="tab-workers" 
            data-tutorial-id="workers-tab"
          >
            <Users className="h-4 w-4 md:h-5 md:w-5" strokeWidth={2.5} />
            <span className="hidden md:inline uppercase tracking-wide">Workers</span>
          </TabsTrigger>
          <TabsTrigger 
            value="tokens" 
            className="gap-1.5 md:gap-2 px-3 md:px-5 h-9 md:h-10 rounded-lg font-bold text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-lg data-[state=inactive]:text-white/90 data-[state=inactive]:hover:bg-white/10 transition-all" 
            data-testid="tab-tokens"
          >
            <Coins className="h-4 w-4 md:h-5 md:w-5" strokeWidth={2.5} />
            <span className="hidden md:inline uppercase tracking-wide">Tokens</span>
          </TabsTrigger>
          <TabsTrigger 
            value="celebrities" 
            className="gap-1.5 md:gap-2 px-3 md:px-5 h-9 md:h-10 rounded-lg font-bold text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-lg data-[state=inactive]:text-white/90 data-[state=inactive]:hover:bg-white/10 transition-all" 
            data-testid="tab-celebrities"
          >
            <Star className="h-4 w-4 md:h-5 md:w-5" strokeWidth={2.5} />
            <span className="hidden md:inline uppercase tracking-wide">Celebrities</span>
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto bg-gradient-to-b from-orange-50/90 to-amber-50/80" ref={scrollContainerRef}>
          <TabsContent value="build" className="p-2 md:p-3 m-0" data-tutorial-id="build-content">
            {buildPCContent || <div className="text-muted-foreground">Build content goes here</div>}
          </TabsContent>
          <TabsContent value="upgrade" className="px-2 md:px-6 pb-2 md:pb-6 m-0">
            {upgradeContent || <div className="text-muted-foreground">Upgrade content goes here</div>}
          </TabsContent>
          <TabsContent value="workers" className="px-2 md:px-6 pb-2 md:pb-6 m-0" data-tutorial-id="workers-content">
            {workersContent || <div className="text-muted-foreground">Workers content goes here</div>}
          </TabsContent>
          <TabsContent value="tokens" className="px-2 md:px-6 pb-2 md:pb-6 m-0">
            {tokensContent || <div className="text-muted-foreground">Tokens content goes here</div>}
          </TabsContent>
          <TabsContent value="celebrities" className="px-2 md:px-6 pb-2 md:pb-6 m-0">
            {celebritiesContent || <div className="text-muted-foreground">Celebrities content goes here</div>}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
