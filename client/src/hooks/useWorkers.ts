import { useState, useCallback } from 'react';
import type { OwnedWorker, WorkerType } from '@/types/game';

interface UseWorkersProps {
  cash: number;
  setCash: (cash: number) => void;
  workerDiscountLevel: number;
  showToast: (title: string, description: string, variant?: 'default' | 'destructive') => void;
}

export function useWorkers({
  cash,
  setCash,
  workerDiscountLevel,
  showToast
}: UseWorkersProps) {
  const [ownedWorkers, setOwnedWorkers] = useState<OwnedWorker[]>([]);

  /**
   * Purchase a worker
   */
  const purchaseWorker = useCallback((workerType: WorkerType) => {
    const discount = 1 - (workerDiscountLevel * 0.05);
    const finalCost = Math.floor(workerType.cost * discount);

    if (cash < finalCost) {
      showToast('Insufficient Cash', 'You do not have enough cash to hire this worker.', 'destructive');
      return;
    }

    const newWorker: OwnedWorker = {
      id: Math.random().toString(36).substring(7),
      type: workerType.id
    };

    setOwnedWorkers(prev => [...prev, newWorker]);
    setCash(cash - finalCost);

    showToast('Worker Hired!', `You hired a ${workerType.name} for $${finalCost.toLocaleString()}.`);
  }, [cash, setCash, workerDiscountLevel, showToast]);

  /**
   * Remove a worker
   */
  const removeWorker = useCallback((workerId: string) => {
    setOwnedWorkers(prev => prev.filter(w => w.id !== workerId));
    showToast('Worker Removed', 'The worker has been removed.');
  }, [showToast]);

  /**
   * Reset all workers (for rebirth)
   */
  const resetWorkers = useCallback(() => {
    setOwnedWorkers([]);
  }, []);

  return {
    ownedWorkers,
    setOwnedWorkers,
    purchaseWorker,
    removeWorker,
    resetWorkers
  };
}
