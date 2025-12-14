import { useState, useEffect, useMemo, useCallback } from 'react';
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
import TutorialMobile from '@/components/TutorialMobile';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useToast } from '@/hooks/use-toast';
import { useGamePersistence } from '@/hooks/useGamePersistence';
import { useUpgradeLevels } from '@/hooks/useUpgradeLevels';
import BuildPCPanel from '@/components/BuildPCPanel';
import HireWorkersPanel from '@/components/HireWorkersPanel';
import TokensPanel from '@/components/TokensPanel';
import UpgradesPanel from '@/components/UpgradesPanel';
import CashFloatingEffect from '@/components/CashFloatingEffect';
import HashCracker from '@/components/minigames/HashCracker';
import MemoryMatch from '@/components/minigames/MemoryMatch';
import PricePrediction from '@/components/minigames/PricePrediction';
import CableConnect from '@/components/minigames/CableConnect';
import TimingChallenge from '@/components/minigames/TimingChallenge';
import { Expand, Zap, Hammer, Wrench, Users, Coins, Star } from 'lucide-react';
import bitblitzIcon from '@assets/generated_images/bitblitz_crypto_token_icon.png';
import { INITIAL_CASH, INITIAL_GRID_SIZE, AVAILABLE_PCS, AVAILABLE_WORKERS, DEFAULT_TOKENS, DEFAULT_UPGRADES } from '@/utils/gameConstants';
import { calculateRebirthCost, calculateEarningsMultiplier } from '@/utils/gameCalculations';
import { Minigame } from '@/types/minigames';
import { useInstantSave } from '@/hooks/useInstantSave';

