import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Zap, TrendingUp, DollarSign } from "lucide-react";

interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  currentLevel: number;
  maxLevel: number;
  effect: string;
  unlocked: boolean;
  category: string;
}

interface UpgradeDetailsModalProps {
  upgrade: Upgrade | null;
  open: boolean;
  onClose: () => void;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'expansion':
      return '🏢';
    case 'mining':
      return '⛏️';
    case 'economy':
      return '💰';
    case 'automation':
      return '⚡';
    default:
      return '📦';
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'expansion':
      return 'bg-blue-500/20 text-blue-300 border-blue-500/50';
    case 'mining':
      return 'bg-purple-500/20 text-purple-300 border-purple-500/50';
    case 'economy':
      return 'bg-green-500/20 text-green-300 border-green-500/50';
    case 'automation':
      return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
    default:
      return 'bg-gray-500/20 text-gray-300 border-gray-500/50';
  }
};

const getUpgradeStats = (upgrade: Upgrade) => {
  const { id, currentLevel, maxLevel } = upgrade;
  
  let currentBonus = '';
  let nextBonus = '';
  
  switch (id) {
    case 'room-space':
      const gridSizes = ['3×3', '3×4', '4×4', '4×5', '5×5', '5×6', '6×6'];
      currentBonus = gridSizes[currentLevel] || '3×3';
      nextBonus = gridSizes[currentLevel + 1] || '6×6 (Max)';
      break;
    case 'mining-speed':
      currentBonus = `+${currentLevel * 10}% speed`;
      nextBonus = currentLevel < maxLevel ? `+${(currentLevel + 1) * 10}% speed` : 'Max Level';
      break;
    case 'offline-boost':
      const tier1Current = (0.3 + currentLevel * 0.1).toFixed(1);
      const tier1Next = (0.3 + (currentLevel + 1) * 0.1).toFixed(1);
      currentBonus = `Tier 1: ${tier1Current}x`;
      nextBonus = currentLevel < maxLevel ? `Tier 1: ${tier1Next}x` : 'Max Level';
      break;
    case 'worker-discount':
      currentBonus = currentLevel > 0 ? `-${currentLevel * 15}% cost` : 'No discount';
      nextBonus = currentLevel < maxLevel ? `-${(currentLevel + 1) * 15}% cost` : 'Max Level';
      break;
    case 'rebirth-discount':
      currentBonus = currentLevel > 0 ? `-${currentLevel * 10}% cost` : 'No discount';
      nextBonus = currentLevel < maxLevel ? `-${(currentLevel + 1) * 10}% cost` : 'Max Level';
      break;
    case 'auto-collect':
      currentBonus = currentLevel > 0 ? 'Active' : 'Inactive';
      nextBonus = currentLevel < maxLevel ? 'Active' : 'Max Level';
      break;
    case 'token-discount':
      const currentCost = Math.max(0, 10000 - currentLevel * 1000);
      const nextCost = Math.max(0, 10000 - (currentLevel + 1) * 1000);
      currentBonus = `$${currentCost.toLocaleString()} switch cost`;
      nextBonus = currentLevel < maxLevel ? `$${nextCost.toLocaleString()} switch cost` : 'Max Level';
      break;
    default:
      currentBonus = 'Level ' + currentLevel;
      nextBonus = currentLevel < maxLevel ? 'Level ' + (currentLevel + 1) : 'Max Level';
  }
  
  return { currentBonus, nextBonus };
};

export default function UpgradeDetailsModal({ upgrade, open, onClose }: UpgradeDetailsModalProps) {
  if (!upgrade) return null;
  
  const progress = (upgrade.currentLevel / upgrade.maxLevel) * 100;
  const { currentBonus, nextBonus } = getUpgradeStats(upgrade);
  const isMaxed = upgrade.currentLevel >= upgrade.maxLevel;
  const costMultiplier = upgrade.id === "room-space" ? 2 : 1.5;
  const nextLevelCost = Math.floor(upgrade.cost * Math.pow(costMultiplier, upgrade.currentLevel));

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-w-[95vw] bg-gray-900 border-gray-700 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-2xl">
            <span className="text-2xl sm:text-3xl">{getCategoryIcon(upgrade.category)}</span>
            <span className="font-mono">{upgrade.name}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 sm:space-y-6 pt-2 sm:pt-4">
          {/* Category Badge */}
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={`${getCategoryColor(upgrade.category)} font-mono`}>
              {upgrade.category.charAt(0).toUpperCase() + upgrade.category.slice(1)}
            </Badge>
            <Badge variant="outline" className="font-mono">
              Level {upgrade.currentLevel}/{upgrade.maxLevel}
            </Badge>
          </div>
          
          {/* Description */}
          <p className="text-gray-400 leading-relaxed">{upgrade.description}</p>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400 font-mono">Progress</span>
              <span className="text-accent font-bold font-mono">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>
          
          {/* Current vs Next Level Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 sm:p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400">
                <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="font-mono">Current Level</span>
              </div>
              <div className="text-base sm:text-xl font-bold text-white font-mono break-words">{currentBonus}</div>
            </div>
            
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 sm:p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="font-mono">Next Level</span>
              </div>
              <div className="text-base sm:text-xl font-bold text-accent font-mono break-words">{nextBonus}</div>
            </div>
          </div>
          
          {/* Effect Description */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-2">
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
              <span className="font-mono text-xs sm:text-sm text-blue-300">Effect</span>
            </div>
            <p className="text-white font-mono text-xs sm:text-sm break-words">{upgrade.effect}</p>
          </div>
          
          {/* Next Level Cost */}
          {!isMaxed && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 sm:p-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                  <span className="font-mono text-xs sm:text-sm text-green-300">Next Level Cost</span>
                </div>
                <span className="text-lg sm:text-xl font-bold text-green-400 font-mono">
                  ${nextLevelCost.toLocaleString()}
                </span>
              </div>
            </div>
          )}
          
          {isMaxed && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-center">
              <span className="text-yellow-400 font-mono font-bold">✨ Max Level Reached ✨</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
