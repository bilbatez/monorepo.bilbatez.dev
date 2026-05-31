export type GraphNode = {
  id: string;
  label: string;
  x: number; // pre-set position for visualization (0-100 range, normalized)
  y: number;
};

export type GraphEdge = {
  from: string;
  to: string;
  weight?: number;
  directed?: boolean;
};

export type Graph = {
  nodes: GraphNode[];
  edges: GraphEdge[];
  directed: boolean;
  weighted: boolean;
};

// Pre-built default graphs
export const UNDIRECTED_UNWEIGHTED: Graph = {
  directed: false,
  weighted: false,
  nodes: [
    { id: 'A', label: 'A', x: 50, y: 10 },
    { id: 'B', label: 'B', x: 20, y: 40 },
    { id: 'C', label: 'C', x: 80, y: 40 },
    { id: 'D', label: 'D', x: 10, y: 80 },
    { id: 'E', label: 'E', x: 50, y: 70 },
    { id: 'F', label: 'F', x: 90, y: 80 },
  ],
  edges: [
    { from: 'A', to: 'B' },
    { from: 'A', to: 'C' },
    { from: 'B', to: 'D' },
    { from: 'B', to: 'E' },
    { from: 'C', to: 'E' },
    { from: 'C', to: 'F' },
    { from: 'D', to: 'E' },
  ],
};

export const DIRECTED_WEIGHTED: Graph = {
  directed: true,
  weighted: true,
  nodes: [
    { id: 'A', label: 'A', x: 10, y: 50 },
    { id: 'B', label: 'B', x: 35, y: 20 },
    { id: 'C', label: 'C', x: 35, y: 80 },
    { id: 'D', label: 'D', x: 65, y: 20 },
    { id: 'E', label: 'E', x: 65, y: 80 },
    { id: 'F', label: 'F', x: 90, y: 50 },
  ],
  edges: [
    { from: 'A', to: 'B', weight: 4 },
    { from: 'A', to: 'C', weight: 2 },
    { from: 'B', to: 'D', weight: 3 },
    { from: 'B', to: 'C', weight: 1 },
    { from: 'C', to: 'E', weight: 5 },
    { from: 'D', to: 'F', weight: 2 },
    { from: 'E', to: 'D', weight: 1 },
    { from: 'E', to: 'F', weight: 3 },
  ],
};

// For DAG (topological sort)
export const DIRECTED_DAG: Graph = {
  directed: true,
  weighted: false,
  nodes: [
    { id: '5', label: '5', x: 10, y: 50 },
    { id: '4', label: '4', x: 10, y: 10 },
    { id: '2', label: '2', x: 40, y: 30 },
    { id: '0', label: '0', x: 70, y: 10 },
    { id: '1', label: '1', x: 70, y: 50 },
    { id: '3', label: '3', x: 40, y: 70 },
  ],
  edges: [
    { from: '5', to: '2' },
    { from: '5', to: '0' },
    { from: '4', to: '0' },
    { from: '4', to: '1' },
    { from: '2', to: '3' },
    { from: '3', to: '1' },
  ],
};
