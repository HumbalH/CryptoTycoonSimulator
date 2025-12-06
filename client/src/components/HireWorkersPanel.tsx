import WorkerCard, { WorkerType } from './WorkerCard';
import { memo } from 'react';

interface HireWorkersPanelProps {
  availableWorkers: WorkerType[];
  ownedWorkers: Array<{ id: string; type: string }>;
  cash: number;
  workerDiscountLevel: number;
  onHire: (workerId: string) => void;
}

const HireWorkersPanel = memo(function HireWorkersPanel({ availableWorkers, ownedWorkers, cash, workerDiscountLevel, onHire }: HireWorkersPanelProps) {
  const technicianCount = ownedWorkers.filter(w => w.type === 'technician').length;
  const engineerCount = ownedWorkers.filter(w => w.type === 'engineer').length;
  const expertCount = ownedWorkers.filter(w => w.type === 'expert').length;

  return (
    <div className="space-y-4 overflow-y-auto max-h-[600px]">
      <div className="bg-card/60 border border-primary/20 rounded p-3">
        <p className="text-xs text-muted-foreground font-mono">
          <span className="text-primary font-bold">Current Workers:</span> {technicianCount} Technicians | {engineerCount} Engineers | {expertCount} Experts
        </p>
      </div>
      <div>
        <h3 className="font-bold font-mono text-sm text-muted-foreground mb-2">Available Workers</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {availableWorkers.map(worker => {
            const discountedCost = Math.floor(worker.cost * (1 - workerDiscountLevel * 0.15));
            return (
              <WorkerCard 
                key={worker.id}
                worker={{ ...worker, cost: discountedCost }}
                canAfford={cash >= discountedCost}
                onHire={onHire}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
});

export default HireWorkersPanel;
