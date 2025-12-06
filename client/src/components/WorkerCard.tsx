import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, Wrench, Zap } from "lucide-react";

export interface WorkerType {
  id: string;
  name: string;
  description: string;
  cost: number;
  efficiency: number;
  capacity: number;
  level: number;
  unlocked: boolean;
  type: "technician" | "engineer" | "expert";
}

interface WorkerCardProps {
  worker: WorkerType;
  canAfford: boolean;
  onHire: (workerId: string) => void;
}

const iconMap = {
  technician: "👷",
  engineer: "👨‍💻",
  expert: "🧑‍🔬"
};

export default function WorkerCard({ worker, canAfford, onHire }: WorkerCardProps) {
  const formatCost = (cost: number) => {
    if (cost >= 1000000) return `$${(cost / 1000000).toFixed(1)}M`;
    if (cost >= 1000) return `$${(cost / 1000).toFixed(1)}K`;
    return `$${cost}`;
  };

  if (!worker.unlocked) {
    return (
      <Card className="opacity-60" data-testid={`worker-card-${worker.id}`}>
        <div className="flex items-center gap-2 p-2">
          <span className="text-2xl opacity-50 flex-shrink-0">{iconMap[worker.type]}</span>
          <div className="flex-1">
            <h3 className="font-bold font-mono text-xs">{worker.name}</h3>
          </div>
          <Lock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        </div>
      </Card>
    );
  }

  return (
    <Card 
      className="hover-elevate border-2 border-secondary/20 bg-gradient-to-br from-card to-card/80" 
      data-testid={`worker-card-${worker.id}`}
      data-tutorial-id={worker.id === 'technician' ? 'technician-card' : undefined}
    >
      <div className="flex flex-col gap-2 p-2">
        {/* Row 1: Icon, Name, Efficiency */}
        <div className="flex items-center gap-2">
          <span className="text-2xl drop-shadow-lg flex-shrink-0">{iconMap[worker.type]}</span>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold font-mono text-xs">{worker.name}</h3>
          </div>
          <Badge variant="outline" className="text-xs gap-0.5 flex-shrink-0">
            <Wrench className="h-2.5 w-2.5" />
            <span>+{worker.efficiency}%</span>
          </Badge>
        </div>
        {/* Row 2: Price and Hire Button */}
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-0.5">
            <Zap className="h-3 w-3 text-primary flex-shrink-0" />
            <span className="font-bold font-mono text-xs">{formatCost(worker.cost)}</span>
          </div>
          <Button 
            size="sm"
            disabled={!canAfford}
            onClick={() => onHire(worker.id)}
            data-testid={`button-hire-${worker.id}`}
            data-tutorial-id={worker.id === 'technician' ? 'technician-buy' : undefined}
            className="h-6 px-2 text-xs ml-auto"
          >
            Hire
          </Button>
        </div>
      </div>
    </Card>
  );
}
