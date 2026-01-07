
export type GeometryType = 'box' | 'cylinder' | 'sphere' | 'torus' | 'pipe' | 'lattice' | 'stadium';

export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  geometryType: GeometryType;
  wireframe: boolean;
  scale: [number, number, number];
  materialDetail: string;
  description: string;
  roughness: number;
  metalness: number;
  emissiveIntensity: number;
  seatingCapacity?: number;
  viewingAngle?: number;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface ThemeResponse {
  theme: ThemeConfig;
  sources: GroundingSource[];
}
