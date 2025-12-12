// Building layout configuration for the city
export interface BuildingConfig {
  x: number;
  z: number;
  rotation: number;
  model: string;
}

export const getBuildingLayout = (): BuildingConfig[] => [
  // MAIN HORIZONTAL STREET (z = -12) NORTH SIDE BUILDINGS
  // Buildings directly above the main road, spaced 2 units apart
  { x: -18, z: -14.5, rotation: 0, model: 'building-a.glb' },
  { x: -16, z: -14.5, rotation: 0, model: 'building-b.glb' },
  { x: -14, z: -14.5, rotation: 0, model: 'building-c.glb' },
  { x: -12, z: -14.5, rotation: 0, model: 'building-d.glb' },
  { x: -10, z: -14.5, rotation: 0, model: 'building-e.glb' },
  { x: -8, z: -14.5, rotation: 0, model: 'building-f.glb' },
  { x: -6, z: -14.5, rotation: 0, model: 'building-g.glb' },
  { x: -4, z: -14.5, rotation: 0, model: 'building-h.glb' },
  { x: -2, z: -14.5, rotation: 0, model: 'building-i.glb' },
  { x: 2, z: -14.5, rotation: 0, model: 'building-j.glb' },
  { x: 4, z: -14.5, rotation: 0, model: 'building-k.glb' },
  { x: 6, z: -14.5, rotation: 0, model: 'building-l.glb' },
  { x: 8, z: -14.5, rotation: 0, model: 'building-m.glb' },
  { x: 10, z: -14.5, rotation: 0, model: 'building-n.glb' },
  { x: 12, z: -14.5, rotation: 0, model: 'building-o.glb' },
  { x: 14, z: -14.5, rotation: 0, model: 'building-p.glb' },
  { x: 16, z: -14.5, rotation: 0, model: 'building-a.glb' },
  { x: 18, z: -14.5, rotation: 0, model: 'building-b.glb' },

  // MAIN HORIZONTAL STREET (z = -12) SOUTH SIDE BUILDINGS
  // Buildings directly below the main road
  { x: -18, z: -9.5, rotation: 0, model: 'building-c.glb' },
  { x: -16, z: -9.5, rotation: 0, model: 'building-d.glb' },
  { x: -14, z: -9.5, rotation: 0, model: 'building-e.glb' },
  { x: -12, z: -9.5, rotation: 0, model: 'building-f.glb' },
  { x: -10, z: -9.5, rotation: 0, model: 'building-g.glb' },
  { x: -8, z: -9.5, rotation: 0, model: 'building-h.glb' },
  { x: -6, z: -9.5, rotation: 0, model: 'building-i.glb' },
  { x: -4, z: -9.5, rotation: 0, model: 'building-j.glb' },
  { x: -2, z: -9.5, rotation: 0, model: 'building-k.glb' },
  { x: 2, z: -9.5, rotation: 0, model: 'building-l.glb' },
  { x: 4, z: -9.5, rotation: 0, model: 'building-m.glb' },
  { x: 6, z: -9.5, rotation: 0, model: 'building-n.glb' },
  { x: 8, z: -9.5, rotation: 0, model: 'building-o.glb' },
  { x: 10, z: -9.5, rotation: 0, model: 'building-p.glb' },
  { x: 12, z: -9.5, rotation: 0, model: 'building-a.glb' },
  { x: 14, z: -9.5, rotation: 0, model: 'building-b.glb' },
  { x: 16, z: -9.5, rotation: 0, model: 'building-c.glb' },
  { x: 18, z: -9.5, rotation: 0, model: 'building-d.glb' },

  // VERTICAL STREET (x = 0) WEST SIDE BUILDINGS
  // Buildings directly left of the vertical road
  { x: -2.5, z: -18, rotation: Math.PI / 2, model: 'building-e.glb' },
  { x: -2.5, z: -16, rotation: Math.PI / 2, model: 'building-f.glb' },
  { x: -2.5, z: -14, rotation: Math.PI / 2, model: 'building-g.glb' },
  { x: -2.5, z: -10, rotation: Math.PI / 2, model: 'building-h.glb' },
  { x: -2.5, z: -8, rotation: Math.PI / 2, model: 'building-i.glb' },
  { x: -2.5, z: -6, rotation: Math.PI / 2, model: 'building-j.glb' },
  { x: -2.5, z: -4, rotation: Math.PI / 2, model: 'building-k.glb' },
  { x: -2.5, z: -2, rotation: Math.PI / 2, model: 'building-l.glb' },
  { x: -2.5, z: 0, rotation: Math.PI / 2, model: 'building-m.glb' },
  { x: -2.5, z: 2, rotation: Math.PI / 2, model: 'building-n.glb' },

  // VERTICAL STREET (x = 0) EAST SIDE BUILDINGS
  // Buildings directly right of the vertical road
  { x: 2.5, z: -18, rotation: -Math.PI / 2, model: 'building-o.glb' },
  { x: 2.5, z: -16, rotation: -Math.PI / 2, model: 'building-p.glb' },
  { x: 2.5, z: -14, rotation: -Math.PI / 2, model: 'building-a.glb' },
  { x: 2.5, z: -10, rotation: -Math.PI / 2, model: 'building-b.glb' },
  { x: 2.5, z: -8, rotation: -Math.PI / 2, model: 'building-c.glb' },
  { x: 2.5, z: -6, rotation: -Math.PI / 2, model: 'building-d.glb' },
  { x: 2.5, z: -4, rotation: -Math.PI / 2, model: 'building-e.glb' },
  { x: 2.5, z: -2, rotation: -Math.PI / 2, model: 'building-f.glb' },
  { x: 2.5, z: 0, rotation: -Math.PI / 2, model: 'building-g.glb' },
  { x: 2.5, z: 2, rotation: -Math.PI / 2, model: 'building-h.glb' },

  // SECONDARY STREETS - Additional buildings between main intersections
  // North-East quadrant densification
  { x: -10, z: -17, rotation: 0, model: 'building-skyscraper-a.glb' },
  { x: -6, z: -17, rotation: 0, model: 'building-skyscraper-b.glb' },
  { x: -2, z: -17, rotation: 0, model: 'building-i.glb' },
  { x: 2, z: -17, rotation: 0, model: 'building-j.glb' },
  { x: 6, z: -17, rotation: 0, model: 'building-skyscraper-c.glb' },
  { x: 10, z: -17, rotation: 0, model: 'building-skyscraper-d.glb' },

  { x: 2, z: -7, rotation: 0, model: 'building-n.glb' },
  { x: 6, z: -7, rotation: 0, model: 'building-o.glb' },
  { x: 10, z: -7, rotation: 0, model: 'building-p.glb' },

  // Corner landmark buildings
  { x: -20, z: -12, rotation: Math.PI / 4, model: 'building-skyscraper-a.glb' },
  { x: 20, z: -12, rotation: -Math.PI / 4, model: 'building-skyscraper-b.glb' },
  { x: 0, z: -20, rotation: 0, model: 'building-skyscraper-c.glb' },
];
