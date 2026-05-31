import { registerAlgorithm } from '../registry';
import type { GraphCommand, GraphState } from './commands';
import { makeGraphState, graphReducer } from './commands';
import { DIRECTED_WEIGHTED } from './types';

export function floydWarshallCommands(state: GraphState): GraphCommand[] {
  const cmds: GraphCommand[] = [];
  const { graph } = state;

  if (graph.nodes.length === 0) return cmds;

  const nodeIds = graph.nodes.map((n) => n.id);
  const n = nodeIds.length;
  const idx = (id: string) => nodeIds.indexOf(id);

  // Initialize distance matrix
  const dist: number[][] = Array.from({ length: n }, () =>
    Array(n).fill(Infinity)
  );
  for (let i = 0; i < n; i++) dist[i][i] = 0;
  for (const edge of graph.edges) {
    const u = idx(edge.from);
    const v = idx(edge.to);
    const w = edge.weight ?? 1;
    dist[u][v] = Math.min(dist[u][v], w);
  }

  cmds.push({
    type: 'visit_node',
    nodeId: nodeIds[0],
    description: 'Floyd-Warshall: Initialize distance matrix',
  });

  // Floyd-Warshall: try each intermediate node k
  for (let k = 0; k < n; k++) {
    const kId = nodeIds[k];
    cmds.push({
      type: 'visit_node',
      nodeId: kId,
      description: `Try intermediate node ${kId}`,
    });

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (dist[i][k] !== Infinity && dist[k][j] !== Infinity) {
          const newDist = dist[i][k] + dist[k][j];
          if (newDist < dist[i][j]) {
            dist[i][j] = newDist;
            cmds.push({
              type: 'update_distance',
              nodeId: nodeIds[j],
              distance: newDist,
              description: `Update dist[${nodeIds[i]}][${nodeIds[j]}] = ${newDist} via ${kId}`,
            });
          }
        }
      }
    }
  }

  // Finalize all nodes
  for (let i = 0; i < n; i++) {
    cmds.push({
      type: 'finalize_node',
      nodeId: nodeIds[i],
      description: `Node ${nodeIds[i]}: shortest distances computed`,
    });
  }

  return cmds;
}

registerAlgorithm({
  name: 'Floyd-Warshall',
  slug: 'floyd-warshall',
  category: 'graph',
  description:
    'Computes shortest paths between all pairs of vertices. Works with negative edge weights (but not negative cycles). Time complexity O(V³).',
  bestCase: 'O(V³)',
  averageCase: 'O(V³)',
  worstCase: 'O(V³)',
  spaceComplexity: 'O(V²)',
  pseudocode: `FloydWarshall(graph):
  dist[i][j] = weight(i,j) if edge exists, else ∞
  dist[i][i] = 0 for all i
  for k from 0 to V-1:
    for i from 0 to V-1:
      for j from 0 to V-1:
        if dist[i][k] + dist[k][j] < dist[i][j]:
          dist[i][j] = dist[i][k] + dist[k][j]`,
  visualizerType: 'graph',
  defaultInput: makeGraphState(DIRECTED_WEIGHTED),
  run: floydWarshallCommands,
  reduce: graphReducer,
});
