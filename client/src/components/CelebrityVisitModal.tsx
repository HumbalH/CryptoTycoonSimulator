import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, DollarSign, Zap } from "lucide-react";

export interface Celebrity {
  id: string;
  name: string;
  title: string;
  bonus: number;
  boostDuration?: number;
  boostMultiplier?: number;
}

interface CelebrityVisitModalProps {
  open: boolean;
  celebrity: Celebrity | null;
  onClose: () => void;
  onClaim: () => void;
}

const celebEmojis = ["🌟", "💫", "⭐", "🎭", "👑"];

export default function CelebrityVisitModal({ open, celebrity, onClose, onClaim }: CelebrityVisitModalProps) {
  if (!celebrity) return null;

  const handleClaim = () => {
    onClaim();
    onClose();
  };

  const formatBonus = (bonus: number) => {
    if (bonus >= 1000000) return `$${(bonus / 1000000).toFixed(1)}M`;
    if (bonus >= 1000) return `$${(bonus / 1000).toFixed(1)}K`;
    return `$${bonus}`;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto" data-testid="celebrity-visit-modal">
        <DialogHeader>
          <div className="flex items-center justify-center mb-2 lg:mb-4">
            <div className="p-3 lg:p-4 rounded-full bg-primary/10 border-2 border-primary">
              <span className="text-4xl lg:text-6xl">{celebEmojis[Math.floor(Math.random() * celebEmojis.length)]}</span>
            </div>
          </div>
          <DialogTitle className="text-center text-xl lg:text-2xl font-bold font-mono">
            {celebrity.name} Visits!
          </DialogTitle>
          <DialogDescription className="text-center text-sm lg:text-base">
            {celebrity.title}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 lg:space-y-4 py-2 lg:py-4">
          <div className="flex flex-col items-center gap-2 lg:gap-3">
            <Badge variant="default" className="text-base lg:text-lg px-3 py-1.5 lg:px-4 lg:py-2 gap-2">
              <DollarSign className="h-4 w-4 lg:h-5 lg:w-5" />
              <span className="font-bold font-mono">{formatBonus(celebrity.bonus)} Bonus!</span>
            </Badge>
            
            {celebrity.boostDuration && celebrity.boostMultiplier && (
              <Badge variant="outline" className="gap-2 text-xs lg:text-sm">
                <Zap className="h-3 w-3 lg:h-4 lg:w-4" />
                <span>
                  {celebrity.boostMultiplier}x boost for {celebrity.boostDuration}s
                </span>
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-center gap-1 text-yellow-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 lg:h-5 lg:w-5 fill-current" />
            ))}
          </div>

          <Button 
            className="w-full" 
            size="lg"
            onClick={handleClaim}
            data-testid="button-claim-celebrity"
          >
            Claim Reward
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
