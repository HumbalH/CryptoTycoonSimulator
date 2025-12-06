export interface Minigame {
  id: string;
  name: string;
  description: string;
  icon: string;
  cooldown: number; // in seconds
  lastPlayed: number;
  reward: {
    type: 'cash' | 'multiplier' | 'boost';
    baseAmount: number;
    duration?: number; // for temporary effects
  };
}

export interface MinigameState {
  activeGame: string | null;
  score: number;
  timeRemaining: number;
  gameData: any; // Game-specific data
}

export interface HashCrackerData {
  targetClicks: number;
  currentClicks: number;
  difficulty: number;
}

export interface MemoryMatchData {
  cards: Array<{ id: number; symbol: string; isFlipped: boolean; isMatched: boolean }>;
  selectedCards: number[];
  matchedPairs: number;
}

export interface PricePredictionData {
  currentPrice: number;
  targetPrice: number;
  userPrediction: 'up' | 'down' | null;
  priceHistory: number[];
}

export interface CableConnectData {
  nodes: Array<{ id: number; x: number; y: number; connected: boolean }>;
  connections: Array<{ from: number; to: number }>;
  targetConnections: number;
}

export interface TimingChallengeData {
  targetZone: { start: number; end: number };
  currentPosition: number;
  speed: number;
  clicked: boolean;
}
