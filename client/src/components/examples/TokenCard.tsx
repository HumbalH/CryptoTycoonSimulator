import TokenCard from '../TokenCard';
import { useState } from 'react';

export default function TokenCardExample() {
  const [activeToken, setActiveToken] = useState('bitblitz');
  
  const tokens = [
    { id: 'bitblitz', name: 'BitBlitz', symbol: 'BitBlitz', profitRate: 10, trend: 'up' as const, unlocked: true },
    { id: 'btc', name: 'Bitcoin', symbol: 'BTC', profitRate: 45, trend: 'up' as const, unlocked: true },
    { id: 'eth', name: 'Ethereum', symbol: 'ETH', profitRate: 38, trend: 'down' as const, unlocked: true },
    { id: 'sol', name: 'Solana', symbol: 'SOL', profitRate: 22, trend: 'neutral' as const, unlocked: true },
    { id: 'gala', name: 'Gala', symbol: 'GALA', profitRate: 15, trend: 'up' as const, unlocked: false },
    { id: 'bene', name: 'Bene', symbol: 'BENE', profitRate: 12, trend: 'neutral' as const, unlocked: false }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-background">
      {tokens.map(token => (
        <TokenCard 
          key={token.id}
          token={token}
          isActive={activeToken === token.id}
          onClick={() => setActiveToken(token.id)}
        />
      ))}
    </div>
  );
}
