import { useState, useEffect } from 'react';
import TopResourceBar from '@/components/TopResourceBar';
import GameCanvas from '@/components/GameCanvas';
import BottomControlPanel from '@/components/BottomControlPanel';
import PCCard, { PCType } from '@/components/PCCard';
import WorkerCard, { WorkerType } from '@/components/WorkerCard';
import TokenCard, { Token } from '@/components/TokenCard';
import UpgradeCard, { Upgrade } from '@/components/UpgradeCard';
import UpgradeDetailsModal from '@/components/UpgradeDetailsModal';
import CelebrityVisitModal, { Celebrity } from '@/components/CelebrityVisitModal';
import GameTutorial from '@/components/GameTutorial';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useToast } from '@/hooks/use-toast';
import { Expand, Zap, Hammer, Wrench, Users, Coins, Star } from 'lucide-react';
import bitblitzIcon from '@assets/generated_images/bitblitz_crypto_token_icon.png';

export default function Game() {
  const { toast } = useToast();
  
  // Game state
  const [userId, setUserId] = useState<string | null>(null);
  const [cash, setCash] = useState(20000);
  const [totalMined, setTotalMined] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [celebrityVisit, setCelebrityVisit] = useState<Celebrity | null>(null);
  const [showCelebrityModal, setShowCelebrityModal] = useState(false);
  const [gridWidth, setGridWidth] = useState(3);
  const [gridHeight, setGridHeight] = useState(3);
  const [rebirthCount, setRebirthCount] = useState(0);
  const [showRebirthModal, setShowRebirthModal] = useState(false);
  const [lastLogout, setLastLogout] = useState<number>(Date.now());
  const [offlineEarningsAmount, setOfflineEarningsAmount] = useState(0);
  const [showOfflineEarningsModal, setShowOfflineEarningsModal] = useState(false);
  const [selectedUpgrade, setSelectedUpgrade] = useState<Upgrade | null>(null);
  const [showUpgradeDetails, setShowUpgradeDetails] = useState(false);
  const [showTutorial, setShowTutorial] = useState(localStorage.getItem('tutorialCompleted') !== 'true');
  const [tutorialStep, setTutorialStep] = useState(0);
  
  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState<string | null>(null);

  // PC state - todo: remove mock functionality
  const [ownedPCs, setOwnedPCs] = useState<Array<{ id: string; type: PCType; token: string; position: [number, number, number]; pendingEarnings: number }>>([
    { 
      id: 'pc-1', 
      type: {
        id: 'budget',
        name: 'Budget Rig',
        description: 'Mines 1 token per second',
        cost: 1000,
        miningRate: 1,
        level: 1,
        unlocked: true,
        icon: 'budget'
      },
      token: 'bitblitz',
      position: [-6, 0.1, -6],
      pendingEarnings: 0
    }
  ]);

  // Workers state - todo: remove mock functionality
  const [ownedWorkers, setOwnedWorkers] = useState<Array<{ id: string; type: string }>>([
    { id: 'worker-1', type: 'technician' }
  ]);

  // Available PCs to purchase - todo: remove mock functionality
  const [availablePCs] = useState<PCType[]>([
    {
      id: 'budget',
      name: 'Budget Rig',
      description: 'Mines 1 token per second',
      cost: 1500,
      miningRate: 1,
      level: 0,
      unlocked: true,
      icon: 'budget'
    },
    {
      id: 'laptop',
      name: 'Laptop Miner',
      description: 'Mines 2 tokens per second',
      cost: 5000,
      miningRate: 2,
      level: 0,
      unlocked: true,
      icon: 'laptop'
    },
    {
      id: 'workstation',
      name: 'Workstation',
      description: 'Mines 3 tokens per second',
      cost: 35000,
      miningRate: 3,
      level: 0,
      unlocked: true,
      icon: 'workstation'
    },
    {
      id: 'gaming',
      name: 'Gaming PC',
      description: 'Mines 4 tokens per second',
      cost: 100000,
      miningRate: 4,
      level: 0,
      unlocked: true,
      icon: 'gaming'
    },
    {
      id: 'mining-rig',
      name: 'Mining Rig',
      description: 'Mines 5 tokens per second',
      cost: 250000,
      miningRate: 5,
      level: 0,
      unlocked: true,
      icon: 'mining-rig'
    },
    {
      id: 'server',
      name: 'Server Rack',
      description: 'Mines 6 tokens per second',
      cost: 600000,
      miningRate: 6,
      level: 0,
      unlocked: true,
      icon: 'server'
    },
    {
      id: 'quantum',
      name: 'Quantum Core',
      description: 'Mines 7 tokens per second',
      cost: 1500000,
      miningRate: 7,
      level: 0,
      unlocked: true,
      icon: 'quantum'
    }
  ]);

  // Workers - todo: remove mock functionality
  const [availableWorkers] = useState<WorkerType[]>([
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
  ]);

  // Handle PC click to collect cash
  const handlePCClick = (pcId: string) => {
    const pc = ownedPCs.find(p => p.id === pcId);
    if (pc && pc.pendingEarnings > 0) {
      setCash(prev => prev + pc.pendingEarnings);
      setTotalMined(prev => prev + pc.pendingEarnings);
      setOwnedPCs(prev => prev.map(p => 
        p.id === pcId ? { ...p, pendingEarnings: 0 } : p
      ));
    }
  };

  // Tokens - unlocked based on rebirths. Order: bitblitz -> gala -> bene -> sol -> eth -> btc
  // Prices roughly 2x of previous but with variance
  const [tokens, setTokens] = useState<Token[]>([
    { id: 'bitblitz', name: 'BitBlitz', symbol: 'BitBlitz', profitRate: 10, basePrice: 10, trend: 'up', unlocked: true },
    { id: 'gala', name: 'Gala', symbol: 'GALA', profitRate: 19, basePrice: 19, trend: 'up', unlocked: rebirthCount >= 1 },
    { id: 'bene', name: 'Bene', symbol: 'BENE', profitRate: 38, basePrice: 38, trend: 'neutral', unlocked: rebirthCount >= 2 },
    { id: 'sol', name: 'Solana', symbol: 'SOL', profitRate: 76, basePrice: 76, trend: 'neutral', unlocked: rebirthCount >= 3 },
    { id: 'eth', name: 'Ethereum', symbol: 'ETH', profitRate: 148, basePrice: 148, trend: 'down', unlocked: rebirthCount >= 4 },
    { id: 'btc', name: 'Bitcoin', symbol: 'BTC', profitRate: 290, basePrice: 290, trend: 'up', unlocked: rebirthCount >= 5 }
  ]);

  const [activeToken, setActiveToken] = useState('bitblitz');

  // Upgrades state
  const [upgrades, setUpgrades] = useState<Upgrade[]>([
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
  ]);

  // Calculate total mining rate (in cash/s based on PC rates and token values)
  const miningSpeedLevel = upgrades.find(u => u.id === 'mining-speed')?.currentLevel || 0;
  const miningSpeedBoost = 1 + (miningSpeedLevel * 0.1);
  const totalMiningRate = ownedPCs.reduce((sum, pc) => {
    const token = tokens.find(t => t.id === pc.token);
    const tokensPerSecond = pc.type.miningRate * miningSpeedBoost; // How many tokens this PC mines per second with boost
    const cashPerToken = token?.profitRate || 10; // How much each token is worth
    return sum + (tokensPerSecond * cashPerToken);
  }, 0);

  // Calculate earnings multiplier from rebirths (0.1x per rebirth)
  const earningsMultiplier = 1 + (rebirthCount * 0.1);

  // Initialize and load game state from localStorage on mount
  useEffect(() => {
    const gameState = localStorage.getItem('gameState');
    if (gameState) {
      try {
        const state = JSON.parse(gameState);
        
        // Version check: clear old saves (increment GAME_VERSION when you want to force reset)
        const GAME_VERSION = 2; // Increment this number in future updates to reset all saves
        if (!state.gameVersion || state.gameVersion < GAME_VERSION) {
          console.log('Old save detected, clearing localStorage...');
          localStorage.removeItem('gameState');
          // Don't reload, just let it use default state
          return; // Exit early, game will use default state
        }
        
        setCash(state.cash || 20000);
        setTotalMined(state.totalMined || 0);
        
        // Backward compatibility: convert old roomSize to gridWidth/gridHeight
        if (state.roomSize && !state.gridWidth && !state.gridHeight) {
          setGridWidth(state.roomSize);
          setGridHeight(state.roomSize);
        } else {
          setGridWidth(state.gridWidth || 3);
          setGridHeight(state.gridHeight || 3);
        }
        
        setRebirthCount(state.rebirthCount || 0);
        if (state.ownedPCs && state.ownedPCs.length > 0) {
          // Migrate old PC positions if coming from old roomSize system
          const needsMigration = state.roomSize && !state.gridWidth && !state.gridHeight;
          
          const fixedPCs = state.ownedPCs.map((pc: any) => {
            let newPosition = [pc.position[0], 0.1, pc.position[2]] as [number, number, number];
            
            // If migrating from old system, convert positions
            // Old: -(roomSize-2) to +(roomSize-2) (centered at 0, step 2)
            // New: -6 to gridWidth*2-6 (starts at -6, step 2)
            if (needsMigration && state.roomSize) {
              const oldX = pc.position[0];
              const oldZ = pc.position[2];
              // Convert from old centered grid to new corner-based grid
              // Shift by -3 to move left/up
              newPosition = [oldX - 3, 0.1, oldZ - 3] as [number, number, number];
            }
            
            return {
              ...pc,
              position: newPosition
            };
          });
          setOwnedPCs(fixedPCs);
        }
        if (state.ownedWorkers && state.ownedWorkers.length > 0) {
          setOwnedWorkers(state.ownedWorkers);
        }
        if (state.upgrades && state.upgrades.length > 0) {
          // Migrate upgrades: keep only the working ones and preserve their levels
          const validUpgradeIds = ['room-space', 'mining-speed', 'offline-boost', 'worker-discount', 'rebirth-discount', 'auto-collect', 'token-discount'];
          const migratedUpgrades = upgrades.map(upgrade => {
            const oldUpgrade = state.upgrades.find((u: any) => u.id === upgrade.id);
            if (oldUpgrade && validUpgradeIds.includes(upgrade.id)) {
              return {
                ...upgrade,
                currentLevel: oldUpgrade.currentLevel
              };
            }
            return upgrade;
          });
          setUpgrades(migratedUpgrades);
        }
        if (state.activeToken) {
          setActiveToken(state.activeToken);
        }
        
        // Calculate offline earnings
        const lastLogoutTime = state.lastLogout || Date.now();
        setLastLogout(lastLogoutTime);
        
        const timeAwayMs = Date.now() - lastLogoutTime;
        const timeAwaySeconds = Math.floor(timeAwayMs / 1000);
        
        // Only show offline earnings if away for more than 1 minute
        if (timeAwaySeconds > 60 && state.ownedPCs && state.ownedPCs.length > 0) {
          // Calculate total mining rate
          let offlineRate = 0;
          state.ownedPCs.forEach((pc: any) => {
            const tokensPerSecond = pc.type?.miningRate || 1;
            const cashPerToken = 10; // Use base token value for offline
            offlineRate += tokensPerSecond * cashPerToken;
          });
          
          // Apply rebirth multiplier
          const rebirthMultiplier = 1 + ((state.rebirthCount || 0) * 0.1);
          offlineRate *= rebirthMultiplier;
          
          // Get offline boost level and calculate tier multipliers
          const offlineBoostLevel = (state.upgrades?.find((u: any) => u.id === 'offline-boost')?.currentLevel || 0);
          const tier1Multiplier = 0.3 + (offlineBoostLevel * 0.1);
          const tier2Multiplier = 0.2 + (offlineBoostLevel * 0.1);
          const tier3Multiplier = 0.1 + (offlineBoostLevel * 0.1);
          
          // Tiered offline earnings: (0.3+boost)x for first 3 hours, (0.2+boost)x for next 3 hours, (0.1+boost)x for next 18 hours (max 24 hours total)
          let earnings = 0;
          const maxOfflineTime = 24 * 60 * 60; // 24 hours in seconds
          const effectiveTime = Math.min(timeAwaySeconds, maxOfflineTime);
          
          const tier1Time = 3 * 60 * 60; // First 3 hours
          const tier2Time = 6 * 60 * 60; // Up to 6 hours total
          
          if (effectiveTime <= tier1Time) {
            // First 3 hours at (0.3+boost)x
            earnings = Math.floor(offlineRate * effectiveTime * tier1Multiplier);
          } else if (effectiveTime <= tier2Time) {
            // First 3 hours at (0.3+boost)x + next hours at (0.2+boost)x
            const tier1Earnings = Math.floor(offlineRate * tier1Time * tier1Multiplier);
            const tier2Earnings = Math.floor(offlineRate * (effectiveTime - tier1Time) * tier2Multiplier);
            earnings = tier1Earnings + tier2Earnings;
          } else {
            // First 3 hours at (0.3+boost)x + next 3 hours at (0.2+boost)x + remaining at (0.1+boost)x
            const tier1Earnings = Math.floor(offlineRate * tier1Time * tier1Multiplier);
            const tier2Earnings = Math.floor(offlineRate * (tier2Time - tier1Time) * tier2Multiplier);
            const tier3Earnings = Math.floor(offlineRate * (effectiveTime - tier2Time) * tier3Multiplier);
            earnings = tier1Earnings + tier2Earnings + tier3Earnings;
          }
          
          if (earnings > 0) {
            setOfflineEarningsAmount(earnings);
            setCash(prev => prev + earnings);
            setTotalMined(prev => prev + earnings);
            setShowOfflineEarningsModal(true);
          }
        }
      } catch (err) {
        console.error('Failed to load game state:', err);
      }
    }
  }, []); // Only run once on mount

  // Save game state to localStorage periodically
  useEffect(() => {
    const saveGameState = () => {
      const gameState = {
        gameVersion: 2, // Increment this when you want to force reset all saves
        cash,
        totalMined,
        gridWidth,
        gridHeight,
        rebirthCount,
        ownedPCs,
        ownedWorkers,
        upgrades,
        activeToken,
        lastLogout: Date.now()
      };
      localStorage.setItem('gameState', JSON.stringify(gameState));
    };
    
    // Save every 30 seconds
    const saveInterval = setInterval(saveGameState, 30000);
    
    // Save before unload
    const handleBeforeUnload = () => {
      saveGameState();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      clearInterval(saveInterval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [cash, totalMined, gridWidth, gridHeight, rebirthCount, ownedPCs, ownedWorkers, upgrades, activeToken]);

  // Mining income - accumulate on PCs
  useEffect(() => {
    const interval = setInterval(() => {
      const hasAutoCollect = (upgrades.find(u => u.id === 'auto-collect')?.currentLevel || 0) > 0;
      const miningSpeedLevel = upgrades.find(u => u.id === 'mining-speed')?.currentLevel || 0;
      const miningSpeedBoost = 1 + (miningSpeedLevel * 0.1); // +10% per level
      
      setOwnedPCs(prev => prev.map(pc => {
        const token = tokens.find(t => t.id === pc.token);
        const tokensPerSecond = pc.type.miningRate * miningSpeedBoost; // Apply mining speed boost
        const cashPerToken = token?.profitRate || 10; // Value per token
        const income = Math.floor(tokensPerSecond * cashPerToken * earningsMultiplier);
        
        if (hasAutoCollect) {
          // Auto-collect: add directly to cash
          setCash(c => c + income);
          setTotalMined(t => t + income);
          return pc;
        } else {
          // Manual collect: accumulate on PC
          return {
            ...pc,
            pendingEarnings: pc.pendingEarnings + income
          };
        }
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [totalMiningRate, earningsMultiplier, upgrades, tokens]);

  // Random celebrity visits - unlock based on earnings
  useEffect(() => {
    const celebInterval = setInterval(() => {
      if (Math.random() > 0.93) { // 7% chance every 10 seconds
        // Celebrity pool that grows as you earn more
        // Bonuses are based on current mining rate
        const currentRate = Math.max(totalMiningRate * earningsMultiplier, 100); // Ensure minimum bonus
        
        const baseCelebrities = [
          { id: '1', name: 'Crypto King', title: 'Legendary Investor', bonus: Math.floor(currentRate * 100), boostDuration: 30, boostMultiplier: 2 }
        ];
        
        const unlockedCelebrities = [
          ...(totalMined >= 50000 ? [{ id: '2', name: 'Hash Master', title: 'Mining Pioneer', bonus: Math.floor(currentRate * 200), boostDuration: 20, boostMultiplier: 1.5 }] : []),
          ...(totalMined >= 300000 ? [{ id: '3', name: 'Blockchain Baron', title: 'Tech Visionary', bonus: Math.floor(currentRate * 300), boostDuration: 60, boostMultiplier: 3 }] : []),
          ...(totalMined >= 1000000 ? [{ id: '4', name: 'NFT Mogul', title: 'Digital Tycoon', bonus: Math.floor(currentRate * 400), boostDuration: 45, boostMultiplier: 2.5 }] : [])
        ];
        
        const allCelebrities = [...baseCelebrities, ...unlockedCelebrities];
        const celeb = allCelebrities[Math.floor(Math.random() * allCelebrities.length)];
        setCelebrityVisit(celeb);
        setShowCelebrityModal(true);
      }
    }, 10000);

    return () => clearInterval(celebInterval);
  }, [totalMined, totalMiningRate, earningsMultiplier]);

  // Update token unlocks when rebirth count changes
  useEffect(() => {
    setTokens(prev => prev.map((token, idx) => ({
      ...token,
      unlocked: idx === 0 ? true : rebirthCount >= idx
    })));
  }, [rebirthCount]);

  // Dynamic token prices - constrained between 0.5x and 3x of base price
  useEffect(() => {
    const priceInterval = setInterval(() => {
      setTokens(prev => prev.map(token => {
        const basePrice = token.basePrice || token.profitRate;
        const minPrice = Math.floor(basePrice * 0.5);
        const maxPrice = Math.floor(basePrice * 3);
        
        const change = Math.floor(Math.random() * 11) - 5;
        const newRate = Math.max(minPrice, Math.min(maxPrice, Math.floor(token.profitRate + change)));
        
        return {
          ...token,
          profitRate: newRate,
          trend: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral'
        };
      }));
    }, 5000);

    return () => clearInterval(priceInterval);
  }, []);

  // Count workers by type
  const getTechnicianCount = () => ownedWorkers.filter(w => w.type === 'technician').length;
  const getEngineerCount = () => ownedWorkers.filter(w => w.type === 'engineer').length;
  const getExpertCount = () => ownedWorkers.filter(w => w.type === 'expert').length;

  // PC Tiers
  const getTier1Count = () => ownedPCs.filter(pc => ['budget', 'laptop', 'workstation'].includes(pc.type.id)).length;
  const getTier2Count = () => ownedPCs.filter(pc => ['gaming', 'mining-rig'].includes(pc.type.id)).length;
  const getTier3Count = () => ownedPCs.filter(pc => ['server', 'quantum'].includes(pc.type.id)).length;

  const handlePurchasePC = (pcId: string) => {
    const pc = availablePCs.find(p => p.id === pcId);
    if (!pc || cash < pc.cost) return;

    // Tier 1 (Budget, Laptop, Workstation): 1 Technician per 5 PCs total
    if (['budget', 'laptop', 'workstation'].includes(pcId)) {
      const tier1Total = getTier1Count() + 1;
      const techsNeeded = Math.ceil(tier1Total / 5);
      const techsHave = getTechnicianCount();

      if (techsHave < techsNeeded) {
        toast({
          title: "Need Technicians!",
          description: `You need ${techsNeeded} Technicians for Tier 1 PCs. You have ${techsHave}.`,
          variant: "destructive"
        });
        return;
      }
    }

    // Tier 2 (Gaming PC, Mining Rig): 1 Engineer per 5 PCs total
    if (['gaming', 'mining-rig'].includes(pcId)) {
      const tier2Total = getTier2Count() + 1;
      const engsNeeded = Math.ceil(tier2Total / 5);
      const engsHave = getEngineerCount();

      if (engsHave < engsNeeded) {
        toast({
          title: "Need Engineers!",
          description: `You need ${engsNeeded} Engineers for Tier 2 PCs. You have ${engsHave}.`,
          variant: "destructive"
        });
        return;
      }
    }

    // Tier 3 (Server Rack, Quantum Core): 1 Expert per 5 PCs total
    if (['server', 'quantum'].includes(pcId)) {
      const tier3Total = getTier3Count() + 1;
      const expertsNeeded = Math.ceil(tier3Total / 5);
      const expertsHave = getExpertCount();

      if (expertsHave < expertsNeeded) {
        toast({
          title: "Need Experts!",
          description: `You need ${expertsNeeded} Experts for Tier 3 PCs. You have ${expertsHave}.`,
          variant: "destructive"
        });
        return;
      }
    }

    setCash(prev => prev - pc.cost);
    
    // Optimized: Find first available position without generating full grid
    // Grid matches floor position: starts at [-6, -6], expand right (gridWidth) and back (gridHeight)
    let foundPosition: [number, number, number] | null = null;
    
    for (let x = -6; x < -6 + gridWidth * 2 && !foundPosition; x += 2) {
      for (let z = -6; z < -6 + gridHeight * 2 && !foundPosition; z += 2) {
        const pos: [number, number, number] = [x, 0.1, z];
        // Check if this position is available
        const isOccupied = ownedPCs.some(owned => 
          Math.abs(owned.position[0] - pos[0]) < 1.5 && 
          Math.abs(owned.position[2] - pos[2]) < 1.5
        );
        if (!isOccupied) {
          foundPosition = pos;
        }
      }
    }

    if (foundPosition) {
      setOwnedPCs(prev => [...prev, {
        id: `pc-${Date.now()}`,
        type: pc,
        token: activeToken,
        position: foundPosition,
        pendingEarnings: 0
      }]);

      toast({
        title: "PC Purchased!",
        description: `${pc.name} is now mining ${tokens.find(t => t.id === activeToken)?.name}`,
      });
    } else {
      toast({
        title: "No Space!",
        description: "Expand your room to place more PCs",
        variant: "destructive"
      });
      setCash(prev => prev + pc.cost);
    }
  };

  const handleHireWorker = (workerId: string) => {
    const worker = availableWorkers.find(w => w.id === workerId);
    if (!worker) return;
    
    // Apply worker discount
    const workerDiscountLevel = upgrades.find(u => u.id === 'worker-discount')?.currentLevel || 0;
    const workerDiscountMultiplier = 1 - (workerDiscountLevel * 0.15);
    const discountedCost = Math.floor(worker.cost * workerDiscountMultiplier);
    
    if (cash < discountedCost) return;

    setCash(prev => prev - discountedCost);
    setOwnedWorkers(prev => [...prev, { id: `worker-${Date.now()}`, type: worker.type }]);

    toast({
      title: "Worker Hired!",
      description: `${worker.name} is now maintaining your PCs`,
    });
  };

  const handleTokenSelect = (tokenId: string) => {
    const token = tokens.find(t => t.id === tokenId);
    if (!token?.unlocked) return;
    
    const baseTokenSwitchCost = 10000;
    const tokenDiscountUpgrade = upgrades.find(u => u.id === 'token-discount');
    const discountAmount = (tokenDiscountUpgrade?.currentLevel || 0) * 1000;
    const switchCost = Math.max(0, baseTokenSwitchCost - discountAmount);
    
    if (activeToken !== tokenId && cash >= switchCost) {
      setCash(prev => prev - switchCost);
      setActiveToken(tokenId);
      
      toast({
        title: "Token Switched!",
        description: `Now mining ${token.name} (-$${switchCost})`,
      });
    }
  };

  const handleClaimCelebrity = () => {
    if (celebrityVisit) {
      setCash(prev => prev + celebrityVisit.bonus);
      
      toast({
        title: "Celebrity Bonus Claimed!",
        description: `+$${celebrityVisit.bonus.toLocaleString()} from ${celebrityVisit.name}`,
      });
    }
  };

  const handleDeletePC = (pcId: string) => {
    setOwnedPCs(prev => prev.filter(pc => pc.id !== pcId));
    
    const deletedPC = ownedPCs.find(pc => pc.id === pcId);
    if (deletedPC) {
      toast({
        title: "PC Deleted",
        description: `${deletedPC.type.name} has been removed from your farm`,
      });
    }
  };

  const handleCollectFromPC = (pcId: string) => {
    const pc = ownedPCs.find(p => p.id === pcId);
    if (!pc || pc.pendingEarnings <= 0) return;

    const earned = Math.floor(pc.pendingEarnings);
    setCash(prev => prev + earned);
    setTotalMined(prev => prev + earned);
    setOwnedPCs(prev => prev.map(p => 
      p.id === pcId ? { ...p, pendingEarnings: 0 } : p
    ));

    toast({
      title: "Coins Collected!",
      description: `+$${earned.toLocaleString()} from ${pc.type.name}`,
    });
  };

  // Calculate rebirth cost (easier early, exponential late)
  let rebirthCost: number;
  if (rebirthCount === 0) {
    rebirthCost = 50000; // 1st rebirth - ~10 mins gameplay
  } else if (rebirthCount === 1) {
    rebirthCost = 300000; // 2nd rebirth - ~1 hour gameplay
  } else if (rebirthCount === 2) {
    rebirthCost = 1500000; // 3rd rebirth - ~5 hours gameplay
  } else {
    // After 3rd rebirth, multiply by 2 each time
    rebirthCost = Math.floor(1500000 * Math.pow(2, rebirthCount - 2));
  }
  
  // Apply rebirth discount upgrade
  const rebirthDiscountLevel = upgrades.find(u => u.id === 'rebirth-discount')?.currentLevel || 0;
  const rebirthDiscountMultiplier = 1 - (rebirthDiscountLevel * 0.1);
  rebirthCost = Math.floor(rebirthCost * rebirthDiscountMultiplier);

  // Check rebirth requirements
  const getRebirthRequirements = () => {
    const requirements: { met: boolean; description: string }[] = [
      { met: cash >= rebirthCost, description: `$${rebirthCost.toLocaleString()} cash` }
    ];

    if (rebirthCount === 0) {
      requirements.push({ met: ownedPCs.length >= 5, description: 'At least 5 PCs built' });
    } else if (rebirthCount === 1) {
      requirements.push({ met: ownedWorkers.length >= 2, description: 'At least 2 Workers hired' });
    } else if (rebirthCount === 2) {
      const hasGamingPC = ownedPCs.some(pc => pc.type.id === 'gaming-pc');
      requirements.push({ met: hasGamingPC, description: '1 Gaming PC' });
    } else if (rebirthCount === 3) {
      const hasServerRack = ownedPCs.some(pc => pc.type.id === 'server-rack');
      requirements.push({ met: hasServerRack, description: '1 Server Rack' });
    } else if (rebirthCount === 4) {
      const hasQuantumCore = ownedPCs.some(pc => pc.type.id === 'quantum-core');
      requirements.push({ met: hasQuantumCore, description: '1 Quantum Core' });
    }

    return requirements;
  };

  const rebirthRequirements = getRebirthRequirements();
  const canRebirth = rebirthRequirements.every(req => req.met);

  const handleRebirth = () => {
    if (!canRebirth) {
      const unmetRequirements = rebirthRequirements.filter(req => !req.met);
      toast({
        title: "Requirements not met!",
        description: `Missing: ${unmetRequirements.map(req => req.description).join(', ')}`,
        variant: "destructive"
      });
      return;
    }

    // Reset game state but keep rebirth count
    setCash(20000);
    setOwnedPCs([{
      id: 'pc-1',
      type: availablePCs[0],
      token: 'bitblitz',
      position: [-3, 0.1, -3],
      pendingEarnings: 0
    }]);
    setOwnedWorkers([]);
    setGridWidth(3);
    setGridHeight(3);
    setActiveToken('bitblitz');
    setRebirthCount(prev => prev + 1);
    setShowRebirthModal(false);

    toast({
      title: "Rebirth Complete!",
      description: `You are now at rebirth level ${rebirthCount + 1}. New multiplier: ${(1 + ((rebirthCount + 1) * 0.1)).toFixed(1)}x`,
    });
  };

  const handleUpgrade = (upgradeId: string) => {
    const upgrade = upgrades.find(u => u.id === upgradeId);
    if (!upgrade || cash < upgrade.cost || upgrade.currentLevel >= upgrade.maxLevel) return;

    setCash(prev => prev - upgrade.cost);
    
    // Handle room expansion for "Buy Space" upgrade
    // Progression: 3x3(0) → 3x4(1) → 4x4(2) → 4x5(3) → 5x5(4) → 5x6(5) → 6x6(6)
    if (upgradeId === "room-space") {
      const nextLevel = upgrade.currentLevel + 1;
      // Levels: 1=3x4, 2=4x4, 3=4x5, 4=5x5, 5=5x6, 6=6x6
      if (nextLevel === 1) { setGridHeight(4); } // 3x3 → 3x4
      else if (nextLevel === 2) { setGridWidth(4); } // 3x4 → 4x4
      else if (nextLevel === 3) { setGridHeight(5); } // 4x4 → 4x5
      else if (nextLevel === 4) { setGridWidth(5); } // 4x5 → 5x5
      else if (nextLevel === 5) { setGridHeight(6); } // 5x5 → 5x6
      else if (nextLevel === 6) { setGridWidth(6); } // 5x6 → 6x6
    }
    
    setUpgrades(prev => prev.map(u => {
      if (u.id === upgradeId) {
        const newLevel = u.currentLevel + 1;
        // Exponential cost scaling: multiply by 2 for land upgrades, 1.5 for others
        const costMultiplier = upgradeId === "room-space" ? 2 : 1.5;
        return {
          ...u,
          currentLevel: newLevel,
          cost: Math.floor(u.cost * costMultiplier)
        };
      }
      return u;
    }));

    toast({
      title: "Upgrade Complete!",
      description: `${upgrade.name} is now level ${upgrade.currentLevel + 1}`,
    });
  };

  // Toggle dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Convert owned PCs to 3D scene format
  const scenePCs = ownedPCs.map(pc => ({
    id: pc.id,
    position: pc.position,
    type: pc.type.icon as 'budget' | 'gaming' | 'server',
    token: pc.token,
    isActive: true
  }));

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden" data-testid="game-page">
      <TopResourceBar 
        cash={cash}
        miningRate={totalMiningRate}
        totalMined={totalMined}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onSettings={() => console.log('Settings opened')}
        rebirthCount={rebirthCount}
        earningsMultiplier={earningsMultiplier}
        onRebirth={() => setShowRebirthModal(true)}
      />

      <div className="flex-1 relative overflow-hidden">
        <GameCanvas 
          pcs={scenePCs} 
          workers={ownedWorkers}
          gridWidth={gridWidth}
          gridHeight={gridHeight}
          onPCClick={handlePCClick}
        />
        
        {/* Mobile floating menu buttons */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 p-1 lg:p-2 z-50 bg-gradient-to-t from-background via-background to-transparent">
          <div className="bg-card/95 backdrop-blur-md border-2 border-primary/30 rounded-xl p-1.5 shadow-2xl">
            <div className="grid grid-cols-5 gap-0.5">
              <Button
                variant="ghost"
                className="flex flex-col gap-1 h-auto py-2"
                onClick={() => setMobileMenuOpen('build')}
              >
                <Hammer className="h-5 w-5" />
                <span className="text-xs">Build</span>
              </Button>
              <Button
                variant="ghost"
                className="flex flex-col gap-1 h-auto py-2"
                onClick={() => setMobileMenuOpen('upgrade')}
              >
                <Wrench className="h-5 w-5" />
                <span className="text-xs">Upgrade</span>
              </Button>
              <Button
                variant="ghost"
                className="flex flex-col gap-1 h-auto py-2"
                onClick={() => setMobileMenuOpen('workers')}
              >
                <Users className="h-5 w-5" />
                <span className="text-xs">Workers</span>
              </Button>
              <Button
                variant="ghost"
                className="flex flex-col gap-1 h-auto py-2"
                onClick={() => setMobileMenuOpen('tokens')}
              >
                <Coins className="h-5 w-5" />
                <span className="text-xs">Tokens</span>
              </Button>
              <Button
                variant="ghost"
                className="flex flex-col gap-1 h-auto py-2"
                onClick={() => setMobileMenuOpen('celebrities')}
              >
                <Star className="h-5 w-5" />
                <span className="text-xs">Stars</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop bottom panel - hidden on mobile */}
      <div className="hidden lg:block">
        <BottomControlPanel 
        buildPCContent={
          <div className="space-y-4 overflow-y-auto max-h-[600px]">
            <div className="bg-card/60 border border-primary/20 rounded p-3">
              <p className="text-xs text-muted-foreground font-mono">
                <span className="text-primary font-bold">Worker Requirements:</span> 1 Technician per 5 PCs | 1 Engineer per 5 Gaming PCs | 1 Expert per 5 Server Racks
              </p>
            </div>
            <div>
              <h3 className="font-bold font-mono text-sm text-muted-foreground mb-2">Available PCs</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {availablePCs.map(pc => (
                  <PCCard 
                    key={pc.id}
                    pc={pc}
                    canAfford={cash >= pc.cost}
                    onPurchase={handlePurchasePC}
                  />
                ))}
              </div>
            </div>
            {ownedPCs.length > 0 && (
              <div className="border-t border-card-border pt-3">
                <h3 className="font-bold font-mono text-sm text-muted-foreground mb-2">Your PCs ({ownedPCs.length})</h3>
                <div className="flex flex-wrap gap-2">
                  {ownedPCs.map(pc => (
                    <div key={pc.id} className="flex items-center gap-2 bg-card/60 border border-primary/30 rounded px-3 py-1">
                      <span className="text-sm font-mono">{pc.type.name}</span>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        className="h-5 w-5 p-0 text-destructive hover:text-destructive"
                        onClick={() => handleDeletePC(pc.id)}
                        data-testid={`button-delete-pc-${pc.id}`}
                      >
                        ✕
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        }
        upgradeContent={
          <div className="space-y-6 pt-0">
            {/* Base Expansion */}
            <div className="space-y-2">
              <h3 className="font-bold font-mono text-lg text-blue-400">🏢 Base Expansion</h3>
              <p className="text-xs text-muted-foreground">Expand your mining facility to build more PCs</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {upgrades.filter(u => u.category === 'expansion').map(upgrade => (
                  <UpgradeCard 
                    key={upgrade.id}
                    upgrade={upgrade}
                    canAfford={cash >= upgrade.cost}
                    onPurchase={handleUpgrade}
                    onShowDetails={(u) => { setSelectedUpgrade(u); setShowUpgradeDetails(true); }}
                  />
                ))}
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-primary/20 via-secondary/20 to-transparent"></div>

            {/* Mining Optimization */}
            <div className="space-y-2">
              <h3 className="font-bold font-mono text-lg text-purple-400">⛏️ Mining Optimization</h3>
              <p className="text-xs text-muted-foreground">Boost your mining efficiency and profits</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {upgrades.filter(u => u.category === 'mining').map(upgrade => (
                  <UpgradeCard 
                    key={upgrade.id}
                    upgrade={upgrade}
                    canAfford={cash >= upgrade.cost}
                    onPurchase={handleUpgrade}
                    onShowDetails={(u) => { setSelectedUpgrade(u); setShowUpgradeDetails(true); }}
                  />
                ))}
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-primary/20 via-secondary/20 to-transparent"></div>

            {/* Economy */}
            <div className="space-y-2">
              <h3 className="font-bold font-mono text-lg text-green-400">💰 Economy</h3>
              <p className="text-xs text-muted-foreground">Reduce costs and maximize profits</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {upgrades.filter(u => u.category === 'economy').map(upgrade => (
                  <UpgradeCard 
                    key={upgrade.id}
                    upgrade={upgrade}
                    canAfford={cash >= upgrade.cost}
                    onPurchase={handleUpgrade}
                    onShowDetails={(u) => { setSelectedUpgrade(u); setShowUpgradeDetails(true); }}
                  />
                ))}
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-primary/20 via-secondary/20 to-transparent"></div>

            {/* Automation */}
            <div className="space-y-2">
              <h3 className="font-bold font-mono text-lg text-yellow-400">⚡ Automation</h3>
              <p className="text-xs text-muted-foreground">Unlock automation and convenience features</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {upgrades.filter(u => u.category === 'automation').map(upgrade => (
                  <UpgradeCard 
                    key={upgrade.id}
                    upgrade={upgrade}
                    canAfford={cash >= upgrade.cost}
                    onPurchase={handleUpgrade}
                    onShowDetails={(u) => { setSelectedUpgrade(u); setShowUpgradeDetails(true); }}
                  />
                ))}
              </div>
            </div>
          </div>
        }
        workersContent={
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {availableWorkers.map(worker => {
              const workerDiscountLevel = upgrades.find(u => u.id === 'worker-discount')?.currentLevel || 0;
              const workerDiscountMultiplier = 1 - (workerDiscountLevel * 0.15);
              const discountedCost = Math.floor(worker.cost * workerDiscountMultiplier);
              
              return (
                <WorkerCard 
                  key={worker.id}
                  worker={{ ...worker, cost: discountedCost }}
                  canAfford={cash >= discountedCost}
                  onHire={handleHireWorker}
                />
              );
            })}
          </div>
        }
        tokensContent={
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold font-mono text-lg">Token Market</h3>
              <Badge variant="outline">Switch Cost: ${Math.max(0, 10000 - ((upgrades.find(u => u.id === 'token-discount')?.currentLevel || 0) * 1000)).toLocaleString()}</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tokens.map((token, idx) => {
                const tokenUnlockMap: Record<string, number> = {
                  bitblitz: 0,
                  gala: 1,
                  bene: 2,
                  sol: 3,
                  eth: 4,
                  btc: 5
                };
                const requiredRebirth = tokenUnlockMap[token.id];
                
                return (
                  <TokenCard 
                    key={token.id}
                    token={token}
                    isActive={activeToken === token.id}
                    onClick={() => handleTokenSelect(token.id)}
                    rebirthCount={rebirthCount}
                    requiredRebirth={requiredRebirth > 0 ? requiredRebirth : undefined}
                  />
                );
              })}
            </div>
          </div>
        }
        celebritiesContent={
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold font-mono text-lg mb-4">Celebrity Visits</h3>
              <p className="text-muted-foreground mb-4 text-sm">
                Famous crypto personalities may visit your mining farm! Unlock more by mining more.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-2 p-2 bg-card/60 rounded">
                  <span className="text-2xl">👑</span>
                  <div>
                    <p className="text-sm font-bold">Crypto King</p>
                    <p className="text-xs text-muted-foreground">Always available</p>
                  </div>
                </div>
                {totalMined >= 50000 && (
                  <div className="flex items-center gap-2 p-2 bg-card/60 rounded">
                    <span className="text-2xl">⚙️</span>
                    <div>
                      <p className="text-sm font-bold">Hash Master</p>
                      <p className="text-xs text-muted-foreground">Unlocked at $50K mined</p>
                    </div>
                  </div>
                )}
                {totalMined >= 300000 && (
                  <div className="flex items-center gap-2 p-2 bg-card/60 rounded">
                    <span className="text-2xl">💎</span>
                    <div>
                      <p className="text-sm font-bold">Blockchain Baron</p>
                      <p className="text-xs text-muted-foreground">Unlocked at $300K mined</p>
                    </div>
                  </div>
                )}
                {totalMined >= 1000000 && (
                  <div className="flex items-center gap-2 p-2 bg-card/60 rounded">
                    <span className="text-2xl">🎩</span>
                    <div>
                      <p className="text-sm font-bold">NFT Mogul</p>
                      <p className="text-xs text-muted-foreground">Unlocked at $1M mined</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        }
      />
      </div>

      {/* Mobile Sheet Modals */}
      <Sheet open={mobileMenuOpen === 'build'} onOpenChange={(open) => !open && setMobileMenuOpen(null)}>
        <SheetContent side="bottom" className="h-[80vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Hammer className="h-5 w-5" />
              Build PCs
            </SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-4">
            <div className="bg-card/60 border border-primary/20 rounded p-3">
              <p className="text-xs text-muted-foreground font-mono">
                <span className="text-primary font-bold">Worker Requirements:</span> 1 Technician per 5 PCs | 1 Engineer per 5 Gaming PCs | 1 Expert per 5 Server Racks
              </p>
            </div>
            <div>
              <h3 className="font-bold font-mono text-sm text-muted-foreground mb-2">Available PCs</h3>
              <div className="grid grid-cols-2 gap-2">
                {availablePCs.map(pc => (
                  <PCCard 
                    key={pc.id}
                    pc={pc}
                    canAfford={cash >= pc.cost}
                    onPurchase={handlePurchasePC}
                  />
                ))}
              </div>
            </div>
            {ownedPCs.length > 0 && (
              <div className="border-t border-card-border pt-3">
                <h3 className="font-bold font-mono text-sm text-muted-foreground mb-2">Your PCs ({ownedPCs.length})</h3>
                <div className="flex flex-wrap gap-2">
                  {ownedPCs.map(pc => (
                    <div key={pc.id} className="flex items-center gap-2 bg-card/60 border border-primary/30 rounded px-3 py-1">
                      <span className="text-sm font-mono">{pc.type.name}</span>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        className="h-5 w-5 p-0 text-destructive hover:text-destructive"
                        onClick={() => handleDeletePC(pc.id)}
                      >
                        ✕
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={mobileMenuOpen === 'upgrade'} onOpenChange={(open) => !open && setMobileMenuOpen(null)}>
        <SheetContent side="bottom" className="h-[80vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              Upgrades
            </SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-4">
            <div>
              <h3 className="font-bold font-mono text-sm text-blue-400 mb-2">🏢 Base Expansion</h3>
              <div className="grid grid-cols-2 gap-2">
                {upgrades.filter(u => u.category === 'expansion').map(upgrade => (
                  <UpgradeCard 
                    key={upgrade.id}
                    upgrade={upgrade}
                    canAfford={cash >= upgrade.cost}
                    onPurchase={handleUpgrade}
                    onShowDetails={(u) => { setSelectedUpgrade(u); setShowUpgradeDetails(true); }}
                  />
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-bold font-mono text-sm text-purple-400 mb-2">⛏️ Mining Optimization</h3>
              <div className="grid grid-cols-2 gap-2">
                {upgrades.filter(u => u.category === 'mining').map(upgrade => (
                  <UpgradeCard 
                    key={upgrade.id}
                    upgrade={upgrade}
                    canAfford={cash >= upgrade.cost}
                    onPurchase={handleUpgrade}
                    onShowDetails={(u) => { setSelectedUpgrade(u); setShowUpgradeDetails(true); }}
                  />
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-bold font-mono text-sm text-green-400 mb-2">💰 Economy</h3>
              <div className="grid grid-cols-2 gap-2">
                {upgrades.filter(u => u.category === 'economy').map(upgrade => (
                  <UpgradeCard 
                    key={upgrade.id}
                    upgrade={upgrade}
                    canAfford={cash >= upgrade.cost}
                    onPurchase={handleUpgrade}
                    onShowDetails={(u) => { setSelectedUpgrade(u); setShowUpgradeDetails(true); }}
                  />
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-bold font-mono text-sm text-yellow-400 mb-2">⚡ Automation</h3>
              <div className="grid grid-cols-2 gap-2">
                {upgrades.filter(u => u.category === 'automation').map(upgrade => (
                  <UpgradeCard 
                    key={upgrade.id}
                    upgrade={upgrade}
                    canAfford={cash >= upgrade.cost}
                    onPurchase={handleUpgrade}
                    onShowDetails={(u) => { setSelectedUpgrade(u); setShowUpgradeDetails(true); }}
                  />
                ))}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={mobileMenuOpen === 'workers'} onOpenChange={(open) => !open && setMobileMenuOpen(null)}>
        <SheetContent side="bottom" className="h-[80vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Hire Workers
            </SheetTitle>
          </SheetHeader>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {availableWorkers.map(worker => (
              <WorkerCard 
                key={worker.id}
                worker={worker}
                canAfford={cash >= worker.cost}
                onHire={handleHireWorker}
              />
            ))}
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={mobileMenuOpen === 'tokens'} onOpenChange={(open) => !open && setMobileMenuOpen(null)}>
        <SheetContent side="bottom" className="h-[80vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5" />
              Token Market
            </SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-4">
            <Badge variant="outline" className="w-full justify-center">
              Switch Cost: ${Math.max(0, 1000 - ((upgrades.find(u => u.id === 'token-discount')?.currentLevel || 0) * 200)).toLocaleString()}
            </Badge>
            <div className="grid grid-cols-1 gap-3">
              {tokens.map((token) => {
                const tokenUnlockMap: Record<string, number> = {
                  bitblitz: 0,
                  gala: 1,
                  bene: 2,
                  sol: 3,
                  eth: 4,
                  btc: 5
                };
                const requiredRebirth = tokenUnlockMap[token.id];
                
                return (
                  <TokenCard 
                    key={token.id}
                    token={token}
                    isActive={activeToken === token.id}
                    onClick={() => handleTokenSelect(token.id)}
                    rebirthCount={rebirthCount}
                    requiredRebirth={requiredRebirth > 0 ? requiredRebirth : undefined}
                  />
                );
              })}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={mobileMenuOpen === 'celebrities'} onOpenChange={(open) => !open && setMobileMenuOpen(null)}>
        <SheetContent side="bottom" className="h-[80vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Celebrity Visits
            </SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            <p className="text-muted-foreground mb-4 text-sm">
              Famous crypto personalities may visit your mining farm! Unlock more by mining more.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-3 bg-card/60 rounded border border-primary/20">
                <span className="text-2xl">👑</span>
                <div>
                  <p className="text-sm font-bold">Crypto King</p>
                  <p className="text-xs text-muted-foreground">Always available</p>
                </div>
              </div>
              {totalMined >= 50000 && (
                <div className="flex items-center gap-2 p-3 bg-card/60 rounded border border-primary/20">
                  <span className="text-2xl">⚙️</span>
                  <div>
                    <p className="text-sm font-bold">Hash Master</p>
                    <p className="text-xs text-muted-foreground">Unlocked at $50K mined</p>
                  </div>
                </div>
              )}
              {totalMined >= 300000 && (
                <div className="flex items-center gap-2 p-3 bg-card/60 rounded border border-primary/20">
                  <span className="text-2xl">💎</span>
                  <div>
                    <p className="text-sm font-bold">Blockchain Baron</p>
                    <p className="text-xs text-muted-foreground">Unlocked at $300K mined</p>
                  </div>
                </div>
              )}
              {totalMined >= 1000000 && (
                <div className="flex items-center gap-2 p-3 bg-card/60 rounded border border-primary/20">
                  <span className="text-2xl">🎩</span>
                  <div>
                    <p className="text-sm font-bold">NFT Mogul</p>
                    <p className="text-xs text-muted-foreground">Unlocked at $1M mined</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <CelebrityVisitModal 
        open={showCelebrityModal}
        celebrity={celebrityVisit}
        onClose={() => setShowCelebrityModal(false)}
        onClaim={handleClaimCelebrity}
      />

      {/* Offline Earnings Modal */}
      <Dialog open={showOfflineEarningsModal} onOpenChange={setShowOfflineEarningsModal}>
        <DialogContent className="max-w-[95vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl lg:text-3xl text-center">Welcome Back! 👋</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-center">
              Your mining operation was working while you were away
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg p-4 sm:p-6 border-2 border-primary/50 my-4">
            <p className="text-center text-xs sm:text-sm text-muted-foreground mb-2">Offline Earnings (0.3x → 0.2x → 0.1x, max 24h)</p>
            <p className="text-center text-2xl sm:text-4xl font-bold text-primary">${offlineEarningsAmount.toLocaleString()}</p>
          </div>

          <p className="text-xs sm:text-sm text-center text-muted-foreground">
            Your PCs earned money automatically while you were gone. This amount has been added to your cash!
          </p>

          <DialogFooter>
            <Button 
              onClick={() => setShowOfflineEarningsModal(false)}
              data-testid="button-offline-earnings-ok"
              className="w-full"
            >
              Awesome!
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tutorial Modal */}
      <GameTutorial
        isOpen={showTutorial}
        currentStep={tutorialStep}
        onNext={() => setTutorialStep(prev => prev + 1)}
        onSkip={() => {
          setShowTutorial(false);
          localStorage.setItem('tutorialCompleted', 'true');
        }}
        onComplete={() => {
          setShowTutorial(false);
          localStorage.setItem('tutorialCompleted', 'true');
        }}
      />

      <Dialog open={showRebirthModal} onOpenChange={setShowRebirthModal}>
        <DialogContent className="max-h-[85vh] max-w-[95vw] sm:max-w-[500px] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl lg:text-2xl font-bold text-primary">Rebirth Available</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Reset your progress but gain permanent earnings multiplier
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 lg:space-y-4 py-2 lg:py-4">
            <div className="bg-card/60 border border-primary/20 rounded-lg p-3 lg:p-4 space-y-2 lg:space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm lg:text-base text-muted-foreground">Current Rebirths:</span>
                <Badge className="bg-primary text-xs lg:text-sm">{rebirthCount}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm lg:text-base text-muted-foreground">Current Multiplier:</span>
                <Badge variant="outline" className="text-xs lg:text-sm">{earningsMultiplier.toFixed(1)}x</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm lg:text-base text-muted-foreground">New Multiplier:</span>
                <Badge className="bg-secondary text-xs lg:text-sm">{(1 + ((rebirthCount + 1) * 0.1)).toFixed(1)}x</Badge>
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-card/60 border border-primary/20 rounded-lg p-3 lg:p-4 space-y-2">
              <h4 className="text-sm lg:text-base font-bold text-primary">Requirements:</h4>
              {rebirthRequirements.map((req, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className={`text-lg ${req.met ? 'text-green-400' : 'text-red-400'}`}>
                    {req.met ? '✓' : '✗'}
                  </span>
                  <span className={`text-xs lg:text-sm ${req.met ? 'text-muted-foreground' : 'text-red-400'}`}>
                    {req.description}
                  </span>
                </div>
              ))}
            </div>

            {rebirthCount === 0 && (
              <div className="bg-secondary/10 border border-secondary/30 rounded-lg p-3">
                <p className="text-sm font-bold text-secondary">🎯 Rebirth 1 Unlocks:</p>
                <p className="text-xs text-muted-foreground mt-1">Gala token - mine a new crypto!</p>
              </div>
            )}
            {rebirthCount === 1 && (
              <div className="bg-secondary/10 border border-secondary/30 rounded-lg p-3">
                <p className="text-sm font-bold text-secondary">🎯 Rebirth 2 Unlocks:</p>
                <p className="text-xs text-muted-foreground mt-1">Bene token - higher earning potential!</p>
              </div>
            )}
            {rebirthCount === 2 && (
              <div className="bg-secondary/10 border border-secondary/30 rounded-lg p-3">
                <p className="text-sm font-bold text-secondary">🎯 Rebirth 3 Unlocks:</p>
                <p className="text-xs text-muted-foreground mt-1">Solana token - even more profitable!</p>
              </div>
            )}
            {rebirthCount === 3 && (
              <div className="bg-secondary/10 border border-secondary/30 rounded-lg p-3">
                <p className="text-sm font-bold text-secondary">🎯 Rebirth 4 Unlocks:</p>
                <p className="text-xs text-muted-foreground mt-1">Ethereum - legendary earnings!</p>
              </div>
            )}
            {rebirthCount === 4 && (
              <div className="bg-secondary/10 border border-secondary/30 rounded-lg p-3">
                <p className="text-sm font-bold text-secondary">🎯 Rebirth 5 Unlocks:</p>
                <p className="text-xs text-muted-foreground mt-1">Bitcoin - the ultimate crypto!</p>
              </div>
            )}

            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
              <p className="text-sm text-destructive font-bold">⚠️ Warning:</p>
              <p className="text-xs text-muted-foreground mt-1">
                Rebirths will reset your farm, PCs, workers, and upgrades. You keep only the earnings multiplier.
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowRebirthModal(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleRebirth}
              disabled={!canRebirth}
              className="bg-gradient-to-r from-primary to-secondary"
            >
              <Zap className="h-4 w-4 mr-2" />
              Rebirth Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upgrade Details Modal */}
      <UpgradeDetailsModal 
        upgrade={selectedUpgrade}
        open={showUpgradeDetails}
        onClose={() => setShowUpgradeDetails(false)}
      />

    </div>
  );
}
