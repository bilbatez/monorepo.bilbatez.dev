import { registerAlgorithm } from '../registry';
import type { GraphCommand, GraphState } from './commands';
import { makeGraphState, graphReducer } from './commands';
import { DIRECTED_WEIGHTED } from './types';

export function dijkstraCommands(state: GraphState): GraphCommand[] {
  const cmds: GraphCommand[] = [];
  const { graph } = state;

  if (graph.nodes.length === 0) return cmds;

  const sourceId = graph.nodes[0].id;

  // Initialize distances
  const dist: Record<string, number> = {};
  const prev: Record<string, string | null> = {};
  for (const node of graph.nodes) {
    dist[node.id] = Infinity;
    prev[node.id] = null;
  }
  dist[sourceId] = 0;

  cmds.push({
    type: 'update_distance',
    nodeId: sourceId,
    distance: 0,
    description: `Initialize: dist[${sourceId}] = 0, all others = ∞`,
  });

  const unvisited = new Set<string>(graph.nodes.map((n) => n.id));

  while (unvisited.size > 0) {
    // Pick node with minimum distance
    let u: string | null = null;
    let minDist = Infinity;
    for (const nodeId of unvisited) {
      if (dist[nodeId] < minDist) {
        minDist = dist[nodeId];
        u = nodeId;
      }
    }

    if (u === null || dist[u] === Infinity) break;

    unvisited.delete(u);

    cmds.push({
      type: 'visit_node',
      nodeId: u,
      description: `Process node ${u} (dist=${dist[u]})`,
    });

    // Relax edges
    const edges = graph.edges.filter((e) => e.from === u);
    for (const edge of edges) {
      const v = edge.to;
      const w = edge.weight ?? 1;
      const newDist = dist[u] + w;

      cmds.push({
        type: 'visit_edge',
        from: u,
        to: v,
        description: `Relax edge ${u} → ${v} (weight=${w})`,
      });

      if (newDist < dist[v]) {
        dist[v] = newDist;
        prev[v] = u;
        cmds.push({
          type: 'update_distance',
          nodeId: v,
          distance: newDist,
          description: `Update dist[${v}] = ${newDist}`,
        });
      }
    }

    cmds.push({
      type: 'finalize_node',
      nodeId: u,
      description: `Finalize node ${u} (shortest dist=${dist[u]})`,
    });
  }

  // Reconstruct path from source to last node
  const lastNode = graph.nodes[graph.nodes.length - 1].id;
  const path: string[] = [];
  let cur: string | null = lastNode;
  while (cur !== null) {
    path.unshift(cur);
    cur = prev[cur];
  }
  if (path[0] === sourceId) {
    cmds.push({
      type: 'mark_path',
      nodes: path,
      description: `Shortest path: ${path.join(' → ')} (dist=${dist[lastNode]})`,
    });
  }

  return cmds;
}

registerAlgorithm({
  name: "Dijkstra's Algorithm",
  slug: 'dijkstra',
  category: 'graph',
  description:
    'Finds the shortest path from a source node to all other nodes in a weighted graph with non-negative edge weights. Uses a greedy approach with a priority queue.',
  bestCase: 'O(1)',
  averageCase: 'O((V+E) log V)',
  worstCase: 'O(V²)',
  spaceComplexity: 'O(V)',
  pseudocode: `Dijkstra(graph, source):
  dist[source] = 0, dist[v] = ∞ for all others
  unvisited = all nodes
  while unvisited not empty:
    u = node in unvisited with min dist
    remove u from unvisited
    for each neighbor v of u:
      alt = dist[u] + weight(u,v)
      if alt < dist[v]:
        dist[v] = alt`,
  visualizerType: 'graph',
  defaultInput: makeGraphState(DIRECTED_WEIGHTED),
  run: dijkstraCommands,
  reduce: graphReducer,
});
