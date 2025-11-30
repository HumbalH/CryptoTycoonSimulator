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
    <div className="h-12 lg:h-20 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 backdrop-blur-md border-b-2 border-primary/30 px-2 lg:px-6 py-1 lg:py-0 flex flex-row items-center justify-between gap-1 lg:gap-0 shadow-lg" data-testid="top-resource-bar">
      <div className="flex items-center gap-1 lg:gap-6 overflow-x-auto">
        <div className="flex items-center gap-1 lg:gap-2 flex-shrink-0">
          <div className="flex flex-col">
            <h1 className="text-sm lg:text-2xl font-bold font-mono text-primary leading-tight">CRYPTO MINE</h1>
            <span className="text-[8px] lg:text-[10px] text-muted-foreground leading-none">v0.8.0</span>
          </div>
        </div>
        {rebirthCount > 0 && (
          <Badge className="bg-gradient-to-r from-orange-500 to-red-500 gap-1 text-[10px] lg:text-sm px-1.5 py-0.5 lg:px-2 lg:py-1 flex-shrink-0">
            <Flame className="h-3 w-3" />
            <span className="hidden lg:inline">Rebirth {rebirthCount}</span>
            <span className="lg:hidden">{rebirthCount}</span>
          </Badge>
        )}
        <div className="flex lg:gap-4 gap-2 flex-shrink-0">
          <ResourceCounter icon={DollarSign} label="Cash" value={formatNumber(cash)} />
          <ResourceCounter icon={Zap} label="Rate/s" value={`${formatNumber(miningRate)} (${earningsMultiplier.toFixed(1)}x)`} trend="up" />
          <ResourceCounter icon={TrendingUp} label="Total" value={formatNumber(totalMined)} />
        </div>
      </div>
      <div className="flex gap-1 items-center flex-shrink-0">
        {onRebirth && (
          <Button 
            onClick={onRebirth}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 h-8 lg:h-9 px-2 lg:px-3"
            size="sm"
            data-testid="button-rebirth"
          >
            <Flame className="h-3 w-3 lg:h-4 lg:w-4 lg:mr-2" />
            <span className="hidden lg:inline">Rebirth</span>
          </Button>
        )}
        <Button 
          size="icon" 
          variant="ghost"
          onClick={onToggleDarkMode}
          data-testid="button-toggle-theme"
          className="h-8 w-8 lg:h-10 lg:w-10"
        >
          {isDarkMode ? <Sun className="h-4 w-4 lg:h-5 lg:w-5" /> : <Moon className="h-4 w-4 lg:h-5 lg:w-5" />}
        </Button>
        <Button 
          size="icon" 
          variant="ghost"
          onClick={onSettings}
          data-testid="button-settings"
          className="h-8 w-8 lg:h-10 lg:w-10"
        >
          <Settings className="h-4 w-4 lg:h-5 lg:w-5" />
        </Button>
      </div>
    </div>
  );
}
