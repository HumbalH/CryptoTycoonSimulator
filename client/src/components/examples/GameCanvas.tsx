import GameCanvas from '../GameCanvas';

export default function GameCanvasExample() {
  const mockPCs = [
    { id: '1', position: [-3, 0.75, -2] as [number, number, number], type: 'budget' as const, token: 'BitBlitz', isActive: true },
    { id: '2', position: [0, 1, -2] as [number, number, number], type: 'gaming' as const, token: 'BTC', isActive: true },
    { id: '3', position: [3, 1.25, -2] as [number, number, number], type: 'server' as const, token: 'ETH', isActive: true },
    { id: '4', position: [-3, 0.75, 1] as [number, number, number], type: 'budget' as const, token: 'SOL', isActive: false },
  ];

  return (
    <div className="h-96">
      <GameCanvas pcs={mockPCs} />
    </div>
  );
}