export default function Game() {
  const { toast } = useToast();
  
  // Game state
  const [userId, setUserId] = useState<string | null>(null);
  const [cash, setCash] = useState(INITIAL_CASH);
  const [totalMined, setTotalMined] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [celebrityVisit, setCelebrityVisit] = useState<Celebrity | null>(null);
  const [showCelebrityModal, setShowCelebrityModal] = useState(false);
  const [gridWidth, setGridWidth] = useState(INITIAL_GRID_SIZE);
  const [gridHeight, setGridHeight] = useState(INITIAL_GRID_SIZE);
  const [rebirthCount, setRebirthCount] = useState(0);
  const [showRebirthModal, setShowRebirthModal] = useState(false);
  const [lastLogout, setLastLogout] = useState<number>(Date.now());
  const [offlineEarningsAmount, setOfflineEarningsAmount] = useState(0);
  const [showOfflineEarningsModal, setShowOfflineEarningsModal] = useState(false);
  const [selectedUpgrade, setSelectedUpgrade] = useState<Upgrade | null>(null);
  const [showUpgradeDetails, setShowUpgradeDetails] = useState(false);
  const [showTutorial, setShowTutorial] = useState(localStorage.getItem('tutorialCompleted') !== 'true');
  const [tutorialStep, setTutorialStep] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [playerName, setPlayerName] = useState(localStorage.getItem('playerName') || 'Miner');
  const [playerAvatar, setPlayerAvatar] = useState(localStorage.getItem('playerAvatar') || '⚡');
  const [tutorialHasBoughtWorker, setTutorialHasBoughtWorker] = useState(false);
  const [tutorialHasBoughtPC, setTutorialHasBoughtPC] = useState(false);
  const [tutorialWorkersTabClicked, setTutorialWorkersTabClicked] = useState(false);
  const [tutorialBuildTabClicked, setTutorialBuildTabClicked] = useState(false);
  const [activeTab, setActiveTab] = useState<string | undefined>(undefined);

  // Mining floor grid start (must match Floor component)
  // Must mirror Floor's start: centerX - floorWidth/2, centerZ - floorDepth/2
  // Floor uses centerX = -15 + floorWidth/2 and centerZ = -4 + floorDepth/2
  // Therefore grid starts at x=-15, z=-4
  const GRID_START_X = -15;
  const GRID_START_Z = -4;
  
  // Floating cash effect state
  const [floatingCash, setFloatingCash] = useState<Array<{ id: string; amount: number; startX: number; startY: number }>>([]);
  
  // Celebrity minigame state
  const [activeBoosts, setActiveBoosts] = useState<Array<{ type: 'multiplier' | 'boost'; value: number; expiresAt: number }>>([]);
  const [activeCelebrityMinigame, setActiveCelebrityMinigame] = useState<string | null>(null);
  const [pendingCelebrityReward, setPendingCelebrityReward] = useState<Celebrity | null>(null);
  
  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState<string | null>(null);
  
  // Desktop panel state
  const [desktopPanelOpen, setDesktopPanelOpen] = useState(true);
  const [desktopActiveTab, setDesktopActiveTab] = useState<string | undefined>(undefined);

  // PC dragging state
  const [selectedPCId, setSelectedPCId] = useState<string>('');

  // Detect screen size changes for tutorial selection
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // PC state - todo: remove mock functionality
  const [ownedPCs, setOwnedPCs] = useState<Array<{ id: string; type: PCType; token: string; position: [number, number, number]; pendingEarnings: number }>>([]);

  // Workers state - start with no workers
  const [ownedWorkers, setOwnedWorkers] = useState<Array<{ id: string; type: string }>>([]);

  // Use constants for available PCs and workers
  const availablePCs = AVAILABLE_PCS as any[];
  const availableWorkers = AVAILABLE_WORKERS as any[];

  // Handle PC click to collect cash
  const handlePCClick = (pcId: string) => {
    const pc = ownedPCs.find(p => p.id === pcId);
    if (pc && pc.pendingEarnings > 0) {
      const earned = Math.floor(pc.pendingEarnings);
      setCash(prev => prev + earned);
      setTotalMined(prev => prev + earned);
      setOwnedPCs(prev => prev.map(p => 
        p.id === pcId ? { ...p, pendingEarnings: 0 } : p
      ));

      // Trigger floating cash effect from center of screen (where PC would be)
      const screenCenterX = window.innerWidth / 2;
      const screenCenterY = window.innerHeight / 2;
      
      setFloatingCash(prev => [...prev, {
        id: `cash-${Date.now()}-${pcId}`,
        amount: earned,
        startX: screenCenterX,
        startY: screenCenterY,
      }]);
    }
  };

  // Handle PC position change from dragging
  const handlePCPositionChange = (pcId: string, newPosition: [number, number, number]) => {
    setOwnedPCs(prev => prev.map(pc => 
      pc.id === pcId ? { ...pc, position: newPosition } : pc
    ));
  };

  // Handle PC selection for dragging (toggle)
  const handleSelectPC = (pcId: string) => {
    setSelectedPCId(pcId);
  };

  // Handle tab changes for tutorial tracking
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (showTutorial && tab === 'workers' && !tutorialWorkersTabClicked) {
      setTutorialWorkersTabClicked(true);
    }
    if (showTutorial && tab === 'build' && !tutorialBuildTabClicked) {
      setTutorialBuildTabClicked(true);
    }
  };

  // Handle mobile menu opens for tutorial tracking
  const handleMobileMenuOpen = (menu: string) => {
    setMobileMenuOpen(menu);
    if (showTutorial && menu === 'workers' && !tutorialWorkersTabClicked) {
      setTutorialWorkersTabClicked(true);
    }
    if (showTutorial && menu === 'build' && !tutorialBuildTabClicked) {
      setTutorialBuildTabClicked(true);
    }
  };

  // Tokens - unlocked based on rebirths. Order: bitblitz -> gala -> bene -> sol -> eth -> btc
  // Prices roughly 2x of previous but with variance
  const [tokens, setTokens] = useState<Token[]>(DEFAULT_TOKENS);

  const [activeToken, setActiveToken] = useState('bitblitz');

  // Upgrades state
  const [upgrades, setUpgrades] = useState<Upgrade[]>(DEFAULT_UPGRADES);

  // Efficient upgrade level access
  const upgradeLevels = useUpgradeLevels(upgrades);

  // Calculate total mining rate (in cash/s based on PC rates and token values) - memoized
  const totalMiningRate = useMemo(() => {
    const miningSpeedBoost = 1 + (upgradeLevels.miningSpeedLevel * 0.1);
    
    // Apply active boosts
    let totalBoostMultiplier = 1;
    const now = Date.now();
    activeBoosts.forEach(boost => {
      if (boost.expiresAt > now) {
        if (boost.type === 'boost') {
          totalBoostMultiplier *= boost.value;
        }
      }
    });
    
    return ownedPCs.reduce((sum, pc) => {
      const token = tokens.find(t => t.id === pc.token);
      const tokensPerSecond = pc.type.miningRate * miningSpeedBoost * totalBoostMultiplier;
      const cashPerToken = token?.profitRate || 10;
      return sum + (tokensPerSecond * cashPerToken);
    }, 0);
  }, [ownedPCs, tokens, upgradeLevels.miningSpeedLevel, activeBoosts]);

  // Calculate earnings multiplier from rebirths (0.1x per rebirth)
  const earningsMultiplier = calculateEarningsMultiplier(rebirthCount);
  
  // Apply active multiplier boosts
  const activeMultiplier = useMemo(() => {
    let multiplier = 1;
    const now = Date.now();
    activeBoosts.forEach(boost => {
      if (boost.expiresAt > now && boost.type === 'multiplier') {
        multiplier *= boost.value;
      }
    });
    return multiplier;
  }, [activeBoosts]);

  // Keep menus open/focused during tutorial start
  useEffect(() => {
    if (showTutorial) {
      setDesktopPanelOpen(true);
      setActiveTab(undefined);
      setMobileMenuOpen(null);
    }
  }, [showTutorial]);

  // Game persistence (localStorage load/save)
  useGamePersistence({
    cash,
    totalMined,
    gridWidth,
    gridHeight,
    rebirthCount,
    ownedPCs,
    ownedWorkers,
    upgrades,
    tokens,
    activeToken,
    tutorialActive: showTutorial,
    setCash,
    setTotalMined,
    setGridWidth,
    setGridHeight,
    setRebirthCount,
    setOwnedPCs,
    setOwnedWorkers,
    setUpgrades,
    setTokens,
    onOfflineEarnings: (amount, minutes) => {
      setOfflineEarningsAmount(amount);
      setCash(prev => prev + amount);
      setTotalMined(prev => prev + amount);
      setShowOfflineEarningsModal(true);
    }
  });

  // Instant save hook
  const instantSave = useInstantSave({
    cash,
    totalMined,
    gridWidth,
    gridHeight,
    rebirthCount,
    ownedPCs,
    ownedWorkers,
    upgrades,
    tokens,
    activeToken,
    tutorialActive: showTutorial
  });

  // Mining income - accumulate on PCs
  useEffect(() => {
    const interval = setInterval(() => {
      const miningSpeedBoost = 1 + (upgradeLevels.miningSpeedLevel * 0.1); // +10% per level
      
      // Apply active boosts
      let totalBoostMultiplier = 1;
      const now = Date.now();
      activeBoosts.forEach(boost => {
        if (boost.expiresAt > now) {
          if (boost.type === 'boost') {
            totalBoostMultiplier *= boost.value;
          }
        }
      });
      
      // Calculate active multiplier
      let activeMultiplierValue = 1;
      activeBoosts.forEach(boost => {
        if (boost.expiresAt > now && boost.type === 'multiplier') {
          activeMultiplierValue *= boost.value;
        }
      });
      
      setOwnedPCs(prev => prev.map(pc => {
        const token = tokens.find(t => t.id === pc.token);
        const tokensPerSecond = pc.type.miningRate * miningSpeedBoost * totalBoostMultiplier; // Apply mining speed boost
        const cashPerToken = token?.profitRate || 10; // Value per token
        const income = Math.floor(tokensPerSecond * cashPerToken * earningsMultiplier * activeMultiplierValue); // 1 second of earnings
        
        if (upgradeLevels.autoCollectEnabled) {
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
  }, [earningsMultiplier, upgradeLevels.miningSpeedLevel, upgradeLevels.autoCollectEnabled, tokens, activeBoosts]);

  // Random celebrity visits - unlock based on earnings
  useEffect(() => {
    // Disable celebrity visits during tutorial
    if (showTutorial) return;
    
    const celebInterval = setInterval(() => {
      // Don't spawn celebrity if a minigame is active
      if (activeCelebrityMinigame) return;
      
      if (Math.random() > 0.92) { // 8% chance every 30 seconds (~4 min average)
        // Celebrity pool that grows as you earn more
        // Bonuses are based on current mining rate
        const currentRate = Math.max(totalMiningRate * earningsMultiplier, 100); // Ensure minimum bonus
        
        // Select random minigame based on rebirth level
        const availableMinigames: string[] = ['hash-cracker', 'price-prediction', 'timing-challenge'];
        if (rebirthCount >= 3) availableMinigames.push('memory-match');
        if (rebirthCount >= 5) availableMinigames.push('cable-connect');
        const randomMinigame = availableMinigames[Math.floor(Math.random() * availableMinigames.length)];
        
        const baseCelebrities = [
          { id: '1', name: 'Crypto King', title: 'Legendary Investor', bonus: Math.floor(currentRate * 100), boostDuration: 30, boostMultiplier: 2, minigameId: randomMinigame }
        ];
        
        const unlockedCelebrities = [
          ...(totalMined >= 50000 ? [{ id: '2', name: 'Hash Master', title: 'Mining Pioneer', bonus: Math.floor(currentRate * 200), boostDuration: 20, boostMultiplier: 1.5, minigameId: randomMinigame }] : []),
          ...(totalMined >= 300000 ? [{ id: '3', name: 'Blockchain Baron', title: 'Tech Visionary', bonus: Math.floor(currentRate * 300), boostDuration: 60, boostMultiplier: 3, minigameId: randomMinigame }] : []),
          ...(totalMined >= 1000000 ? [{ id: '4', name: 'NFT Mogul', title: 'Digital Tycoon', bonus: Math.floor(currentRate * 400), boostDuration: 45, boostMultiplier: 2.5, minigameId: randomMinigame }] : [])
        ];
        
        const allCelebrities = [...baseCelebrities, ...unlockedCelebrities];
        const celeb = allCelebrities[Math.floor(Math.random() * allCelebrities.length)];
        setCelebrityVisit(celeb);
        setShowCelebrityModal(true);
      }
    }, 30000);

    return () => clearInterval(celebInterval);
  }, [totalMined, totalMiningRate, earningsMultiplier, rebirthCount, activeCelebrityMinigame, showTutorial]);

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
    }, 10000);

    return () => clearInterval(priceInterval);
  }, []);

  // Count workers by type - memoized
  const workerCounts = useMemo(() => ({
    technicians: ownedWorkers.filter(w => w.type === 'technician').length,
    engineers: ownedWorkers.filter(w => w.type === 'engineer').length,
    experts: ownedWorkers.filter(w => w.type === 'expert').length,
  }), [ownedWorkers]);

  // PC Tiers - memoized
  const pcTierCounts = useMemo(() => ({
    tier1: ownedPCs.filter(pc => ['budget', 'laptop', 'workstation'].includes(pc.type.id)).length,
    tier2: ownedPCs.filter(pc => ['gaming', 'mining-rig'].includes(pc.type.id)).length,
    tier3: ownedPCs.filter(pc => ['server', 'quantum'].includes(pc.type.id)).length,
  }), [ownedPCs]);

  const handlePurchasePC = useCallback((pcId: string) => {
    const pc = availablePCs.find(p => p.id === pcId);
    if (!pc || cash < pc.cost) return;

    // Tier 1 (Budget, Laptop, Workstation): 1 Technician per 5 PCs total
    if (['budget', 'laptop', 'workstation'].includes(pcId)) {
      const tier1Total = pcTierCounts.tier1 + 1;
      const techsNeeded = Math.ceil(tier1Total / 5);
      const techsHave = workerCounts.technicians;

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
      const tier2Total = pcTierCounts.tier2 + 1;
      const engsNeeded = Math.ceil(tier2Total / 5);
      const engsHave = workerCounts.engineers;

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
      const tier3Total = pcTierCounts.tier3 + 1;
      const expertsNeeded = Math.ceil(tier3Total / 5);
      const expertsHave = workerCounts.experts;

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
    
    // Track tutorial progress
    if (showTutorial && !tutorialHasBoughtPC) {
      setTutorialHasBoughtPC(true);
    }
    
    // Optimized: Find first available position without generating full grid
    // Grid matches Floor: starts at [GRID_START_X, GRID_START_Z], expands right (gridWidth) and back (gridHeight)
    let foundPosition: [number, number, number] | null = null;
    for (let x = GRID_START_X; x < GRID_START_X + gridWidth * 2 && !foundPosition; x += 2) {
      for (let z = GRID_START_Z; z < GRID_START_Z + gridHeight * 2 && !foundPosition; z += 2) {
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

      instantSave();
    } else {
      toast({
        title: "No Space!",
        description: "Expand your room to place more PCs",
        variant: "destructive"
      });
      setCash(prev => prev + pc.cost);
    }
  }, [availablePCs, cash, pcTierCounts, workerCounts, ownedPCs, gridWidth, gridHeight, activeToken, tokens, toast]);

  const handleHireWorker = useCallback((workerId: string) => {
    const worker = availableWorkers.find(w => w.id === workerId);
    if (!worker) return;
    
    // Apply worker discount
    const workerDiscountMultiplier = 1 - (upgradeLevels.workerDiscountLevel * 0.15);
    const discountedCost = Math.floor(worker.cost * workerDiscountMultiplier);
    
    if (cash < discountedCost) return;

    setCash(prev => prev - discountedCost);
    setOwnedWorkers(prev => [...prev, { id: `worker-${Date.now()}`, type: worker.type }]);

    // Track tutorial progress
    if (showTutorial && !tutorialHasBoughtWorker) {
      setTutorialHasBoughtWorker(true);
    }

    toast({
      title: "Worker Hired!",
      description: `${worker.name} is now maintaining your PCs`,
    });

    instantSave();
  }, [availableWorkers, cash, upgradeLevels.workerDiscountLevel, toast, showTutorial, tutorialHasBoughtWorker]);

  const handleTokenSelect = useCallback((tokenId: string) => {
    const token = tokens.find(t => t.id === tokenId);
    if (!token?.unlocked) return;
    
    const baseTokenSwitchCost = 10000;
    const discountAmount = upgradeLevels.tokenDiscountLevel * 1000;
    const switchCost = Math.max(0, baseTokenSwitchCost - discountAmount);
    
    if (activeToken !== tokenId && cash >= switchCost) {
      setCash(prev => prev - switchCost);
      setActiveToken(tokenId);
      
      toast({
        title: "Token Switched!",
        description: `Now mining ${token.name} (-$${switchCost})`,
      });

      instantSave();
    }
  }, [tokens, activeToken, cash, upgradeLevels.tokenDiscountLevel, toast]);

  // One-time migration: move any existing PCs to the new floor grid
  useEffect(() => {
    const flagKey = 'migratedToNewGrid_v1';
    if (localStorage.getItem(flagKey) === 'true') return;
    if (!ownedPCs.length) return;

    const floorWidth = gridWidth * 2;
    const floorDepth = gridHeight * 2;
    const within = (pos: [number, number, number]) =>
      pos[0] >= GRID_START_X - 0.5 && pos[0] < GRID_START_X + floorWidth + 0.5 &&
      pos[2] >= GRID_START_Z - 0.5 && pos[2] < GRID_START_Z + floorDepth + 0.5;

    const needsMigration = ownedPCs.some(pc => !within(pc.position));
    if (!needsMigration) return;

    // Assign PCs to first available slots on the new grid
    const occupied = new Set<string>();
    const key = (x: number, z: number) => `${x},${z}`;
    const assignments = new Map<string, [number, number, number]>();

    for (let x = GRID_START_X; x < GRID_START_X + floorWidth; x += 2) {
      for (let z = GRID_START_Z; z < GRID_START_Z + floorDepth; z += 2) {
        occupied.add(key(x, z));
      }
    }
    // Mark already placed PCs that are within bounds as occupied
    ownedPCs.forEach(pc => {
      if (within(pc.position)) {
        occupied.delete(key(pc.position[0], pc.position[2]));
      }
    });

    // Reassign those outside bounds to free slots
    for (const pc of ownedPCs) {
      if (within(pc.position)) continue;
      let placed: [number, number, number] | null = null;
      outer: for (let x = GRID_START_X; x < GRID_START_X + floorWidth; x += 2) {
        for (let z = GRID_START_Z; z < GRID_START_Z + floorDepth; z += 2) {
          if (!occupied.has(key(x, z))) {
            placed = [x as number, 0.1 as number, z as number];
            occupied.add(key(x, z));
            break outer;
          }
        }
      }
      if (placed) assignments.set(pc.id, placed);
    }

    if (assignments.size > 0) {
      setOwnedPCs(prev => prev.map(pc => assignments.get(pc.id) ? { ...pc, position: assignments.get(pc.id)! } : pc));
      localStorage.setItem(flagKey, 'true');
    }
  }, [ownedPCs, gridWidth, gridHeight]);

  const handleClaimCelebrity = () => {
    if (celebrityVisit) {
      setCash(prev => prev + celebrityVisit.bonus);
      
      toast({
        title: "Celebrity Bonus Claimed!",
        description: `+$${celebrityVisit.bonus.toLocaleString()} from ${celebrityVisit.name}`,
      });
    }
    setCelebrityVisit(null);
    setShowCelebrityModal(false);
    setPendingCelebrityReward(null);
  };

  const handleStartCelebrityMinigame = () => {
    if (celebrityVisit && celebrityVisit.minigameId) {
      setPendingCelebrityReward(celebrityVisit);
      setActiveCelebrityMinigame(celebrityVisit.minigameId);
      setShowCelebrityModal(false);
    }
  };

  const handleCelebrityMinigameComplete = (gameId: string, success: boolean, data: any) => {
    setActiveCelebrityMinigame(null);
    
    if (success && pendingCelebrityReward) {
      // Award the celebrity bonus
      setCash(prev => prev + pendingCelebrityReward.bonus);
      setTotalMined(prev => prev + pendingCelebrityReward.bonus);
      
      toast({
        title: "🎉 Challenge Won!",
        description: `${pendingCelebrityReward.name} awarded you $${pendingCelebrityReward.bonus.toLocaleString()}!`,
      });
      
      setPendingCelebrityReward(null);
      setCelebrityVisit(null);
    } else {
      // Failed the minigame
      toast({
        title: "Challenge Failed",
        description: "Better luck next time!",
        variant: "destructive"
      });
      
      setPendingCelebrityReward(null);
      setCelebrityVisit(null);
    }

    instantSave();
  };

  // Clean up expired boosts
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setActiveBoosts(prev => prev.filter(boost => boost.expiresAt > now));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

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

    // Trigger floating cash effect from center of screen (where PC would be)
    const screenCenterX = window.innerWidth / 2;
    const screenCenterY = window.innerHeight / 2;
    
    setFloatingCash(prev => [...prev, {
      id: `cash-${Date.now()}-${pcId}`,
      amount: earned,
      startX: screenCenterX,
      startY: screenCenterY,
    }]);

    toast({
      title: "Coins Collected!",
      description: `+$${earned.toLocaleString()} from ${pc.type.name}`,
    });
  };

  // Calculate rebirth cost using utility function - memoized
  const rebirthCost = useMemo(() => 
    calculateRebirthCost(rebirthCount, upgradeLevels.rebirthDiscountLevel), 
    [rebirthCount, upgradeLevels.rebirthDiscountLevel]
  );

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
      const hasGamingPC = ownedPCs.some(pc => pc.type.id === 'gaming');
      requirements.push({ met: hasGamingPC, description: '1 Gaming PC' });
    } else if (rebirthCount === 3) {
      const hasServerRack = ownedPCs.some(pc => pc.type.id === 'server');
      requirements.push({ met: hasServerRack, description: '1 Server Rack' });
    } else if (rebirthCount === 4) {
      const hasQuantumCore = ownedPCs.some(pc => pc.type.id === 'quantum');
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
    setCash(20000000);
    setOwnedPCs([{
      id: 'pc-1',
      type: availablePCs[0],
      token: 'bitblitz',
      position: [GRID_START_X, 0.1, GRID_START_Z],
      pendingEarnings: 0
    }]);
    setOwnedWorkers([]);
    setGridWidth(3);
    setGridHeight(3);
    setActiveToken('bitblitz');
    setRebirthCount(prev => prev + 1);
    setShowRebirthModal(false);

    // Reset only room-space upgrade to level 0
    setUpgrades(prev => prev.map(upgrade => {
      if (upgrade.id === 'room-space') {
        return {
          ...upgrade,
          currentLevel: 0,
          cost: 20000
        };
      }
      return upgrade;
    }));

    toast({
      title: "Rebirth Complete!",
      description: `You are now at rebirth level ${rebirthCount + 1}. New multiplier: ${(1 + ((rebirthCount + 1) * 0.1)).toFixed(1)}x`,
    });

    instantSave();
  };

  const handleUpgrade = (upgradeId: string) => {
    const upgrade = upgrades.find((u: Upgrade) => u.id === upgradeId);
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

    instantSave();
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
    isActive: true,
    pendingEarnings: pc.pendingEarnings
  }));

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden" data-testid="game-page">
      {/* Floating cash effect */}
      <CashFloatingEffect 
        floatingCash={floatingCash}
        onComplete={(id) => setFloatingCash(prev => prev.filter(c => c.id !== id))}
      />
      
      <TopResourceBar 
        cash={cash}
        miningRate={totalMiningRate}
        totalMined={totalMined}
        isDarkMode={isDarkMode}
        onToggleDarkMode={undefined}
        onSettings={() => console.log('Settings opened')}
        rebirthCount={rebirthCount}
        earningsMultiplier={earningsMultiplier}
        onRebirth={() => setShowRebirthModal(true)}
        playerName={playerName}
      />

      <div className="flex-1 relative overflow-hidden">
        <GameCanvas 
          pcs={scenePCs} 
          workers={ownedWorkers}
          gridWidth={gridWidth}
          gridHeight={gridHeight}
          onPCClick={handlePCClick}
          onPCPositionChange={handlePCPositionChange}
          onSelectPC={handleSelectPC}
          selectedPCId={selectedPCId}
          gridStartX={GRID_START_X}
          gridStartZ={GRID_START_Z}
          enableDragging={true}
        />
        
        {/* Mobile floating menu buttons */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 p-1 lg:p-2 z-50 bg-gradient-to-t from-background via-background to-transparent">
          <div className="bg-card/95 backdrop-blur-md border-2 border-primary/30 rounded-xl p-1.5 shadow-2xl">
            <div className="grid grid-cols-5 gap-0.5">
              <Button
                variant="ghost"
                className="flex flex-col gap-1 h-auto py-2"
                onClick={() => handleMobileMenuOpen('build')}
                data-tutorial-id="build-tab"
              >
                <Hammer className="h-5 w-5" />
                <span className="text-xs">Build</span>
              </Button>
              <Button
                variant="ghost"
                className="flex flex-col gap-1 h-auto py-2"
                onClick={() => {
                  if (showTutorial) return; // Block during tutorial
                  setMobileMenuOpen('upgrade');
                }}
              >
                <Wrench className="h-5 w-5" />
                <span className="text-xs">Upgrade</span>
              </Button>
              <Button
                variant="ghost"
                className="flex flex-col gap-1 h-auto py-2"
                onClick={() => handleMobileMenuOpen('workers')}
                data-tutorial-id="workers-tab"
              >
                <Users className="h-5 w-5" />
                <span className="text-xs">Workers</span>
              </Button>
              <Button
                variant="ghost"
                className="flex flex-col gap-1 h-auto py-2"
                onClick={() => {
                  if (showTutorial) return; // Block during tutorial
                  setMobileMenuOpen('tokens');
                }}
              >
                <Coins className="h-5 w-5" />
                <span className="text-xs">Tokens</span>
              </Button>
              <Button
                variant="ghost"
                className="flex flex-col gap-1 h-auto py-2"
                onClick={() => {
                  if (showTutorial) return; // Block during tutorial
                  setMobileMenuOpen('celebrities');
                }}
              >
                <Star className="h-5 w-5" />
                <span className="text-xs">Stars</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop bottom panel with close control */}
      <div className="hidden lg:block fixed bottom-0 left-0 right-0 z-40">
        {desktopPanelOpen ? (
          <div className="relative">
            <button
              className="absolute right-4 -top-6 px-3 py-1 rounded-full bg-white shadow-md border text-sm font-semibold"
              onClick={() => {
                if (showTutorial) return; // keep open during tutorial
                setDesktopPanelOpen(false);
              }}
            >
              Close Menu
            </button>
            <BottomControlPanel
              buildPCContent={(
                <BuildPCPanel
                  availablePCs={availablePCs as PCType[]}
                  ownedPCs={ownedPCs}
                  cash={cash}
                  onPurchase={handlePurchasePC}
                  onDelete={handleDeletePC}
                />
              )}
              upgradeContent={(
                <UpgradesPanel
                  upgrades={upgrades}
                  cash={cash}
                    onPurchase={handleUpgrade}
                  onShowDetails={(upgrade) => {
                    setSelectedUpgrade(upgrade);
                    setShowUpgradeDetails(true);
                  }}
                />
              )}
              workersContent={(
                <HireWorkersPanel
                  availableWorkers={availableWorkers as any[]}
                  ownedWorkers={ownedWorkers}
                  cash={cash}
                  workerDiscountLevel={upgradeLevels.workerDiscountLevel}
                  onHire={handleHireWorker}
                />
              )}
              tokensContent={(
                <TokensPanel
                  tokens={tokens}
                  activeToken={activeToken}
                  cash={cash}
                  tokenDiscountLevel={upgradeLevels.tokenDiscountLevel}
                  onSelect={setActiveToken}
                />
              )}
              celebritiesContent={(
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
              )}
              onTabChange={handleTabChange}
              activeTab={activeTab}
            />
          </div>
        ) : (
          <div className="flex justify-center pb-2">
            <button
              className="px-4 py-2 rounded-full bg-white shadow-lg border font-semibold"
              onClick={() => setDesktopPanelOpen(true)}
            >
              Open Menu
            </button>
          </div>
        )}
      </div>

      {/* Mobile Sheet Modals */}
      <Sheet open={mobileMenuOpen === 'build'} onOpenChange={(open) => {
        // Don't allow closing during tutorial
        if (!showTutorial && !open) {
          setMobileMenuOpen(null);
        }
      }}>
        <SheetContent 
          side="bottom" 
          className="h-[80vh] overflow-y-auto" 
          data-tutorial-id="build-content"
        >
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

      <Sheet open={mobileMenuOpen === 'workers'} onOpenChange={(open) => {
        // Don't allow closing during tutorial
        if (!showTutorial && !open) {
          setMobileMenuOpen(null);
        }
      }}>
        <SheetContent 
          side="bottom" 
          className="h-[80vh] overflow-y-auto" 
          data-tutorial-id="workers-content"
        >
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Hire Workers
            </SheetTitle>
          </SheetHeader>
          <div className="mt-4 grid grid-cols-1 gap-3">
            {availableWorkers.map(worker => {
              const discountedCost = Math.floor(worker.cost * (1 - upgradeLevels.workerDiscountLevel * 0.15));
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
              Switch Cost: ${Math.max(0, 1000 - (upgradeLevels.tokenDiscountLevel * 200)).toLocaleString()}
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
        onStartMinigame={handleStartCelebrityMinigame}
      />

      {/* Celebrity Minigame Modals */}
      <HashCracker
        isOpen={activeCelebrityMinigame === 'hash-cracker'}
        onClose={() => setActiveCelebrityMinigame(null)}
        onComplete={(success, score) => handleCelebrityMinigameComplete('hash-cracker', success, score)}
      />

      <PricePrediction
        isOpen={activeCelebrityMinigame === 'price-prediction'}
        onClose={() => setActiveCelebrityMinigame(null)}
        onComplete={(success, correct) => handleCelebrityMinigameComplete('price-prediction', success, correct)}
      />

      <TimingChallenge
        isOpen={activeCelebrityMinigame === 'timing-challenge'}
        onClose={() => setActiveCelebrityMinigame(null)}
        onComplete={(success, accuracy) => handleCelebrityMinigameComplete('timing-challenge', success, accuracy)}
      />

      <MemoryMatch
        isOpen={activeCelebrityMinigame === 'memory-match'}
        onClose={() => setActiveCelebrityMinigame(null)}
        onComplete={(success, moves) => handleCelebrityMinigameComplete('memory-match', success, moves)}
      />

      <CableConnect
        isOpen={activeCelebrityMinigame === 'cable-connect'}
        onClose={() => setActiveCelebrityMinigame(null)}
        onComplete={(success, time) => handleCelebrityMinigameComplete('cable-connect', success, time)}
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

      {/* Tutorial Modal - Desktop or Mobile based on screen size */}
      {isMobile ? (
        <TutorialMobile
          isOpen={showTutorial}
          hasBoughtWorker={tutorialHasBoughtWorker}
          hasBoughtPC={tutorialHasBoughtPC}
          onStepChange={setTutorialStep}
          mobileMenuOpen={mobileMenuOpen}
          onCloseSheet={() => setMobileMenuOpen(null)}
          onComplete={(name: string, avatar: string) => {
            setPlayerName(name);
            setPlayerAvatar(avatar);
            setShowTutorial(false);
            localStorage.setItem('tutorialCompleted', 'true');
            localStorage.setItem('playerName', name);
            localStorage.setItem('playerAvatar', avatar);
          }}
        />
      ) : (
        <GameTutorial
          isOpen={showTutorial}
          hasBoughtWorker={tutorialHasBoughtWorker}
          hasBoughtPC={tutorialHasBoughtPC}
          workersTabClicked={tutorialWorkersTabClicked}
          buildTabClicked={tutorialBuildTabClicked}
          onStepChange={setTutorialStep}
          onComplete={(name: string, avatar: string) => {
            setPlayerName(name);
            setPlayerAvatar(avatar);
            setShowTutorial(false);
            localStorage.setItem('tutorialCompleted', 'true');
            localStorage.setItem('playerName', name);
            localStorage.setItem('playerAvatar', avatar);
          }}
        />
      )}

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

      {/* Cash Floating Effect */}
      <CashFloatingEffect 
        floatingCash={floatingCash}
        onComplete={(id) => setFloatingCash(prev => prev.filter(f => f.id !== id))}
      />

    </div>
  );
}
