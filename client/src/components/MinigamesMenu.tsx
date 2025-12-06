import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AVAILABLE_MINIGAMES } from '@/utils/minigameConstants';
import { Minigame } from '@/types/minigames';
import HashCracker from './minigames/HashCracker';
import MemoryMatch from './minigames/MemoryMatch';
import PricePrediction from './minigames/PricePrediction';
import CableConnect from './minigames/CableConnect';
import TimingChallenge from './minigames/TimingChallenge';

interface MinigamesMenuProps {
  isOpen: boolean;
  onClose: () => void;
  minigames: Minigame[];
  onGameComplete: (gameId: string, success: boolean, data: any) => void;
}

export default function MinigamesMenu({ isOpen, onClose, minigames, onGameComplete }: MinigamesMenuProps) {
  const [activeGame, setActiveGame] = useState<string | null>(null);

  const handlePlayGame = (gameId: string) => {
    setActiveGame(gameId);
  };

  const handleGameComplete = (gameId: string, success: boolean, data: any) => {
    setActiveGame(null);
    onGameComplete(gameId, success, data);
  };

  const canPlayGame = (game: Minigame) => {
    const timeSinceLastPlayed = Date.now() - game.lastPlayed;
    const cooldownMs = game.cooldown * 1000;
    return timeSinceLastPlayed >= cooldownMs;
  };

  const getCooldownRemaining = (game: Minigame) => {
    const timeSinceLastPlayed = Date.now() - game.lastPlayed;
    const cooldownMs = game.cooldown * 1000;
    const remaining = Math.max(0, cooldownMs - timeSinceLastPlayed);
    return Math.ceil(remaining / 1000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  return (
    <>
      <Dialog open={isOpen && !activeGame} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <span>🎮</span>
              Minigames
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            {minigames.map(game => {
              const available = canPlayGame(game);
              const cooldown = getCooldownRemaining(game);

              return (
                <Card key={game.id} className={!available ? 'opacity-60' : ''}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-3xl">{game.icon}</span>
                        <div>
                          <h3 className="font-bold">{game.name}</h3>
                          <p className="text-xs text-muted-foreground">{game.description}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Badge variant="outline">
                        {game.reward.type === 'cash' && `💰 $${game.reward.baseAmount.toLocaleString()}`}
                        {game.reward.type === 'multiplier' && `✨ ${game.reward.baseAmount}x for ${game.reward.duration}s`}
                        {game.reward.type === 'boost' && `⚡ ${game.reward.baseAmount}x speed for ${game.reward.duration}s`}
                      </Badge>
                    </div>

                    <Button
                      onClick={() => handlePlayGame(game.id)}
                      disabled={!available}
                      className="w-full"
                      variant={available ? "default" : "secondary"}
                    >
                      {available ? 'Play Now' : `Cooldown: ${formatTime(cooldown)}`}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* Individual Game Modals */}
      <HashCracker
        isOpen={activeGame === 'hash-cracker'}
        onClose={() => setActiveGame(null)}
        onComplete={(success, score) => handleGameComplete('hash-cracker', success, score)}
      />

      <MemoryMatch
        isOpen={activeGame === 'memory-match'}
        onClose={() => setActiveGame(null)}
        onComplete={(success, moves) => handleGameComplete('memory-match', success, moves)}
      />

      <PricePrediction
        isOpen={activeGame === 'price-prediction'}
        onClose={() => setActiveGame(null)}
        onComplete={(success, correct) => handleGameComplete('price-prediction', success, correct)}
      />

      <CableConnect
        isOpen={activeGame === 'cable-connect'}
        onClose={() => setActiveGame(null)}
        onComplete={(success, time) => handleGameComplete('cable-connect', success, time)}
      />

      <TimingChallenge
        isOpen={activeGame === 'timing-challenge'}
        onClose={() => setActiveGame(null)}
        onComplete={(success, accuracy) => handleGameComplete('timing-challenge', success, accuracy)}
      />
    </>
  );
}
