import UpgradeCard from '../UpgradeCard';
import { useState } from 'react';

export default function UpgradeCardExample() {
  const [cash, setCash] = useState(50000);
  
  const upgrades = [
    {
      id: "mining-speed",
      name: "Overclocking",
      description: "Increase mining speed for all PCs",
      cost: 10000,
      currentLevel: 2,
      maxLevel: 10,
      effect: "+10% mining speed per level",
      unlocked: true,
      category: "mining" as const
    },
    {
      id: "worker-discount",
      name: "Recruitment Program",
      description: "Reduce worker hiring costs",
      cost: 25000,
      currentLevel: 0,
      maxLevel: 5,
      effect: "-15% worker cost per level",
      unlocked: true,
      category: "economy" as const
    },
    {
      id: "room-space",
      name: "Expand Base",
      description: "Unlock larger mining area",
      cost: 50000,
      currentLevel: 1,
      maxLevel: 3,
      effect: "+1 grid space per level",
      unlocked: false,
      category: "expansion" as const
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
