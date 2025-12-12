import { useState, useCallback } from 'react';
import type { OwnedPC, PCType, OwnedWorker } from '@/types/game';
import { checkWorkerRequirements } from '@/utils/gameCalculations';

interface UsePCsProps {
  gridWidth: number;
  gridHeight: number;
  cash: number;
  setCash: (cash: number) => void;
  ownedWorkers: OwnedWorker[];
  showToast: (title: string, description: string, variant?: 'default' | 'destructive') => void;
  tutorialStep?: number;
  setTutorialStep?: (step: number) => void;
}

export function usePCs({
  gridWidth,
  gridHeight,
  cash,
  setCash,
  ownedWorkers,
  showToast,
  tutorialStep,
  setTutorialStep
}: UsePCsProps) {
  const [ownedPCs, setOwnedPCs] = useState<OwnedPC[]>([]);
  const [selectedPC, setSelectedPC] = useState<OwnedPC | null>(null);

  /**
   * Find an available grid position for a new PC
   */
  const findAvailablePosition = useCallback((): [number, number, number] | null => {
    // PC grid coordinates match floor: x: -5 to 15, z: 12 to 28
    // Grid cells are 2 units apart
    const gridStartX = -5;
    const gridStartZ = 12;

    for (let z = gridStartZ; z < gridStartZ + gridHeight * 2; z += 2) {
      for (let x = gridStartX; x < gridStartX + gridWidth * 2; x += 2) {
        const occupied = ownedPCs.some(
          pc => Math.abs(pc.position[0] - x) < 0.5 && Math.abs(pc.position[2] - z) < 0.5
        );

        if (!occupied) {
          return [x, 0.1, z];
        }
      }
    }

    return null;
  }, [gridWidth, gridHeight, ownedPCs]);

  /**
   * Purchase a PC
   */
  const purchasePC = useCallback((pcType: PCType) => {
    // Check worker requirements
    const hasRequirements = checkWorkerRequirements(pcType.id, ownedPCs, ownedWorkers);
    
    if (!hasRequirements) {
      let requiredWorker = '';
      let tier = 0;

      if (pcType.id === 'budget' || pcType.id === 'gaming') {
        requiredWorker = 'Technician';
        tier = 1;
      } else if (pcType.id === 'server' || pcType.id === 'asic') {
        requiredWorker = 'Engineer';
        tier = 2;
      } else if (pcType.id === 'quantum' || pcType.id === 'supercomputer') {
        requiredWorker = 'Expert';
        tier = 3;
      }

      showToast(
        'Worker Required',
        `You need to hire a ${requiredWorker} before purchasing this Tier ${tier} PC.`,
        'destructive'
      );
      return;
    }

    if (cash < pcType.cost) {
      showToast('Insufficient Cash', 'You do not have enough cash to purchase this PC.', 'destructive');
      return;
    }

    const position = findAvailablePosition();
    if (!position) {
      showToast('No Space Available', 'Your grid is full! Upgrade your room space to place more PCs.', 'destructive');
      return;
    }

    const newPC: OwnedPC = {
      id: Math.random().toString(36).substring(7),
      type: pcType,
      position: position,
      lastCollectedTime: Date.now(),
      token: pcType.tokenEarned,
      pendingEarnings: 0
    };

    setOwnedPCs(prev => [...prev, newPC]);
    setCash(cash - pcType.cost);

    showToast('PC Purchased!', `You bought a ${pcType.name} for $${pcType.cost.toLocaleString()}.`);

    // Tutorial progression
    if (tutorialStep === 0 && setTutorialStep) {
      setTutorialStep(1);
    }
  }, [cash, setCash, ownedPCs, ownedWorkers, gridWidth, gridHeight, findAvailablePosition, showToast, tutorialStep, setTutorialStep]);

  /**
   * Remove a PC
   */
  const removePC = useCallback((pcToRemove: OwnedPC) => {
    setOwnedPCs(prev => prev.filter(pc => pc.id !== pcToRemove.id));
    
    if (selectedPC?.id === pcToRemove.id) {
      setSelectedPC(null);
    }

    showToast('PC Removed', `You removed the ${pcToRemove.type.name}.`);
  }, [selectedPC, showToast]);

  /**
   * Collect earnings from a specific PC
   */
  const collectPCEarnings = useCallback((
    pc: OwnedPC,
    tokens: any[],
    miningSpeedLevel: number,
    rebirthCount: number
  ): number => {
    const timeSinceCollected = (Date.now() - pc.lastCollectedTime) / 1000;

    const baseTokensPerSecond = pc.type.miningRate;
    const speedMultiplier = 1 + (miningSpeedLevel * 0.2);
    const tokensPerSecond = baseTokensPerSecond * speedMultiplier;

    const tokensEarned = tokensPerSecond * timeSinceCollected;

    const tokenValue = tokens.find(t => t.name === pc.type.tokenEarned)?.value || 10;
    const rebirthMultiplier = 1 + (rebirthCount * 0.1);
    const cashEarned = Math.floor(tokensEarned * tokenValue * rebirthMultiplier);

    // Update last collected time
    setOwnedPCs(prev => prev.map(p => 
      p.id === pc.id ? { ...p, lastCollectedTime: Date.now() } : p
    ));

    return cashEarned;
  }, []);

  /**
   * Collect earnings from all PCs
   */
  const collectAllEarnings = useCallback((
    tokens: any[],
    miningSpeedLevel: number,
    rebirthCount: number
  ): number => {
    let totalEarnings = 0;

    ownedPCs.forEach(pc => {
      const earnings = collectPCEarnings(pc, tokens, miningSpeedLevel, rebirthCount);
      totalEarnings += earnings;
    });

    return totalEarnings;
  }, [ownedPCs, collectPCEarnings]);

  /**
   * Reset all PCs (for rebirth)
   */
  const resetPCs = useCallback(() => {
    setOwnedPCs([]);
    setSelectedPC(null);
  }, []);

  return {
    ownedPCs,
    setOwnedPCs,
    selectedPC,
    setSelectedPC,
    purchasePC,
    removePC,
    collectPCEarnings,
    collectAllEarnings,
    resetPCs
  };
}
