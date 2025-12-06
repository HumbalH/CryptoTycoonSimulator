import { useEffect, useState } from 'react';
import { DollarSign } from 'lucide-react';

interface FloatingCash {
  id: string;
  amount: number;
  startX: number;
  startY: number;
}

interface CashFloatingEffectProps {
  floatingCash: FloatingCash[];
  onComplete: (id: string) => void;
}

export default function CashFloatingEffect({ floatingCash, onComplete }: CashFloatingEffectProps) {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {floatingCash.map((cash) => (
        <FloatingCashItem
          key={cash.id}
          cash={cash}
          onComplete={onComplete}
        />
      ))}
    </div>
  );
}

function FloatingCashItem({ 
  cash, 
  onComplete 
}: { 
  cash: FloatingCash; 
  onComplete: (id: string) => void;
}) {
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
      onComplete(cash.id);
    }, 1000); // Animation duration

    return () => clearTimeout(timer);
  }, [cash.id, onComplete]);

  if (!isAnimating) return null;

  return (
    <div
      className="absolute animate-float-to-top"
      style={{
        left: `${cash.startX}px`,
        top: `${cash.startY}px`,
        animation: 'floatToTop 1s ease-out forwards',
      }}
    >
      <div className="flex items-center gap-1 bg-green-500/90 text-white px-3 py-1.5 rounded-full shadow-lg font-bold text-sm backdrop-blur-sm border-2 border-green-300">
        <DollarSign className="w-4 h-4" />
        <span>+{cash.amount.toLocaleString()}</span>
      </div>
    </div>
  );
}
