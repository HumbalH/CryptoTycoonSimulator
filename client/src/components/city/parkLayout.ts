// Park/green spaces configuration for the city
export interface ParkConfig {
  x: number;
  z: number;
  width: number;
  depth: number;
  color: string;
}

export const getParkLayout = (): ParkConfig[] => [
  // Corner parks
  { x: -22, z: -22, width: 3, depth: 3, color: '#22c55e' }, // North-west corner park
  { x: 22, z: -22, width: 3, depth: 3, color: '#22c55e' }, // North-east corner park
  { x: -22, z: 6, width: 3, depth: 3, color: '#22c55e' }, // South-west corner park
  { x: 22, z: 6, width: 3, depth: 3, color: '#22c55e' }, // South-east corner park

  // Mid-block parks along main streets
  { x: -8, z: -26, width: 2.5, depth: 2.5, color: '#10b981' }, // North central park
  { x: 8, z: -26, width: 2.5, depth: 2.5, color: '#10b981' }, // North-east green space
  { x: -8, z: 10, width: 2.5, depth: 2.5, color: '#10b981' }, // South central park
  { x: 8, z: 10, width: 2.5, depth: 2.5, color: '#10b981' }, // South-east green space
];
