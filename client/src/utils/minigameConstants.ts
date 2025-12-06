import { Minigame } from '@/types/minigames';

export const AVAILABLE_MINIGAMES: Minigame[] = [
  {
    id: 'hash-cracker',
    name: 'Hash Cracker',
    description: 'Rapidly click to crack the hash and earn bonus cash!',
    icon: '🔓',
    cooldown: 300, // 5 minutes
    lastPlayed: 0,
    reward: {
      type: 'cash',
      baseAmount: 50000,
    }
  },
  {
    id: 'memory-match',
    name: 'Crypto Memory',
    description: 'Match crypto coin pairs to boost your earnings!',
    icon: '🧠',
    cooldown: 600, // 10 minutes
    lastPlayed: 0,
    reward: {
      type: 'multiplier',
      baseAmount: 1.5,
      duration: 60, // 60 seconds
    }
  },
  {
    id: 'price-prediction',
    name: 'Price Oracle',
    description: 'Predict the market movement for a cash reward!',
    icon: '📈',
    cooldown: 180, // 3 minutes
    lastPlayed: 0,
    reward: {
      type: 'cash',
      baseAmount: 30000,
    }
  },
  {
    id: 'cable-connect',
    name: 'Network Builder',
    description: 'Connect all nodes to boost mining speed!',
    icon: '🔌',
    cooldown: 420, // 7 minutes
    lastPlayed: 0,
    reward: {
      type: 'boost',
      baseAmount: 2.0,
      duration: 45, // 45 seconds
    }
  },
  {
    id: 'timing-challenge',
    name: 'Perfect Timing',
    description: 'Click at the perfect moment for maximum rewards!',
    icon: '⏱️',
    cooldown: 240, // 4 minutes
    lastPlayed: 0,
    reward: {
      type: 'cash',
      baseAmount: 40000,
    }
  }
];
