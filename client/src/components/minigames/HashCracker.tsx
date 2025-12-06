import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface HashCrackerProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (success: boolean, score: number) => void;
}

export default function HashCracker({ isOpen, onClose, onComplete }: HashCrackerProps) {
  const [clicks, setClicks] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isActive, setIsActive] = useState(false);
  const targetClicks = 50;

  useEffect(() => {
    if (isOpen && !isActive) {
      setClicks(0);
      setTimeLeft(10);
      setIsActive(true);
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
      const success = clicks >= targetClicks;
      setTimeout(() => onComplete(success, clicks), 500);
    }
  }, [timeLeft, isActive]);

  const handleClick = () => {
    if (isActive && timeLeft > 0) {
      const newClicks = clicks + 1;
      setClicks(newClicks);
      
      if (newClicks >= targetClicks) {
        setIsActive(false);
        setTimeout(() => onComplete(true, newClicks), 500);
      }
    }
  };

  const progress = (clicks / targetClicks) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">🔓</span>
            Hash Cracker
          </DialogTitle>
          <DialogDescription>
            Click rapidly to crack the hash before time runs out!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="text-center space-y-2">
            <div className="text-5xl font-bold font-mono text-primary">
              {timeLeft}s
            </div>
            <div className="text-sm text-muted-foreground">Time Remaining</div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span className="font-mono">{clicks} / {targetClicks}</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>

          <Button
            onClick={handleClick}
            disabled={!isActive || timeLeft <= 0}
            className="w-full h-32 text-2xl font-bold"
            variant={isActive ? "default" : "secondary"}
          >
            {isActive ? '💥 CRACK! 💥' : timeLeft <= 0 ? '⏱️ TIME UP!' : 'START'}
          </Button>

          {!isActive && timeLeft <= 0 && (
            <div className={`text-center text-lg font-bold ${clicks >= targetClicks ? 'text-green-500' : 'text-destructive'}`}>
              {clicks >= targetClicks ? '✅ Hash Cracked!' : '❌ Failed to crack!'}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
