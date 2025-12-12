// Decorative elements configuration for the city (trees, lights, etc)
export interface DecorativeElement {
  x: number;
  z: number;
  model: string;
  rotation?: number;
  scale?: number;
}

// Trees - using available models
export const getTreeLayout = (): DecorativeElement[] => {
  const trees: DecorativeElement[] = [];
  
  // Trees around parks - using the new grass-trees models
  const parkPositions = [
    { parkX: -12, parkZ: -22 },
    { parkX: 12, parkZ: -22 },
    { parkX: -12, parkZ: -2 },
    { parkX: 12, parkZ: -2 },
  ];

  parkPositions.forEach(park => {
    // Scatter trees around each park using new grass-trees models
    const scatter = [
      { x: -3, z: -3, model: 'grass-trees.glb' },
    ];

    scatter.forEach(pos => {
      trees.push({
        x: park.parkX + pos.x,
        z: park.parkZ + pos.z,
        model: pos.model,
        rotation: 0,
        scale: 1.0,
      });
    });
  });

  // Trees along roads (street trees) - using new grass-trees models
  const roadAlignedTrees = [
    { x: -18, z: -16, model: 'grass-trees.glb', scale: 0.8 },
    { x: -14, z: -16, model: 'grass-trees-tall.glb', scale: 0.8 },
    { x: -10, z: -16, model: 'grass-trees.glb', scale: 0.8 },
    { x: -6, z: -16, model: 'grass-trees-tall.glb', scale: 0.8 },
    { x: -2, z: -16, model: 'grass-trees.glb', scale: 0.8 },
    { x: 2, z: -16, model: 'grass-trees-tall.glb', scale: 0.8 },
    { x: 6, z: -16, model: 'grass-trees.glb', scale: 0.8 },
    { x: 10, z: -16, model: 'grass-trees-tall.glb', scale: 0.8 },
    { x: 14, z: -16, model: 'grass-trees.glb', scale: 0.8 },
    { x: 18, z: -16, model: 'grass-trees-tall.glb', scale: 0.8 },

    { x: -18, z: -8, model: 'grass-trees-tall.glb', scale: 0.8 },
    { x: -14, z: -8, model: 'grass-trees.glb', scale: 0.8 },
    { x: -10, z: -8, model: 'grass-trees-tall.glb', scale: 0.8 },
    { x: -6, z: -8, model: 'grass-trees.glb', scale: 0.8 },
    { x: -2, z: -8, model: 'grass-trees-tall.glb', scale: 0.8 },
    { x: 2, z: -8, model: 'grass-trees.glb', scale: 0.8 },
    { x: 6, z: -8, model: 'grass-trees-tall.glb', scale: 0.8 },
    { x: 10, z: -8, model: 'grass-trees.glb', scale: 0.8 },
    { x: 14, z: -8, model: 'grass-trees-tall.glb', scale: 0.8 },
    { x: 18, z: -8, model: 'grass-trees.glb', scale: 0.8 },
  ];

  return [...trees, ...roadAlignedTrees];
};

// Street lights
export const getStreetLightLayout = (): DecorativeElement[] => [
  // Lights along main horizontal street
  { x: -16, z: -13, model: 'light-square.glb', rotation: 0, scale: 0.8 },
  { x: -12, z: -13, model: 'light-square.glb', rotation: 0, scale: 0.8 },
  { x: -8, z: -13, model: 'light-square.glb', rotation: 0, scale: 0.8 },
  { x: -4, z: -13, model: 'light-square.glb', rotation: 0, scale: 0.8 },
  { x: 0, z: -13, model: 'light-square.glb', rotation: 0, scale: 0.8 },
  { x: 4, z: -13, model: 'light-square.glb', rotation: 0, scale: 0.8 },
  { x: 8, z: -13, model: 'light-square.glb', rotation: 0, scale: 0.8 },
  { x: 12, z: -13, model: 'light-square.glb', rotation: 0, scale: 0.8 },
  { x: 16, z: -13, model: 'light-square.glb', rotation: 0, scale: 0.8 },

  { x: -16, z: -11, model: 'light-square.glb', rotation: 0, scale: 0.8 },
  { x: -12, z: -11, model: 'light-square.glb', rotation: 0, scale: 0.8 },
  { x: -8, z: -11, model: 'light-square.glb', rotation: 0, scale: 0.8 },
  { x: -4, z: -11, model: 'light-square.glb', rotation: 0, scale: 0.8 },
  { x: 0, z: -11, model: 'light-square.glb', rotation: 0, scale: 0.8 },
  { x: 4, z: -11, model: 'light-square.glb', rotation: 0, scale: 0.8 },
  { x: 8, z: -11, model: 'light-square.glb', rotation: 0, scale: 0.8 },
  { x: 12, z: -11, model: 'light-square.glb', rotation: 0, scale: 0.8 },
  { x: 16, z: -11, model: 'light-square.glb', rotation: 0, scale: 0.8 },

  // Lights along vertical street
  { x: -1, z: -20, model: 'light-curved.glb', rotation: Math.PI / 2, scale: 0.8 },
  { x: 1, z: -20, model: 'light-curved.glb', rotation: Math.PI / 2, scale: 0.8 },
  { x: -1, z: -16, model: 'light-curved.glb', rotation: Math.PI / 2, scale: 0.8 },
  { x: 1, z: -16, model: 'light-curved.glb', rotation: Math.PI / 2, scale: 0.8 },
  { x: -1, z: -12, model: 'light-curved.glb', rotation: Math.PI / 2, scale: 0.8 },
  { x: 1, z: -12, model: 'light-curved.glb', rotation: Math.PI / 2, scale: 0.8 },
  { x: -1, z: -8, model: 'light-curved.glb', rotation: Math.PI / 2, scale: 0.8 },
  { x: 1, z: -8, model: 'light-curved.glb', rotation: Math.PI / 2, scale: 0.8 },
  { x: -1, z: -4, model: 'light-curved.glb', rotation: Math.PI / 2, scale: 0.8 },
  { x: 1, z: -4, model: 'light-curved.glb', rotation: Math.PI / 2, scale: 0.8 },
  { x: -1, z: 0, model: 'light-curved.glb', rotation: Math.PI / 2, scale: 0.8 },
  { x: 1, z: 0, model: 'light-curved.glb', rotation: Math.PI / 2, scale: 0.8 },
];

// Barriers and construction elements
export const getBarrierLayout = (): DecorativeElement[] => [
  // Construction barriers at intersections
  { x: -0.5, z: -13.5, model: 'construction-barrier.glb', rotation: 0, scale: 0.7 },
  { x: 0.5, z: -13.5, model: 'construction-barrier.glb', rotation: 0, scale: 0.7 },
  { x: -0.5, z: -10.5, model: 'construction-barrier.glb', rotation: 0, scale: 0.7 },
  { x: 0.5, z: -10.5, model: 'construction-barrier.glb', rotation: 0, scale: 0.7 },
];

// Utility tanks and industrial elements
export const getUtilityLayout = (): DecorativeElement[] => [
  // Utility tanks

  // Overhang structures
  { x: -15, z: -20, model: 'detail-overhang.glb', rotation: 0, scale: 0.7 },
  { x: 15, z: -20, model: 'detail-overhang.glb', rotation: Math.PI, scale: 0.7 },
];
