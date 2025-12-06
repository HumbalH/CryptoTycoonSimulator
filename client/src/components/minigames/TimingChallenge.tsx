import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';

interface TimingChallengeProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (success: boolean, accuracy: number) => void;
}

export default function TimingChallenge({ isOpen, onClose, onComplete }: TimingChallengeProps) {
  const [position, setPosition] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [result, setResult] = useState<'perfect' | 'good' | 'miss' | null>(null);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  const maxRounds = 3;
  const speed = 0.5; // Slower, more predictable movement
  const targetStart = 45;
  const targetEnd = 55;
  const perfectZoneStart = 48;
  const perfectZoneEnd = 52;

  useEffect(() => {
    if (isOpen && !gameStarted) {
      setPosition(0);
      setClicked(false);
      setResult(null);
      setRound(1);
      setScore(0);
      setIsMoving(true);
      setGameStarted(true);
    } else if (!isOpen && gameStarted) {
      setGameStarted(false);
    }
  }, [isOpen, gameStarted]);

  useEffect(() => {
    if (!isMoving || clicked) return;

    const interval = setInterval(() => {
      setPosition(prev => {
        const next = prev + speed;
        if (next >= 100) {
          // Auto-miss if reached the end
          setClicked(true);
          setIsMoving(false);
          setResult('miss');
          return 100;
        }
        return next;
      });
    }, 20);

    return () => clearInterval(interval);
  }, [isMoving, clicked]);

  // Handle auto-miss progression
  useEffect(() => {
    if (position >= 100 && clicked && result === 'miss') {
      const timer = setTimeout(() => {
        if (round >= maxRounds) {
          const success = score >= 200;
          const accuracy = score / (maxRounds * 100);
          onComplete(success, accuracy);
        } else {
          setRound(round + 1);
          startNewRound();
        }
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [position, clicked, result, round, score]);

  const startNewRound = () => {
    setPosition(0);
    setClicked(false);
    setResult(null);
    setIsMoving(true);
  };

  const handleClick = () => {
    if (clicked || !isMoving) return;

    setClicked(true);
    setIsMoving(false);

    // Compensate for reaction time lag by checking a bit behind
    const compensatedPosition = position - 1.5; // Account for visual lag

    let roundResult: 'perfect' | 'good' | 'miss';
    let points = 0;

    if (compensatedPosition >= perfectZoneStart && compensatedPosition <= perfectZoneEnd) {
      roundResult = 'perfect';
      points = 100;
    } else if (compensatedPosition >= targetStart && compensatedPosition <= targetEnd) {
      roundResult = 'good';
      points = 50;
    } else {
      roundResult = 'miss';
      points = 0;
    }

    setResult(roundResult);
    const newScore = score + points;
    setScore(newScore);

    // Handle progression
    setTimeout(() => {
      if (round >= maxRounds) {
        const success = newScore >= 200;
        const accuracy = newScore / (maxRounds * 100);
        onComplete(success, accuracy);
      } else {
        setRound(round + 1);
        startNewRound();
      }
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">⏱️</span>
            Perfect Timing
          </DialogTitle>
          <DialogDescription>
            Click when the bar reaches the green zone! Score 200+ to win.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex justify-between text-sm">
            <span>Round: <span className="font-mono font-bold">{round}/{maxRounds}</span></span>
            <span>Score: <span className="font-mono font-bold">{score}</span></span>
          </div>

          <div className="space-y-4">
            {/* Timing Bar */}
            <div className="relative h-16 bg-card border-2 border-border rounded-lg overflow-hidden">
              {/* Perfect Zone */}
              <div 
                className="absolute top-0 bottom-0 bg-green-500/30 border-x-2 border-green-500"
                style={{ left: `${perfectZoneStart}%`, width: `${perfectZoneEnd - perfectZoneStart}%` }}
              />
              
              {/* Good Zone */}
              <div 
                className="absolute top-0 bottom-0 bg-yellow-500/20 border-x-2 border-yellow-500"
                style={{ left: `${targetStart}%`, width: `${targetEnd - targetStart}%` }}
              />

              {/* Moving Indicator */}
              <div 
                className="absolute top-0 bottom-0 w-1 bg-primary"
                style={{ left: `${position}%` }}
              />
            </div>

            <div className="text-xs text-center text-muted-foreground">
              Green = Perfect (100 pts) | Yellow = Good (50 pts) | Red = Miss (0 pts)
            </div>
          </div>

          <button
            onClick={handleClick}
            disabled={!isMoving || clicked}
            className={`w-full h-24 text-2xl font-bold rounded-lg transition-all ${
              !isMoving || clicked
                ? 'bg-secondary/20 cursor-not-allowed'
                : 'bg-primary hover:bg-primary/90 text-primary-foreground'
            }`}
          >
            {isMoving && !clicked ? '⚡ CLICK NOW! ⚡' : 'Wait...'}
          </button>

          {result && (
            <div className={`text-center text-xl font-bold ${
              result === 'perfect' ? 'text-green-500' :
              result === 'good' ? 'text-yellow-500' :
              'text-destructive'
            }`}>
              {result === 'perfect' && '🎯 PERFECT! +100'}
              {result === 'good' && '✓ Good! +50'}
              {result === 'miss' && '✗ Missed! +0'}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
