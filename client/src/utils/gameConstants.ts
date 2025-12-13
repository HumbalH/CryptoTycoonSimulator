import type { PCType, WorkerType, Token, Upgrade } from '@/types/game';

export const GAME_VERSION = 20;
export const INITIAL_CASH = 20000; // 20k starting cash for testing
export const INITIAL_GRID_SIZE = 3;

export const AVAILABLE_PCS: PCType[] = [
  {
    id: 'budget',
    name: 'Budget Rig',
    description: 'Mines 1 token per second',
    cost: 1500,
    miningRate: 1,
    level: 0,
    unlocked: true,
    icon: 'budget',
    tier: 1,
    tokenEarned: 'BitBlitz',
    modelUrl: '/models/budget-rig.glb'
  },
  {
    id: 'laptop',
    name: 'Laptop Miner',
    description: 'Mines 2 tokens per second',
    cost: 5000,
    miningRate: 2,
    level: 0,
    unlocked: true,
    icon: 'laptop',
    tier: 1,
    tokenEarned: 'BitBlitz',
    modelUrl: '/models/laptop.glb'
  },
  {
    id: 'workstation',
    name: 'Workstation',
    description: 'Mines 3 tokens per second',
    cost: 35000,
    miningRate: 3,
    level: 0,
    unlocked: true,
    icon: 'workstation',
    tier: 1,
    tokenEarned: 'Gala',
    modelUrl: '/models/workstation.glb'
  },
  {
    id: 'gaming',
    name: 'Gaming PC',
    description: 'Mines 4 tokens per second',
    cost: 100000,
    miningRate: 4,
    level: 0,
    unlocked: true,
    icon: 'gaming',
    tier: 1,
    tokenEarned: 'Gala',
    modelUrl: '/models/gaming-pc.glb'
  },
  {
    id: 'mining-rig',
    name: 'Mining Rig',
    description: 'Mines 5 tokens per second',
    cost: 250000,
    miningRate: 5,
    level: 0,
    unlocked: true,
    icon: 'mining-rig',
    tier: 2,
    tokenEarned: 'Bene',
    modelUrl: '/models/mining-rig.glb'
  },
  {
    id: 'server',
    name: 'Server Rack',
    description: 'Mines 6 tokens per second',
    cost: 600000,
    miningRate: 6,
    level: 0,
    unlocked: true,
    icon: 'server',
    tier: 2,
    tokenEarned: 'Solana',
    modelUrl: '/models/server-rack.glb'
  },
  {
    id: 'quantum',
    name: 'Quantum Core',
    description: 'Mines 7 tokens per second',
    cost: 1500000,
    miningRate: 7,
    level: 0,
    unlocked: true,
    icon: 'quantum',
    tier: 3,
    tokenEarned: 'Bitcoin',
    modelUrl: '/models/quantum-core.glb'
  }
];

export const AVAILABLE_WORKERS: WorkerType[] = [
  {
    id: 'tech1',
    name: 'Technician',
    description: 'Basic PC maintenance and monitoring',
    cost: 15000,
    efficiency: 10,
    capacity: 3,
    level: 0,
    unlocked: true,
    type: 'technician'
  },
  {
    id: 'eng1',
    name: 'Engineer',
    description: 'Advanced optimization expert',
    cost: 60000,
    efficiency: 25,
    capacity: 5,
    level: 0,
    unlocked: true,
    type: 'engineer'
  },
  {
    id: 'expert1',
    name: 'Expert',
    description: 'Elite mining specialist with AI algorithms',
    cost: 300000,
    efficiency: 50,
    capacity: 10,
    level: 0,
    unlocked: true,
    type: 'expert'
  }
];

export const DEFAULT_TOKENS: Token[] = [
  { id: 'bitblitz', name: 'BitBlitz', symbol: 'BitBlitz', profitRate: 5, basePrice: 5, trend: 'up', unlocked: true, value: 10 },
  { id: 'gala', name: 'Gala', symbol: 'GALA', profitRate: 8, basePrice: 8, trend: 'up', unlocked: false, value: 19 },
  { id: 'bene', name: 'Bene', symbol: 'BENE', profitRate: 11, basePrice: 11, trend: 'neutral', unlocked: false, value: 38 },
  { id: 'sol', name: 'Solana', symbol: 'SOL', profitRate: 14, basePrice: 14, trend: 'neutral', unlocked: false, value: 76 },
  { id: 'eth', name: 'Ethereum', symbol: 'ETH', profitRate: 17, basePrice: 17, trend: 'down', unlocked: false, value: 148 },
  { id: 'btc', name: 'Bitcoin', symbol: 'BTC', profitRate: 20, basePrice: 20, trend: 'up', unlocked: false, value: 290 }
];

export const DEFAULT_UPGRADES: Upgrade[] = [
  {
    id: "room-space",
    name: "Expand Base",
    description: "Unlock more space to build additional PCs",
    cost: 20000,
    currentLevel: 0,
    maxLevel: 6,
    effect: "+1 grid space per level",
    unlocked: true,
    category: "expansion"
  },
  {
    id: "mining-speed",
    name: "Overclocking",
    description: "Boost all PCs' mining rate with advanced overclocking techniques",
    cost: 75000,
    currentLevel: 0,
    maxLevel: 5,
    effect: "+10% mining speed per level",
    unlocked: true,
    category: "mining"
  },
  {
    id: "offline-boost",
    name: "Remote Monitoring",
    description: "Increase earnings while you're offline with remote monitoring systems",
    cost: 100000,
    currentLevel: 0,
    maxLevel: 3,
    effect: "+0.1x to all offline tiers per level",
    unlocked: true,
    category: "mining"
  },
  {
    id: "worker-discount",
    name: "Recruitment Program",
    description: "Reduce the cost to hire new workers with an optimized recruitment program",
    cost: 40000,
    currentLevel: 0,
    maxLevel: 3,
    effect: "-15% worker cost per level",
    unlocked: true,
    category: "economy"
  },
  {
    id: "rebirth-discount",
    name: "Efficiency Expert",
    description: "Reduce the cost required for your next rebirth through efficiency improvements",
    cost: 200000,
    currentLevel: 0,
    maxLevel: 3,
    effect: "-10% rebirth cost per level",
    unlocked: true,
    category: "economy"
  },
  {
    id: "auto-collect",
    name: "Auto-Collection",
    description: "Automatically collect earnings from all PCs without manual clicking",
    cost: 150000,
    currentLevel: 0,
    maxLevel: 1,
    effect: "Automatic earnings collection",
    unlocked: true,
    category: "automation"
  },
  {
    id: "token-discount",
    name: "Token Switch Discount",
    description: "Reduce the cost when switching between different tokens",
    cost: 50000,
    currentLevel: 0,
    maxLevel: 5,
    effect: "-$1,000 switch cost per level",
    unlocked: true,
    category: "economy"
  }
];
