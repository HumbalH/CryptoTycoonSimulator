import UpgradeCard, { Upgrade } from './UpgradeCard';

interface UpgradesPanelProps {
  upgrades: Upgrade[];
  cash: number;
  onPurchase: (upgradeId: string) => void;
  onShowDetails: (upgrade: Upgrade) => void;
}

export default function UpgradesPanel({ upgrades, cash, onPurchase, onShowDetails }: UpgradesPanelProps) {
  const expansionUpgrades = upgrades.filter(u => u.category === 'expansion');
  const miningUpgrades = upgrades.filter(u => u.category === 'mining');
  const economyUpgrades = upgrades.filter(u => u.category === 'economy');
  const automationUpgrades = upgrades.filter(u => u.category === 'automation');

  return (
    <div className="space-y-4 overflow-y-auto max-h-[600px]">
      <div className="bg-card/60 border border-primary/20 rounded p-3">
        <p className="text-xs text-muted-foreground font-mono">
          <span className="text-primary font-bold">Upgrade System:</span> Purchase upgrades to boost your mining operation permanently.
        </p>
      </div>

      {/* Expansion */}
      {expansionUpgrades.length > 0 && (
        <div>
          <h3 className="font-bold font-mono text-sm text-muted-foreground mb-2">Expansion</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {expansionUpgrades.map(upgrade => (
              <UpgradeCard 
                key={upgrade.id}
                upgrade={upgrade}
                canAfford={cash >= upgrade.cost}
                onPurchase={onPurchase}
                onShowDetails={onShowDetails}
              />
            ))}
          </div>
        </div>
      )}

      {/* Mining */}
      {miningUpgrades.length > 0 && (
        <div>
          <h3 className="font-bold font-mono text-sm text-muted-foreground mb-2">Mining</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {miningUpgrades.map(upgrade => (
              <UpgradeCard 
                key={upgrade.id}
                upgrade={upgrade}
                canAfford={cash >= upgrade.cost}
                onPurchase={onPurchase}
                onShowDetails={onShowDetails}
              />
            ))}
          </div>
        </div>
      )}

      {/* Economy */}
      {economyUpgrades.length > 0 && (
        <div>
          <h3 className="font-bold font-mono text-sm text-muted-foreground mb-2">Economy</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {economyUpgrades.map(upgrade => (
              <UpgradeCard 
                key={upgrade.id}
                upgrade={upgrade}
                canAfford={cash >= upgrade.cost}
                onPurchase={onPurchase}
                onShowDetails={onShowDetails}
              />
            ))}
          </div>
        </div>
      )}

      {/* Automation */}
      {automationUpgrades.length > 0 && (
        <div>
          <h3 className="font-bold font-mono text-sm text-muted-foreground mb-2">Automation</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {automationUpgrades.map(upgrade => (
              <UpgradeCard 
                key={upgrade.id}
                upgrade={upgrade}
                canAfford={cash >= upgrade.cost}
                onPurchase={onPurchase}
                onShowDetails={onShowDetails}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
