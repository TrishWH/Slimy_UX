export interface Node {
  id: string;
  label: string;
  x?: number;
  y?: number;
}

export interface Edge {
  source: string;
  target: string;
  pheromoneStrength: number;
  label?: string;
}

export interface GraphData {
  nodes: Node[];
  edges: Edge[];
}

export interface AntAgent {
  id: string;
  currentNode: string;
  path: string[];
  speed: number;
}

export interface PheromoneUpdate {
  edgeId: string;
  delta: number;
  evaporationRate: number;
}

// Constants for ACO algorithm
export const ACO_CONSTANTS = {
  EVAPORATION_RATE: 0.1,
  PHEROMONE_DEPOSIT: 0.5,
  MIN_PHEROMONE: 0.1,
  MAX_PHEROMONE: 1.0,
  ANT_SPEED: 2,
  NUM_ANTS: 5
} as const; 