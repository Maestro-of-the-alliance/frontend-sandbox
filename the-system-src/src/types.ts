export interface EncyclopediaEntry {
  slug: string;
  title: string;
  summary: string;
  content: string;
  coordinates: string;
  dateDiscovered: string;
  classification: string;
  status: string;
}

export interface PlanetaryDimension {
  id: string;
  name: string;
  dimension: string;
  tagline: string;
  description: string;
  color: string;
  secondaryColor: string;
  radius: number;
  realRadius: number;
  orbitDistance: number;
  orbitPeriod: number;
  realOrbitDistance: number;
  entries: EncyclopediaEntry[];
  visualFeatures: {
    hasRings?: boolean;
    ringColor?: string;
    ringRadiusInner?: number;
    ringRadiusOuter?: number;
    cloudsSpeed?: number;
    spotColor?: string;
    stripeColors?: string[];
  };
}

export interface SimulationConfig {
  speedFactor: number;
  showOrbits: boolean;
  showLabels: boolean;
  isPaused: boolean;
  camLock: boolean;
}
