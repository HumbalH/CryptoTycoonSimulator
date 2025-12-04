import type { OwnedPC, Token, Upgrade, OwnedWorker } from '@/types/game';

/**
 * Calculate total mining rate in cash per second
 */
export function calculateTotalMiningRate(
  ownedPCs: OwnedPC[],
  tokens: Token[],
  miningSpeedLevel: number
): number {
  const miningSpeedBoost = 1 + (miningSpeedLevel * 0.1);
  
  return ownedPCs.reduce((sum, pc) => {
    const token = tokens.find(t => t.id === pc.token);
    const tokensPerSecond = pc.type.miningRate * miningSpeedBoost;
    const cashPerToken = token?.profitRate || 10;
    return sum + (tokensPerSecond * cashPerToken);
  }, 0);
}

/**
 * Calculate earnings multiplier from rebirths
 */
export function calculateEarningsMultiplier(rebirthCount: number): number {
  return 1 + (rebirthCount * 0.1);
}

/**
 * Calculate rebirth cost based on rebirth count
 */
export function calculateRebirthCost(rebirthCount: number, rebirthDiscountLevel: number): number {
  let baseCost: number;
  
  if (rebirthCount === 0) {
    baseCost = 50000;
  } else if (rebirthCount === 1) {
    baseCost = 300000;
  } else if (rebirthCount === 2) {
    baseCost = 1500000;
  } else {
    baseCost = Math.floor(1500000 * Math.pow(2, rebirthCount - 2));
  }
  
  const discountMultiplier = 1 - (rebirthDiscountLevel * 0.1);
  return Math.floor(baseCost * discountMultiplier);
}

/**
 * Calculate worker discount multiplier
 */
export function calculateWorkerDiscount(workerDiscountLevel: number): number {
  return 1 - (workerDiscountLevel * 0.15);
}

/**
 * Calculate token switch cost
 */
export function calculateTokenSwitchCost(tokenDiscountLevel: number): number {
  const baseTokenSwitchCost = 10000;
  const discountAmount = tokenDiscountLevel * 1000;
  return Math.max(0, baseTokenSwitchCost - discountAmount);
}

/**
 * Count workers by type
 */
export function countWorkersByType(ownedWorkers: OwnedWorker[], type: string): number {
  return ownedWorkers.filter(w => w.type === type).length;
}

/**
 * Count PCs by tier
 */
export function countPCsByTier(ownedPCs: OwnedPC[], tier: 1 | 2 | 3): number {
  const tierMap = {
    1: ['budget', 'laptop', 'workstation'],
    2: ['gaming', 'mining-rig'],
    3: ['server', 'quantum']
  };
  
  return ownedPCs.filter(pc => tierMap[tier].includes(pc.type.id)).length;
}

/**
 * Check if worker requirements are met for a PC purchase
 */
export function checkWorkerRequirements(
  pcId: string,
  ownedPCs: OwnedPC[],
  ownedWorkers: OwnedWorker[]
): { canPurchase: boolean; message?: string } {
  // Tier 1 (Budget, Laptop, Workstation): 1 Technician per 5 PCs total
  if (['budget', 'laptop', 'workstation'].includes(pcId)) {
    const tier1Total = countPCsByTier(ownedPCs, 1) + 1;
    const techsNeeded = Math.ceil(tier1Total / 5);
    const techsHave = countWorkersByType(ownedWorkers, 'technician');

    if (techsHave < techsNeeded) {
      return {
        canPurchase: false,
        message: `You need ${techsNeeded} Technicians for Tier 1 PCs. You have ${techsHave}.`
      };
    }
  }

  // Tier 2 (Gaming PC, Mining Rig): 1 Engineer per 5 PCs total
  if (['gaming', 'mining-rig'].includes(pcId)) {
    const tier2Total = countPCsByTier(ownedPCs, 2) + 1;
    const engsNeeded = Math.ceil(tier2Total / 5);
    const engsHave = countWorkersByType(ownedWorkers, 'engineer');

    if (engsHave < engsNeeded) {
      return {
        canPurchase: false,
        message: `You need ${engsNeeded} Engineers for Tier 2 PCs. You have ${engsHave}.`
      };
    }
  }

  // Tier 3 (Server Rack, Quantum Core): 1 Expert per 5 PCs total
  if (['server', 'quantum'].includes(pcId)) {
    const tier3Total = countPCsByTier(ownedPCs, 3) + 1;
    const expertsNeeded = Math.ceil(tier3Total / 5);
    const expertsHave = countWorkersByType(ownedWorkers, 'expert');

    if (expertsHave < expertsNeeded) {
      return {
        canPurchase: false,
        message: `You need ${expertsNeeded} Experts for Tier 3 PCs. You have ${expertsHave}.`
      };
    }
  }

  return { canPurchase: true };
}

/**
 * Calculate expected room-space upgrade level from grid size
 */
export function calculateExpectedRoomSpaceLevel(gridWidth: number, gridHeight: number): number {
  if (gridWidth === 3 && gridHeight === 4) return 1;
  if (gridWidth === 4 && gridHeight === 4) return 2;
  if (gridWidth === 4 && gridHeight === 5) return 3;
  if (gridWidth === 5 && gridHeight === 5) return 4;
  if (gridWidth === 5 && gridHeight === 6) return 5;
  if (gridWidth === 6 && gridHeight === 6) return 6;
  return 0;
}

/**
 * Calculate upgrade cost for a given level
 */
export function calculateUpgradeCost(baseUpgrade: Upgrade, level: number): number {
  const costMultiplier = baseUpgrade.id === "room-space" ? 2 : 1.5;
  let cost = baseUpgrade.cost;
  
  for (let i = 0; i < level; i++) {
    cost = Math.floor(cost * costMultiplier);
  }
  
  return cost;
}

/**
 * Update grid size based on room-space upgrade level
 */
export function getGridSizeForLevel(level: number): { width: number; height: number } {
  switch (level) {
    case 1: return { width: 3, height: 4 };
    case 2: return { width: 4, height: 4 };
    case 3: return { width: 4, height: 5 };
    case 4: return { width: 5, height: 5 };
    case 5: return { width: 5, height: 6 };
    case 6: return { width: 6, height: 6 };
    default: return { width: 3, height: 3 };
  }
}
