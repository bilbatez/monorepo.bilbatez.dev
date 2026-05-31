import { registerAlgorithm } from '../registry';
import type { GraphCommand, GraphState } from './commands';
import { makeGraphState, graphReducer } from './commands';
import { DIRECTED_WEIGHTED } from './types';

export function bellmanFordCommands(state: GraphState): GraphCommand[] {
  const cmds: GraphCommand[] = [];
  const { graph } = state;

  if (graph.nodes.length === 0) return cmds;

  const sourceId = graph.nodes[0].id;
  const V = graph.nodes.length;

  // Initialize distances
  const dist: Record<string, number> = {};
  for (const node of graph.nodes) {
    dist[node.id] = Infinity;
  }
  dist[sourceId] = 0;

  cmds.push({
    type: 'update_distance',
    nodeId: sourceId,
    distance: 0,
    description: `Initialize: dist[${sourceId}] = 0, all others = ∞`,
  });

  // Relax all edges V-1 times
  for (let i = 0; i < V - 1; i++) {
    let updated = false;
    for (const edge of graph.edges) {
      const u = edge.from;
      const v = edge.to;
      const w = edge.weight ?? 1;

      if (dist[u] !== Infinity) {
        cmds.push({
          type: 'visit_edge',
          from: u,
          to: v,
          description: `Iteration ${i + 1}: Relax edge ${u} → ${v} (weight=${w})`,
        });

        if (dist[u] + w < dist[v]) {
          dist[v] = dist[u] + w;
          updated = true;
          cmds.push({
            type: 'update_distance',
            nodeId: v,
            distance: dist[v],
            description: `Update dist[${v}] = ${dist[v]}`,
          });
        }
      }
    }

    if (!updated) break; // Early exit if no updates
  }

  // Finalize all reachable nodes
  for (const node of graph.nodes) {
    if (dist[node.id] !== Infinity) {
      cmds.push({
        type: 'finalize_node',
        nodeId: node.id,
        description: `Node ${node.id}: final dist = ${dist[node.id]}`,
      });
    }
  }

  return cmds;
}

registerAlgorithm({
  name: 'Bellman-Ford',
  slug: 'bellman-ford',
  category: 'graph',
  description:
    'Finds shortest paths from a source to all vertices, handling negative edge weights. Detects negative cycles. Slower than Dijkstra but more versatile.',
  bestCase: 'O(V)',
  averageCase: 'O(VE)',
  worstCase: 'O(VE)',
  spaceComplexity: 'O(V)',
  pseudocode: `BellmanFord(graph, source):
  dist[source] = 0, dist[v] = ∞ for all others
  repeat V-1 times:
    for each edge (u, v, w):
      if dist[u] + w < dist[v]:
        dist[v] = dist[u] + w
  // Check for negative cycles:
  for each edge (u, v, w):
    if dist[u] + w < dist[v]:
      report negative cycle`,
  visualizerType: 'graph',
  defaultInput: makeGraphState(DIRECTED_WEIGHTED),
  run: bellmanFordCommands,
  reduce: graphReducer,
});
