import { useFrame } from '@react-three/fiber';
import type { MutableRefObject } from 'react';
import * as THREE from 'three';

export interface CameraPanBoundsProps {
  controlsRef: MutableRefObject<any>;
  cameraRef: MutableRefObject<THREE.PerspectiveCamera | null>;
  panBounds: { minX: number; maxX: number; minZ: number; maxZ: number };
}

export function CameraPanBounds({ controlsRef, cameraRef, panBounds }: CameraPanBoundsProps) {
  useFrame(() => {
    const controls = controlsRef.current;
    const cam = cameraRef.current;
    if (!controls || !cam) return;

    const target = controls.target as THREE.Vector3;
    const offset = cam.position.clone().sub(target);

    const clampedTarget = new THREE.Vector3(
      THREE.MathUtils.clamp(target.x, panBounds.minX, panBounds.maxX),
      0,
      THREE.MathUtils.clamp(target.z, panBounds.minZ, panBounds.maxZ)
    );

    if (!target.equals(clampedTarget)) {
      controls.target.copy(clampedTarget);
      cam.position.copy(clampedTarget.clone().add(offset));
      controls.update();
    }
  });

  return null;
}
