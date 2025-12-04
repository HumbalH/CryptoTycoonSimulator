import { useEffect, useState, useCallback } from 'react';
import { useToast } from './use-toast';
import { usePCs } from './usePCs';
import { useWorkers } from './useWorkers';
import { useUpgrades } from './useUpgrades';
import { useTokens } from './useTokens';
import { useRebirth } from './useRebirth';
import { loadGameState, saveGameState, syncUpgrades, calculateOfflineEarnings } from '@/utils/localStorage';
import { DEFAULT_UPGRADES, DEFAULT_TOKENS, INITIAL_CASH, INITIAL_GRID_SIZE } from '@/utils/gameConstants';
import { calculateTotalMiningRate } from '@/utils/gameCalculations';

export function useGameState() {
  const { toast } = useToast();
  const showToast = useCallback((title: string, description: string, variant?: 'default' | 'destructive') => {
    toast({ title, description, variant });
  }, [toast]);

  // Core game state
  const [cash, setCash] = useState(INITIAL_CASH);
  const [gridWidth, setGridWidth] = useState(INITIAL_GRID_SIZE);
  const [gridHeight, setGridHeight] = useState(INITIAL_GRID_SIZE);
  const [tutorialStep, setTutorialStep] = useState(-1);
  const [lastSaveTime, setLastSaveTime] = useState(Date.now());
  const [rebirthCount, setRebirthCount] = useState(0);

  // Initialize upgrade hook first (needed by others)
  const upgradeHook = useUpgrades({
    cash,
    setCash,
    gridWidth,
    gridHeight,
    setGridWidth,
    setGridHeight,
    showToast
  });

  // Get upgrade levels
  const workerDiscountLevel = upgradeHook.getUpgradeLevel('worker-discount');
  const tokenDiscountLevel = upgradeHook.getUpgradeLevel('token-discount');
  const rebirthDiscountLevel = upgradeHook.getUpgradeLevel('rebirth-discount');

  // Initialize worker hook
  const workerHook = useWorkers({
    cash,
    setCash,
    workerDiscountLevel,
    showToast
  });

  // Initialize PC hook
  const pcHook = usePCs({
    gridWidth,
    gridHeight,
    cash,
    setCash,
    ownedWorkers: workerHook.ownedWorkers,
    showToast,
    tutorialStep,
    setTutorialStep
  });

  // Initialize token hook
  const tokenHook = useTokens({
    cash,
    setCash,
    rebirthCount,
    tokenDiscountLevel,
    showToast
  });

  // Initialize rebirth hook
  const rebirthHook = useRebirth({
    cash,
    setCash,
    ownedPCs: pcHook.ownedPCs,
    rebirthDiscountLevel,
    resetPCs: pcHook.resetPCs,
    resetWorkers: workerHook.resetWorkers,
    resetUpgrade: upgradeHook.resetUpgrade,
    setGridWidth,
    setGridHeight,
    unlockTokens: tokenHook.unlockTokens,
    showToast
  });

  // Sync rebirth count
  useEffect(() => {
    setRebirthCount(rebirthHook.rebirthCount);
  }, [rebirthHook.rebirthCount]);

  // Unlock tokens when rebirth count changes
  useEffect(() => {
    tokenHook.unlockTokens();
  }, [rebirthCount]);

  // Load game state on mount
  useEffect(() => {
    const savedState = loadGameState();

    if (savedState) {
      setCash(savedState.cash || INITIAL_CASH);
      setGridWidth(savedState.gridWidth || INITIAL_GRID_SIZE);
      setGridHeight(savedState.gridHeight || INITIAL_GRID_SIZE);
      rebirthHook.setRebirthCount(savedState.rebirthCount || 0);

      // Load PCs
      pcHook.setOwnedPCs(savedState.ownedPCs || []);

      // Load workers
      workerHook.setOwnedWorkers(savedState.ownedWorkers || []);

      // Load and sync upgrades
      const syncedUpgrades = syncUpgrades(savedState.upgrades, savedState.gridWidth, savedState.gridHeight);
      upgradeHook.setUpgrades(syncedUpgrades);

      // Load tokens
      tokenHook.setTokens(savedState.tokens || DEFAULT_TOKENS);

      // Unlock tokens based on rebirth count
      tokenHook.unlockTokens();

      // Calculate offline earnings
      if (savedState.lastLogout) {
        const offlineBoostLevel = upgradeHook.getUpgradeLevel('offline-boost');
        const earnings = calculateOfflineEarnings(
          savedState.lastLogout,
          savedState.ownedPCs || [],
          savedState.rebirthCount || 0,
          offlineBoostLevel
        );

        if (earnings > 0) {
          setCash(prev => prev + earnings);
          const timeAway = Math.floor((Date.now() - savedState.lastLogout) / 1000 / 60);
          showToast(
            'Welcome Back!',
            `You were away for ${timeAway} minutes and earned $${earnings.toLocaleString()} offline.`
          );
        }
      }
    } else {
      // New game - initialize with defaults
      upgradeHook.setUpgrades(DEFAULT_UPGRADES);
      tokenHook.setTokens(DEFAULT_TOKENS);
      tokenHook.unlockTokens();
    }
  }, []);

  // Auto-save every 30 seconds
  useEffect(() => {
    const saveInterval = setInterval(() => {
      const gameState = {
        gameVersion: 2,
        cash,
        totalMined: 0,
        gridWidth,
        gridHeight,
        rebirthCount: rebirthHook.rebirthCount,
        ownedPCs: pcHook.ownedPCs,
        ownedWorkers: workerHook.ownedWorkers,
        upgrades: upgradeHook.upgrades,
        tokens: tokenHook.tokens,
        activeToken: 'bitblitz',
        lastLogout: Date.now()
      };

      saveGameState(gameState);
      setLastSaveTime(Date.now());
    }, 30000);

    return () => clearInterval(saveInterval);
  }, [cash, gridWidth, gridHeight, rebirthHook.rebirthCount, pcHook.ownedPCs, workerHook.ownedWorkers, upgradeHook.upgrades, tokenHook.tokens]);

  // Save on window unload
  useEffect(() => {
    const handleUnload = () => {
      const gameState = {
        gameVersion: 2,
        cash,
        totalMined: 0,
        gridWidth,
        gridHeight,
        rebirthCount: rebirthHook.rebirthCount,
        ownedPCs: pcHook.ownedPCs,
        ownedWorkers: workerHook.ownedWorkers,
        upgrades: upgradeHook.upgrades,
        tokens: tokenHook.tokens,
        activeToken: 'bitblitz',
        lastLogout: Date.now()
      };

      saveGameState(gameState);
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, [cash, gridWidth, gridHeight, rebirthHook.rebirthCount, pcHook.ownedPCs, workerHook.ownedWorkers, upgradeHook.upgrades, tokenHook.tokens]);

  // Get total mining rate
  const getTotalMiningRate = () => {
    const miningSpeedLevel = upgradeHook.getUpgradeLevel('mining-speed');
    return calculateTotalMiningRate(pcHook.ownedPCs, tokenHook.tokens, miningSpeedLevel);
  };

  return {
    // Core state
    cash,
    setCash,
    gridWidth,
    gridHeight,
    tutorialStep,
    setTutorialStep,
    lastSaveTime,

    // Hooks
    ...pcHook,
    ...workerHook,
    ...upgradeHook,
    ...tokenHook,
    ...rebirthHook,

    // Utilities
    showToast,
    getTotalMiningRate,
    workerDiscountLevel
  };
}
