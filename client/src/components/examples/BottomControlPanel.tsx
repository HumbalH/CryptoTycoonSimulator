import BottomControlPanel from '../BottomControlPanel';

export default function BottomControlPanelExample() {
  return (
    <BottomControlPanel 
      buildPCContent={<div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="p-4 bg-card rounded-md border border-card-border">
            PC Type {i}
          </div>
        ))}
      </div>}
      upgradeContent={<div>Upgrades available</div>}
      workersContent={<div>Hire workers here</div>}
      tokensContent={<div>Token management</div>}
      celebritiesContent={<div>Celebrity visits log</div>}
    />
  );
}

