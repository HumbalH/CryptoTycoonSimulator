import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Hammer, Wrench, Users, Coins, Star } from "lucide-react";

interface BottomControlPanelProps {
  buildPCContent?: React.ReactNode;
  upgradeContent?: React.ReactNode;
  workersContent?: React.ReactNode;
  tokensContent?: React.ReactNode;
  celebritiesContent?: React.ReactNode;
}

export default function BottomControlPanel({
  buildPCContent,
  upgradeContent,
  workersContent,
  tokensContent,
  celebritiesContent
}: BottomControlPanelProps) {
  return (
    <div className="h-64 md:h-48 bg-gradient-to-b from-card/80 to-card/60 backdrop-blur-md border-t-2 border-primary/30 shadow-2xl" data-testid="bottom-control-panel">
      <Tabs defaultValue="build" className="h-full flex flex-col">
        <TabsList className="w-full justify-start rounded-none bg-gradient-to-r from-primary/10 to-secondary/10 border-b-2 border-primary/20 px-2 md:px-6 gap-1 md:gap-2">
          <TabsTrigger value="build" className="gap-1 md:gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground" data-testid="tab-build">
            <Hammer className="h-4 w-4" />
            <span className="font-mono hidden md:inline">Build</span>
          </TabsTrigger>
          <TabsTrigger value="upgrade" className="gap-1 md:gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground" data-testid="tab-upgrade">
            <Wrench className="h-4 w-4" />
            <span className="font-mono hidden md:inline">Upgrade</span>
          </TabsTrigger>
          <TabsTrigger value="workers" className="gap-1 md:gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground" data-testid="tab-workers">
            <Users className="h-4 w-4" />
            <span className="font-mono hidden md:inline">Workers</span>
          </TabsTrigger>
          <TabsTrigger value="tokens" className="gap-1 md:gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground" data-testid="tab-tokens">
            <Coins className="h-4 w-4" />
            <span className="font-mono hidden md:inline">Tokens</span>
          </TabsTrigger>
          <TabsTrigger value="celebrities" className="gap-1 md:gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground" data-testid="tab-celebrities">
            <Star className="h-4 w-4" />
            <span className="font-mono hidden md:inline">Celebrities</span>
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto">
          <TabsContent value="build" className="p-2 md:p-3 m-0">
            {buildPCContent || <div className="text-muted-foreground">Build content goes here</div>}
          </TabsContent>
          <TabsContent value="upgrade" className="px-2 md:px-6 pb-2 md:pb-6 m-0">
            {upgradeContent || <div className="text-muted-foreground">Upgrade content goes here</div>}
          </TabsContent>
          <TabsContent value="workers" className="px-2 md:px-6 pb-2 md:pb-6 m-0">
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
