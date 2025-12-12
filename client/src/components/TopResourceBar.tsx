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
  playerName?: string;
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
  onRebirth,
  playerName = 'Miner'
}: TopResourceBarProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `$${Math.floor(num / 1000)}K`;
    return `$${Math.floor(num)}`;
  };

  return (
    <div className="relative h-auto lg:h-24 bg-gradient-to-br from-orange-400 via-amber-400 to-yellow-400 border-b-4 border-orange-600/40 px-2 sm:px-3 lg:px-6 py-2 lg:py-3 shadow-2xl" data-testid="top-resource-bar">
      {/* Decorative top stripe */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-300 via-yellow-300 to-orange-300"></div>
      
      {/* Main content container */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 lg:gap-4 h-full">
        
        {/* Left section: Title & Player Info */}
        <div className="flex items-center justify-between gap-2 lg:gap-3 w-full sm:w-auto flex-shrink-0">
          <div className="flex items-center gap-2 lg:gap-3">
            {/* Game logo/icon */}
            <div className="hidden lg:flex h-14 w-14 rounded-xl bg-white/90 items-center justify-center shadow-lg border-2 border-orange-500/30">
              <span className="text-3xl">💰</span>
            </div>
            
            <div className="flex flex-col">
              <h1 className="text-sm sm:text-base lg:text-2xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] leading-tight tracking-tight">
                {playerName.toUpperCase()}'S EMPIRE
              </h1>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-[9px] sm:text-[10px] lg:text-xs text-orange-900/70 font-bold">CRYPTO TYCOON</span>
                {rebirthCount > 0 && (
                  <Badge className="bg-gradient-to-r from-orange-600 to-red-600 border border-orange-700 gap-1 text-[8px] sm:text-[9px] lg:text-xs px-1 sm:px-1.5 py-0 shadow-md">
                    <Flame className="h-2 w-2 sm:h-2.5 sm:w-2.5 lg:h-3 lg:w-3" />
                    <span className="font-bold">R{rebirthCount}</span>
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          {/* Action buttons - show on mobile at top */}
          <div className="flex sm:hidden gap-1.5 items-center flex-shrink-0">
            {onRebirth && (
              <Button 
                onClick={onRebirth}
                className="bg-gradient-to-br from-orange-500 via-red-500 to-red-600 hover:from-orange-600 hover:via-red-600 hover:to-red-700 text-white font-black shadow-lg border-2 border-red-700/30 h-8 px-2 rounded-lg"
                size="sm"
                data-testid="button-rebirth"
              >
                <Flame className="h-3.5 w-3.5" />
              </Button>
            )}
            <Button 
              size="icon" 
              onClick={onToggleDarkMode}
              disabled={!onToggleDarkMode}
              data-testid="button-toggle-theme"
              className="h-8 w-8 bg-white/90 hover:bg-white rounded-lg shadow-md border-2 border-orange-300/50"
            >
              {isDarkMode ? <Sun className="h-3.5 w-3.5 text-orange-600" /> : <Moon className="h-3.5 w-3.5 text-orange-600" />}
            </Button>
            <Button 
              size="icon" 
              onClick={onSettings}
              data-testid="button-settings"
              className="h-8 w-8 bg-white/90 hover:bg-white rounded-lg shadow-md border-2 border-orange-300/50"
            >
              <Settings className="h-3.5 w-3.5 text-orange-600" />
            </Button>
          </div>
        </div>

      
        {/* Center section: Resource Displays (game-style panels) */}
        <div className="flex gap-1.5 sm:gap-2 lg:gap-3 w-full sm:flex-1 justify-between sm:justify-start">
          {/* Cash Display */}
          <div className="flex-1 min-w-[90px] sm:min-w-[120px] lg:min-w-[140px] bg-white/95 rounded-lg px-2 sm:px-3 py-1.5 shadow-md border-2 border-green-400/50">
            <div className="flex items-center justify-between gap-1 sm:gap-2">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-md bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-sm">
                  <DollarSign className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-white" strokeWidth={3} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] sm:text-[9px] lg:text-[10px] font-bold text-green-700 uppercase tracking-wide">Cash</span>
                  <span className="text-xs sm:text-sm lg:text-lg font-black text-green-900 leading-none">{formatNumber(cash)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Rate Display */}
          <div className="flex-1 min-w-[90px] sm:min-w-[120px] lg:min-w-[140px] bg-white/95 rounded-lg px-2 sm:px-3 py-1.5 shadow-md border-2 border-blue-400/50">
            <div className="flex items-center justify-between gap-1 sm:gap-2">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-md bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center shadow-sm">
                  <Zap className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-white" strokeWidth={3} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] sm:text-[9px] lg:text-[10px] font-bold text-blue-700 uppercase tracking-wide">Per Sec</span>
                  <span className="text-xs sm:text-sm lg:text-lg font-black text-blue-900 leading-none">{formatNumber(miningRate)}</span>
                </div>
              </div>
              {earningsMultiplier > 1 && (
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[8px] sm:text-[9px] px-1 py-0 h-3.5 sm:h-4 border-0">
                  {earningsMultiplier.toFixed(1)}x
                </Badge>
              )}
            </div>
          </div>

          {/* Total Display */}
          <div className="flex-1 min-w-[90px] sm:min-w-[120px] lg:min-w-[140px] bg-white/95 rounded-lg px-2 sm:px-3 py-1.5 shadow-md border-2 border-purple-400/50">
            <div className="flex items-center justify-between gap-1 sm:gap-2">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-md bg-gradient-to-br from-purple-400 to-violet-500 flex items-center justify-center shadow-sm">
                  <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-white" strokeWidth={3} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] sm:text-[9px] lg:text-[10px] font-bold text-purple-700 uppercase tracking-wide">Total</span>
                  <span className="text-xs sm:text-sm lg:text-lg font-black text-purple-900 leading-none">{formatNumber(totalMined)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right section: Action buttons - desktop only */}
        <div className="hidden sm:flex gap-1.5 lg:gap-2 items-center flex-shrink-0">
          {onRebirth && (
            <Button 
              onClick={onRebirth}
              className="bg-gradient-to-br from-orange-500 via-red-500 to-red-600 hover:from-orange-600 hover:via-red-600 hover:to-red-700 text-white font-black shadow-lg border-2 border-red-700/30 h-9 lg:h-10 px-3 lg:px-4 rounded-lg"
              size="sm"
              data-testid="button-rebirth"
            >
              <Flame className="h-4 w-4 lg:h-5 lg:w-5 lg:mr-1.5" />
              <span className="hidden lg:inline text-xs lg:text-sm">REBIRTH</span>
            </Button>
          )}
          <Button 
            size="icon" 
            onClick={onToggleDarkMode}
            disabled={!onToggleDarkMode}
            data-testid="button-toggle-theme"
            className="h-9 w-9 lg:h-10 lg:w-10 bg-white/90 hover:bg-white rounded-lg shadow-md border-2 border-orange-300/50"
          >
            {isDarkMode ? <Sun className="h-4 w-4 lg:h-5 lg:w-5 text-orange-600" /> : <Moon className="h-4 w-4 lg:h-5 lg:w-5 text-orange-600" />}
          </Button>
          <Button 
            size="icon" 
            onClick={onSettings}
            data-testid="button-settings"
            className="h-9 w-9 lg:h-10 lg:w-10 bg-white/90 hover:bg-white rounded-lg shadow-md border-2 border-orange-300/50"
          >
            <Settings className="h-4 w-4 lg:h-5 lg:w-5 text-orange-600" />
          </Button>
        </div>
      </div>
    </div>
  );
}
