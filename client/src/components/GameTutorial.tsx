import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronRight } from 'lucide-react';

interface GameTutorialProps {
  isOpen: boolean;
  onComplete: () => void;
  currentStep: number;
  onNext: () => void;
  onSkip: () => void;
}

export default function GameTutorial({ isOpen, onComplete, currentStep, onNext, onSkip }: GameTutorialProps) {
  const steps = [
    {
      title: "Welcome to Crypto Mining Tycoon!",
      description: "Let's learn how to build your mining empire. First, you'll need to buy a PC to start mining.",
      highlight: "You have 5 Budget Rigs you can buy on the left panel. Click 'Buy' on a Budget Rig to purchase one for $3,000.",
      cta: "Buy Your First PC"
    },
    {
      title: "Buying a Worker",
      description: "Now that you have a PC, you need a worker to manage it! Workers are essential for running your mining operation.",
      highlight: "Look at the 'Workers' section on the left panel. Click 'Hire' on a Technician to hire your first worker for $15,000.",
      cta: "Hire Your First Worker"
    },
    {
      title: "Collecting Money",
      description: "Your PCs are earning money! Now you need to collect it manually by clicking on the PCs in the mining farm.",
      highlight: "Click on any PC in the 3D mining farm view to collect the coins. The coins will be automatically added to your cash.",
      cta: "Collect Your First Coins"
    },
    {
      title: "Offline Earnings",
      description: "Your mining operation works even when you're away! When you come back, you'll earn passive income.",
      highlight: "When you close the game and return later, you'll automatically earn 10% of your normal mining rate for up to 24 hours offline. No need to log in constantly!",
      cta: "Got It!"
    },
    {
      title: "Tips for Success",
      description: "Here are some key tips to help you progress:",
      highlight: "• Expand your farm by buying land upgrades\n• Switch between different tokens to maximize profits\n• Hire workers to unlock higher-tier PCs\n• Buy the Auto-Collection upgrade eventually to collect passively\n• Rebirth when you have enough cash for permanent multipliers",
      cta: "Start Mining!"
    }
  ];

  const step = steps[currentStep];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onSkip()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{step.title}</DialogTitle>
          <DialogDescription>{step.description}</DialogDescription>
        </DialogHeader>
        
        <div className="bg-muted/50 rounded-lg p-4 border border-primary/30 my-4">
          <p className="text-sm whitespace-pre-line">{step.highlight}</p>
        </div>

        <DialogFooter className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={onSkip}
            data-testid="button-skip-tutorial"
          >
            Skip Tutorial
          </Button>
          <Button 
            onClick={currentStep === steps.length - 1 ? onComplete : onNext}
            data-testid="button-next-tutorial"
            className="gap-2"
          >
            {currentStep === steps.length - 1 ? (
              "Start Playing"
            ) : (
              <>
                {step.cta}
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </DialogFooter>

        <div className="flex gap-1 justify-center mt-4">
          {steps.map((_, i) => (
            <div 
              key={i} 
              className={`h-1 flex-1 rounded-full ${i <= currentStep ? 'bg-primary' : 'bg-muted'}`}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
