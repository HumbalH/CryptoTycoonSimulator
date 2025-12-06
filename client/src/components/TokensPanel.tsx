import TokenCard, { Token } from './TokenCard';
import { memo } from 'react';

interface TokensPanelProps {
  tokens: Token[];
  activeToken: string;
  cash: number;
  tokenDiscountLevel: number;
  onSelect: (tokenId: string) => void;
}

const TokensPanel = memo(function TokensPanel({ tokens, activeToken, cash, tokenDiscountLevel, onSelect }: TokensPanelProps) {
  return (
    <div className="space-y-4 overflow-y-auto max-h-[600px]">
      <div className="bg-card/60 border border-primary/20 rounded p-3">
        <p className="text-xs text-muted-foreground font-mono">
          <span className="text-primary font-bold">Token System:</span> Upgrade tokens to increase their cash value. Different tokens unlock at higher rebirth levels.
        </p>
      </div>
      <div>
        <h3 className="font-bold font-mono text-sm text-muted-foreground mb-2">Available Tokens</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {tokens.map(token => (
            <TokenCard 
              key={token.id}
              token={token}
              isActive={activeToken === token.id}
              onClick={() => onSelect(token.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

export default TokensPanel;
