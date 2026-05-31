import { registerAlgorithm } from '../registry';
import type { GraphCommand, GraphState } from './commands';
import { makeGraphState, graphReducer } from './commands';
import { UNDIRECTED_UNWEIGHTED } from './types';

export function primCommands(state: GraphState): GraphCommand[] {
  const cmds: GraphCommand[] = [];
  const { graph } = state;

  if (graph.nodes.length === 0) return cmds;

  const startId = graph.nodes[0].id;
  const inMST = new Set<string>();

  // Build adjacency list with weights
  const adj: Record<string, { to: string; weight: number }[]> = {};
  for (const node of graph.nodes) adj[node.id] = [];
  for (const edge of graph.edges) {
    adj[edge.from].push({ to: edge.to, weight: edge.weight ?? 1 });
    if (!graph.directed) {
      adj[edge.to].push({ to: edge.from, weight: edge.weight ?? 1 });
    }
  }

  inMST.add(startId);
  cmds.push({
    type: 'visit_node',
    nodeId: startId,
    description: `Prim: Start at node ${startId}`,
  });

  while (inMST.size < graph.nodes.length) {
    let bestFrom = '';
    let bestTo = '';
    let bestWeight = Infinity;

    // Find minimum-weight edge crossing the MST frontier
    for (const nodeId of inMST) {
      for (const { to, weight } of adj[nodeId]) {
        if (!inMST.has(to) && weight < bestWeight) {
          bestWeight = weight;
          bestFrom = nodeId;
          bestTo = to;
        }
      }
    }

    if (!bestTo) break; // Disconnected graph

    inMST.add(bestTo);

    cmds.push({
      type: 'visit_node',
      nodeId: bestTo,
      description: `Visit node ${bestTo} via edge ${bestFrom}-${bestTo} (weight=${bestWeight})`,
    });

    cmds.push({
      type: 'mark_mst_edge',
      from: bestFrom,
      to: bestTo,
      description: `Add edge ${bestFrom}-${bestTo} to MST (weight=${bestWeight})`,
    });
  }

  return cmds;
}

registerAlgorithm({
  name: "Prim's Algorithm",
  slug: 'prim',
  category: 'graph',
  description:
    'Builds a Minimum Spanning Tree by starting from one node and greedily growing the MST one edge at a time, always picking the minimum-weight edge that connects a new vertex.',
  bestCase: 'O(E log V)',
  averageCase: 'O(E log V)',
  worstCase: 'O(E log V)',
  spaceComplexity: 'O(V)',
  pseudocode: `Prim(graph, start):
  inMST = {start}
  while inMST.size < V:
    find min-weight edge (u, v) where u in MST, v not in MST
    add v to MST
    add edge (u, v) to result`,
  visualizerType: 'graph',
  defaultInput: makeGraphState(UNDIRECTED_UNWEIGHTED),
  run: primCommands,
  reduce: graphReducer,
});
