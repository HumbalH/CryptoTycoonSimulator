import { useEffect, useRef, memo } from 'react';
import * as THREE from 'three';

export interface FloorProps {
  gridWidth: number;
  gridHeight: number;
}

export const GridHelperComponent = memo(function GridHelperComponent() {
  const gridRef = useRef<THREE.GridHelper>(null);

  useEffect(() => {
    if (gridRef.current) {
      gridRef.current.position.y = 0.01;
    }
  }, []);

  return <primitive ref={gridRef} object={new THREE.GridHelper(80, 80, '#a78bfa', '#c4b5fd')} />;
});

// Classic cartoony yellow floor used previously (no stone model)
export const Floor = memo(function Floor({ gridWidth, gridHeight }: FloorProps) {
  const floorWidth = gridWidth * 2;
  const floorDepth = gridHeight * 2;
  // Mining area center derived from desired grid start at (-15, -4)
  const centerX = -15 + floorWidth / 2;
  const centerZ = -4 + floorDepth / 2;

  return (
    <>
      {/* Main floor - cartoony yellow mining area */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[centerX, 0, centerZ]} receiveShadow>
        <planeGeometry args={[floorWidth, floorDepth]} />
        <meshStandardMaterial 
          color="#fbbf24"
          metalness={0.1}
          roughness={0.8}
          emissive="#f59e0b"
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Grid pattern overlay - simple lines */}
      {Array.from({ length: Math.ceil(floorWidth / 2) }).map((_, i) => (
        <mesh key={`grid-x-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[centerX - floorWidth / 2 + i * 2, 0.001, centerZ]}>
          <planeGeometry args={[0.08, floorDepth]} />
          <meshStandardMaterial 
            color="#f59e0b" 
            metalness={0.0} 
            roughness={0.9}
          />
        </mesh>
      ))}
      {Array.from({ length: Math.ceil(floorDepth / 2) }).map((_, i) => (
        <mesh key={`grid-z-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[centerX, 0.001, centerZ - floorDepth / 2 + i * 2]}>
          <planeGeometry args={[floorWidth, 0.08]} />
          <meshStandardMaterial 
            color="#f59e0b" 
            metalness={0.0} 
            roughness={0.9}
          />
        </mesh>
      ))}

      {/* Floor border - yellow frame */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[centerX, 0.02, centerZ]}>
        <planeGeometry args={[floorWidth + 0.8, floorDepth + 0.8]} />
        <meshStandardMaterial 
          color="#eab308"
          metalness={0.0}
          roughness={0.7}
        />
      </mesh>

      {/* Outer ground area - cartoony yellowish-beige base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[120, 120]} />
        <meshStandardMaterial 
          color="#d9d3bf"
          metalness={0.0}
          roughness={0.85}
          emissive="#f59e0b"
          emissiveIntensity={0.1}
        />
      </mesh>
    </>
  );
});
