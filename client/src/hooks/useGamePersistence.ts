
import { useEffect, Dispatch, SetStateAction } from 'react';
import { GAME_VERSION } from '@/utils/gameConstants';

interface UseGamePersistenceProps {
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
  setCash: (cash: number) => void;
  setTotalMined: (value: number | ((prev: number) => number)) => void;
  setGridWidth: (width: number) => void;
  setGridHeight: (height: number) => void;
  setRebirthCount: (count: number) => void;
  setOwnedPCs: (pcs: any[]) => void;
  setOwnedWorkers: (workers: any[]) => void;
  setUpgrades: Dispatch<SetStateAction<any[]>>;
  setTokens: (tokens: any[]) => void;
  onOfflineEarnings?: (amount: number, minutes: number) => void;
}


export function useGamePersistence({
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
  tutorialActive,
  setCash,
  setTotalMined,
  setGridWidth,
  setGridHeight,
  setRebirthCount,
  setOwnedPCs,
  setOwnedWorkers,
  setUpgrades,
  setTokens,
  onOfflineEarnings
}: UseGamePersistenceProps) {

  // Load game state on mount
  useEffect(() => {
    // Check if tutorial is still active - if so, clear any saved game state
    const tutorialCompleted = localStorage.getItem('tutorialCompleted') === 'true';
    if (!tutorialCompleted) {
      console.log('Tutorial not completed, clearing game state...');
      localStorage.removeItem('gameState');
      return;
    }

    const gameState = localStorage.getItem('gameState');
    if (gameState) {
      try {
        const state = JSON.parse(gameState);
        
        // Version check
        if (!state.gameVersion || state.gameVersion < GAME_VERSION) {
          console.log('Old save detected, clearing localStorage...');
          localStorage.removeItem('gameState');
          localStorage.removeItem('tutorialCompleted');
          return;
        }

        // Load all state
        if (state.cash !== undefined) setCash(state.cash);
        if (state.totalMined !== undefined) setTotalMined(state.totalMined);
        if (state.gridWidth !== undefined) setGridWidth(state.gridWidth);
        if (state.gridHeight !== undefined) setGridHeight(state.gridHeight);
        if (state.rebirthCount !== undefined) setRebirthCount(state.rebirthCount);
        if (state.ownedPCs) setOwnedPCs(state.ownedPCs);
        if (state.ownedWorkers) setOwnedWorkers(state.ownedWorkers);
        
        // Load and sync upgrades
        if (state.upgrades && state.upgrades.length > 0) {
          const validUpgradeIds = ['room-space', 'mining-speed', 'offline-boost', 'worker-discount', 'rebirth-discount', 'auto-collect', 'token-discount'];
          
          setUpgrades((prev: any[]) => prev.map((upgrade: any) => {
            const oldUpgrade = state.upgrades.find((u: any) => u.id === upgrade.id);
            
            if (oldUpgrade && validUpgradeIds.includes(upgrade.id)) {
              // Special case: room-space must match grid size
              if (upgrade.id === 'room-space') {
                const gridW = state.gridWidth || 3;
                const gridH = state.gridHeight || 3;
                
                let expectedLevel = 0;
                if (gridW === 3 && gridH === 4) expectedLevel = 1;
                else if (gridW === 4 && gridH === 4) expectedLevel = 2;
                else if (gridW === 4 && gridH === 5) expectedLevel = 3;
                else if (gridW === 5 && gridH === 5) expectedLevel = 4;
                else if (gridW === 5 && gridH === 6) expectedLevel = 5;
                else if (gridW === 6 && gridH === 6) expectedLevel = 6;
                
                const baseCost = 20000;
                const cost = baseCost * Math.pow(2, expectedLevel);
                
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
          }));
        }
        
        // Load tokens
        if (state.tokens) {
          setTokens(state.tokens);
        }

        // Calculate offline earnings
        if (state.lastLogout && onOfflineEarnings) {
          const timeAwayMs = Date.now() - state.lastLogout;
          const timeAwaySeconds = Math.floor(timeAwayMs / 1000);

          if (timeAwaySeconds > 60 && state.ownedPCs && state.ownedPCs.length > 0) {
            const offlineBoostLevel = state.upgrades?.find((u: any) => u.id === 'offline-boost')?.currentLevel || 0;
            
            let offlineRate = 0;
            state.ownedPCs.forEach((pc: any) => {
              const tokensPerSecond = pc.type?.miningRate || 1;
              const cashPerToken = 10;
              offlineRate += tokensPerSecond * cashPerToken;
            });

            const rebirthMultiplier = 1 + ((state.rebirthCount || 0) * 0.1);
            offlineRate *= rebirthMultiplier;

            const tier1Multiplier = 0.3 + (offlineBoostLevel * 0.1);
            const tier2Multiplier = 0.2 + (offlineBoostLevel * 0.1);
            const tier3Multiplier = 0.1 + (offlineBoostLevel * 0.1);

            const maxOfflineTime = 24 * 60 * 60;
            const effectiveTime = Math.min(timeAwaySeconds, maxOfflineTime);

            const tier1Time = 3 * 60 * 60;
            const tier2Time = 6 * 60 * 60;

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

            if (earnings > 0) {
              const timeAway = Math.floor(timeAwaySeconds / 60);
              onOfflineEarnings(earnings, timeAway);
            }
          }
        }
      } catch (err) {
        console.error('Failed to load game state:', err);
      }
    }
  }, []); // Only run on mount

  // Auto-save every 30 seconds
  useEffect(() => {
    // Don't save during tutorial
    if (tutorialActive) return;

    const saveInterval = setInterval(() => {
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
    }, 30000); // Save every 30 seconds

    return () => clearInterval(saveInterval);
  }, [cash, gridWidth, gridHeight, rebirthCount, ownedPCs, ownedWorkers, upgrades, tokens, activeToken, tutorialActive]);

  // Save on window close
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Don't save during tutorial
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
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [cash, gridWidth, gridHeight, rebirthCount, ownedPCs, ownedWorkers, upgrades, tokens, activeToken, tutorialActive]);
}
