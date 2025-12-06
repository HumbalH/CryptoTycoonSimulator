import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from 'react';
import TutorialCharacter from './TutorialCharacter';
import TutorialOverlay from './TutorialOverlay';

interface TutorialMobileProps {
  isOpen: boolean;
  onComplete: (playerName: string, avatar: string) => void;
  hasBoughtWorker: boolean;
  hasBoughtPC: boolean;
  onStepChange?: (step: number) => void;
  mobileMenuOpen?: string | null;
  onCloseSheet?: () => void;
}

export default function TutorialMobile({ 
  isOpen, 
  onComplete,
  hasBoughtWorker,
  hasBoughtPC,
  onStepChange,
  mobileMenuOpen,
  onCloseSheet
}: TutorialMobileProps) {
  const [step, setStep] = useState(0);
  const [playerName, setPlayerName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('⚡');
  const [showCharacterModal, setShowCharacterModal] = useState(false);
  const [dialogDismissed, setDialogDismissed] = useState(false);

  // Notify parent of step changes
  useEffect(() => {
    if (onStepChange) {
      onStepChange(step);
    }
  }, [step]);

  const avatars = ['⚡', '🔥', '💎', '🚀', '⭐', '🎮', '🤖', '👾'];

  // Mobile tutorial flow - simplified steps (no separate tab click steps)
  const tutorialSteps = [
    {
      type: 'story',
      message: "Welcome, traveler. I am BitAI, your AI guide. The year is 2047... and the world as we knew it has changed forever.",
      autoAdvance: false,
      unlockElements: []
    },
    {
      type: 'story',
      message: "The global financial system collapsed. Banks failed. Governments fell. Traditional money became worthless overnight. Chaos reigned...",
      autoAdvance: false,
      unlockElements: []
    },
    {
      type: 'story',
      message: "But hope emerged from the ashes. A group of rogue developers discovered the lost Bitcoin protocol - a way to restart cryptocurrency from zero.",
      autoAdvance: false,
      unlockElements: []
    },
    {
      type: 'story',
      message: "Someone must mine the first blocks. Someone must rebuild the blockchain. That someone... is YOU. But first, I need to know your name.",
      autoAdvance: false,
      showModal: true,
      unlockElements: []
    },
    {
      type: 'welcome',
      message: `Welcome, ${playerName || 'Miner'}! An anonymous benefactor has sent you $20,000 and access to this abandoned mining facility. Your mission: rebuild the financial system, one block at a time.`,
      autoAdvance: false,
      unlockElements: []
    },
    {
      type: 'guide',
      message: "First things first - you need workers to operate mining equipment. Click on the WORKERS button at the bottom and hire a Technician for $15,000.",
      highlight: 'technician-buy',
      autoAdvance: false,
      waitFor: 'worker-bought',
      unlockElements: ['workers-tab', 'technician-buy', 'technician-card', 'workers-content']
    },
    {
      type: 'guide', 
      message: "Excellent! Your technician is ready to work. Now let's get some mining equipment. Click the BUILD button and buy a Budget Rig for $1,500.",
      highlight: 'budget-rig-buy',
      autoAdvance: false,
      waitFor: 'pc-bought',
      unlockElements: ['build-tab', 'budget-rig-buy', 'budget-rig-card', 'build-content']
    },
    {
      type: 'completion',
      message: "Outstanding! Your mining operation is now live! Click on PCs in the 3D view to collect earnings. Watch for celebrity visitors - win their minigame challenges for massive bonuses. Good luck, miner!",
      autoAdvance: false,
      unlockElements: []
    }
  ];

  const currentStep = tutorialSteps[step];

  const handleNext = () => {
    if (currentStep?.showModal) {
      setShowCharacterModal(true);
    } else {
      setStep(prev => prev + 1);
    }
  };

  const handleCreateCharacter = () => {
    if (playerName.trim().length >= 2 && playerName.trim().length <= 7) {
      setShowCharacterModal(false);
      setStep(prev => prev + 1);
    }
  };

  const handleFinish = () => {
    onComplete(playerName || 'Anonymous Miner', selectedAvatar);
  };

  // Reset dialog dismissed state on step change
  useEffect(() => {
    setDialogDismissed(false);
  }, [step]);

  // Auto-advance when conditions are met
  if (currentStep?.waitFor === 'worker-bought' && hasBoughtWorker && step === 5) {
    setTimeout(() => {
      if (onCloseSheet) onCloseSheet(); // Close the workers sheet
      setStep(6);
    }, 500);
  }
  
  if (currentStep?.waitFor === 'pc-bought' && hasBoughtPC && step === 6) {
    setTimeout(() => {
      if (onCloseSheet) onCloseSheet(); // Close the build sheet
      setStep(7);
    }, 500);
  }

  if (!isOpen) return null;

  // Calculate dynamic unlock elements based on mobile sheet state
  const getDynamicUnlockElements = () => {
    if (!currentStep?.unlockElements) return [];
    
    // Step 5: Buy technician
    if (step === 5) {
      // While dialog is visible, nothing is unlocked
      if (!dialogDismissed) {
        return [];
      }
      
      // After dialog dismissed, check sheet state
      if (mobileMenuOpen === 'workers') {
        // Sheet is open, unlock the content for buying
        console.log('Step 5: Sheet open, unlocking content');
        return ['technician-buy', 'technician-card', 'workers-content'];
      } else {
        // Sheet is closed, unlock workers-tab button so they can open it
        console.log('Step 5: Sheet closed, unlocking workers-tab button');
        return ['workers-tab'];
      }
    }
    
    // Step 6: Buy PC
    if (step === 6) {
      // While dialog is visible, nothing is unlocked
      if (!dialogDismissed) {
        return [];
      }
      
      // After dialog dismissed, check sheet state
      if (mobileMenuOpen === 'build') {
        // Sheet is open, unlock the content for buying
        console.log('Step 6: Sheet open, unlocking content');
        return ['budget-rig-buy', 'budget-rig-card', 'build-content'];
      } else {
        // Sheet is closed, unlock build-tab button so they can open it
        console.log('Step 6: Sheet closed, unlocking build-tab button');
        return ['build-tab'];
      }
    }
    
    // Other steps - use default unlock elements
    return currentStep.unlockElements;
  };

  return (
    <>
      {/* Custom overlay for mobile - only darken bottom buttons after dialog dismissed */}
      {currentStep && step < tutorialSteps.length - 1 && (step === 5 || step === 6) && dialogDismissed && (
        <>
          {/* Darken non-active buttons */}
          {['build', 'upgrade', 'workers', 'tokens', 'celebrities'].map((btnType, idx) => {
            const unlocked = getDynamicUnlockElements();
            const isUnlocked = 
              (btnType === 'workers' && unlocked.includes('workers-tab')) ||
              (btnType === 'build' && unlocked.includes('build-tab'));
            
            if (isUnlocked) return null; // Don't darken unlocked buttons
            
            return (
              <div 
                key={btnType}
                className="fixed bottom-0 z-[9999] pointer-events-auto bg-black/70"
                style={{
                  left: `${idx * 20}%`,
                  width: '20%',
                  height: '80px'
                }}
                onClick={(e) => e.stopPropagation()}
              />
            );
          })}
        </>
      )}

      {/* Tutorial Overlay for non-mobile-button steps */}
      {currentStep && step < tutorialSteps.length - 1 && step !== 5 && step !== 6 && (
        <TutorialOverlay 
          highlightElement={currentStep.highlight}
          darkenRest={true}
          showArrow={!!currentStep.highlight}
          unlockElements={getDynamicUnlockElements()}
        />
      )}

      {/* Character dialog */}
      {currentStep && !showCharacterModal && !dialogDismissed && (
        <TutorialCharacter
          message={currentStep.message}
          position="left"
          dismissible={step === 5 || step === 6}
          onDismiss={() => {
            setDialogDismissed(true);
          }}
          onMessageComplete={
            currentStep.waitFor ? undefined : (step === tutorialSteps.length - 1 ? handleFinish : handleNext)
          }
          autoAdvance={currentStep.autoAdvance}
        />
      )}

      {/* Character Creation Modal */}
      <Dialog open={showCharacterModal} onOpenChange={() => {}}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto z-[10003] landscape:max-h-[85vh] landscape:p-4" style={{ pointerEvents: 'auto' }}>
          <DialogHeader className="landscape:space-y-1">
            <DialogTitle className="landscape:text-lg">Create Your Identity</DialogTitle>
            <DialogDescription className="landscape:text-xs">
              Every miner needs a name and an avatar
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 landscape:space-y-2 landscape:py-1">
            <div className="space-y-2 landscape:space-y-1">
              <Label htmlFor="player-name" className="landscape:text-xs">Your Name (2-7 characters)</Label>
              <Input
                id="player-name"
                placeholder="Enter your miner name..."
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                minLength={2}
                maxLength={7}
                className="text-lg font-mono landscape:text-sm landscape:h-8"
              />
            </div>

            <div className="space-y-2 landscape:space-y-1">
              <Label className="landscape:text-xs">Choose Your Avatar</Label>
              <div className="grid grid-cols-4 gap-2 landscape:gap-1">
                {avatars.map((avatar) => (
                  <button
                    key={avatar}
                    onClick={() => setSelectedAvatar(avatar)}
                    className={`text-4xl p-4 rounded-lg border-2 transition-all hover:scale-110 landscape:text-2xl landscape:p-2 landscape:border ${
                      selectedAvatar === avatar
                        ? 'border-primary bg-primary/10 scale-110'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="landscape:pt-2">
            <Button 
              onClick={handleCreateCharacter}
              disabled={playerName.trim().length < 2 || playerName.trim().length > 7}
              className="w-full landscape:h-8 landscape:text-sm"
            >
              Create Character
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
