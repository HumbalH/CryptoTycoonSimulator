import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Suspense, useRef, useState, memo } from 'react';
import * as THREE from 'three';

interface MiningPCProps {
  position: [number, number, number];
  type: 'budget' | 'laptop' | 'workstation' | 'gaming' | 'mining-rig' | 'server' | 'quantum';
  token: string;
  isActive: boolean;
  id: string;
  onPCClick?: (pcId: string) => void;
}

function FloatingCoin({ position }: { position: [number, number, number] }) {
  const coinRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (coinRef.current) {
      coinRef.current.position.y = position[1] + 2 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
      coinRef.current.rotation.y = state.clock.elapsedTime * 2;
    }
  });

  return (
    <mesh ref={coinRef} position={position}>
      <cylinderGeometry args={[0.15, 0.15, 0.05, 16]} />
      <meshStandardMaterial 
        color="#fbbf24"
        emissive="#fbbf24"
        emissiveIntensity={1}
        metalness={0.8}
      />
    </mesh>
  );
}

function MiningParticles({ position, count = 2 }: { position: [number, number, number]; count?: number }) {
  const particlesRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.children.forEach((child, i) => {
        const offset = (i / count) * Math.PI * 2;
        child.position.y = Math.sin(state.clock.elapsedTime * 2 + offset) * 0.3 + 1.5;
        child.position.x = Math.cos(state.clock.elapsedTime + offset) * 0.3;
        child.position.z = Math.sin(state.clock.elapsedTime + offset) * 0.3;
      });
    }
  });

  return (
    <group ref={particlesRef} position={position}>
      {Array.from({ length: count }).map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[0.05, 6, 6]} />
          <meshStandardMaterial 
            color="#00ffff"
            emissive="#00ffff"
            emissiveIntensity={1.5}
          />
        </mesh>
      ))}
    </group>
  );
}

