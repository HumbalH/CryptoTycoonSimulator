import PCCard, { PCType } from './PCCard';
import { Button } from './ui/button';
import { memo } from 'react';

interface BuildPCPanelProps {
  availablePCs: PCType[];
  ownedPCs: Array<{ id: string; type: PCType; token: string; position: [number, number, number]; pendingEarnings: number }>;
  cash: number;
  onPurchase: (pcId: string) => void;
  onDelete: (pcId: string) => void;
}

const BuildPCPanel = memo(function BuildPCPanel({ availablePCs, ownedPCs, cash, onPurchase, onDelete }: BuildPCPanelProps) {
  return (
    <div className="space-y-4 overflow-y-auto max-h-[600px]">
      <div className="bg-card/60 border border-primary/20 rounded p-3">
        <p className="text-xs text-muted-foreground font-mono">
          <span className="text-primary font-bold">Worker Requirements:</span> 1 Technician per 5 PCs | 1 Engineer per 5 Gaming PCs | 1 Expert per 5 Server Racks
        </p>
      </div>
      <div>
        <h3 className="font-bold font-mono text-sm text-muted-foreground mb-2">Available PCs</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {availablePCs.map(pc => (
            <PCCard 
              key={pc.id}
              pc={pc}
              canAfford={cash >= pc.cost}
              onPurchase={onPurchase}
            />
          ))}
        </div>
      </div>
      {ownedPCs.length > 0 && (
        <div className="border-t border-card-border pt-3">
          <h3 className="font-bold font-mono text-sm text-muted-foreground mb-2">Your PCs ({ownedPCs.length})</h3>
          <div className="flex flex-wrap gap-2">
            {ownedPCs.map(pc => (
              <div key={pc.id} className="flex items-center gap-2 bg-card/60 border border-primary/30 rounded px-3 py-1">
                <span className="text-sm font-mono">{pc.type.name}</span>
                <Button 
                  size="sm" 
                  variant="ghost"
                  className="h-5 w-5 p-0 text-destructive hover:text-destructive"
                  onClick={() => onDelete(pc.id)}
                  data-testid={`button-delete-pc-${pc.id}`}
                >
                  ✕
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

export default BuildPCPanel;
