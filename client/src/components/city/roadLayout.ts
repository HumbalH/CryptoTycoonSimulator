// Road layout configuration for the city
export interface RoadConfig {
  x: number;
  z: number;
  rotation: number;
  model: string;
  level: number;
}

export const getRoadLayout = (): RoadConfig[] => [
  // Main horizontal street (East-West) - all straight
  { x: -18, z: -12, rotation: 0, model: 'road-straight.glb', level: 0 },
  { x: -17, z: -12, rotation: 0, model: 'road-straight.glb', level: 0 },
  { x: -16, z: -12, rotation: 0, model: 'road-straight.glb', level: 0 },
  { x: -15, z: -12, rotation: 0, model: 'road-straight.glb', level: 0 },
  { x: -14, z: -12, rotation: 0, model: 'road-straight.glb', level: 0 },
  { x: -13, z: -12, rotation: 0, model: 'road-straight.glb', level: 0 },
  { x: -12, z: -12, rotation: 0, model: 'road-straight.glb', level: 0 },
  { x: -11, z: -12, rotation: 0, model: 'road-straight.glb', level: 0 },
  { x: -10, z: -12, rotation: 0, model: 'road-straight.glb', level: 0 },
  { x: -9, z: -12, rotation: 0, model: 'road-straight.glb', level: 0 },
  { x: -8, z: -12, rotation: 0, model: 'road-straight.glb', level: 0 },
  { x: -7, z: -12, rotation: 0, model: 'road-straight.glb', level: 0 },
  { x: -6, z: -12, rotation: 0, model: 'road-straight.glb', level: 0 },
  { x: -5, z: -12, rotation: 0, model: 'road-straight.glb', level: 0 },
  { x: -4, z: -12, rotation: 0, model: 'road-straight.glb', level: 0 },
  { x: -3, z: -12, rotation: 0, model: 'road-straight.glb', level: 0 },
  { x: -2, z: -12, rotation: 0, model: 'road-straight.glb', level: 0 },
  { x: -1, z: -12, rotation: 0, model: 'road-straight.glb', level: 0 },
  { x: 0, z: -12, rotation: 0, model: 'road-roundabout.glb', level: 0 }, // Main intersection roundabout
  { x: 1, z: -12, rotation: 0, model: 'road-straight.glb', level: 0 },
  { x: 2, z: -12, rotation: 0, model: 'road-straight.glb', level: 0 },
  { x: 3, z: -12, rotation: 0, model: 'road-straight.glb', level: 0 },
  { x: 4, z: -12, rotation: 0, model: 'road-straight.glb', level: 0 },
  { x: 5, z: -12, rotation: 0, model: 'road-straight.glb', level: 0 },
  { x: 6, z: -12, rotation: 0, model: 'road-straight.glb', level: 0 },
  { x: 7, z: -12, rotation: 0, model: 'road-straight.glb', level: 0 },
  { x: 8, z: -12, rotation: 0, model: 'road-straight.glb', level: 0 },
  { x: 9, z: -12, rotation: 0, model: 'road-straight.glb', level: 0 },
  { x: 10, z: -12, rotation: 0, model: 'road-straight.glb', level: 0 },
  { x: 11, z: -12, rotation: 0, model: 'road-straight.glb', level: 0 },
  { x: 12, z: -12, rotation: 0, model: 'road-straight.glb', level: 0 },
  { x: 13, z: -12, rotation: 0, model: 'road-straight.glb', level: 0 },
  { x: 14, z: -12, rotation: 0, model: 'road-straight.glb', level: 0 },
  { x: 15, z: -12, rotation: 0, model: 'road-straight.glb', level: 0 },
  { x: 16, z: -12, rotation: 0, model: 'road-straight.glb', level: 0 },
  { x: 17, z: -12, rotation: 0, model: 'road-straight.glb', level: 0 },
  { x: 18, z: -12, rotation: 0, model: 'road-straight.glb', level: 0 },

  // Vertical street (North-South) - all straight with roundabouts at intersections
  { x: 0, z: -26, rotation: Math.PI / 2, model: 'road-straight.glb', level: 0 },
  { x: 0, z: -25, rotation: Math.PI / 2, model: 'road-straight.glb', level: 0 },
  { x: 0, z: -24, rotation: Math.PI / 2, model: 'road-straight.glb', level: 0 },
  { x: 0, z: -23, rotation: Math.PI / 2, model: 'road-straight.glb', level: 0 },
  { x: 0, z: -22, rotation: Math.PI / 2, model: 'road-straight.glb', level: 0 },
  { x: 0, z: -21, rotation: Math.PI / 2, model: 'road-straight.glb', level: 0 },
  { x: 0, z: -20, rotation: Math.PI / 2, model: 'road-straight.glb', level: 0 },
  { x: 0, z: -19, rotation: Math.PI / 2, model: 'road-straight.glb', level: 0 },
  { x: 0, z: -18, rotation: Math.PI / 2, model: 'road-straight.glb', level: 0 },
  { x: 0, z: -17, rotation: Math.PI / 2, model: 'road-straight.glb', level: 0 },
  { x: 0, z: -16, rotation: Math.PI / 2, model: 'road-straight.glb', level: 0 },
  { x: 0, z: -15, rotation: Math.PI / 2, model: 'road-straight.glb', level: 0 },
  { x: 0, z: -14, rotation: Math.PI / 2, model: 'road-straight.glb', level: 0 },
  { x: 0, z: -13, rotation: Math.PI / 2, model: 'road-straight.glb', level: 0 },
  { x: 0, z: -11, rotation: Math.PI / 2, model: 'road-straight.glb', level: 0 },
  { x: 0, z: -10, rotation: Math.PI / 2, model: 'road-straight.glb', level: 0 },
  { x: 0, z: -9, rotation: Math.PI / 2, model: 'road-straight.glb', level: 0 },
  { x: 0, z: -8, rotation: Math.PI / 2, model: 'road-straight.glb', level: 0 },
  { x: 0, z: -7, rotation: Math.PI / 2, model: 'road-straight.glb', level: 0 },
  { x: 0, z: -6, rotation: Math.PI / 2, model: 'road-straight.glb', level: 0 },
  { x: 0, z: -5, rotation: Math.PI / 2, model: 'road-straight.glb', level: 0 },
  { x: 0, z: -4, rotation: Math.PI / 2, model: 'road-straight.glb', level: 0 },
  { x: 0, z: -3, rotation: Math.PI / 2, model: 'road-straight.glb', level: 0 },
  { x: 0, z: -2, rotation: Math.PI / 2, model: 'road-straight.glb', level: 0 },
  { x: 0, z: -1, rotation: Math.PI / 2, model: 'road-straight.glb', level: 0 },
  { x: 0, z: 4, rotation: Math.PI / 2, model: 'road-roundabout.glb', level: 0 }, // Third roundabout
  { x: 0, z: 0, rotation: Math.PI / 2, model: 'road-straight.glb', level: 0 },
  { x: 0, z: 1, rotation: Math.PI / 2, model: 'road-straight.glb', level: 0 },
  { x: 0, z: 2, rotation: Math.PI / 2, model: 'road-straight.glb', level: 0 },
  { x: 0, z: 3, rotation: Math.PI / 2, model: 'road-straight.glb', level: 0 },
  { x: -2, z: 4, rotation: 0, model: 'road-straight.glb', level: 0 }, // Third roundabout
  { x: -3, z: 4, rotation: 0, model: 'road-straight.glb', level: 0 }, // Third roundabout
  { x: -4, z: 4, rotation: 0, model: 'road-straight.glb', level: 0 }, // Third roundabout
  { x: -5, z: 4, rotation: 0, model: 'road-straight.glb', level: 0 }, // Third roundabout
];
