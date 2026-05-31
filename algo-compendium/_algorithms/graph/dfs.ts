import { registerAlgorithm } from '../registry';
import type { GraphCommand, GraphState } from './commands';
import { makeGraphState, graphReducer } from './commands';
import { UNDIRECTED_UNWEIGHTED } from './types';

export function dfsCommands(state: GraphState): GraphCommand[] {
  const cmds: GraphCommand[] = [];
  const { graph } = state;

  if (graph.nodes.length === 0) return cmds;

  const startId = graph.nodes[0].id;
  const visited = new Set<string>();

  // Build adjacency list
  const adj: Record<string, string[]> = {};
  for (const node of graph.nodes) adj[node.id] = [];
  for (const edge of graph.edges) {
    adj[edge.from].push(edge.to);
    if (!graph.directed) adj[edge.to].push(edge.from);
  }

  function dfs(nodeId: string) {
    visited.add(nodeId);
    cmds.push({
      type: 'visit_node',
      nodeId,
      description: `DFS: Visit node ${nodeId}`,
    });

    const neighbors = adj[nodeId] ?? [];
    for (const neighbor of neighbors) {
      cmds.push({
        type: 'visit_edge',
        from: nodeId,
        to: neighbor,
        description: `Explore edge ${nodeId} → ${neighbor}`,
      });

      if (!visited.has(neighbor)) {
        dfs(neighbor);
      }
    }
  }

  dfs(startId);

  return cmds;
}

registerAlgorithm({
  name: 'Depth-First Search',
  slug: 'dfs',
  category: 'graph',
  description:
    'Explores as far as possible along each branch before backtracking. Useful for topological sorting, cycle detection, and finding connected components.',
  bestCase: 'O(V+E)',
  averageCase: 'O(V+E)',
  worstCase: 'O(V+E)',
  spaceComplexity: 'O(V)',
  pseudocode: `DFS(graph, start):
  visited = {}
  function explore(node):
    visited.add(node)
    for each neighbor of node:
      if neighbor not in visited:
        explore(neighbor)
  explore(start)`,
  visualizerType: 'graph',
  defaultInput: makeGraphState(UNDIRECTED_UNWEIGHTED),
  run: dfsCommands,
  reduce: graphReducer,
});
