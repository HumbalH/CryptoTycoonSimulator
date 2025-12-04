import type { GameState, Upgrade } from '@/types/game';
import { GAME_VERSION } from './gameConstants';
import { calculateExpectedRoomSpaceLevel, calculateUpgradeCost } from './gameCalculations';
import { DEFAULT_UPGRADES } from './gameConstants';

const GAME_STATE_KEY = 'gameState';

/**
 * Load game state from localStorage
 */
export function loadGameState(): GameState | null {
  const savedState = localStorage.getItem(GAME_STATE_KEY);
  if (!savedState) return null;

  try {
    const state = JSON.parse(savedState);

    // Version check: clear old saves
    if (!state.gameVersion || state.gameVersion < GAME_VERSION) {
      console.log('Old save detected, clearing localStorage...');
      localStorage.removeItem(GAME_STATE_KEY);
      return null;
    }

    return state;
  } catch (err) {
    console.error('Failed to load game state:', err);
    return null;
  }
}

/**
 * Save game state to localStorage
 */
export function saveGameState(state: GameState): void {
  try {
    localStorage.setItem(GAME_STATE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save game state:', err);
  }
}

/**
 * Migrate old PC positions if needed
 */
export function migratePCPositions(
  ownedPCs: any[],
  gridWidth: number,
  gridHeight: number,
  oldRoomSize?: number
): any[] {
  const needsMigration = oldRoomSize && !gridWidth && !gridHeight;

  if (!needsMigration) return ownedPCs;

  return ownedPCs.map((pc: any) => {
    const oldX = pc.position[0];
    const oldZ = pc.position[2];
    // Convert from old centered grid to new corner-based grid
    const newPosition: [number, number, number] = [oldX - 3, 0.1, oldZ - 3];

    return {
      ...pc,
      position: newPosition
    };
  });
}

/**
 * Sync upgrades with saved state and fix room-space upgrade
 */
export function syncUpgrades(
  savedUpgrades: any[] | undefined,
  gridWidth: number,
  gridHeight: number
): Upgrade[] {
  if (!savedUpgrades || savedUpgrades.length === 0) {
    return DEFAULT_UPGRADES;
  }

  const validUpgradeIds = ['room-space', 'mining-speed', 'offline-boost', 'worker-discount', 'rebirth-discount', 'auto-collect', 'token-discount'];

  return DEFAULT_UPGRADES.map(upgrade => {
    const oldUpgrade = savedUpgrades.find((u: any) => u.id === upgrade.id);
    
    if (oldUpgrade && validUpgradeIds.includes(upgrade.id)) {
      // Special case: room-space must match grid size (fix for users who rebirthed before the fix)
      if (upgrade.id === 'room-space') {
        const expectedLevel = calculateExpectedRoomSpaceLevel(gridWidth, gridHeight);
        const cost = calculateUpgradeCost(upgrade, expectedLevel);

        return {
          ...upgrade,
          currentLevel: expectedLevel,
          cost: cost
        };
      }
      
      return {
        ...upgrade,
        currentLevel: oldUpgrade.currentLevel,
        cost: oldUpgrade.cost
      };
    }
    
    return upgrade;
  });
}

/**
 * Calculate offline earnings
 */
export function calculateOfflineEarnings(
  lastLogoutTime: number,
  ownedPCs: any[],
  rebirthCount: number,
  offlineBoostLevel: number
): number {
  const timeAwayMs = Date.now() - lastLogoutTime;
  const timeAwaySeconds = Math.floor(timeAwayMs / 1000);

  // Only show offline earnings if away for more than 1 minute
  if (timeAwaySeconds <= 60 || ownedPCs.length === 0) {
    return 0;
  }

  // Calculate total mining rate
  let offlineRate = 0;
  ownedPCs.forEach((pc: any) => {
    const tokensPerSecond = pc.type?.miningRate || 1;
    const cashPerToken = 10; // Use base token value for offline
    offlineRate += tokensPerSecond * cashPerToken;
  });

  // Apply rebirth multiplier
  const rebirthMultiplier = 1 + (rebirthCount * 0.1);
  offlineRate *= rebirthMultiplier;

  // Get offline boost level and calculate tier multipliers
  const tier1Multiplier = 0.3 + (offlineBoostLevel * 0.1);
  const tier2Multiplier = 0.2 + (offlineBoostLevel * 0.1);
  const tier3Multiplier = 0.1 + (offlineBoostLevel * 0.1);

  // Tiered offline earnings
  const maxOfflineTime = 24 * 60 * 60; // 24 hours in seconds
  const effectiveTime = Math.min(timeAwaySeconds, maxOfflineTime);

  const tier1Time = 3 * 60 * 60; // First 3 hours
  const tier2Time = 6 * 60 * 60; // Up to 6 hours total

  let earnings = 0;

  if (effectiveTime <= tier1Time) {
    earnings = Math.floor(offlineRate * effectiveTime * tier1Multiplier);
  } else if (effectiveTime <= tier2Time) {
    const tier1Earnings = Math.floor(offlineRate * tier1Time * tier1Multiplier);
    const tier2Earnings = Math.floor(offlineRate * (effectiveTime - tier1Time) * tier2Multiplier);
    earnings = tier1Earnings + tier2Earnings;
  } else {
    const tier1Earnings = Math.floor(offlineRate * tier1Time * tier1Multiplier);
    const tier2Earnings = Math.floor(offlineRate * (tier2Time - tier1Time) * tier2Multiplier);
    const tier3Earnings = Math.floor(offlineRate * (effectiveTime - tier2Time) * tier3Multiplier);
    earnings = tier1Earnings + tier2Earnings + tier3Earnings;
  }

  return earnings;
}
