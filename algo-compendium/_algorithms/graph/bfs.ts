import { registerAlgorithm } from '../registry';
import type { GraphCommand, GraphState } from './commands';
import { makeGraphState, graphReducer } from './commands';
import { UNDIRECTED_UNWEIGHTED } from './types';

export function bfsCommands(state: GraphState): GraphCommand[] {
  const cmds: GraphCommand[] = [];
  const { graph } = state;

  if (graph.nodes.length === 0) return cmds;

  const startId = graph.nodes[0].id;
  const visited = new Set<string>();
  const queue: string[] = [startId];
  visited.add(startId);

  // Build adjacency list
  const adj: Record<string, string[]> = {};
  for (const node of graph.nodes) adj[node.id] = [];
  for (const edge of graph.edges) {
    adj[edge.from].push(edge.to);
    if (!graph.directed) adj[edge.to].push(edge.from);
  }

  cmds.push({
    type: 'visit_node',
    nodeId: startId,
    description: `BFS: Start at node ${startId}`,
  });

  while (queue.length > 0) {
    const current = queue.shift()!;
    const neighbors = adj[current] ?? [];

    for (const neighbor of neighbors) {
      cmds.push({
        type: 'visit_edge',
        from: current,
        to: neighbor,
        description: `Explore edge ${current} → ${neighbor}`,
      });

      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
        cmds.push({
          type: 'visit_node',
          nodeId: neighbor,
          description: `BFS: Visit node ${neighbor} (from ${current})`,
        });
      }
    }
  }

  return cmds;
}

registerAlgorithm({
  name: 'Breadth-First Search',
  slug: 'bfs',
  category: 'graph',
  description:
    'Explores a graph level by level from the start node, visiting all neighbors before moving deeper. Finds shortest path in unweighted graphs.',
  bestCase: 'O(V+E)',
  averageCase: 'O(V+E)',
  worstCase: 'O(V+E)',
  spaceComplexity: 'O(V)',
  pseudocode: `BFS(graph, start):
  queue = [start]
  visited = {start}
  while queue not empty:
    node = queue.dequeue()
    for each neighbor of node:
      if neighbor not in visited:
        visited.add(neighbor)
        queue.enqueue(neighbor)`,
  visualizerType: 'graph',
  defaultInput: makeGraphState(UNDIRECTED_UNWEIGHTED),
  run: bfsCommands,
  reduce: graphReducer,
});
