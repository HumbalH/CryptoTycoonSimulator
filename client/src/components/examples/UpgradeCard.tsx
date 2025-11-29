import UpgradeCard from '../UpgradeCard';
import { useState } from 'react';

export default function UpgradeCardExample() {
  const [cash, setCash] = useState(50000);
  
  const upgrades = [
    {
      id: "hashrate",
      name: "Hashrate Boost",
      description: "Increase mining speed for all PCs",
      cost: 10000,
      currentLevel: 2,
      maxLevel: 10,
      effect: "+15% mining rate",
      unlocked: true,
      category: "pc" as const
    },
    {
      id: "worker-speed",
      name: "Worker Efficiency",
      description: "Workers maintain PCs faster",
      cost: 25000,
      currentLevel: 0,
      maxLevel: 5,
      effect: "+20% worker speed",
      unlocked: true,
      category: "worker" as const
    },
    {
      id: "room-expansion",
      name: "Room Expansion",
      description: "Unlock larger mining area",
      cost: 50000,
      currentLevel: 1,
      maxLevel: 3,
      effect: "+5x5 grid space",
      unlocked: false,
      category: "room" as const
    }
  ];

  const handleUpgrade = (upgradeId: string) => {
    const upgrade = upgrades.find(u => u.id === upgradeId);
    if (upgrade && cash >= upgrade.cost) {
      setCash(cash - upgrade.cost);
      console.log(`Upgraded ${upgrade.name}`);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-background">
      {upgrades.map(upgrade => (
        <UpgradeCard 
          key={upgrade.id}
          upgrade={upgrade}
          canAfford={cash >= upgrade.cost}
          onPurchase={handleUpgrade}
        />
      ))}
    </div>
  );
}
