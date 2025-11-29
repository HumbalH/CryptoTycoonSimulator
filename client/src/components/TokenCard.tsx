import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { SiBitcoin, SiEthereum } from "react-icons/si";

export interface Token {
  id: string;
  name: string;
  symbol: string;
  profitRate: number;
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

const tokenIcons: Record<string, any> = {
  BTC: SiBitcoin,
  ETH: SiEthereum,
  SOL: "☀️",
  GALA: "🎮",
  BENE: "💎",
  BitBlitz: "⚡"
};

export default function TokenCard({ token, isActive, onClick, rebirthCount = 0, requiredRebirth }: TokenCardProps) {
  const Icon = typeof tokenIcons[token.symbol] === 'string' ? null : tokenIcons[token.symbol];
  const emoji = typeof tokenIcons[token.symbol] === 'string' ? tokenIcons[token.symbol] : null;

  const TrendIcon = token.trend === "up" ? TrendingUp : token.trend === "down" ? TrendingDown : Minus;
  const trendColor = token.trend === "up" ? "text-green-500" : token.trend === "down" ? "text-red-500" : "text-muted-foreground";

  return (
    <Card 
      className={`hover-elevate cursor-pointer transition-all border-2 ${isActive ? 'ring-4 ring-accent shadow-2xl shadow-accent/50 border-accent' : 'border-primary/20'} ${!token.unlocked ? 'opacity-50' : ''} bg-gradient-to-br from-card to-card/80`}
      onClick={token.unlocked ? onClick : undefined}
      data-testid={`token-card-${token.id}`}
    >
      <CardContent className="p-4 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {Icon ? (
              <Icon className="h-8 w-8 text-primary" />
            ) : (
              <span className="text-3xl">{emoji}</span>
            )}
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
