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

// Map worker types to provided image filenames in /public/workers
const imageFileMap: Record<WorkerType["type"], string> = {
  technician: "Technician.png", // user-provided filename
  engineer: "Engineer.png",
  expert: "Expert.png"
};

export default function WorkerCard({ worker, canAfford, onHire }: WorkerCardProps) {
  const formatCost = (cost: number) => {
    if (cost >= 1000000) return `$${(cost / 1000000).toFixed(1)}M`;
    if (cost >= 1000) return `$${(cost / 1000).toFixed(1)}K`;
    return `$${cost}`;
  };

  // Served from public/workers directory provided by user assets
  const imageSrc = `/workers/${imageFileMap[worker.type] ?? `${worker.id}.png`}`;

  if (!worker.unlocked) {
    return (
      <Card className="opacity-80 bg-gradient-to-br from-orange-50 via-amber-50 to-white border-2 border-muted/40 rounded-xl shadow-md overflow-hidden" data-testid={`worker-card-${worker.id}`}>
        <div className="flex items-center gap-2 sm:gap-3 p-2 relative">
          <div className="relative h-10 w-10 sm:h-12 sm:w-12 rounded-lg overflow-hidden border border-muted/40 bg-white">
            <img src={imageSrc} alt={worker.name} className="h-full w-full object-cover opacity-60" loading="lazy" />
            <div className="absolute inset-0 bg-white/50" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-black text-[11px] sm:text-xs text-muted-foreground truncate">{worker.name}</h3>
            <p className="text-[9px] sm:text-[10px] text-muted-foreground/80 line-clamp-1">Locked worker</p>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Lock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card 
      className="hover-elevate border-2 border-secondary/25 bg-gradient-to-br from-orange-50 via-amber-50 to-white rounded-lg sm:rounded-xl shadow-lg overflow-hidden w-full" 
      data-testid={`worker-card-${worker.id}`}
      data-tutorial-id={worker.id === 'technician' ? 'technician-card' : undefined}
    >
      <div className="flex gap-3 p-3">
        {/* Portrait */}
        <div className="relative h-20 w-20 rounded-lg overflow-hidden border-2 border-white shadow-md bg-white flex-shrink-0">
          <img src={imageSrc} alt={worker.name} className="h-full w-full object-cover" loading="lazy" />
          <div className="absolute inset-0 border border-secondary/20 rounded-lg" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-black text-sm text-secondary-900">{worker.name}</h3>
              <Badge variant="outline" className="text-[10px] gap-1 px-1.5 py-0 flex-shrink-0">
                <Wrench className="h-3 w-3" />
                <span>+{worker.efficiency}%</span>
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground leading-tight line-clamp-2">{worker.description}</p>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1 bg-white/80 border border-secondary/30 rounded-md px-2 py-1 shadow-sm">
              <Zap className="h-3.5 w-3.5 text-primary" />
              <span className="font-black text-xs text-secondary-900">{formatCost(worker.cost)}</span>
            </div>
            <Button 
              size="sm"
              disabled={!canAfford}
              onClick={() => onHire(worker.id)}
              data-testid={`button-hire-${worker.id}`}
              data-tutorial-id={worker.id === 'technician' ? 'technician-buy' : undefined}
              className="h-7 px-4 text-xs font-black bg-gradient-to-r from-secondary to-emerald-400 text-white shadow-md border border-secondary/40 flex-shrink-0"
            >
              Hire
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
