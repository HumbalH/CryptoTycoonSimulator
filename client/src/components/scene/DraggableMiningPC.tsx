import { MiningPC, type MiningPCProps } from './MiningPC';
import { useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { useFrame, useThree, ThreeEvent } from '@react-three/fiber';

interface DraggableMiningPCProps extends MiningPCProps {
  gridWidth: number;
  gridHeight: number;
  gridStartX: number;
  gridStartZ: number;
  onPositionChange?: (pcId: string, newPosition: [number, number, number]) => void;
  isSelected?: boolean;
  onSelect?: (pcId: string) => void;
}

export function DraggableMiningPC({
  position,
  id,
  gridWidth,
  gridHeight,
  gridStartX,
  gridStartZ,
  onPositionChange,
  isSelected = false,
  onSelect,
  ...pcProps
}: DraggableMiningPCProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { camera, gl, raycaster } = useThree();
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef<THREE.Vector3>(new THREE.Vector3());
  const dragOffset = useRef<THREE.Vector3>(new THREE.Vector3());
  const dragPlane = useRef<THREE.Plane>(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0));

  // Define grid dimensions (matches Game.tsx logic)
  const GRID_CELL_SIZE = 2; // Each grid cell is 2 units
  const maxGridX = gridStartX + gridWidth * GRID_CELL_SIZE;
  const maxGridZ = gridStartZ + gridHeight * GRID_CELL_SIZE;

  // Check if position is within unlocked grid
  const isPositionValid = useCallback((pos: [number, number, number]): boolean => {
    const [x, , z] = pos;
    return x >= gridStartX && x < maxGridX && z >= gridStartZ && z < maxGridZ;
  }, [gridStartX, gridStartZ, maxGridX, maxGridZ]);

  // Snap position to grid
  const snapToGrid = useCallback((pos: THREE.Vector3): [number, number, number] => {
    const snappedX = Math.round(pos.x / GRID_CELL_SIZE) * GRID_CELL_SIZE;
    const snappedZ = Math.round(pos.z / GRID_CELL_SIZE) * GRID_CELL_SIZE;
    const clampedX = Math.max(gridStartX, Math.min(snappedX, maxGridX - GRID_CELL_SIZE));
    const clampedZ = Math.max(gridStartZ, Math.min(snappedZ, maxGridZ - GRID_CELL_SIZE));
    return [clampedX, 0.1, clampedZ];
  }, [gridStartX, gridStartZ, maxGridX, maxGridZ]);

  // Handle pointer down
  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    
    if (onSelect) {
      onSelect(id);
    }
    
    if (!isSelected) return;

    setIsDragging(true);
    gl.domElement.style.cursor = 'grabbing';
    
    if (groupRef.current) {
      dragStartPos.current.copy(groupRef.current.position);
      
      // Calculate intersection point with ground plane
      const intersectPoint = new THREE.Vector3();
      raycaster.ray.intersectPlane(dragPlane.current, intersectPoint);
      
      // Store offset between click point and PC position
      dragOffset.current.copy(intersectPoint).sub(groupRef.current.position);
    }
  };

  // Handle pointer up
  const handlePointerUp = useCallback(() => {
    if (!isDragging || !groupRef.current) return;
    
    setIsDragging(false);
    gl.domElement.style.cursor = 'default';

    // Snap to grid and validate
    const currentPos = groupRef.current.position;
    const snappedPos = snapToGrid(currentPos);
    
    if (isPositionValid(snappedPos)) {
      if (onPositionChange) {
        onPositionChange(id, snappedPos);
      }
      groupRef.current.position.set(...snappedPos);
    } else {
      // Revert to original position
      groupRef.current.position.copy(dragStartPos.current);
    }
  }, [isDragging, snapToGrid, isPositionValid, id, onPositionChange, gl]);

  // Handle pointer move during drag
  useFrame(({ mouse }) => {
    if (!isDragging || !groupRef.current) return;

    // Update raycaster with current mouse position
    raycaster.setFromCamera(mouse, camera);

    // Intersect with ground plane (y = 0)
    const intersectPoint = new THREE.Vector3();
    const hasIntersection = raycaster.ray.intersectPlane(dragPlane.current, intersectPoint);

    if (hasIntersection && intersectPoint) {
      // Calculate new position accounting for offset
      const newPos = intersectPoint.clone().sub(dragOffset.current);
      newPos.y = 0.1; // Keep at floor level
      
      // Update position (will be validated and snapped on release)
      groupRef.current.position.copy(newPos);
    }
  });

  // Hover cursor feedback
  const handlePointerOver = () => {
    if (isSelected && !isDragging) {
      gl.domElement.style.cursor = 'grab';
    }
  };

  const handlePointerOut = () => {
    if (!isDragging) {
      gl.domElement.style.cursor = 'default';
    }
  };

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* Selection indicator ring */}
      {isSelected && (
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.2, 1.4, 32]} />
          <meshBasicMaterial color={0x4ade80} transparent opacity={0.8} />
        </mesh>
      )}
      {/* Drag indicator when dragging */}
      {isDragging && (
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.0, 1.6, 32]} />
          <meshBasicMaterial color={0x60a5fa} transparent opacity={0.6} wireframe />
        </mesh>
      )}
      <MiningPC {...pcProps} position={[0, 0, 0]} id={id} />
    </group>
  );
}
