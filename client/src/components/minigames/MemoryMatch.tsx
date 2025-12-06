import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

// Using actual token symbols from the game: BitBlitz, GALA, BENE, SOL, ETH, BTC
const CRYPTO_SYMBOLS = ['BitBlitz', 'GALA', 'BENE', 'SOL', 'ETH', 'BTC'];

interface Card {
  id: number;
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface MemoryMatchProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (success: boolean, moves: number) => void;
}

export default function MemoryMatch({ isOpen, onClose, onComplete }: MemoryMatchProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isActive, setIsActive] = useState(false);

  const totalPairs = 6;

  useEffect(() => {
    if (isOpen && cards.length === 0) {
      initializeGame();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive]);

  // Check for time up
  useEffect(() => {
    if (timeLeft === 0 && !isActive) {
      const success = matchedPairs === totalPairs;
      setTimeout(() => onComplete(success, moves), 500);
    }
  }, [timeLeft, isActive]);

  useEffect(() => {
    if (matchedPairs === totalPairs && isActive) {
      setIsActive(false);
      setTimeout(() => onComplete(true, moves), 500);
    }
  }, [matchedPairs, isActive, moves, onComplete]);

  const initializeGame = () => {
    const symbols = CRYPTO_SYMBOLS.slice(0, totalPairs);
    const pairs = [...symbols, ...symbols];
    const shuffled = pairs
      .map((symbol, index) => ({
        id: index,
        symbol,
        isFlipped: false,
        isMatched: false,
      }))
      .sort(() => Math.random() - 0.5);

    setCards(shuffled);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setTimeLeft(30);
    setIsActive(true);
  };

  const handleCardClick = (cardId: number) => {
    if (!isActive || timeLeft <= 0) return;
    if (flippedCards.length === 2) return;
    if (flippedCards.includes(cardId)) return;
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isMatched) return;

    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);

    // Update card to show it's flipped
    setCards(prev => prev.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    ));

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [first, second] = newFlipped;
      const firstCard = cards.find(c => c.id === first);
      const secondCard = cards.find(c => c.id === second);
      
      if (firstCard && secondCard && firstCard.symbol === secondCard.symbol) {
        // Match found
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            card.id === first || card.id === second
              ? { ...card, isMatched: true, isFlipped: false }
              : card
          ));
          setMatchedPairs(p => p + 1);
          setFlippedCards([]);
        }, 300);
      } else {
        // No match - flip back after delay
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            card.id === first || card.id === second
              ? { ...card, isFlipped: false }
              : card
          ));
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">🧠</span>
            Crypto Memory
          </DialogTitle>
          <DialogDescription>
            Match all the crypto pairs before time runs out!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex justify-between text-sm">
            <span>Time: <span className="font-mono font-bold">{timeLeft}s</span></span>
            <span>Moves: <span className="font-mono font-bold">{moves}</span></span>
            <span>Pairs: <span className="font-mono font-bold">{matchedPairs}/{totalPairs}</span></span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {cards.map((card) => (
              <button
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                disabled={!isActive || card.isMatched || card.isFlipped}
                className={`aspect-square text-xs font-bold rounded-lg transition-all transform flex items-center justify-center ${
                  card.isMatched
                    ? 'bg-green-500/20 border-2 border-green-500'
                    : card.isFlipped
                    ? 'bg-primary/20 border-2 border-primary'
                    : 'bg-card border-2 border-border hover:border-primary hover:scale-105'
                } ${!isActive ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {card.isMatched || card.isFlipped ? <span className="text-center leading-tight">{card.symbol}</span> : <span className="text-4xl">?</span>}
              </button>
            ))}
          </div>

          {!isActive && timeLeft <= 0 && (
            <div className={`text-center text-lg font-bold ${matchedPairs === totalPairs ? 'text-green-500' : 'text-destructive'}`}>
              {matchedPairs === totalPairs ? '✅ All pairs matched!' : '❌ Time up!'}
            </div>
          )}
          
          {!isActive && matchedPairs === totalPairs && timeLeft > 0 && (
            <div className="text-center text-lg font-bold text-green-500">
              ✅ Perfect! Completed in {moves} moves!
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
