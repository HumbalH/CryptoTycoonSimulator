import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, Zap } from "lucide-react";

export interface PCType {
  id: string;
  name: string;
  description: string;
  cost: number;
  miningRate: number;
  level: number;
  unlocked: boolean;
  icon: "budget" | "laptop" | "workstation" | "gaming" | "mining-rig" | "server" | "quantum";
}

interface PCCardProps {
  pc: PCType;
  canAfford: boolean;
  onPurchase: (pcId: string) => void;
}

const iconMap = {
  budget: "💼",
  laptop: "🔋",
  workstation: "⚙️",
  gaming: "🎮",
  "mining-rig": "⚡",
  server: "🖥️",
  quantum: "🔮"
};

export default function PCCard({ pc, canAfford, onPurchase }: PCCardProps) {
  const formatCost = (cost: number) => {
    if (cost >= 1000000) return `$${(cost / 1000000).toFixed(1)}M`;
    if (cost >= 1000) return `$${(cost / 1000).toFixed(1)}K`;
    return `$${cost}`;
  };

  if (!pc.unlocked) {
    return (
      <Card className="opacity-60" data-testid={`pc-card-${pc.id}`}>
        <div className="flex flex-col gap-2 p-2">
          {/* Row 1: Icon, Name, Earning */}
          <div className="flex items-center gap-2">
            <span className="text-2xl opacity-50 flex-shrink-0">{iconMap[pc.icon]}</span>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold font-mono text-xs">{pc.name}</h3>
            </div>
            <Lock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          </div>
          {/* Row 2: Price and Lock */}
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-0.5">
              <Zap className="h-3 w-3 text-muted-foreground flex-shrink-0" />
              <span className="font-bold font-mono text-xs text-muted-foreground">{formatCost(pc.cost)}</span>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="hover-elevate border-2 border-primary/20 bg-gradient-to-br from-card to-card/80" data-testid={`pc-card-${pc.id}`} {...(pc.id === 'budget' && { 'data-tutorial-id': 'budget-rig-card' })}>
      <div className="flex flex-col gap-2 p-2">
        {/* Row 1: Icon, Name, Earning */}
        <div className="flex items-center gap-2">
          <span className="text-2xl drop-shadow-lg flex-shrink-0">{iconMap[pc.icon]}</span>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold font-mono text-xs">{pc.name}</h3>
          </div>
          <Badge variant="outline" className="text-xs gap-0.5 flex-shrink-0 whitespace-nowrap">
            <span>{pc.miningRate}/s</span>
          </Badge>
        </div>
        {/* Row 2: Price and Buy Button */}
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-0.5">
            <Zap className="h-3 w-3 text-primary flex-shrink-0" />
            <span className="font-bold font-mono text-xs">{formatCost(pc.cost)}</span>
          </div>
          <Button 
            size="sm"
            disabled={!canAfford}
            onClick={() => onPurchase(pc.id)}
            data-testid={`button-purchase-${pc.id}`}
            {...(pc.id === 'budget' && { 'data-tutorial-id': 'budget-rig-buy' })}
            className="h-6 px-2 text-xs ml-auto"
          >
            Buy
          </Button>
        </div>
      </div>
    </Card>
  );
}
