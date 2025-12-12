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

// Map PC types to provided image filenames in /public/pcs
const imageFileMap: Record<PCType["icon"], string> = {
  budget: "4.png",
  laptop: "3.png",
  workstation: "1.png",
  gaming: "2.png",
  "mining-rig": "5.png",
  server: "6.png",
  quantum: "7.png"
};

export default function PCCard({ pc, canAfford, onPurchase }: PCCardProps) {
  const formatCost = (cost: number) => {
    if (cost >= 1000000) return `$${(cost / 1000000).toFixed(1)}M`;
    if (cost >= 1000) return `$${(cost / 1000).toFixed(1)}K`;
    return `$${cost}`;
  };

  // Image path for PCs; user will provide assets under public/pcs
  const pcImageSrc = `/pcs/${imageFileMap[pc.icon] ?? `${pc.id}.png`}`;

  if (!pc.unlocked) {
    return (
      <Card className="opacity-70 bg-gradient-to-br from-orange-50 via-amber-50 to-white border-2 border-muted/40 rounded-xl shadow-sm" data-testid={`pc-card-${pc.id}`}>
        <div className="flex flex-col gap-2 p-2">
          {/* Row 1: Image + Name */}
          <div className="flex items-center gap-2">
            <div className="relative h-12 w-12 rounded-lg overflow-hidden border border-muted/40 bg-white flex-shrink-0">
              <img src={pcImageSrc} alt={pc.name} loading="lazy" className="h-full w-full object-cover opacity-60" />
              <div className="absolute inset-0 bg-white/50" />
            </div>
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
    <Card className="hover-elevate border-2 border-primary/25 bg-gradient-to-br from-orange-50 via-amber-50 to-white rounded-xl shadow-md" data-testid={`pc-card-${pc.id}`} {...(pc.id === 'budget' && { 'data-tutorial-id': 'budget-rig-card' })}>
      <div className="flex flex-col gap-2 p-2">
        {/* Row 1: Image + Name + Rate */}
        <div className="flex items-center gap-2">
          <div className="relative h-12 w-12 rounded-lg overflow-hidden border-2 border-white shadow-sm bg-white flex-shrink-0">
            <img src={pcImageSrc} alt={pc.name} loading="lazy" className="h-full w-full object-cover" />
            <div className="absolute inset-0 border border-primary/20 rounded-lg" />
          </div>
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
