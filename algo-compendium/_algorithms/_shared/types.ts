export type VisualizerType =
  | 'array' // Sorting, Searching
  | 'graph' // Graph algorithms
  | 'tree' // Tree algorithms
  | 'grid' // DP, Backtracking
  | 'string' // String Matching
  | 'math'; // Math algorithms

export type AlgorithmCategory =
  | 'sorting'
  | 'searching'
  | 'graph'
  | 'tree'
  | 'dynamic-programming'
  | 'string-matching'
  | 'backtracking'
  | 'math';

export type AlgorithmMeta<C, S> = {
  name: string;
  slug: string;
  category: AlgorithmCategory;
  description: string;
  bestCase: string;
  averageCase: string;
  worstCase: string;
  spaceComplexity: string;
  stable?: boolean;
  inPlace?: boolean;
  pseudocode: string;
  visualizerType: VisualizerType;
  legendLabels?: { pivot?: string };
  defaultInput: S;
  run: (input: S) => C[];
  reduce: (state: S, cmd: C) => S;
};

export type CategoryMeta = {
  slug: AlgorithmCategory;
  name: string;
  description: string;
  algorithmCount: number;
};
