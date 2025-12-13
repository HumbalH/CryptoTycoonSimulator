import { useCallback } from 'react';
import { GAME_VERSION } from '@/utils/gameConstants';

export function useInstantSave({
  cash,
  totalMined,
  gridWidth,
  gridHeight,
  rebirthCount,
  ownedPCs,
  ownedWorkers,
  upgrades,
  tokens,
  activeToken,
  tutorialActive
}: {
  cash: number;
  totalMined: number;
  gridWidth: number;
  gridHeight: number;
  rebirthCount: number;
  ownedPCs: any[];
  ownedWorkers: any[];
  upgrades: any[];
  tokens: any[];
  activeToken: string;
  tutorialActive: boolean;
}) {
  return useCallback(() => {
    if (tutorialActive) return;
    const gameState = {
      gameVersion: GAME_VERSION,
      cash,
      totalMined,
      gridWidth,
      gridHeight,
      rebirthCount,
      ownedPCs,
      ownedWorkers,
      upgrades,
      tokens,
      activeToken,
      lastLogout: Date.now()
    };
    localStorage.setItem('gameState', JSON.stringify(gameState));
  }, [cash, totalMined, gridWidth, gridHeight, rebirthCount, ownedPCs, ownedWorkers, upgrades, tokens, activeToken, tutorialActive]);
}
