import { DollarSign, Zap, TrendingUp, Settings, Moon, Sun, Flame } from "lucide-react";
import ResourceCounter from "./ResourceCounter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TopResourceBarProps {
  cash: number;
  miningRate: number;
  totalMined: number;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  onSettings?: () => void;
  rebirthCount?: number;
  earningsMultiplier?: number;
  onRebirth?: () => void;
}

export default function TopResourceBar({ 
  cash, 
  miningRate, 
  totalMined,
  isDarkMode = true,
  onToggleDarkMode,
  onSettings,
  rebirthCount = 0,
  earningsMultiplier = 1,
  onRebirth
}: TopResourceBarProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `$${Math.floor(num / 1000000)}M`;
    if (num >= 1000) return `$${Math.floor(num / 1000)}K`;
    return `$${Math.floor(num)}`;
  };

  return (
    <div className="h-auto md:h-20 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 backdrop-blur-md border-b-2 border-primary/30 px-2 md:px-6 py-2 md:py-0 flex flex-col md:flex-row items-start md:items-center justify-between gap-2 md:gap-0 shadow-lg" data-testid="top-resource-bar">
      <div className="flex items-center gap-2 md:gap-6 w-full md:w-auto justify-between md:justify-start">
        <div className="flex items-center gap-2">
          <h1 className="text-lg md:text-2xl font-bold font-mono text-primary">CRYPTO MINE</h1>
          {rebirthCount > 0 && (
            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 gap-1">
              <Flame className="h-3 w-3" />
              Rebirth {rebirthCount}
            </Badge>
          )}
        </div>
        <div className="flex gap-2 md:gap-4 overflow-x-auto">
          <ResourceCounter icon={DollarSign} label="Cash" value={formatNumber(cash)} />
          <ResourceCounter icon={Zap} label="Rate/s" value={`${formatNumber(miningRate)} (${earningsMultiplier.toFixed(1)}x)`} trend="up" />
          <ResourceCounter icon={TrendingUp} label="Total" value={formatNumber(totalMined)} />
        </div>
      </div>
      <div className="flex gap-1 md:gap-2">
        {onRebirth && (
          <Button 
            onClick={onRebirth}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            size="sm"
            data-testid="button-rebirth"
          >
            <Flame className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Rebirth</span>
          </Button>
        )}
        <Button 
          size="icon" 
          variant="ghost"
          onClick={onToggleDarkMode}
          data-testid="button-toggle-theme"
        >
          {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
        <Button 
          size="icon" 
          variant="ghost"
          onClick={onSettings}
          data-testid="button-settings"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
