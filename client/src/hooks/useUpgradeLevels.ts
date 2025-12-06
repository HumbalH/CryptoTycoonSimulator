import { useMemo } from 'react';
import type { Upgrade } from '@/types/game';

/**
 * Custom hook to efficiently access upgrade levels
 * Memoizes a lookup map to avoid repeated array.find() calls
 */
export function useUpgradeLevels(upgrades: Upgrade[]) {
  const upgradeLevels = useMemo(() => {
    const map = new Map<string, number>();
    upgrades.forEach(upgrade => {
      map.set(upgrade.id, upgrade.currentLevel);
    });
    return map;
  }, [upgrades]);

  const getLevel = (upgradeId: string): number => {
    return upgradeLevels.get(upgradeId) || 0;
  };

  return {
    getLevel,
    miningSpeedLevel: getLevel('mining-speed'),
    autoCollectEnabled: getLevel('auto-collect') > 0,
    workerDiscountLevel: getLevel('worker-discount'),
    tokenDiscountLevel: getLevel('token-discount'),
    rebirthDiscountLevel: getLevel('rebirth-discount'),
    offlineBoostLevel: getLevel('offline-boost'),
  };
}
