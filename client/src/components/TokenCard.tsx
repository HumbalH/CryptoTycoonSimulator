import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, Gamepad2, Gem, Zap } from "lucide-react";
import { SiBitcoin, SiEthereum, SiSolana } from "react-icons/si";

export interface Token {
  id: string;
  name: string;
  symbol: string;
  profitRate: number;
  basePrice: number;
  trend: "up" | "down" | "neutral";
  unlocked: boolean;
}

interface TokenCardProps {
  token: Token;
  isActive?: boolean;
  onClick?: () => void;
  rebirthCount?: number;
  requiredRebirth?: number;
}

const tokenIcons: Record<string, { icon: any; color: string } | { emoji: string }> = {
  BTC: { icon: SiBitcoin, color: "#f7931a" },
  ETH: { icon: SiEthereum, color: "#627eea" },
  SOL: { icon: SiSolana, color: "#14f195" },
  GALA: { icon: Gamepad2, color: "#f97316" },
  BENE: { icon: Gem, color: "#06b6d4" },
  BitBlitz: { icon: Zap, color: "#facc15" }
};

export default function TokenCard({ token, isActive, onClick, rebirthCount = 0, requiredRebirth }: TokenCardProps) {
  const iconEntry = tokenIcons[token.symbol];
  const Icon = iconEntry && "icon" in iconEntry ? iconEntry.icon : null;
  const iconColor = iconEntry && "icon" in iconEntry ? iconEntry.color : undefined;
  const emoji = iconEntry && "emoji" in iconEntry ? iconEntry.emoji : null;

  // Image path for tokens; user can supply under public/tokens
  const tokenImageSrc = `/tokens/${token.id}.png`;

  const TrendIcon = token.trend === "up" ? TrendingUp : token.trend === "down" ? TrendingDown : Minus;
  const trendColor = token.trend === "up" ? "text-green-500" : token.trend === "down" ? "text-red-500" : "text-muted-foreground";

  return (
    <Card 
      className={`hover-elevate cursor-pointer transition-all rounded-xl shadow-md border-2 ${isActive ? 'ring-4 ring-accent shadow-2xl shadow-accent/40 border-accent' : 'border-primary/25'} ${!token.unlocked ? 'opacity-60' : ''} bg-gradient-to-br from-orange-50 via-amber-50 to-white`}
      onClick={token.unlocked ? onClick : undefined}
      data-testid={`token-card-${token.id}`}
    >
      <CardContent className="p-4 bg-gradient-to-br from-white/80 to-amber-50/60 rounded-xl">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 rounded-lg overflow-hidden border-2 border-white shadow-sm bg-white flex-shrink-0">
              <img 
                src={tokenImageSrc} 
                alt={token.name} 
                loading="lazy" 
                className="h-full w-full object-cover" 
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} 
              />
              <div className="absolute inset-0 flex items-center justify-center">
                {Icon && <Icon className="h-7 w-7" style={{ color: iconColor }} />}
                {!Icon && emoji && <span className="text-2xl">{emoji}</span>}
                {!Icon && !emoji && <div className="text-2xl">🪙</div>}
              </div>
              <div className="absolute inset-0 border border-accent/30 rounded-lg" />
            </div>
            <div>
              <h4 className="font-bold font-mono">{token.symbol}</h4>
              <p className="text-xs text-muted-foreground">{token.name}</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`flex items-center gap-1 ${trendColor}`}>
              <TrendIcon className="h-4 w-4" />
              <span className="font-bold font-mono">${token.profitRate}/s</span>
            </div>
            {isActive && <Badge variant="default" className="mt-1 text-xs">Active</Badge>}
            {!token.unlocked && requiredRebirth !== undefined && (
              <Badge variant="secondary" className="mt-1 text-xs whitespace-nowrap">
                Rebirth {requiredRebirth}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
