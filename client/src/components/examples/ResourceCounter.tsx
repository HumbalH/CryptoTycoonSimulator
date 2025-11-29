import ResourceCounter from '../ResourceCounter';
import { DollarSign, Zap, TrendingUp } from 'lucide-react';

export default function ResourceCounterExample() {
  return (
    <div className="flex gap-4 p-4 bg-background">
      <ResourceCounter icon={DollarSign} label="Cash" value="$125,430" />
      <ResourceCounter icon={Zap} label="Mining Rate" value="$342/s" trend="up" />
      <ResourceCounter icon={TrendingUp} label="Total Mined" value="$5.2M" />
    </div>
  );
}
