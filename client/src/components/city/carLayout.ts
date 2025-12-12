// Car configuration for the city
export interface CarConfig {
  x: number;
  z: number;
  rotation: number;
  model: string;
  speed: number;
  path: string;
}

export interface CarState {
  x: number;
  z: number;
  y: number;
  rotation: number;
  speed: number;
  path: string;
}

export const getCarLayout = (): CarConfig[] => [
  { x: -18, z: -12, rotation: Math.PI, model: 'sedan.glb', speed: 0.015, path: 'horizontal' },
  { x: 0, z: -26, rotation: Math.PI / 2, model: 'taxi.glb', speed: 0.012, path: 'vertical' },
];

export const initializeCarState = (carLayout: CarConfig[]): CarState[] => {
  return carLayout.map((car) => {
    let initialPos = { x: 0, z: -12, y: 0.1 };
    let initialRot = 0;

    if (car.path === 'horizontal') {
      initialPos = { x: -18, z: -12, y: 0.1 };
      initialRot = Math.PI / 2;
    } else if (car.path === 'vertical') {
      initialPos = { x: 0, z: -26, y: 0.1 };
      initialRot = 0;
    }

    return {
      x: initialPos.x,
      z: initialPos.z,
      y: initialPos.y,
      rotation: initialRot,
      speed: car.speed,
      path: car.path,
    };
  });
};

export const updateCarPosition = (carState: CarState): void => {
  const speed = carState.speed;

  // Define routes for each car path
  if (carState.path === 'horizontal') {
    // East-west movement on main road
    carState.x += speed;
    if (carState.x > 20) carState.x = -20;
  } else if (carState.path === 'vertical') {
    // North-south movement on main road
    carState.z += speed;
    if (carState.z > 4) carState.z = -28;
  }
};
