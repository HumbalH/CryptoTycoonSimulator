import { useRef } from 'react';
import * as THREE from 'three';

interface ParasolProps {
  position: [number, number, number];
  color?: string;
  scale?: number;
}

export function Parasol({ position, color = '#ef4444', scale = 1 }: ParasolProps) {
  const groupRef = useRef<THREE.Group>(null);

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Pole */}
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 1.2, 8]} />
        <meshStandardMaterial color="#8b7355" metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Base/Stand */}
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.3, 0.35, 0.08, 16]} />
        <meshStandardMaterial color="#a0826d" metalness={0.2} roughness={0.8} />
      </mesh>

      {/* Parasol Canopy - Top Dome */}
      <mesh position={[0, 1.35, 0]} castShadow>
        <coneGeometry args={[0.8, 0.4, 32]} />
        <meshStandardMaterial
          color={color}
          metalness={0.1}
          roughness={0.6}
          emissive={color}
          emissiveIntensity={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Parasol Canopy - Bottom Dome (for better shape) */}
      <mesh position={[0, 1.25, 0]} castShadow>
        <sphereGeometry args={[0.8, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color={color}
          metalness={0.08}
          roughness={0.5}
          emissive={color}
          emissiveIntensity={0.04}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Parasol Ribs - 8 decorative ribs */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radiusStart = 0;
        const radiusEnd = 0.75;
        const startX = Math.cos(angle) * radiusStart;
        const startZ = Math.sin(angle) * radiusStart;
        const endX = Math.cos(angle) * radiusEnd;
        const endZ = Math.sin(angle) * radiusEnd;

        return (
          <group key={`rib-${i}`} position={[0, 1.35, 0]}>
            <mesh position={[(startX + endX) / 2, -0.175, (startZ + endZ) / 2]}>
              <cylinderGeometry args={[0.01, 0.01, 0.35, 6]} />
              <meshStandardMaterial color="#666666" />
            </mesh>
          </group>
        );
      })}

      {/* Edge Trim/Fringe */}
      <mesh position={[0, 0.98, 0]} castShadow>
        <torusGeometry args={[0.8, 0.04, 8, 32]} />
        <meshStandardMaterial color="#d4a574" metalness={0.2} roughness={0.6} />
      </mesh>

      {/* Small decorative finial on top */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#c9a876" metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  );
}

interface ParasolGroupProps {
  position: [number, number, number];
  count?: number;
  colors?: string[];
  spacing?: number;
  scale?: number;
}

export function ParasolGroup({ position, count = 3, colors, spacing = 0.8, scale = 1 }: ParasolGroupProps) {
  const defaultColors = ['#ef4444', '#3b82f6', '#fbbf24', '#10b981', '#f97316', '#8b5cf6'];
  const colorArray = colors || defaultColors;

  const positions = Array.from({ length: count }).map((_, i) => {
    const offset = (i - (count - 1) / 2) * spacing;
    return [position[0] + offset, position[1], position[2]] as [number, number, number];
  });

  return (
    <>
      {positions.map((pos, idx) => (
        <Parasol key={`parasol-${idx}`} position={pos} color={colorArray[idx % colorArray.length]} scale={scale} />
      ))}
    </>
  );
}
