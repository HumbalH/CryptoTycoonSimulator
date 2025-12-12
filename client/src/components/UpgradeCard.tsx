import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, Zap, Info, DollarSign, Sparkles } from "lucide-react";

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

// Map upgrade IDs to provided image filenames in /public/upgrades
const imageFileMap: Record<string, string> = {
  "room-space": "8.png",
  "mining-speed": "9.png",
  "offline-boost": "10.png",
  "worker-discount": "11.png",
  "rebirth-discount": "12.png",
  "auto-collect": "14.png",
  "token-discount": "13.png"
};

export default function UpgradeCard({ upgrade, canAfford, onPurchase, onShowDetails }: UpgradeCardProps) {
  const formatCost = (cost: number) => {
    if (cost >= 1000000) return `$${Math.floor(cost / 1000000)}M`;
    if (cost >= 1000) return `$${Math.floor(cost / 1000)}K`;
    return `$${cost}`;
  };

  const isMaxLevel = upgrade.currentLevel >= upgrade.maxLevel;

  // Image path for upgrades; served from public/upgrades directory
  const upgradeImageSrc = `/upgrade/${imageFileMap[upgrade.id] ?? `${upgrade.id}.png`}`;

  if (!upgrade.unlocked) {
    return (
      <Card className="opacity-70 bg-gradient-to-br from-orange-100 via-amber-100 to-yellow-50 border-2 border-orange-300/40 rounded-xl shadow-md" data-testid={`upgrade-card-${upgrade.id}`}>
        <div className="flex items-center gap-2 p-2">
          <div className="relative h-10 w-10 rounded-lg overflow-hidden border-2 border-orange-200/60 bg-white/80 flex-shrink-0 shadow-sm">
            <img src={upgradeImageSrc} alt={upgrade.name} loading="lazy" className="h-full w-full object-cover opacity-50" />
            <div className="absolute inset-0 bg-white/40" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-xs text-orange-800/70 truncate">{upgrade.name}</h3>
          </div>
          <Lock className="h-4 w-4 text-orange-400/60 flex-shrink-0" />
        </div>
      </Card>
    );
  }

  return (
    <Card 
      className={`hover:scale-[1.01] transition-all duration-200 border-2 border-orange-400/50 bg-gradient-to-br from-orange-100 via-amber-50 to-yellow-100 rounded-xl shadow-md hover:shadow-lg ${isMaxLevel ? 'opacity-90' : ''}`}
      data-testid={`upgrade-card-${upgrade.id}`}
    >
      <div className="p-2 space-y-1.5">
        {/* Image and Name */}
        <div className="flex items-center gap-2">
          <div className="relative h-12 w-12 rounded-xl overflow-hidden border-2 border-white shadow-sm bg-gradient-to-br from-white to-orange-50 flex-shrink-0">
            <img src={upgradeImageSrc} alt={upgrade.name} loading="lazy" className="h-full w-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-sm text-orange-900 leading-tight truncate">{upgrade.name}</h3>
            <Badge variant="outline" className="text-xs bg-white/80 border-orange-400/50 text-orange-700 font-bold">
              Lv {upgrade.currentLevel}/{upgrade.maxLevel}
            </Badge>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-orange-800/80 leading-snug line-clamp-2">{upgrade.description}</p>

        {/* Effect Badge */}
        <div className="flex items-center gap-1">
          <Zap className="h-3 w-3 text-amber-500 flex-shrink-0" />
          <span className="text-xs font-semibold text-amber-700 bg-amber-100/80 px-1.5 py-0.5 rounded-full truncate">
            {upgrade.effect}
          </span>
        </div>

        {/* Price and Button */}
        <div className="flex items-center justify-between pt-0.5">
          {isMaxLevel ? (
            <Badge className="w-full justify-center bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold text-xs py-1.5 shadow-md flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              MAX LEVEL
            </Badge>
          ) : (
            <>
              <div className="flex items-center gap-1 bg-orange-200/60 px-2 py-1 rounded-lg">
                <DollarSign className="h-3.5 w-3.5 text-orange-700" />
                <span className="font-black text-xs text-orange-900">{formatCost(upgrade.cost)}</span>
              </div>
              <Button 
                disabled={!canAfford}
                onClick={(e) => {
                  e.stopPropagation();
                  onPurchase(upgrade.id);
                }}
                data-testid={`button-upgrade-${upgrade.id}`}
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs px-3 py-1 h-auto rounded-lg shadow-sm hover:shadow-md transition-all"
              >
                Upgrade
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
