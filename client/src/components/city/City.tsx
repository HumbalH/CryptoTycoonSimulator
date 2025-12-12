import { Suspense, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { getRoadLayout } from './roadLayout';
import { getBuildingLayout } from './buildingLayout';
import { getParkLayout } from './parkLayout';
import { getCarLayout, initializeCarState, updateCarPosition } from './carLayout';
import { ParasolGroup } from './Parasol';
import { getTreeLayout, getStreetLightLayout, getBarrierLayout, getUtilityLayout } from './decorativeLayout';

// GLB Model loader component
function GLBModel({ path, position, rotation = [0, 0, 0], scale = 1, ...props }: any) {
  const gltf = useGLTF(path);
  const scene = Array.isArray(gltf) ? gltf[0].scene : gltf.scene;
  const clonedScene = scene.clone();

  // Apply green color to grass and tree models
  if (path.includes('grass') || path.includes('tree')) {
    clonedScene.traverse((child: any) => {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({
          color: '#22c55e',
          metalness: 0.0,
          roughness: 0.8,
        });
      }
    });
  }

  return (
    <group position={position} rotation={rotation} scale={scale} {...props}>
      <primitive object={clonedScene} />
    </group>
  );
}

// Roads component
function Roads() {
  const basePath = '/3D-Models/Models/GLB format/';
  const roadLayout = getRoadLayout();

  return (
    <Suspense fallback={null}>
      {roadLayout.map((road, idx) => (
        <GLBModel
          key={`road-${idx}`}
          path={`${basePath}${road.model}`}
          position={[road.x, road.level || 0, road.z]}
          rotation={[0, road.rotation, 0]}
          scale={1}
        />
      ))}
    </Suspense>
  );
}

// Buildings component
function Buildings() {
  const basePath = '/3D-Models/Models/GLB format/';
  const buildingLayout = getBuildingLayout();

  return (
    <Suspense fallback={null}>
      {buildingLayout.map((building, idx) => (
        <GLBModel
          key={`building-${idx}`}
          path={`${basePath}${building.model}`}
          position={[building.x, 0, building.z]}
          rotation={[0, building.rotation, 0]}
          scale={1}
        />
      ))}
    </Suspense>
  );
}

// Parks component
function Parks() {
  const parkLayout = getParkLayout();

  return (
    <Suspense fallback={null}>
      {parkLayout.map((park, idx) => (
        <group key={`park-group-${idx}`}>
          {/* Park grass area */}
          <mesh position={[park.x, 0.02, park.z]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[park.width, park.depth]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.0} roughness={0.8} />
          </mesh>

          {/* Parasols in park */}
          <ParasolGroup
            position={[park.x - 0.5, 0.1, park.z - 0.5]}
            count={2}
            colors={['#ef4444', '#3b82f6']}
            spacing={0.6}
            scale={0.8}
          />
          <ParasolGroup
            position={[park.x + 0.5, 0.1, park.z + 0.5]}
            count={2}
            colors={['#fbbf24', '#10b981']}
            spacing={0.6}
            scale={0.8}
          />
        </group>
      ))}
    </Suspense>
  );
}

// Animated Cars component
function AnimatedCars() {
  const basePath = '/3D-Models/Models/GLB format/';
  const carLayout = getCarLayout();
  const carRefs = useRef<any[]>([]);
  const [carStates] = useState(() => initializeCarState(carLayout));

  useFrame(() => {
    carRefs.current.forEach((ref, idx) => {
      if (ref && carStates[idx]) {
        updateCarPosition(carStates[idx]);

        if (ref.current) {
          ref.current.position.set(carStates[idx].x, carStates[idx].y, carStates[idx].z);
        }
      }
    });
  });

  return (
    <Suspense fallback={null}>
      {carLayout.map((car, idx) => (
        <group
          key={`car-${idx}`}
          ref={(ref) => {
            if (ref && !carRefs.current[idx]) {
              carRefs.current[idx] = { current: ref };
            }
          }}
          position={[carStates[idx].x, carStates[idx].y, carStates[idx].z]}
          rotation={[0, carStates[idx].rotation, 0]}
        >
          <Suspense fallback={null}>
            <GLBModel path={`${basePath}${car.model}`} position={[0, 0, 0]} scale={0.3} />
          </Suspense>
        </group>
      ))}
    </Suspense>
  );
}

// Decorative elements component (trees, lights, barriers, etc)
function DecorativeElements() {
  const basePath = '/3D-Models/Models/GLB format/';

  const treeLayout = getTreeLayout();
  const lightLayout = getStreetLightLayout();
  const barrierLayout = getBarrierLayout();
  const utilityLayout = getUtilityLayout();

  const allDecorations = [...treeLayout, ...lightLayout, ...barrierLayout, ...utilityLayout];

  return (
    <Suspense fallback={null}>
      {allDecorations.map((element, idx) => (
        <GLBModel
          key={`deco-${idx}`}
          path={`${basePath}${element.model}`}
          position={[element.x, 0, element.z]}
          rotation={[0, element.rotation || 0, 0]}
          scale={element.scale || 1}
        />
      ))}
    </Suspense>
  );
}

// Main City component
export default function City() {
  return (
    <Suspense fallback={null}>
      <Parks />
      <Roads />
      <Buildings />
      <AnimatedCars />
      <DecorativeElements />
    </Suspense>
  );
}
