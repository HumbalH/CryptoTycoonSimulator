import { useState, useCallback } from 'react';
import type { Token } from '@/types/game';

interface UseTokensProps {
  cash: number;
  setCash: (cash: number) => void;
  rebirthCount: number;
  tokenDiscountLevel: number;
  showToast: (title: string, description: string, variant?: 'default' | 'destructive') => void;
}

export function useTokens({
  cash,
  setCash,
  rebirthCount,
  tokenDiscountLevel,
  showToast
}: UseTokensProps) {
  const [tokens, setTokens] = useState<Token[]>([]);

  /**
   * Purchase a token
   */
  const purchaseToken = useCallback((token: Token) => {
    if (!token.unlocked) {
      showToast('Token Locked', 'This token is not yet unlocked.', 'destructive');
      return;
    }

    const discount = 1 - (tokenDiscountLevel * 0.1);
    const finalCost = Math.floor(token.basePrice * discount);

    if (cash < finalCost) {
      showToast('Insufficient Cash', 'You do not have enough cash to purchase this token.', 'destructive');
      return;
    }

    // Increase token value
    setTokens(prev => prev.map(t => {
      if (t.id === token.id) {
        return {
          ...t,
          value: t.value + 5
        };
      }
      return t;
    }));

    setCash(cash - finalCost);
    showToast('Token Purchased!', `${token.name} value increased by $5.`);
  }, [cash, setCash, tokenDiscountLevel, showToast]);

  /**
   * Unlock tokens based on rebirth count
   */
  const unlockTokens = useCallback(() => {
    setTokens(prev => prev.map(token => {
      // Token unlock logic based on rebirth count
      if (token.id === 'bitblitz' || token.id === 'gala') {
        return { ...token, unlocked: true };
      }
      if (token.id === 'bene' && rebirthCount >= 1) {
        return { ...token, unlocked: true };
      }
      if (token.id === 'sol' && rebirthCount >= 2) {
        return { ...token, unlocked: true };
      }
      if (token.id === 'eth' && rebirthCount >= 3) {
        return { ...token, unlocked: true };
      }
      if (token.id === 'btc' && rebirthCount >= 4) {
        return { ...token, unlocked: true };
      }
      return token;
    }));
  }, [rebirthCount]);

  /**
   * Get token value by name
   */
  const getTokenValue = useCallback((tokenName: string): number => {
    return tokens.find(t => t.name === tokenName)?.value || 10;
  }, [tokens]);

  return {
    tokens,
    setTokens,
    purchaseToken,
    unlockTokens,
    getTokenValue
  };
}
