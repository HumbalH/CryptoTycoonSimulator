import { useMemo } from 'react';
import * as THREE from 'three';

interface GridBoundaryProps {
  gridWidth: number;
  gridHeight: number;
  gridStartX: number;
  gridStartZ: number;
}

export function GridBoundary({ gridWidth, gridHeight, gridStartX, gridStartZ }: GridBoundaryProps) {
  const GRID_CELL_SIZE = 2;
  
  const gridLines = useMemo(() => {
    const lines: THREE.Vector3[][] = [];
    
    // Calculate grid boundaries
    const maxX = gridStartX + gridWidth * GRID_CELL_SIZE;
    const maxZ = gridStartZ + gridHeight * GRID_CELL_SIZE;
    
    // Vertical lines (along X axis)
    for (let x = gridStartX; x <= maxX; x += GRID_CELL_SIZE) {
      lines.push([
        new THREE.Vector3(x, 0.15, gridStartZ),
        new THREE.Vector3(x, 0.15, maxZ)
      ]);
    }
    
    // Horizontal lines (along Z axis)
    for (let z = gridStartZ; z <= maxZ; z += GRID_CELL_SIZE) {
      lines.push([
        new THREE.Vector3(gridStartX, 0.15, z),
        new THREE.Vector3(maxX, 0.15, z)
      ]);
    }
    
    return lines;
  }, [gridWidth, gridHeight, gridStartX, gridStartZ]);
  
  const boundaryGeometry = useMemo(() => {
    const maxX = gridStartX + gridWidth * GRID_CELL_SIZE;
    const maxZ = gridStartZ + gridHeight * GRID_CELL_SIZE;
    
    const points = [
      new THREE.Vector3(gridStartX, 0.2, gridStartZ),
      new THREE.Vector3(maxX, 0.2, gridStartZ),
      new THREE.Vector3(maxX, 0.2, maxZ),
      new THREE.Vector3(gridStartX, 0.2, maxZ),
      new THREE.Vector3(gridStartX, 0.2, gridStartZ)
    ];
    
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [gridWidth, gridHeight, gridStartX, gridStartZ]);

  return (
    <group>
      {/* Grid lines */}
      {gridLines.map((points, index) => (
        <line key={`grid-line-${index}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={points.length}
              array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color={0x4ade80} opacity={0.15} transparent />
        </line>
      ))}
      
      {/* Boundary outline */}
      <line>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attach="attributes-position"
            count={5}
            array={new Float32Array([
              gridStartX, 0.2, gridStartZ,
              gridStartX + gridWidth * GRID_CELL_SIZE, 0.2, gridStartZ,
              gridStartX + gridWidth * GRID_CELL_SIZE, 0.2, gridStartZ + gridHeight * GRID_CELL_SIZE,
              gridStartX, 0.2, gridStartZ + gridHeight * GRID_CELL_SIZE,
              gridStartX, 0.2, gridStartZ
            ])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color={0x4ade80} opacity={0.4} transparent linewidth={2} />
      </line>
    </group>
  );
}
