import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

export interface FloatingCoinProps {
  position: [number, number, number];
  isPending?: boolean;
}

export function FloatingCoin({ position, isPending = false }: FloatingCoinProps) {
  const coinRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!coinRef.current) return;
    const baseY = isPending ? position[1] : position[1];
    const amplitude = isPending ? 0.4 : 0.2;
    const speed = isPending ? 3 : 2;

    coinRef.current.position.y = baseY + Math.sin(state.clock.elapsedTime * speed) * amplitude;
    coinRef.current.rotation.y = state.clock.elapsedTime * 2;

    if (isPending) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.2;
      coinRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group ref={coinRef} position={position}>
      <mesh>
        <cylinderGeometry args={[0.12, 0.12, 0.04, 32]} />
        <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={1.2} />
      </mesh>
    </group>
  );
}
