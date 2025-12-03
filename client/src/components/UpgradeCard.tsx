import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, Zap, Info } from "lucide-react";

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  currentLevel: number;
  maxLevel: number;
  effect: string;
  unlocked: boolean;
  category: "expansion" | "mining" | "economy" | "automation";
}

interface UpgradeCardProps {
  upgrade: Upgrade;
  canAfford: boolean;
  onPurchase: (upgradeId: string) => void;
  onShowDetails?: (upgrade: Upgrade) => void;
}

const categoryIcons = {
  expansion: "🏢",
  mining: "⛏️",
  economy: "💰",
  automation: "⚡"
};

export default function UpgradeCard({ upgrade, canAfford, onPurchase, onShowDetails }: UpgradeCardProps) {
  const formatCost = (cost: number) => {
    if (cost >= 1000000) return `$${Math.floor(cost / 1000000)}M`;
    if (cost >= 1000) return `$${Math.floor(cost / 1000)}K`;
    return `$${cost}`;
  };

  const isMaxLevel = upgrade.currentLevel >= upgrade.maxLevel;

  if (!upgrade.unlocked) {
    return (
      <Card className="opacity-60 border-2 border-muted" data-testid={`upgrade-card-${upgrade.id}`}>
        <div className="flex items-center gap-2 p-2">
          <span className="text-2xl opacity-50 flex-shrink-0">{categoryIcons[upgrade.category]}</span>
          <div className="flex-1">
            <h3 className="font-bold font-mono text-xs">{upgrade.name}</h3>
          </div>
          <Lock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        </div>
      </Card>
    );
  }

  return (
    <Card 
      className={`hover-elevate border-2 border-primary/20 bg-gradient-to-br from-card to-card/80 ${isMaxLevel ? 'opacity-75' : ''} cursor-pointer`}
      data-testid={`upgrade-card-${upgrade.id}`}
      onClick={() => onShowDetails?.(upgrade)}
    >
      <div className="flex flex-col gap-2 p-2">
        {/* Row 1: Icon, Name, Level, Info Icon */}
        <div className="flex items-center gap-2">
          <span className="text-2xl drop-shadow-lg flex-shrink-0">{categoryIcons[upgrade.category]}</span>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold font-mono text-xs">{upgrade.name}</h3>
          </div>
          <Info className="h-4 w-4 text-blue-400 flex-shrink-0 hover:text-blue-300 transition-colors" />
          <Badge variant="outline" className="text-xs whitespace-nowrap flex-shrink-0">
            Lv {upgrade.currentLevel}/{upgrade.maxLevel}
          </Badge>
        </div>
        {/* Row 2: Price and Buy/Max Button */}
        <div className="flex items-center gap-1">
          {isMaxLevel ? (
            <Badge variant="default" className="bg-gradient-to-r from-green-600 to-emerald-600 text-xs">
              MAX LEVEL
            </Badge>
          ) : (
            <>
              <div className="flex items-center gap-0.5">
                <Zap className="h-3 w-3 text-primary flex-shrink-0" />
                <span className="font-bold font-mono text-xs">{formatCost(upgrade.cost)}</span>
              </div>
              <Button 
                size="sm"
                disabled={!canAfford}
                onClick={(e) => {
                  e.stopPropagation();
                  onPurchase(upgrade.id);
                }}
                data-testid={`button-upgrade-${upgrade.id}`}
                className="h-6 px-2 text-xs ml-auto"
              >
                Buy
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
