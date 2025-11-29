import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Hammer, Wrench, Users, Coins, Star } from "lucide-react";

interface BottomControlPanelProps {
  buildPCContent?: React.ReactNode;
  buildDecorationsContent?: React.ReactNode;
  buildUtilityContent?: React.ReactNode;
  upgradeContent?: React.ReactNode;
  workersContent?: React.ReactNode;
  tokensContent?: React.ReactNode;
  celebritiesContent?: React.ReactNode;
}

export default function BottomControlPanel({
  buildPCContent,
  buildDecorationsContent,
  buildUtilityContent,
  upgradeContent,
  workersContent,
  tokensContent,
  celebritiesContent
}: BottomControlPanelProps) {
  return (
    <div className="h-48 bg-gradient-to-b from-card/80 to-card/60 backdrop-blur-md border-t-2 border-primary/30 shadow-2xl" data-testid="bottom-control-panel">
      <Tabs defaultValue="build" className="h-full flex flex-col">
        <TabsList className="w-full justify-start rounded-none bg-gradient-to-r from-primary/10 to-secondary/10 border-b-2 border-primary/20 px-6 gap-2">
          <TabsTrigger value="build" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground" data-testid="tab-build">
            <Hammer className="h-4 w-4" />
            <span className="font-mono">Build</span>
          </TabsTrigger>
          <TabsTrigger value="upgrade" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground" data-testid="tab-upgrade">
            <Wrench className="h-4 w-4" />
            <span className="font-mono">Upgrade</span>
          </TabsTrigger>
          <TabsTrigger value="workers" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground" data-testid="tab-workers">
            <Users className="h-4 w-4" />
            <span className="font-mono">Workers</span>
          </TabsTrigger>
          <TabsTrigger value="tokens" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground" data-testid="tab-tokens">
            <Coins className="h-4 w-4" />
            <span className="font-mono">Tokens</span>
          </TabsTrigger>
          <TabsTrigger value="celebrities" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground" data-testid="tab-celebrities">
            <Star className="h-4 w-4" />
            <span className="font-mono">Celebrities</span>
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto">
          <TabsContent value="build" className="p-0 m-0 h-full flex flex-col">
            <Tabs defaultValue="pc" className="flex flex-col w-full">
              <TabsList className="w-full justify-start rounded-none bg-card/40 border-b border-primary/10 px-6 gap-2 py-1">
                <TabsTrigger value="pc" className="text-sm data-[state=active]:bg-primary/20" data-testid="tab-build-pc">PC</TabsTrigger>
                <TabsTrigger value="decorations" className="text-sm data-[state=active]:bg-primary/20" data-testid="tab-build-decorations">Decorations</TabsTrigger>
                <TabsTrigger value="utility" className="text-sm data-[state=active]:bg-primary/20" data-testid="tab-build-utility">Utility</TabsTrigger>
              </TabsList>
              <TabsContent value="pc" className="p-3 m-0">
                {buildPCContent || <div className="text-muted-foreground">PC content goes here</div>}
              </TabsContent>
              <TabsContent value="decorations" className="p-3 m-0">
                {buildDecorationsContent || <div className="text-muted-foreground">Decorations content goes here</div>}
              </TabsContent>
              <TabsContent value="utility" className="p-3 m-0">
                {buildUtilityContent || <div className="text-muted-foreground">Utility content goes here</div>}
              </TabsContent>
            </Tabs>
          </TabsContent>
          <TabsContent value="upgrade" className="p-6 m-0">
            {upgradeContent || <div className="text-muted-foreground">Upgrade content goes here</div>}
          </TabsContent>
          <TabsContent value="workers" className="p-6 m-0">
            {workersContent || <div className="text-muted-foreground">Workers content goes here</div>}
          </TabsContent>
          <TabsContent value="tokens" className="p-6 m-0">
            {tokensContent || <div className="text-muted-foreground">Tokens content goes here</div>}
          </TabsContent>
          <TabsContent value="celebrities" className="p-6 m-0">
            {celebritiesContent || <div className="text-muted-foreground">Celebrities content goes here</div>}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
