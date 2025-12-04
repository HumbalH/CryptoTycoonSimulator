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
import { useGamePersistence } from '@/hooks/useGamePersistence';
import BuildPCPanel from '@/components/BuildPCPanel';
import HireWorkersPanel from '@/components/HireWorkersPanel';
import TokensPanel from '@/components/TokensPanel';
import UpgradesPanel from '@/components/UpgradesPanel';
import { Expand, Zap, Hammer, Wrench, Users, Coins, Star } from 'lucide-react';
import bitblitzIcon from '@assets/generated_images/bitblitz_crypto_token_icon.png';
import { INITIAL_CASH, INITIAL_GRID_SIZE, AVAILABLE_PCS, AVAILABLE_WORKERS, DEFAULT_TOKENS, DEFAULT_UPGRADES } from '@/utils/gameConstants';
import { calculateRebirthCost, calculateEarningsMultiplier } from '@/utils/gameCalculations';

export default function Game() {
  const { toast } = useToast();
  
  // Game state
  const [userId, setUserId] = useState<string | null>(null);
  const [cash, setCash] = useState(INITIAL_CASH);
  const [totalMined, setTotalMined] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(true);
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
  
  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState<string | null>(null);

  // PC state - todo: remove mock functionality
  const [ownedPCs, setOwnedPCs] = useState<Array<{ id: string; type: PCType; token: string; position: [number, number, number]; pendingEarnings: number }>>([
    { 
      id: 'pc-1', 
      type: AVAILABLE_PCS[0] as any,
      token: 'bitblitz',
      position: [-6, 0.1, -6],
      pendingEarnings: 0
    }
  ]);

  // Workers state - todo: remove mock functionality
  const [ownedWorkers, setOwnedWorkers] = useState<Array<{ id: string; type: string }>>([
    { id: 'worker-1', type: 'technician' }
  ]);

  // Use constants for available PCs and workers
  const availablePCs = AVAILABLE_PCS as any[];
  const availableWorkers = AVAILABLE_WORKERS as any[];

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
  const [tokens, setTokens] = useState<Token[]>(DEFAULT_TOKENS);

  const [activeToken, setActiveToken] = useState('bitblitz');

  // Upgrades state
  const [upgrades, setUpgrades] = useState<Upgrade[]>(DEFAULT_UPGRADES);

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
  const earningsMultiplier = calculateEarningsMultiplier(rebirthCount);

  // Game persistence (localStorage load/save)
  useGamePersistence({
    cash,
    gridWidth,
    gridHeight,
    rebirthCount,
    ownedPCs,
    ownedWorkers,
    upgrades,
    tokens,
    activeToken,
    setCash,
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

  // Calculate rebirth cost using utility function
  const rebirthDiscountLevel = upgrades.find(u => u.id === 'rebirth-discount')?.currentLevel || 0;
  const rebirthCost = calculateRebirthCost(rebirthCount, rebirthDiscountLevel);

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
    setCash(20000);
    setOwnedPCs([{
      id: 'pc-1',
      type: availablePCs[0],
      token: 'bitblitz',
      position: [-6, 0.1, -6],
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
          <BuildPCPanel 
            availablePCs={availablePCs}
            ownedPCs={ownedPCs}
            cash={cash}
            onPurchase={handlePurchasePC}
            onDelete={handleDeletePC}
          />
        }
        upgradeContent={
          <UpgradesPanel 
            upgrades={upgrades}
            cash={cash}
            onPurchase={handleUpgrade}
            onShowDetails={(u) => { setSelectedUpgrade(u); setShowUpgradeDetails(true); }}
          />
        }
        workersContent={
          <HireWorkersPanel 
            availableWorkers={availableWorkers}
            ownedWorkers={ownedWorkers}
            cash={cash}
            workerDiscountLevel={upgrades.find(u => u.id === 'worker-discount')?.currentLevel || 0}
            onHire={handleHireWorker}
          />
        }
        tokensContent={
          <TokensPanel 
            tokens={tokens}
            activeToken={activeToken}
            cash={cash}
            tokenDiscountLevel={upgrades.find(u => u.id === 'token-discount')?.currentLevel || 0}
            onSelect={handleTokenSelect}
          />
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
