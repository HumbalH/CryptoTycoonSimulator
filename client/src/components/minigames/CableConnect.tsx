import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface Node {
  id: number;
  x: number;
  y: number;
  connected: boolean;
  maxConnections: number; // New: limit connections per node
  type: 'server' | 'router' | 'pc'; // New: node type
}

interface Connection {
  from: number;
  to: number;
}

interface CableConnectProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (success: boolean, time: number) => void;
}

export default function CableConnect({ isOpen, onClose, onComplete }: CableConnectProps) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(45);
  const [isActive, setIsActive] = useState(false);
  const [invalidMessage, setInvalidMessage] = useState<string>('');

  const totalNodes = 10;

  useEffect(() => {
    if (isOpen && nodes.length === 0) {
      initializeGame();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsActive(false);
          const success = checkAllConnected();
          setTimeout(() => onComplete(success, 45 - prev), 500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, timeLeft]);

  useEffect(() => {
    if (isActive && checkAllConnected()) {
      setIsActive(false);
      setTimeout(() => onComplete(true, 45 - timeLeft), 500);
    }
  }, [connections, isActive, timeLeft]);

  const initializeGame = () => {
    // Generate random network layout with different node types
    const newNodes: Node[] = [];
    const nodeTypes: Array<'server' | 'router' | 'pc'> = [];
    
    // 1 server (hub), 3 routers (intermediate), 6 PCs (endpoints)
    nodeTypes.push('server');
    for (let i = 0; i < 3; i++) nodeTypes.push('router');
    for (let i = 0; i < 6; i++) nodeTypes.push('pc');
    
    // Shuffle types
    for (let i = nodeTypes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [nodeTypes[i], nodeTypes[j]] = [nodeTypes[j], nodeTypes[i]];
    }
    
    // Random placement with clustering
    for (let i = 0; i < totalNodes; i++) {
      const type = nodeTypes[i];
      
      // Different max connections based on type
      const maxConnections = type === 'server' ? 4 : type === 'router' ? 3 : 2;
      
      // Random position with some structure
      let x, y;
      if (type === 'server') {
        // Server near center
        x = 180 + (Math.random() - 0.5) * 60;
        y = 160 + (Math.random() - 0.5) * 60;
      } else if (type === 'router') {
        // Routers in mid-range
        const angle = Math.random() * Math.PI * 2;
        const radius = 80 + Math.random() * 40;
        x = 180 + Math.cos(angle) * radius;
        y = 160 + Math.sin(angle) * radius;
      } else {
        // PCs on the edges
        const angle = Math.random() * Math.PI * 2;
        const radius = 120 + Math.random() * 50;
        x = 180 + Math.cos(angle) * radius;
        y = 160 + Math.sin(angle) * radius;
      }
      
      newNodes.push({
        id: i,
        x: Math.max(30, Math.min(330, x)),
        y: Math.max(30, Math.min(290, y)),
        connected: false,
        maxConnections,
        type,
      });
    }
    
    setNodes(newNodes);
    setConnections([]);
    setSelectedNode(null);
    setTimeLeft(45);
    setIsActive(true);
    setInvalidMessage('');
  };

  const handleNodeClick = (nodeId: number) => {
    if (!isActive) return;

    if (selectedNode === null) {
      setSelectedNode(nodeId);
      setInvalidMessage('');
    } else if (selectedNode === nodeId) {
      setSelectedNode(null);
      setInvalidMessage('');
    } else {
      // Check if connection already exists
      const connectionExists = connections.some(
        conn => 
          (conn.from === selectedNode && conn.to === nodeId) ||
          (conn.from === nodeId && conn.to === selectedNode)
      );

      if (connectionExists) {
        setInvalidMessage('Connection already exists!');
        setTimeout(() => setInvalidMessage(''), 2000);
        setSelectedNode(null);
        return;
      }

      // Check connection limits
      const fromNode = nodes.find(n => n.id === selectedNode);
      const toNode = nodes.find(n => n.id === nodeId);
      
      const fromConnections = connections.filter(c => c.from === selectedNode || c.to === selectedNode).length;
      const toConnections = connections.filter(c => c.from === nodeId || c.to === nodeId).length;

      if (fromNode && fromConnections >= fromNode.maxConnections) {
        setInvalidMessage(`${fromNode.type.toUpperCase()} ${selectedNode + 1} is at max capacity (${fromNode.maxConnections})!`);
        setTimeout(() => setInvalidMessage(''), 2000);
        setSelectedNode(null);
        return;
      }

      if (toNode && toConnections >= toNode.maxConnections) {
        setInvalidMessage(`${toNode.type.toUpperCase()} ${nodeId + 1} is at max capacity (${toNode.maxConnections})!`);
        setTimeout(() => setInvalidMessage(''), 2000);
        setSelectedNode(null);
        return;
      }

      // Check for crossing cables (optional hard mode)
      const wouldCross = connections.some(conn => {
        const c1 = nodes.find(n => n.id === conn.from);
        const c2 = nodes.find(n => n.id === conn.to);
        const n1 = nodes.find(n => n.id === selectedNode);
        const n2 = nodes.find(n => n.id === nodeId);
        
        if (!c1 || !c2 || !n1 || !n2) return false;
        
        // Simple line intersection check
        return linesIntersect(c1.x, c1.y, c2.x, c2.y, n1.x, n1.y, n2.x, n2.y);
      });

      if (wouldCross) {
        setInvalidMessage('Cables cannot cross!');
        setTimeout(() => setInvalidMessage(''), 2000);
        setSelectedNode(null);
        return;
      }

      // Create connection
      setConnections(prev => [...prev, { from: selectedNode, to: nodeId }]);
      updateConnectedStatus([...connections, { from: selectedNode, to: nodeId }]);
      setSelectedNode(null);
      setInvalidMessage('');
    }
  };

  // Check if two line segments intersect
  const linesIntersect = (x1: number, y1: number, x2: number, y2: number, 
                          x3: number, y3: number, x4: number, y4: number): boolean => {
    const denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
    if (denom === 0) return false;
    
    const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
    const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom;
    
    return ua > 0.01 && ua < 0.99 && ub > 0.01 && ub < 0.99;
  };

  const updateConnectedStatus = (conns: Connection[]) => {
    if (conns.length === 0) {
      setNodes(prev => prev.map(n => ({ ...n, connected: false })));
      return;
    }

    // Find all connected nodes using BFS
    const visited = new Set<number>();
    const queue = [conns[0].from];
    visited.add(conns[0].from);

    while (queue.length > 0) {
      const current = queue.shift()!;
      
      conns.forEach(conn => {
        if (conn.from === current && !visited.has(conn.to)) {
          visited.add(conn.to);
          queue.push(conn.to);
        } else if (conn.to === current && !visited.has(conn.from)) {
          visited.add(conn.from);
          queue.push(conn.from);
        }
      });
    }

    setNodes(prev => prev.map(n => ({
      ...n,
      connected: visited.has(n.id)
    })));
  };

  const checkAllConnected = () => {
    return nodes.every(n => n.connected) && nodes.length > 0;
  };

  const handleRemoveConnection = (conn: Connection) => {
    const newConns = connections.filter(c => 
      !(c.from === conn.from && c.to === conn.to) &&
      !(c.from === conn.to && c.to === conn.from)
    );
    setConnections(newConns);
    updateConnectedStatus(newConns);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">🔌</span>
            Network Builder
          </DialogTitle>
          <DialogDescription>
            Connect all nodes to complete the network!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex justify-between text-sm">
            <span>Time: <span className="font-mono font-bold">{timeLeft}s</span></span>
            <span>Cables: <span className="font-mono font-bold">{connections.length}</span></span>
            <span>Network: <span className="font-mono font-bold">{nodes.filter(n => n.connected).length}/{totalNodes}</span></span>
          </div>

          {invalidMessage && (
            <div className="text-center text-sm text-destructive font-bold animate-pulse">
              {invalidMessage}
            </div>
          )}

          {/* Game Board */}
          <div className="relative w-full h-80 bg-card border border-border rounded-lg overflow-hidden"  style={{ touchAction: 'none' }}>
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {/* Draw connections */}
              {connections.map((conn, i) => {
                const from = nodes.find(n => n.id === conn.from);
                const to = nodes.find(n => n.id === conn.to);
                if (!from || !to) return null;

                return (
                  <g key={i}>
                    <line
                      x1={from.x}
                      y1={from.y}
                      x2={to.x}
                      y2={to.y}
                      stroke="hsl(var(--primary))"
                      strokeWidth="2"
                      className="opacity-50 hover:opacity-100"
                    />
                    {/* Connection midpoint for deletion */}
                    <circle
                      cx={(from.x + to.x) / 2}
                      cy={(from.y + to.y) / 2}
                      r="8"
                      fill="hsl(var(--destructive))"
                      className="cursor-pointer pointer-events-auto opacity-0 hover:opacity-80"
                      onClick={() => handleRemoveConnection(conn)}
                    />
                  </g>
                );
              })}

              {/* Draw pending connection */}
              {selectedNode !== null && (
                <line
                  x1={nodes[selectedNode]?.x}
                  y1={nodes[selectedNode]?.y}
                  x2={nodes[selectedNode]?.x}
                  y2={nodes[selectedNode]?.y}
                  stroke="hsl(var(--primary))"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  className="animate-pulse"
                />
              )}
            </svg>

            {/* Nodes */}
            {nodes.map(node => {
              const currentConnections = connections.filter(c => c.from === node.id || c.to === node.id).length;
              const nodeColors = {
                server: 'bg-blue-500 border-blue-300',
                router: 'bg-purple-500 border-purple-300',
                pc: 'bg-orange-500 border-orange-300'
              };
              const nodeIcons = {
                server: '🖥️',
                router: '📡',
                pc: '💻'
              };
              
              return (
                <button
                  key={node.id}
                  onClick={() => handleNodeClick(node.id)}
                  disabled={!isActive}
                  className={`absolute w-14 h-14 rounded-full border-4 transition-all transform -translate-x-7 -translate-y-7 flex flex-col items-center justify-center text-xs ${
                    node.connected
                      ? 'bg-green-500 border-green-300'
                      : nodeColors[node.type]
                  } ${
                    selectedNode === node.id
                      ? 'border-white scale-125 animate-pulse shadow-lg'
                      : 'hover:scale-110'
                  } ${
                    currentConnections >= node.maxConnections
                      ? 'opacity-60'
                      : ''
                  } ${!isActive ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  style={{
                    left: `${node.x}px`,
                    top: `${node.y}px`,
                  }}
                >
                  <span className="text-lg leading-none">{nodeIcons[node.type]}</span>
                  <span className="text-[8px] font-bold mt-0.5">{currentConnections}/{node.maxConnections}</span>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-blue-300 flex items-center justify-center">🖥️</div>
              <span className="text-muted-foreground">Server (4 max)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-6 h-6 rounded-full bg-purple-500 border-2 border-purple-300 flex items-center justify-center">📡</div>
              <span className="text-muted-foreground">Router (3 max)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-6 h-6 rounded-full bg-orange-500 border-2 border-orange-300 flex items-center justify-center">💻</div>
              <span className="text-muted-foreground">PC (2 max)</span>
            </div>
          </div>

          <div className="text-xs text-center text-muted-foreground">
            Connect all nodes without crossing cables. Each node has a connection limit!
          </div>

          {!isActive && timeLeft <= 0 && (
            <div className={`text-center text-lg font-bold ${checkAllConnected() ? 'text-green-500' : 'text-destructive'}`}>
              {checkAllConnected() ? '✅ Network Complete!' : '❌ Time up!'}
            </div>
          )}

          {!isActive && checkAllConnected() && timeLeft > 0 && (
            <div className="text-center text-lg font-bold text-green-500">
              ✅ Network completed in {45 - timeLeft} seconds!
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
