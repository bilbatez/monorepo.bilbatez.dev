import type { Graph } from './types';

export type GraphCommand =
  | { type: 'visit_node'; nodeId: string; description: string }
  | { type: 'visit_edge'; from: string; to: string; description: string }
  | {
      type: 'update_distance';
      nodeId: string;
      distance: number;
      description: string;
    }
  | { type: 'mark_path'; nodes: string[]; description: string }
  | { type: 'mark_mst_edge'; from: string; to: string; description: string }
  | { type: 'finalize_node'; nodeId: string; description: string }
  | { type: 'set_result'; result: string[]; description: string };

export type GraphState = {
  graph: Graph;
  visited: string[]; // visited node IDs
  visitedEdges: [string, string][]; // [from, to] pairs
  current: string | null; // current node
  distances: Record<string, number>; // for Dijkstra/Bellman-Ford
  path: string[]; // highlighted path
  mstEdges: [string, string][]; // MST edges
  finalized: string[]; // finalized/done nodes
  result: string[]; // topological order or other ordered result
  description: string;
};

export function makeGraphState(graph: Graph): GraphState {
  const distances: Record<string, number> = {};
  graph.nodes.forEach((n) => {
    distances[n.id] = Infinity;
  });
  return {
    graph,
    visited: [],
    visitedEdges: [],
    current: null,
    distances,
    path: [],
    mstEdges: [],
    finalized: [],
    result: [],
    description: 'Ready',
  };
}

export function graphReducer(state: GraphState, cmd: GraphCommand): GraphState {
  switch (cmd.type) {
    case 'visit_node':
      return {
        ...state,
        visited: [...new Set([...state.visited, cmd.nodeId])],
        current: cmd.nodeId,
        description: cmd.description,
      };
    case 'visit_edge':
      return {
        ...state,
        visitedEdges: [...state.visitedEdges, [cmd.from, cmd.to]],
        description: cmd.description,
      };
    case 'update_distance': {
      const distances = { ...state.distances, [cmd.nodeId]: cmd.distance };
      return { ...state, distances, description: cmd.description };
    }
    case 'mark_path':
      return { ...state, path: cmd.nodes, description: cmd.description };
    case 'mark_mst_edge':
      return {
        ...state,
        mstEdges: [...state.mstEdges, [cmd.from, cmd.to]],
        description: cmd.description,
      };
    case 'finalize_node':
      return {
        ...state,
        finalized: [...state.finalized, cmd.nodeId],
        description: cmd.description,
      };
    case 'set_result':
      return { ...state, result: cmd.result, description: cmd.description };
  }
}