const MiningPC = memo(function MiningPC({ position, type, token, isActive, id, onPCClick }: MiningPCProps) {
  const pcRef = useRef<THREE.Group>(null);

  const config: Record<string, any> = {
    budget: { 
      width: 0.5, height: 0.8, depth: 0.5, 
      color: '#3b82f6', emissive: '#1e40af',
      glowIntensity: 1.0, shape: 'compact'
    },
    laptop: { 
      width: 0.6, height: 0.4, depth: 0.5, 
      color: '#14b8a6', emissive: '#0d9488',
      glowIntensity: 1.3, shape: 'flat'
    },
    workstation: { 
      width: 0.75, height: 1.2, depth: 0.65, 
      color: '#7c3aed', emissive: '#6d28d9',
      glowIntensity: 1.8, shape: 'tower'
    },
    gaming: { 
      width: 0.85, height: 1.5, depth: 0.75, 
      color: '#ec4899', emissive: '#be185d',
      glowIntensity: 2.5, shape: 'aggressive'
    },
    'mining-rig': { 
      width: 1.2, height: 1.6, depth: 0.9, 
      color: '#f97316', emissive: '#ea580c',
      glowIntensity: 2.8, shape: 'industrial'
    },
    server: { 
      width: 1.3, height: 2.0, depth: 1.0, 
      color: '#22c55e', emissive: '#15803d',
      glowIntensity: 3.2, shape: 'rack'
    },
    quantum: { 
      width: 1.5, height: 2.3, depth: 1.1, 
      color: '#fcd34d', emissive: '#f59e0b',
      glowIntensity: 4.0, shape: 'futuristic'
    }
  };

  const { width, height, depth, color, emissive, glowIntensity, shape } = config[type] || config.budget;

  return (
    <group ref={pcRef} position={position}>
      {/* Clickable invisible collision box */}
      <mesh 
        position={[0, height / 2 + 0.1, 0]} 
        onClick={() => onPCClick?.(id)}
        onPointerEnter={(e) => { e.object.scale.set(1.1, 1.1, 1.1); }}
        onPointerLeave={(e) => { e.object.scale.set(1, 1, 1); }}
      >
        <boxGeometry args={[width + 0.3, height + 0.3, depth + 0.3]} />
        <meshStandardMaterial transparent opacity={0} />
      </mesh>

      {/* Base Platform */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[width * 0.8, width * 0.9, 0.1, 8]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Main PC Tower */}
      <mesh castShadow position={[0, height / 2 + 0.1, 0]}>
        {shape === 'flat' ? (
          <boxGeometry args={[width, height * 0.6, depth]} />
        ) : shape === 'aggressive' ? (
          <boxGeometry args={[width, height, depth]} />
        ) : shape === 'rack' ? (
          <boxGeometry args={[width * 0.95, height, depth * 0.85]} />
        ) : shape === 'industrial' ? (
          <boxGeometry args={[width, height, depth]} />
        ) : shape === 'futuristic' ? (
          <boxGeometry args={[width, height, depth]} />
        ) : (
          <boxGeometry args={[width, height, depth]} />
        )}
        <meshStandardMaterial 
          color={color}
          metalness={shape === 'server' || shape === 'rack' ? 0.7 : 0.6}
          roughness={0.35}
          emissive={isActive ? emissive : '#000000'}
          emissiveIntensity={isActive ? 0.3 : 0}
        />
      </mesh>

      {/* Front Panel Glow */}
      <mesh position={[0, height / 2 + 0.1, depth / 2 + 0.02]}>
        <planeGeometry args={[width * 0.85, Math.max(height * 0.7, 0.3)]} />
        <meshStandardMaterial 
          color={isActive ? color : '#000000'}
          emissive={isActive ? color : '#000000'}
          emissiveIntensity={isActive ? 0.8 : 0}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* RGB LED Strips - Gaming & Premium Types */}
      {(type === 'gaming' || type === 'quantum') && isActive && (
        <>
          <mesh position={[-width / 2 - 0.02, height / 2 + 0.1, 0]}>
            <boxGeometry args={[0.03, height * 0.9, depth * 0.25]} />
            <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={1.3} />
          </mesh>
          <mesh position={[width / 2 + 0.02, height / 2 + 0.1, 0]}>
            <boxGeometry args={[0.03, height * 0.9, depth * 0.25]} />
            <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={1.3} />
          </mesh>
        </>
      )}

      {/* Quantum Glow Ring - Quantum Type Only */}
      {type === 'quantum' && isActive && (
        <mesh position={[0, height / 2 + 0.1, 0]}>
          <torusGeometry args={[width / 2 + 0.15, 0.05, 8, 16]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.5} />
        </mesh>
      )}

      {/* Vents/Grills - More for server/rack types */}
      {shape === 'rack' ? (
        [0.5, 0.15, -0.15, -0.5].map((yOffset, i) => (
          <mesh key={i} position={[0, height / 2 + 0.1 + yOffset, depth / 2 + 0.01]}>
            <boxGeometry args={[width * 0.8, 0.08, 0.02]} />
            <meshStandardMaterial color="#0a0a0a" metalness={0.6} />
          </mesh>
        ))
      ) : (
        [0.3, 0, -0.3].map((yOffset, i) => (
          <mesh key={i} position={[0, height / 2 + 0.1 + yOffset, depth / 2 + 0.01]}>
            <boxGeometry args={[width * 0.65, 0.08, 0.02]} />
            <meshStandardMaterial color="#0a0a0a" />
          </mesh>
        ))
      )}

      {/* Mining particles and effects */}
      {isActive && (
        <>
          <FloatingCoin position={[0, height + 0.1, 0]} />
          <MiningParticles position={[0, height / 2 + 0.1, 0]} count={2} />
          <pointLight 
            position={[0, height / 2 + 0.1, 0]} 
            color={color}
            intensity={glowIntensity}
            distance={3}
          />
        </>
      )}

      {/* Power/Status Light */}
      <mesh position={[width / 2 - 0.1, height + 0.1 - 0.2, depth / 2 + 0.02]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial 
          color={isActive ? '#00ff00' : '#ff0000'}
          emissive={isActive ? '#00ff00' : '#ff0000'}
          emissiveIntensity={2}
        />
      </mesh>
    </group>
  );
});

interface WorkerProps {
  id: string;
  pcs: Array<{ position: [number, number, number] }>;
}

