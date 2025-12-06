import CelebrityVisitModal from '../CelebrityVisitModal';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function CelebrityVisitModalExample() {
  const [open, setOpen] = useState(false);
  
  const celebrity = {
    id: 'elon',
    name: 'Crypto King',
    title: 'Legendary Investor',
    bonus: 500000,
    boostDuration: 30,
    boostMultiplier: 2
  };

  return (
    <div className="p-4 bg-background">
      <Button onClick={() => setOpen(true)} data-testid="button-trigger-celebrity">
        Trigger Celebrity Visit
      </Button>
      <CelebrityVisitModal 
        open={open}
        celebrity={celebrity}
        onClose={() => setOpen(false)}
        onClaim={() => console.log('Claimed celebrity bonus!')}
        onStartMinigame={() => console.log('Started minigame challenge!')}
      />
    </div>
  );
}
