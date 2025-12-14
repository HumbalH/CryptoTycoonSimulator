import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Suspense, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Search } from 'lucide-react';
// import City from './city/City';
import { MiningPC, type MiningPCProps } from './scene/MiningPC';
// import { DraggableMiningPC } from './scene/DraggableMiningPC';
import { Worker } from './scene/Worker';
import { Floor } from './scene/Ground';
import { CameraPanBounds } from './scene/CameraPanBounds';
import { GridBoundary } from './scene/GridBoundary';

interface GameCanvasProps {
  pcs?: Array<Omit<MiningPCProps, 'onPCClick'>>;
  workers?: Array<{ id: string; type?: 'technician' | 'engineer' | 'expert' | string }>;
  gridWidth?: number;
  gridHeight?: number;
  onPCClick?: (pcId: string) => void;
  onPCPositionChange?: (pcId: string, newPosition: [number, number, number]) => void;
  onSelectPC?: (pcId: string) => void;
  selectedPCId?: string | null;
  gridStartX?: number;
  gridStartZ?: number;
  enableDragging?: boolean;
}

export default function GameCanvas({ 
  pcs = [], 
  workers = [], 
  gridWidth = 3, 
  gridHeight = 3, 
  onPCClick, 
  onPCPositionChange,
  onSelectPC,
  selectedPCId = null,
  gridStartX = -15,
  gridStartZ = -4,
  enableDragging = true
}: GameCanvasProps) {
  // Use only selectedPCId for both selection and placement
  const [hoveredCoords, setHoveredCoords] = useState<{ x: number; z: number } | null>(null);
  const controlsRef = useRef<any>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const panBounds = useMemo(() => ({ minX: -30, maxX: 30, minZ: -32, maxZ: 36 }), []);
  const pcsFocus = useMemo(() => {
    if (!pcs.length) {
      return undefined;
    }
    const box = new THREE.Box3();
    pcs.forEach((pc) => box.expandByPoint(new THREE.Vector3(pc.position[0], pc.position[1], pc.position[2])));
    const size = box.getSize(new THREE.Vector3());
    const target = box.getCenter(new THREE.Vector3());
    return { target, span: Math.max(size.x, size.y, size.z, 8) };
  }, [pcs]);

  const focusOnPcs = () => {
    if (!pcsFocus) return;
    const { target, span } = pcsFocus;
    const distance = span * 1.8;
    const dir = new THREE.Vector3(-1, 1, 1).normalize();
    const newPos = target.clone().add(dir.multiplyScalar(distance));

    if (cameraRef.current) {
      cameraRef.current.position.copy(newPos);
      cameraRef.current.lookAt(target);
    }
    if (controlsRef.current) {
      controlsRef.current.target.copy(target);
      controlsRef.current.update();
    }
  };

  return (
    <div className="w-full h-full relative" data-testid="game-canvas">

      <Canvas
        shadows
        gl={{ alpha: true }}
        onPointerMove={(e) => {
          const canvas = e.nativeEvent.target as HTMLCanvasElement;
          const rect = canvas.getBoundingClientRect();
          const x = ((e.nativeEvent.clientX - rect.left) / rect.width) * 2 - 1;
          const y = -((e.nativeEvent.clientY - rect.top) / rect.height) * 2 + 1;
          const distance = 25;
          const groundX = x * distance * 0.8;
          const groundZ = y * distance * 0.6;
          setHoveredCoords({ x: groundX, z: groundZ });
        }}
      >

        <Suspense fallback={null}>
          {/* Transparent floor mesh for PC movement */}
          {selectedPCId && (
            <mesh
              // Move mesh further toward bottom right and make it larger
              position={[
                gridStartX + (gridWidth * 2) / 2, // center horizontally
                0.12,
                gridStartZ + (gridHeight * 2) / 2 // center vertically
              ]}
              rotation={[-Math.PI / 2, 0, 0]}
              onPointerDown={(e) => {
                if (e.button !== 0) return; // Only left click
                if (!e.intersections || !e.intersections.length) return;
                const intersect = e.intersections[0].point;
                // Clamp to actual floor boundaries
                const minX = gridStartX - 4;
                const maxX = (gridStartX + gridWidth * 1.8);
                const minZ = gridStartZ - 4;
                const maxZ = (gridStartZ + gridHeight * 1.8);
                // Check for overlap with existing PCs
                const pcRadius = 0.7; // Adjust as needed for PC size
                const isOverlapping = pcs.some(pc => {
                  const dx = pc.position[0] - intersect.x;
                  const dz = pc.position[2] - intersect.z;
                  return Math.sqrt(dx * dx + dz * dz) < pcRadius * 2;
                });
                if (
                  intersect.x >= minX && intersect.x <= maxX &&
                  intersect.z >= minZ && intersect.z <= maxZ &&
                  !isOverlapping
                ) {
                  if (onPCPositionChange) {
                    onPCPositionChange(selectedPCId, [intersect.x, 0, intersect.z]);
                  }
                  if (onSelectPC) {
                    onSelectPC(''); // Always deselect after placing
                  }
                } else {
                  // Deselect if invalid
                  if (onSelectPC) onSelectPC('');
                }
                e.stopPropagation();
              }}
            >
              <planeGeometry args={[gridWidth * 2.6, gridHeight * 2.6]} />
              <meshStandardMaterial transparent opacity={0} />
            </mesh>
          )}

          <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 22, 22]} fov={30} near={0.1} far={1000} />
          <OrbitControls
            ref={controlsRef}
            enablePan
            enableZoom
            enableRotate={false}
            minPolarAngle={Math.PI / 3.5}
            maxPolarAngle={Math.PI / 3.5}
            minAzimuthAngle={0}
            maxAzimuthAngle={0}
            minDistance={10}
            maxDistance={80}
            target={[gridStartX + (gridWidth * 2) / 2, 0, gridStartZ + (gridHeight * 2) / 2]}
            panSpeed={1.5}
            zoomSpeed={1.0}
            mouseButtons={{ LEFT: THREE.MOUSE.PAN, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.PAN }}
            touches={{ ONE: THREE.TOUCH.PAN, TWO: THREE.TOUCH.DOLLY_PAN }}
          />
          <CameraPanBounds controlsRef={controlsRef} cameraRef={cameraRef} panBounds={panBounds} />

          <ambientLight intensity={0.9} />
          <directionalLight
            position={[20, 35, 25]}
            intensity={2.0}
            castShadow
            shadow-mapSize-width={4096}
            shadow-mapSize-height={4096}
            shadow-camera-left={-80}
            shadow-camera-right={80}
            shadow-camera-top={80}
            shadow-camera-bottom={-40}
            shadow-bias={-0.0005}
          />
          <pointLight position={[-30, 20, -20]} intensity={1.5} color="#ffffff" />
          <pointLight position={[30, 20, 20]} intensity={1.5} color="#ffffff" />
          <pointLight position={[0, 15, 0]} intensity={1.2} color="#ffe0b2" />

          <Floor gridWidth={gridWidth} gridHeight={gridHeight} />
          {/* <City /> */}

          {/* Show grid boundary when a PC is selected */}
          {selectedPCId && enableDragging && (
            <GridBoundary 
              gridWidth={gridWidth}
              gridHeight={gridHeight}
              gridStartX={gridStartX - 1}
              gridStartZ={gridStartZ - 1}
            />
          )}

          {pcs.map((pc) => (
            <MiningPC
              key={pc.id}
              id={pc.id}
              position={pc.position}
              type={pc.type}
              token={pc.token}
              isActive={pc.isActive}
              pendingEarnings={pc.pendingEarnings}
              onPCClick={onPCClick ? () => onPCClick(pc.id) : undefined}
              onSelectPC={onSelectPC}
              isSelected={selectedPCId === pc.id}
            />
          ))}

          {workers.map((worker) => (
            <Worker key={worker.id} id={worker.id} pcs={pcs} workerType={worker.type} />
          ))}
        </Suspense>
      </Canvas>

      <div className="fixed bottom-3 right-3 z-20 sm:bottom-4 sm:right-4">
        <button
          onClick={focusOnPcs}
          title="Focus on PCs"
          aria-label="Focus on PCs"
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-lg border-none flex items-center justify-center text-xl p-0 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <Search size={24} strokeWidth={2.2} className="pointer-events-none" />
        </button>
      </div>

      <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
        <div className="bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-md px-4 py-3 rounded-lg border-2 border-primary/40 shadow-xl">
          <div className="text-sm font-mono space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-muted-foreground">Mining PCs:</span>
              <span className="font-bold text-primary">{pcs.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-muted-foreground">Workers:</span>
              <span className="font-bold text-secondary">{workers.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
              <span className="text-muted-foreground">Grid:</span>
              <span className="font-bold text-accent">{gridWidth}x{gridHeight}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
