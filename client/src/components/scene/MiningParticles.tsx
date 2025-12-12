import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

export interface MiningParticlesProps {
  position: [number, number, number];
  count?: number;
}

export function MiningParticles({ position, count = 2 }: MiningParticlesProps) {
  const particlesRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!particlesRef.current) return;
    particlesRef.current.children.forEach((child, i) => {
      const offset = (i / count) * Math.PI * 2;
      child.position.y = Math.sin(state.clock.elapsedTime * 2 + offset) * 0.3 + 1.5;
      child.position.x = Math.cos(state.clock.elapsedTime + offset) * 0.3;
      child.position.z = Math.sin(state.clock.elapsedTime + offset) * 0.3;
    });
  });

  return (
    <group ref={particlesRef} position={position}>
      {Array.from({ length: count }).map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[0.05, 6, 6]} />
          <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={1.5} />
        </mesh>
      ))}
    </group>
  );
}
