import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Suspense, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Search } from 'lucide-react';
import City from './city/City';
import { MiningPC, type MiningPCProps } from './scene/MiningPC';
import { DraggableMiningPC } from './scene/DraggableMiningPC';
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
  const [hoveredCoords, setHoveredCoords] = useState<{ x: number; z: number } | null>(null);
  const controlsRef = useRef<any>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  const panBounds = useMemo(() => ({ minX: -30, maxX: 30, minZ: -32, maxZ: 36 }), []);

  const pcsFocus = useMemo(() => {
    if (!pcs.length) {
      return { target: new THREE.Vector3(0, 1, 0), span: 15 };
    }
    const box = new THREE.Box3();
    pcs.forEach((pc) => box.expandByPoint(new THREE.Vector3(pc.position[0], pc.position[1], pc.position[2])));
    const size = box.getSize(new THREE.Vector3());
    const target = box.getCenter(new THREE.Vector3());
    target.y = 1;
    const span = Math.max(size.x, size.y, size.z, 8);
    return { target, span };
  }, [pcs]);

  const focusOnPcs = () => {
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

          <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 50, 50]} fov={30} near={0.1} far={1000} />
          <OrbitControls
            ref={controlsRef}
            enablePan
            enableZoom
            enableRotate={false}
            minPolarAngle={Math.PI / 3.5}
            maxPolarAngle={Math.PI / 3.5}
            minAzimuthAngle={0}
            maxAzimuthAngle={0}
            minDistance={15}
            maxDistance={80}
            target={[0, 0, 0]}
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
          <City />

          {/* Show grid boundary when a PC is selected */}
          {selectedPCId && enableDragging && (
            <GridBoundary 
              gridWidth={gridWidth}
              gridHeight={gridHeight}
              gridStartX={gridStartX}
              gridStartZ={gridStartZ}
            />
          )}

          {pcs.map((pc) => 
            enableDragging ? (
              <DraggableMiningPC
                key={pc.id}
                id={pc.id}
                position={pc.position}
                type={pc.type}
                token={pc.token}
                isActive={pc.isActive}
                pendingEarnings={pc.pendingEarnings}
                onPCClick={onPCClick}
                gridWidth={gridWidth}
                gridHeight={gridHeight}
                gridStartX={gridStartX}
                gridStartZ={gridStartZ}
                onPositionChange={onPCPositionChange}
                isSelected={selectedPCId === pc.id}
                onSelect={onSelectPC}
              />
            ) : (
              <MiningPC
                key={pc.id}
                id={pc.id}
                position={pc.position}
                type={pc.type}
                token={pc.token}
                isActive={pc.isActive}
                pendingEarnings={pc.pendingEarnings}
                onPCClick={onPCClick}
              />
            )
          )}

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
