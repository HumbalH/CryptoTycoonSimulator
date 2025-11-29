import PCCard from '../PCCard';
import { useState } from 'react';

export default function PCCardExample() {
  const [cash, setCash] = useState(50000);
  
  const pcs = [
    {
      id: "budget",
      name: "Budget Rig",
      description: "Entry-level mining setup",
      cost: 1000,
      miningRate: 10,
      level: 2,
      unlocked: true,
      icon: "budget" as const
    },
    {
      id: "gaming",
      name: "Gaming PC",
      description: "High-performance rig with RGB",
      cost: 25000,
      miningRate: 50,
      level: 0,
      unlocked: true,
      icon: "gaming" as const
    },
    {
      id: "server",
      name: "Server Rack",
      description: "Industrial-grade mining powerhouse",
      cost: 150000,
      miningRate: 300,
      level: 0,
      unlocked: false,
      icon: "server" as const
    }
  ];

  const handlePurchase = (pcId: string) => {
    const pc = pcs.find(p => p.id === pcId);
    if (pc && cash >= pc.cost) {
      setCash(cash - pc.cost);
      console.log(`Purchased ${pc.name}`);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-background">
      {pcs.map(pc => (
        <PCCard 
          key={pc.id}
          pc={pc}
          canAfford={cash >= pc.cost}
          onPurchase={handlePurchase}
        />
      ))}
    </div>
  );
}
