import { useGLTF } from '@react-three/drei';
import { memo, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { FloatingCoin } from './FloatingCoin';
import { MiningParticles } from './MiningParticles';

export interface MiningPCProps {
  position: [number, number, number];
  type: 'budget' | 'laptop' | 'workstation' | 'gaming' | 'mining-rig' | 'server' | 'quantum';
  token: string;
  isActive: boolean;
  id: string;
  pendingEarnings?: number;
  onPCClick?: (pcId: string) => void;
}

export const MiningPC = memo(function MiningPC({ position, type, token, isActive, id, pendingEarnings = 0, onPCClick }: MiningPCProps) {
  const pcRef = useRef<THREE.Group>(null);
  const hasPendingEarnings = pendingEarnings > 0;

  const gamingGLTF = useGLTF('/3D-Models/Models/GLB format/Gaming Computer.glb');
  const gamingScene = useMemo(() => {
    const scene = Array.isArray(gamingGLTF) ? gamingGLTF[0].scene : gamingGLTF.scene;
    return scene.clone();
  }, [gamingGLTF]);

  const config: Record<string, any> = {
    budget: { width: 0.5, height: 0.8, depth: 0.5, color: '#3b82f6', emissive: '#1e40af', glowIntensity: 1.0, shape: 'compact' },
    laptop: { width: 0.6, height: 0.4, depth: 0.5, color: '#14b8a6', emissive: '#0d9488', glowIntensity: 1.3, shape: 'flat' },
    workstation: { width: 0.75, height: 1.2, depth: 0.65, color: '#7c3aed', emissive: '#6d28d9', glowIntensity: 1.8, shape: 'tower' },
    gaming: { width: 0.85, height: 1.5, depth: 0.75, color: '#ec4899', emissive: '#be185d', glowIntensity: 2.5, shape: 'aggressive' },
    'mining-rig': { width: 1.2, height: 1.6, depth: 0.9, color: '#f97316', emissive: '#ea580c', glowIntensity: 2.8, shape: 'industrial' },
    server: { width: 1.3, height: 2.0, depth: 1.0, color: '#22c55e', emissive: '#15803d', glowIntensity: 3.2, shape: 'rack' },
    quantum: { width: 1.5, height: 2.3, depth: 1.1, color: '#fcd34d', emissive: '#f59e0b', glowIntensity: 4.0, shape: 'futuristic' }
  };

  const pcConfig = config[type] || config.budget;
  const width = pcConfig.width;
  const height = pcConfig.height;
  const depth = pcConfig.depth;
  const color = pcConfig.color;
  const emissive = pcConfig.emissive;
  const glowIntensity = pcConfig.glowIntensity;
  const shape = pcConfig.shape;

  const tokenAccentMap: Record<string, string> = {
    bitblitz: '#facc15',
    gala: '#10b981',
    bene: '#06b6d4',
    sol: '#22d3ee',
    eth: '#7c3aed',
    btc: '#f97316'
  };
  const tokenKey = token?.toLowerCase?.() || '';
  const accent = tokenAccentMap[tokenKey] || emissive;

  const renderBody = () => {
    switch (type) {
      case 'laptop':
        return (
          <group position={[0, height / 2, 0]}>
            {/* Removed dark, thin meshes to test for black line artifacts */}
            <mesh castShadow position={[0, 0, 0]}>
              <boxGeometry args={[width, height * 0.1, depth]} />
              <meshStandardMaterial color={color} metalness={0.6} roughness={0.25} emissive={isActive ? emissive : '#000'} emissiveIntensity={isActive ? 0.4 : 0} />
            </mesh>
          </group>
        );
      case 'workstation':
        return (
          <group position={[0, height / 2 + 0.05, 0]}>
            {[-width * 0.22, width * 0.22].map((x, i) => (
              <mesh key={i} castShadow position={[x, 0, 0]}>
                <boxGeometry args={[width * 0.6, height, depth * 0.9]} />
                <meshStandardMaterial color={color} metalness={0.6} roughness={0.35} emissive={isActive ? emissive : '#000'} emissiveIntensity={isActive ? 0.35 : 0} />
              </mesh>
            ))}
            <mesh position={[0, height * 0.55, depth * 0.45]} castShadow>
              <boxGeometry args={[width * 0.4, 0.12, 0.08]} />
              <meshStandardMaterial color={accent} metalness={0.7} roughness={0.25} emissive={isActive ? accent : '#000'} emissiveIntensity={isActive ? 0.7 : 0} />
            </mesh>
          </group>
        );
      case 'gaming':
        // Simple rectangular box for gaming PC
        return (
          <group position={[0, height / 2, 0]}>
            <mesh castShadow>
              <boxGeometry args={[width, height, depth]} />
              <meshStandardMaterial color="#ec4899" metalness={0.6} roughness={0.25} />
            </mesh>
          </group>
        );
      case 'mining-rig':
        // Solid purplish box for mining rig
        return (
          <group position={[0, height / 2, 0]}>
            <mesh castShadow>
              <boxGeometry args={[width, height, depth]} />
              <meshStandardMaterial color="#a78bfa" metalness={0.5} roughness={0.3} />
            </mesh>
          </group>
        );
      case 'server':
        return (
          <group position={[0, height / 2 + 0.05, 0]}>
            <mesh castShadow>
              <boxGeometry args={[width, height, depth * 0.8]} />
              <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} emissive={isActive ? emissive : '#000'} emissiveIntensity={isActive ? 0.35 : 0} />
            </mesh>
            {[...Array(5)].map((_, i) => (
              <mesh key={i} position={[0, height * (0.4 - i * 0.18), depth / 2 + 0.01]}>
                <boxGeometry args={[width * 0.8, 0.09, 0.02]} />
                <meshStandardMaterial color="#0a0a0a" />
              </mesh>
            ))}
            <mesh position={[0, -height * 0.35, depth / 2 + 0.015]}>
              <boxGeometry args={[width * 0.5, 0.1, 0.02]} />
              <meshStandardMaterial color={accent} emissive={isActive ? accent : '#000'} emissiveIntensity={isActive ? 0.8 : 0} />
            </mesh>
          </group>
        );
      case 'quantum':
        return (
          <group position={[0, height / 2 + 0.05, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[width * 0.45, width * 0.5, height * 0.9, 24]} />
              <meshStandardMaterial color={color} metalness={0.7} roughness={0.25} emissive={isActive ? emissive : '#000'} emissiveIntensity={isActive ? 0.45 : 0} />
            </mesh>
            {[-0.25, 0, 0.25].map((y, i) => (
              <mesh key={i} position={[0, y * height, 0]}>
                <torusGeometry args={[width * 0.6, 0.05, 12, 24]} />
                <meshStandardMaterial color={accent} emissive={isActive ? accent : '#000'} emissiveIntensity={isActive ? 1.3 : 0} />
              </mesh>
            ))}
            <mesh position={[0, height * 0.1, 0]}>
              <sphereGeometry args={[0.18, 16, 16]} />
              <meshStandardMaterial color={accent} emissive={isActive ? accent : '#000'} emissiveIntensity={isActive ? 1.6 : 0} />
            </mesh>
          </group>
        );
      default:
        return (
          <mesh castShadow position={[0, height / 2 + 0.05, 0]}>
            <boxGeometry args={[width, height, depth]} />
            <meshStandardMaterial color={color} metalness={0.6} roughness={0.35} emissive={isActive ? emissive : '#000'} emissiveIntensity={isActive ? 0.35 : 0} />
          </mesh>
        );
    }
  };

  return (
    <group ref={pcRef} position={position}>
      <mesh
        position={[0, height / 2 + 0.1, 0]}
        onClick={() => onPCClick?.(id)}
        onPointerEnter={(e) => {
          e.object.scale.set(1.1, 1.1, 1.1);
        }}
        onPointerLeave={(e) => {
          e.object.scale.set(1, 1, 1);
        }}
      >
        <boxGeometry args={[width + 0.3, height + 0.3, depth + 0.3]} />
        <meshStandardMaterial transparent opacity={0} />
      </mesh>

      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[width * 0.9, width * 1.0, 0.12, 12]} />
        <meshStandardMaterial color="#facc15" metalness={0.35} roughness={0.35} />
      </mesh>

      {renderBody()}

      <mesh position={[0, height * 0.2, depth / 2 + 0.03]}>
        <planeGeometry args={[width * 0.6, 0.22]} />
        <meshStandardMaterial color="#0f172a" emissive={isActive ? accent : '#111827'} emissiveIntensity={isActive ? 1.0 : 0.2} transparent opacity={0.9} />
      </mesh>

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

      {isActive && (
        <>
          {hasPendingEarnings ? (
            <FloatingCoin position={[0, height + 0.5, 0]} isPending={true} />
          ) : (
            <FloatingCoin position={[0, height + 0.1, 0]} isPending={false} />
          )}
          <MiningParticles position={[0, height / 2 + 0.1, 0]} count={2} />
          <pointLight
            position={[0, height / 2 + 0.1, 0]}
            color={hasPendingEarnings ? '#10b981' : color}
            intensity={hasPendingEarnings ? glowIntensity * 1.5 : glowIntensity}
            distance={3}
          />
        </>
      )}

      <mesh position={[width / 2 - 0.1, height + 0.1 - 0.2, depth / 2 + 0.02]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color={isActive ? '#00ff00' : '#ff0000'} emissive={isActive ? '#00ff00' : '#ff0000'} emissiveIntensity={2} />
      </mesh>
    </group>
  );
});
