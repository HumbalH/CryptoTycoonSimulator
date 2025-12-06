import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface PricePredictionProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (success: boolean, correct: boolean) => void;
}

export default function PricePrediction({ isOpen, onClose, onComplete }: PricePredictionProps) {
  const [currentPrice, setCurrentPrice] = useState(1000);
  const [priceHistory, setPriceHistory] = useState<number[]>([1000]);
  const [prediction, setPrediction] = useState<'up' | 'down' | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [finalPrice, setFinalPrice] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);

  useEffect(() => {
    if (isOpen) {
      // Reset game with pre-populated history
      const startPrice = 800 + Math.random() * 400;
      
      // Generate 10 initial data points for smoother start
      const initialHistory = [startPrice];
      let currentVal = startPrice;
      for (let i = 0; i < 9; i++) {
        const change = (Math.random() - 0.5) * 50;
        currentVal = Math.max(500, Math.min(1500, currentVal + change));
        initialHistory.push(currentVal);
      }
      
      setCurrentPrice(currentVal);
      setPriceHistory(initialHistory);
      setPrediction(null);
      setRevealed(false);
      setTimeLeft(15);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || revealed || prediction !== null || timeLeft <= 10) return;

    const interval = setInterval(() => {
      setPriceHistory(prev => {
        const lastPrice = prev[prev.length - 1];
        const change = (Math.random() - 0.5) * 100;
        const newPrice = Math.max(500, Math.min(1500, lastPrice + change));
        return [...prev, newPrice];
      });
    }, 200);

    return () => clearInterval(interval);
  }, [isOpen, revealed, prediction, timeLeft]);

  useEffect(() => {
    if (timeLeft <= 0 || !isOpen || prediction !== null) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isOpen, prediction]);

  const handlePrediction = (direction: 'up' | 'down') => {
    setPrediction(direction);
    
    // Simulate final price movement
    setTimeout(() => {
      const lastPrice = priceHistory[priceHistory.length - 1];
      const changePercent = (Math.random() - 0.3) * 0.2; // Slight bias towards up
      const newPrice = lastPrice * (1 + changePercent);
      setFinalPrice(newPrice);
      setRevealed(true);
      
      const actualDirection = newPrice > lastPrice ? 'up' : 'down';
      const isCorrect = actualDirection === direction;
      
      setTimeout(() => {
        onComplete(true, isCorrect);
      }, 2000);
    }, 1500);
  };

  const maxPrice = Math.max(...priceHistory);
  const minPrice = Math.min(...priceHistory);
  const range = maxPrice - minPrice || 100;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">📈</span>
            Price Oracle
          </DialogTitle>
          <DialogDescription>
            Predict if the price will go UP or DOWN!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="text-center space-y-2">
            <div className="text-sm text-muted-foreground">Current Price</div>
            <div className="text-4xl font-bold font-mono text-primary">
              ${priceHistory[priceHistory.length - 1]?.toFixed(2)}
            </div>
            {!prediction && (
              <div className="text-sm text-muted-foreground">
                Time to decide: {timeLeft}s
              </div>
            )}
          </div>

          {/* Price Chart */}
          <div className="h-32 bg-card border border-border rounded-lg p-2 relative overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="priceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                </linearGradient>
              </defs>
              {priceHistory.length > 1 && (
                <>
                  <polygon
                    points={priceHistory.map((price, i) => {
                      const x = (i / (priceHistory.length - 1)) * 100;
                      const y = 100 - ((price - minPrice) / range) * 100;
                      return `${x},${y}`;
                    }).join(' ') + ` 100,100 0,100`}
                    fill="url(#priceGradient)"
                  />
                  <polyline
                    points={priceHistory.map((price, i) => {
                      const x = (i / (priceHistory.length - 1)) * 100;
                      const y = 100 - ((price - minPrice) / range) * 100;
                      return `${x},${y}`;
                    }).join(' ')}
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="1"
                    vectorEffect="non-scaling-stroke"
                  />
                </>
              )}
            </svg>
          </div>

          {!prediction ? (
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => handlePrediction('up')}
                className="h-20 text-lg font-bold"
                disabled={timeLeft <= 0}
              >
                <TrendingUp className="w-6 h-6 mr-2" />
                UP
              </Button>
              <Button
                onClick={() => handlePrediction('down')}
                variant="destructive"
                className="h-20 text-lg font-bold"
                disabled={timeLeft <= 0}
              >
                <TrendingDown className="w-6 h-6 mr-2" />
                DOWN
              </Button>
            </div>
          ) : revealed ? (
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Final Price</div>
                <div className={`text-3xl font-bold font-mono ${
                  finalPrice > priceHistory[priceHistory.length - 1] ? 'text-green-500' : 'text-red-500'
                }`}>
                  ${finalPrice.toFixed(2)}
                </div>
              </div>
              <div className={`text-center text-xl font-bold ${
                (finalPrice > priceHistory[priceHistory.length - 1] && prediction === 'up') ||
                (finalPrice < priceHistory[priceHistory.length - 1] && prediction === 'down')
                  ? 'text-green-500'
                  : 'text-destructive'
              }`}>
                {(finalPrice > priceHistory[priceHistory.length - 1] && prediction === 'up') ||
                (finalPrice < priceHistory[priceHistory.length - 1] && prediction === 'down')
                  ? '✅ Correct Prediction!'
                  : '❌ Wrong Prediction!'}
              </div>
            </div>
          ) : (
            <div className="text-center text-lg font-bold text-muted-foreground animate-pulse">
              Analyzing market trends...
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