function Worker({ id, pcs }: WorkerProps) {
  const workerRef = useRef<THREE.Group>(null);
  const [currentPcIndex, setCurrentPcIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  
  useFrame((state, delta) => {
    if (!workerRef.current || pcs.length === 0) return;

    const targetPos = pcs[currentPcIndex].position;
    const currentPos = workerRef.current.position;
    const direction = new THREE.Vector3(
      targetPos[0] - currentPos.x,
      0.3,
      targetPos[2] - currentPos.z
    );
    const distance = direction.length();

    if (distance > 0.5) {
      direction.normalize();
      workerRef.current.position.x += direction.x * delta * 2;
      workerRef.current.position.z += direction.z * delta * 2;
      const angle = Math.atan2(direction.x, direction.z);
      workerRef.current.rotation.y = angle;
      
      // Bob animation while walking
      workerRef.current.position.y = 0.3 + Math.abs(Math.sin(state.clock.elapsedTime * 5)) * 0.1;
    } else {
      setProgress((p: number) => {
        if (p > 1.5) {
          setCurrentPcIndex((i: number) => (i + 1) % pcs.length);
          return 0;
        }
        return p + delta;
      });
    }
  });

  return (
    <group ref={workerRef} position={[0, 0.3, 0]}>
      {/* Body */}
      <mesh castShadow>
        <capsuleGeometry args={[0.2, 0.5, 8, 16]} />
        <meshStandardMaterial color="#3b82f6" />
      </mesh>
      
      {/* Head */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>

      {/* Hard Hat */}
      <mesh position={[0, 0.65, 0]} castShadow>
        <coneGeometry args={[0.18, 0.15, 8]} />
        <meshStandardMaterial color="#eab308" />
      </mesh>

      {/* Toolbox */}
      <mesh position={[0.25, -0.1, 0]} castShadow>
        <boxGeometry args={[0.15, 0.1, 0.1]} />
        <meshStandardMaterial color="#71717a" metalness={0.8} />
      </mesh>

      {/* Worker glow */}
      <pointLight position={[0, 0.5, 0]} color="#60a5fa" intensity={1.5} distance={2} />
    </group>
  );
}

function Clouds() {
  return (
    <>
      {[
        { x: -35, z: -5, scale: 4 },
        { x: -10, z: -10, scale: 3.5 },
        { x: 15, z: -8, scale: 4.5 },
        { x: 35, z: -12, scale: 3 },
        { x: 0, z: 15, scale: 3.8 },
        { x: -25, z: 25, scale: 4 },
      ].map((cloud, i) => (
        <mesh key={`cloud-${i}`} position={[cloud.x, 25, cloud.z]}>
          <sphereGeometry args={[cloud.scale, 16, 16]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.2} />
        </mesh>
      ))}
      {[
        { x: -40, z: 0, scale: 3 },
        { x: 0, z: -15, scale: 3.8 },
        { x: 30, z: 5, scale: 3.2 },
      ].map((cloud, i) => (
        <mesh key={`cloud-extra-${i}`} position={[cloud.x - 2, 26, cloud.z - 1]}>
          <sphereGeometry args={[cloud.scale * 0.7, 16, 16]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.15} />
        </mesh>
      ))}
    </>
  );
}

function Roads() {
  const roadZ = -10; // Fixed road position, doesn't move with room expansion
  
  return (
    <>
      {/* Horizontal road - stretches across */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, roadZ]}>
        <planeGeometry args={[60, 3]} />
        <meshStandardMaterial color="#666666" metalness={0.3} roughness={0.7} />
      </mesh>
      
      {/* Road center markings */}
      {Array.from({ length: 15 }).map((_, i) => (
        <mesh key={`road-mark-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[-25 + i * 4, 0.006, roadZ]}>
          <planeGeometry args={[2, 0.5]} />
          <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={0.4} />
        </mesh>
      ))}
    </>
  );
}

function NPCs() {
  const roadZ = -10; // Fixed road position
  
  const [npcPositions] = useState(() => {
    return Array.from({ length: 6 }).map(() => ({
      x: Math.random() * 50 - 25,
      z: roadZ + Math.random() * 3, // Spawn on the road
      speed: 0.015 + Math.random() * 0.01,
    }));
  });
  
  const npcRefs = useRef<THREE.Group[]>([]);
  
  useFrame((state) => {
    npcRefs.current.forEach((ref, idx) => {
      if (ref) {
        const npc = npcPositions[idx];
        ref.position.x += npc.speed;
        // Loop: when they go off to the right, reset to the left
        if (ref.position.x > 30) {
          ref.position.x = -30;
          ref.position.z = roadZ + Math.random() * 3;
        }
      }
    });
  });
  
  return (
    <>
      {npcPositions.map((_, i) => (
        <group key={`npc-${i}`} ref={(ref) => { if (ref) npcRefs.current[i] = ref; }} position={[npcPositions[i].x, 0, npcPositions[i].z]}>
          {/* Body */}
          <mesh position={[0, 0.35, 0]}>
            <boxGeometry args={[0.3, 0.5, 0.3]} />
            <meshStandardMaterial color={['#ff6b6b', '#6bcf7f', '#4d96ff', '#ffd93d', '#b562ff', '#ff8c42'][i % 6]} />
          </mesh>
          {/* Head */}
          <mesh position={[0, 0.8, 0]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color="#f5deb3" />
          </mesh>
        </group>
      ))}
    </>
  );
}

function DetailedBuilding({ x, z, width, height, color, buildingId, shiftZ }: { x: number; z: number; width: number; height: number; color: string; buildingId: number; shiftZ: number }) {
  const adjustedZ = z + shiftZ;
  const windowColors = ['#ffff00', '#00ff88', '#ff00ff', '#00ffff', '#ffff00', '#ff88ff'];
  const windowColor = windowColors[buildingId % windowColors.length];
  
  return (
    <group>
      {/* Main building body */}
      <mesh position={[x, height / 2, adjustedZ]} castShadow>
        <boxGeometry args={[width, height, 5]} />
        <meshStandardMaterial color={color} metalness={0.15} roughness={0.65} />
      </mesh>
      
      {/* Roof */}
      <mesh position={[x, height, adjustedZ]}>
        <coneGeometry args={[width / 2 + 0.3, 1.5, 4]} />
        <meshStandardMaterial color={color} metalness={0.2} roughness={0.7} />
      </mesh>
      
      {/* Door */}
      <mesh position={[x, 1, adjustedZ + 2.6]}>
        <boxGeometry args={[1, 2, 0.1]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
      <mesh position={[x + 0.35, 1.5, adjustedZ + 2.65]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#ffd700" metalness={0.9} />
      </mesh>
      
      {/* Windows grid */}
      {Array.from({ length: Math.ceil(height / 2.5) }).map((_, row) =>
        Array.from({ length: 3 }).map((_, col) => (
          <mesh key={`window-${row}-${col}`} position={[x - width / 3 + col * (width / 3), 2 + row * 2.5, adjustedZ + 2.6]}>
            <boxGeometry args={[0.6, 0.6, 0.15]} />
            <meshStandardMaterial color={windowColor} emissive={windowColor} emissiveIntensity={0.5} />
          </mesh>
        ))
      )}
    </group>
  );
}

function CityBuildings() {
  const roadZ = -10; // Fixed road position
  const buildingZ = roadZ - 5; // Buildings are 5 units further in front of the road
  
  // Single row of buildings stretched across
  const buildingConfigs = [
    { x: -24, z: buildingZ, width: 5, height: 12, color: '#ff6b6b' },
    { x: -14, z: buildingZ, width: 5, height: 14, color: '#ff8c42' },
    { x: -4, z: buildingZ, width: 5, height: 13, color: '#ffd93d' },
    { x: 6, z: buildingZ, width: 5, height: 12, color: '#6bcf7f' },
    { x: 16, z: buildingZ, width: 5, height: 15, color: '#4d96ff' },
    { x: 26, z: buildingZ, width: 5, height: 11, color: '#b562ff' },
  ];
  
  return (
    <>
      {buildingConfigs.map((building, i) => (
        <DetailedBuilding
          key={`building-${i}`}
          x={building.x}
          z={building.z}
          width={building.width}
          height={building.height}
          color={building.color}
          buildingId={i}
          shiftZ={0} // No shift needed - buildings are at absolute positions now
        />
      ))}
    </>
  );
}

function Floor({ gridWidth, gridHeight }: { gridWidth: number; gridHeight: number }) {
  // Calculate floor dimensions based on unlocked grid
  // Grid goes from [-3, -3] and expands right (+x) and back (+z)
  // Each grid cell is 2 units apart
  const floorWidth = gridWidth * 2;
  const floorDepth = gridHeight * 2;
  
  // Center position: PC at [-3, -3] is the corner, so offset by half unit less
  const centerX = -3 + floorWidth / 2 - 1;
  const centerZ = -3 + floorDepth / 2 - 1;
  
  // Wall positions - walls are set back from the floor edges for an open feel
  const wallOffset = 1; // Distance from floor edge
  const leftWallX = centerX - floorWidth / 2 - wallOffset;
  const rightWallX = centerX + floorWidth / 2 + wallOffset;
  const frontWallZ = centerZ - floorDepth / 2 - wallOffset;
  
  const wallHeight = 3;
  const wallThickness = 0.2;
  const doorWidth = 3; // Width of the door opening
  
  return (
    <>
      {/* Main floor - vibrant grass green - represents unlocked land */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[centerX, 0, centerZ]} receiveShadow>
        <planeGeometry args={[floorWidth, floorDepth]} />
        <meshStandardMaterial 
          color="#2ecc71"
          metalness={0.1}
          roughness={0.8}
        />
      </mesh>

      {/* Left wall */}
      <mesh position={[leftWallX, wallHeight / 2, centerZ]} castShadow receiveShadow>
        <boxGeometry args={[wallThickness, wallHeight, floorDepth + wallOffset * 2]} />
        <meshStandardMaterial color="#7f8c8d" roughness={0.8} />
      </mesh>

      {/* Right wall */}
      <mesh position={[rightWallX, wallHeight / 2, centerZ]} castShadow receiveShadow>
        <boxGeometry args={[wallThickness, wallHeight, floorDepth + wallOffset * 2]} />
        <meshStandardMaterial color="#7f8c8d" roughness={0.8} />
      </mesh>

      {/* Front wall (facing road) - left section */}
      <mesh position={[centerX - doorWidth / 2 - (floorWidth / 2 - doorWidth / 2) / 2 - wallOffset / 2, wallHeight / 2, frontWallZ]} castShadow receiveShadow>
        <boxGeometry args={[floorWidth / 2 - doorWidth / 2 + wallOffset, wallHeight, wallThickness]} />
        <meshStandardMaterial color="#7f8c8d" roughness={0.8} />
      </mesh>

      {/* Front wall (facing road) - right section */}
      <mesh position={[centerX + doorWidth / 2 + (floorWidth / 2 - doorWidth / 2) / 2 + wallOffset / 2, wallHeight / 2, frontWallZ]} castShadow receiveShadow>
        <boxGeometry args={[floorWidth / 2 - doorWidth / 2 + wallOffset, wallHeight, wallThickness]} />
        <meshStandardMaterial color="#7f8c8d" roughness={0.8} />
      </mesh>

      {/* Outer ground area - darker green */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial 
          color="#27ae60"
          metalness={0.05}
          roughness={0.9}
        />
      </mesh>
    </>
  );
}

interface GameCanvasProps {
  pcs?: Array<{
    id: string;
    position: [number, number, number];
    type: 'budget' | 'gaming' | 'server' | 'laptop' | 'workstation' | 'mining-rig' | 'quantum';
    token: string;
    isActive: boolean;
  }>;
  workers?: Array<{ id: string }>;
  gridWidth?: number;
  gridHeight?: number;
  onPCClick?: (pcId: string) => void;
}

export default function GameCanvas({ pcs = [], workers = [], gridWidth = 3, gridHeight = 3, onPCClick }: GameCanvasProps) {
  return (
    <div className="w-full h-full bg-gradient-to-b from-blue-400 via-cyan-300 to-green-300 relative" data-testid="game-canvas">
      <Canvas shadows>
        <Suspense fallback={null}>
          <color attach="background" args={['#87ceeb']} />
          <PerspectiveCamera makeDefault position={[0, 18, 18]} fov={45} />
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minPolarAngle={0.3}
            maxPolarAngle={1.2}
            minDistance={12}
            maxDistance={35}
            target={[0, 0, 0]}
            panSpeed={1.5}
            rotateSpeed={0.5}
          />
          
          {/* Lighting */}
          <ambientLight intensity={0.7} />
          <directionalLight 
            position={[15, 25, 10]} 
            intensity={1.5} 
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-left={-30}
            shadow-camera-right={30}
            shadow-camera-top={40}
            shadow-camera-bottom={-10}
          />
          
          {/* Bright accent lights */}
          <pointLight position={[-10, 8, -10]} intensity={2} color="#ff6b6b" />
          <pointLight position={[10, 8, 10]} intensity={2} color="#6bcf7f" />
          <pointLight position={[0, 12, 0]} intensity={1.5} color="#ffd93d" />

          {/* Fluffy clouds */}
          <Clouds />

          {/* Roads */}
          <Roads />

          {/* City with detailed buildings */}
          <CityBuildings />

          {/* Walking NPCs */}
          <NPCs />

          {/* Scene */}
          <Floor gridWidth={gridWidth} gridHeight={gridHeight} />
          
          {/* Mining PCs */}
          {pcs.map(pc => (
            <MiningPC 
              key={pc.id}
              id={pc.id}
              position={pc.position}
              type={pc.type}
              token={pc.token}
              isActive={pc.isActive}
              onPCClick={onPCClick}
            />
          ))}

          {/* Workers */}
          {workers.map(worker => (
            <Worker 
              key={worker.id}
              id={worker.id}
              pcs={pcs}
            />
          ))}
        </Suspense>
      </Canvas>

      {/* Info overlay */}
      <div className="absolute top-4 left-4 bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-md px-4 py-3 rounded-lg border-2 border-primary/40 shadow-xl">
        <div className="text-sm font-mono space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-muted-foreground">Mining PCs:</span>
            <span className="font-bold text-primary">{pcs.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
            <span className="text-muted-foreground">Workers:</span>
            <span className="font-bold text-secondary">{workers.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
            <span className="text-muted-foreground">Grid:</span>
            <span className="font-bold text-accent">{gridWidth}x{gridHeight}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
