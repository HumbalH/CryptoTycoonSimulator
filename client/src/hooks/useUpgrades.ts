import { useState, useCallback } from 'react';
import type { Upgrade } from '@/types/game';
import { calculateUpgradeCost } from '@/utils/gameCalculations';

interface UseUpgradesProps {
  cash: number;
  setCash: (cash: number) => void;
  gridWidth: number;
  gridHeight: number;
  setGridWidth: (width: number) => void;
  setGridHeight: (height: number) => void;
  showToast: (title: string, description: string, variant?: 'default' | 'destructive') => void;
}

export function useUpgrades({
  cash,
  setCash,
  gridWidth,
  gridHeight,
  setGridWidth,
  setGridHeight,
  showToast
}: UseUpgradesProps) {
  const [upgrades, setUpgrades] = useState<Upgrade[]>([]);

  /**
   * Purchase an upgrade
   */
  const purchaseUpgrade = useCallback((upgrade: Upgrade) => {
    if (cash < upgrade.cost) {
      showToast('Insufficient Cash', 'You do not have enough cash for this upgrade.', 'destructive');
      return;
    }

    if (upgrade.currentLevel >= upgrade.maxLevel) {
      showToast('Max Level', 'This upgrade is already at max level.', 'destructive');
      return;
    }

    // Special handling for room-space upgrade
    if (upgrade.id === 'room-space') {
      const newLevel = upgrade.currentLevel + 1;
      
      // Progressive grid expansion: 3x3 -> 3x4 -> 4x4 -> 4x5 -> 5x5 -> 5x6 -> 6x6
      if (newLevel === 1) {
        setGridHeight(4); // 3x3 -> 3x4
      } else if (newLevel === 2) {
        setGridWidth(4); // 3x4 -> 4x4
      } else if (newLevel === 3) {
        setGridHeight(5); // 4x4 -> 4x5
      } else if (newLevel === 4) {
        setGridWidth(5); // 4x5 -> 5x5
      } else if (newLevel === 5) {
        setGridHeight(6); // 5x5 -> 5x6
      } else if (newLevel === 6) {
        setGridWidth(6); // 5x6 -> 6x6
      }
    }

    // Update upgrade state
    setUpgrades(prev => prev.map(u => {
      if (u.id === upgrade.id) {
        const newLevel = u.currentLevel + 1;
        const newCost = calculateUpgradeCost(u, newLevel);
        
        return {
          ...u,
          currentLevel: newLevel,
          cost: newCost
        };
      }
      return u;
    }));

    setCash(cash - upgrade.cost);
    showToast('Upgrade Purchased!', `${upgrade.name} upgraded to level ${upgrade.currentLevel + 1}.`);
  }, [cash, setCash, gridWidth, gridHeight, setGridWidth, setGridHeight, showToast]);

  /**
   * Get upgrade level by ID
   */
  const getUpgradeLevel = useCallback((upgradeId: string): number => {
    return upgrades.find(u => u.id === upgradeId)?.currentLevel || 0;
  }, [upgrades]);

  /**
   * Reset specific upgrade (for rebirth)
   */
  const resetUpgrade = useCallback((upgradeId: string) => {
    setUpgrades(prev => prev.map(u => {
      if (u.id === upgradeId) {
        const newCost = calculateUpgradeCost(u, 0);
        return {
          ...u,
          currentLevel: 0,
          cost: newCost
        };
      }
      return u;
    }));
  }, []);

  return {
    upgrades,
    setUpgrades,
    purchaseUpgrade,
    getUpgradeLevel,
    resetUpgrade
  };
}
