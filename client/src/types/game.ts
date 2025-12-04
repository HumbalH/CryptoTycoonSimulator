// Game Types
export interface PCType {
  id: string;
  name: string;
  description: string;
  cost: number;
  miningRate: number;
  level: number;
  unlocked: boolean;
  icon: string;
  tier: number;
  tokenEarned: string;
  modelUrl: string;
}

export interface OwnedPC {
  id: string;
  type: PCType;
  token: string;
  position: [number, number, number];
  pendingEarnings: number;
  lastCollectedTime: number;
}

export interface WorkerType {
  id: string;
  name: string;
  description: string;
  cost: number;
  efficiency: number;
  capacity: number;
  level: number;
  unlocked: boolean;
  type: 'technician' | 'engineer' | 'expert';
}

export interface OwnedWorker {
  id: string;
  type: string;
}

export interface Token {
  id: string;
  name: string;
  symbol: string;
  profitRate: number;
  basePrice: number;
  trend: 'up' | 'down' | 'neutral';
  unlocked: boolean;
  value: number;
}

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  currentLevel: number;
  maxLevel: number;
  effect: string;
  unlocked: boolean;
  category: 'expansion' | 'mining' | 'economy' | 'automation';
}

export interface Celebrity {
  id: string;
  name: string;
  title: string;
  bonus: number;
  boostDuration: number;
  boostMultiplier: number;
}

export interface GameState {
  gameVersion: number;
  cash: number;
  totalMined: number;
  gridWidth: number;
  gridHeight: number;
  rebirthCount: number;
  ownedPCs: OwnedPC[];
  ownedWorkers: OwnedWorker[];
  upgrades: Upgrade[];
  tokens: Token[];
  activeToken: string;
  lastLogout: number;
}
