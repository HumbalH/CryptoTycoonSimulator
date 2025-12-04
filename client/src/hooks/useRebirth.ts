import { useState, useCallback } from 'react';
import { calculateRebirthCost } from '@/utils/gameCalculations';
import { INITIAL_CASH, INITIAL_GRID_SIZE } from '@/utils/gameConstants';

interface UseRebirthProps {
  cash: number;
  setCash: (cash: number) => void;
  ownedPCs: any[];
  rebirthDiscountLevel: number;
  resetPCs: () => void;
  resetWorkers: () => void;
  resetUpgrade: (upgradeId: string) => void;
  setGridWidth: (width: number) => void;
  setGridHeight: (height: number) => void;
  unlockTokens: () => void;
  showToast: (title: string, description: string, variant?: 'default' | 'destructive') => void;
}

export function useRebirth({
  cash,
  setCash,
  ownedPCs,
  rebirthDiscountLevel,
  resetPCs,
  resetWorkers,
  resetUpgrade,
  setGridWidth,
  setGridHeight,
  unlockTokens,
  showToast
}: UseRebirthProps) {
  const [rebirthCount, setRebirthCount] = useState(0);

  /**
   * Check if rebirth requirements are met
   */
  const checkRebirthRequirements = useCallback((targetLevel: number): boolean => {
    if (targetLevel === 1) {
      // Rebirth 1 -> 2: Need at least one Tier 1 PC (Budget or Gaming)
      const hasTier1PC = ownedPCs.some(
        pc => pc.type.id === 'budget' || pc.type.id === 'gaming'
      );
      if (!hasTier1PC) {
        showToast('Rebirth Locked', 'You need at least one Tier 1 PC (Budget or Gaming) to rebirth.', 'destructive');
        return false;
      }
    } else if (targetLevel === 2) {
      // Rebirth 2 -> 3: Need at least one Tier 2 PC (Server or ASIC)
      const hasTier2PC = ownedPCs.some(
        pc => pc.type.id === 'server' || pc.type.id === 'asic'
      );
      if (!hasTier2PC) {
        showToast('Rebirth Locked', 'You need at least one Tier 2 PC (Server or ASIC) to rebirth.', 'destructive');
        return false;
      }
    } else if (targetLevel === 3) {
      // Rebirth 3 -> 4: Need at least one Tier 3 PC (Quantum or Supercomputer)
      const hasTier3PC = ownedPCs.some(
        pc => pc.type.id === 'quantum' || pc.type.id === 'supercomputer'
      );
      if (!hasTier3PC) {
        showToast('Rebirth Locked', 'You need at least one Tier 3 PC (Quantum or Supercomputer) to rebirth.', 'destructive');
        return false;
      }
    }

    return true;
  }, [ownedPCs, showToast]);

  /**
   * Perform rebirth
   */
  const performRebirth = useCallback(() => {
    const cost = calculateRebirthCost(rebirthCount, rebirthDiscountLevel);

    if (cash < cost) {
      showToast('Insufficient Cash', `You need $${cost.toLocaleString()} to rebirth.`, 'destructive');
      return;
    }

    if (!checkRebirthRequirements(rebirthCount)) {
      return;
    }

    // Reset game state
    setCash(INITIAL_CASH);
    resetPCs();
    resetWorkers();
    
    // Reset grid to 3x3
    setGridWidth(INITIAL_GRID_SIZE);
    setGridHeight(INITIAL_GRID_SIZE);
    
    // Reset room-space upgrade only
    resetUpgrade('room-space');

    // Increment rebirth count
    const newRebirthCount = rebirthCount + 1;
    setRebirthCount(newRebirthCount);

    // Unlock new tokens
    unlockTokens();

    const multiplier = 1 + (newRebirthCount * 0.1);
    showToast(
      'Rebirth Successful!',
      `You are now at Rebirth Level ${newRebirthCount}. Earnings multiplier: ${multiplier.toFixed(1)}x`
    );
  }, [
    cash,
    setCash,
    rebirthCount,
    rebirthDiscountLevel,
    resetPCs,
    resetWorkers,
    resetUpgrade,
    setGridWidth,
    setGridHeight,
    unlockTokens,
    checkRebirthRequirements,
    showToast
  ]);

  /**
   * Get rebirth cost
   */
  const getRebirthCost = useCallback((): number => {
    return calculateRebirthCost(rebirthCount, rebirthDiscountLevel);
  }, [rebirthCount, rebirthDiscountLevel]);

  /**
   * Get current rebirth multiplier
   */
  const getRebirthMultiplier = useCallback((): number => {
    return 1 + (rebirthCount * 0.1);
  }, [rebirthCount]);

  return {
    rebirthCount,
    setRebirthCount,
    performRebirth,
    getRebirthCost,
    getRebirthMultiplier,
    checkRebirthRequirements
  };
}
