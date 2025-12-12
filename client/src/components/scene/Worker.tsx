import { useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import * as THREE from 'three';

export interface WorkerProps {
  id: string;
  pcs: Array<{ position: [number, number, number] }>;
  workerType?: 'technician' | 'engineer' | 'expert' | string;
}

export function Worker({ id, pcs, workerType = 'technician' }: WorkerProps) {
  const workerRef = useRef<THREE.Group>(null);
  const [currentPcIndex, setCurrentPcIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const roleStyles: Record<string, { suit: string; accent: string; glow: string; glove: string }> = {
    technician: { suit: '#2563eb', accent: '#0ea5e9', glow: '#38bdf8', glove: '#f97316' },
    engineer: { suit: '#16a34a', accent: '#22c55e', glow: '#4ade80', glove: '#f59e0b' },
    expert: { suit: '#7c3aed', accent: '#a855f7', glow: '#c084fc', glove: '#f97316' }
  };
  const style = roleStyles[workerType] || roleStyles.technician;

  useFrame((state, delta) => {
    if (!workerRef.current || pcs.length === 0) return;

    const targetPos = pcs[currentPcIndex].position;
    const currentPos = workerRef.current.position;
    const direction = new THREE.Vector3(targetPos[0] - currentPos.x, 0.3, targetPos[2] - currentPos.z);
    const distance = direction.length();

    if (distance > 0.5) {
      direction.normalize();
      workerRef.current.position.x += direction.x * delta * 2;
      workerRef.current.position.z += direction.z * delta * 2;
      const angle = Math.atan2(direction.x, direction.z);
      workerRef.current.rotation.y = angle;
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
      <mesh position={[-0.08, -0.25, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.25, 12]} />
        <meshStandardMaterial color="#1f2937" metalness={0.3} roughness={0.6} />
      </mesh>
      <mesh position={[0.08, -0.25, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.25, 12]} />
        <meshStandardMaterial color="#1f2937" metalness={0.3} roughness={0.6} />
      </mesh>

      <mesh position={[-0.08, -0.4, 0]} castShadow>
        <boxGeometry args={[0.12, 0.06, 0.18]} />
        <meshStandardMaterial color="#111827" metalness={0.4} roughness={0.5} />
      </mesh>
      <mesh position={[0.08, -0.4, 0]} castShadow>
        <boxGeometry args={[0.12, 0.06, 0.18]} />
        <meshStandardMaterial color="#111827" metalness={0.4} roughness={0.5} />
      </mesh>

      <mesh castShadow>
        <capsuleGeometry args={[0.22, 0.55, 12, 24]} />
        <meshStandardMaterial color={style.suit} metalness={0.35} roughness={0.4} />
      </mesh>

      <mesh position={[0, -0.05, 0]} castShadow>
        <torusGeometry args={[0.18, 0.025, 12, 24]} />
        <meshStandardMaterial color={style.accent} metalness={0.5} roughness={0.3} emissive={style.accent} emissiveIntensity={0.4} />
      </mesh>

      <mesh position={[-0.25, 0.05, 0]} rotation={[0, 0, Math.PI / 10]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.35, 10]} />
        <meshStandardMaterial color={style.suit} metalness={0.35} roughness={0.4} />
      </mesh>
      <mesh position={[0.25, 0.05, 0]} rotation={[0, 0, -Math.PI / 10]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.35, 10]} />
        <meshStandardMaterial color={style.suit} metalness={0.35} roughness={0.4} />
      </mesh>

      <mesh position={[-0.25, -0.1, 0]} castShadow>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial color={style.glove} metalness={0.3} />
      </mesh>
      <mesh position={[0.25, -0.1, 0]} castShadow>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial color={style.glove} metalness={0.3} />
      </mesh>

      <mesh position={[0, 0.55, 0]} castShadow>
        <sphereGeometry args={[0.16, 20, 20]} />
        <meshStandardMaterial color="#fbbf24" roughness={0.5} />
      </mesh>

      <mesh position={[0, 0.55, 0.12]} rotation={[-0.1, 0, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.12, 0.08, 16, 1, true]} />
        <meshStandardMaterial color={style.accent} metalness={0.7} roughness={0.1} emissive={style.accent} emissiveIntensity={0.8} transparent opacity={0.7} />
      </mesh>

      <mesh position={[0, 0.72, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.18, 0.12, 12]} />
        <meshStandardMaterial color="#eab308" metalness={0.4} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.8, 0]} castShadow>
        <coneGeometry args={[0.12, 0.12, 12]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.4} roughness={0.3} emissive="#f59e0b" emissiveIntensity={0.2} />
      </mesh>

      <mesh position={[0, 0.2, -0.16]} castShadow>
        <boxGeometry args={[0.18, 0.28, 0.1]} />
        <meshStandardMaterial color="#0f172a" metalness={0.35} roughness={0.45} />
      </mesh>
      <mesh position={[0, 0.3, -0.12]} castShadow>
        <boxGeometry args={[0.16, 0.12, 0.06]} />
        <meshStandardMaterial color={style.accent} metalness={0.5} emissive={style.accent} emissiveIntensity={0.6} />
      </mesh>

      <mesh position={[0.3, -0.05, 0]} castShadow>
        <boxGeometry args={[0.18, 0.12, 0.12]} />
        <meshStandardMaterial color="#6b7280" metalness={0.7} roughness={0.35} />
      </mesh>
      <mesh position={[0.3, 0.02, 0.07]} castShadow>
        <boxGeometry args={[0.12, 0.04, 0.02]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.6} roughness={0.3} />
      </mesh>

      <pointLight position={[0, 0.5, 0]} color={style.glow} intensity={1.8} distance={2.4} />
    </group>
  );
}
