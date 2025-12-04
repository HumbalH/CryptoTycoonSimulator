import { useEffect, useState } from 'react';
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
  const showToast = (title: string, description: string, variant?: 'default' | 'destructive') => {
    toast({ title, description, variant });
  };

  // Core game state
  const [cash, setCash] = useState(INITIAL_CASH);
  const [gridWidth, setGridWidth] = useState(INITIAL_GRID_SIZE);
  const [gridHeight, setGridHeight] = useState(INITIAL_GRID_SIZE);
  const [tutorialStep, setTutorialStep] = useState(-1);
  const [lastSaveTime, setLastSaveTime] = useState(Date.now());

  // Initialize hooks
  const workerHook = useWorkers({
    cash,
    setCash,
    workerDiscountLevel: 0,
    showToast
  });

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

  const upgradeHook = useUpgrades({
    cash,
    setCash,
    gridWidth,
    gridHeight,
    setGridWidth,
    setGridHeight,
    showToast
  });

  const tokenHook = useTokens({
    cash,
    setCash,
    rebirthCount: 0,
    tokenDiscountLevel: upgradeHook.getUpgradeLevel('token-discount'),
    showToast
  });

  const rebirthHook = useRebirth({
    cash,
    setCash,
    ownedPCs: pcHook.ownedPCs,
    rebirthDiscountLevel: upgradeHook.getUpgradeLevel('rebirth-discount'),
    resetPCs: pcHook.resetPCs,
    resetWorkers: workerHook.resetWorkers,
    resetUpgrade: upgradeHook.resetUpgrade,
    setGridWidth,
    setGridHeight,
    unlockTokens: tokenHook.unlockTokens,
    showToast
  });

  // Update worker hook with current discount level
  const workerDiscountLevel = upgradeHook.getUpgradeLevel('worker-discount');

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
