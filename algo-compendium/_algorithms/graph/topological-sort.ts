import { registerAlgorithm } from '../registry';
import type { GraphCommand, GraphState } from './commands';
import { makeGraphState, graphReducer } from './commands';
import { DIRECTED_DAG } from './types';

export function topologicalSortCommands(state: GraphState): GraphCommand[] {
  const cmds: GraphCommand[] = [];
  const { graph } = state;

  if (graph.nodes.length === 0) return cmds;

  const visited = new Set<string>();
  const stack: string[] = [];

  // Build adjacency list
  const adj: Record<string, string[]> = {};
  for (const node of graph.nodes) adj[node.id] = [];
  for (const edge of graph.edges) {
    adj[edge.from].push(edge.to);
  }

  function dfs(nodeId: string) {
    visited.add(nodeId);
    cmds.push({
      type: 'visit_node',
      nodeId,
      description: `DFS: Visit node ${nodeId}`,
    });

    for (const neighbor of adj[nodeId] ?? []) {
      if (!visited.has(neighbor)) {
        dfs(neighbor);
      }
    }

    stack.push(nodeId);
    cmds.push({
      type: 'finalize_node',
      nodeId,
      description: `Finalize node ${nodeId} (push to stack)`,
    });
  }

  for (const node of graph.nodes) {
    if (!visited.has(node.id)) {
      dfs(node.id);
    }
  }

  const result = [...stack].reverse();

  cmds.push({
    type: 'set_result',
    result,
    description: `Topological order: ${result.join(' → ')}`,
  });

  return cmds;
}

registerAlgorithm({
  name: 'Topological Sort',
  slug: 'topological-sort',
  category: 'graph',
  description:
    'Orders vertices in a Directed Acyclic Graph (DAG) such that for every directed edge u → v, u appears before v. Uses DFS with a post-order stack.',
  bestCase: 'O(V+E)',
  averageCase: 'O(V+E)',
  worstCase: 'O(V+E)',
  spaceComplexity: 'O(V)',
  pseudocode: `TopologicalSort(graph):
  visited = {}
  stack = []
  function dfs(node):
    visited.add(node)
    for each neighbor of node:
      if neighbor not visited:
        dfs(neighbor)
    stack.push(node)
  for each node in graph:
    if node not visited:
      dfs(node)
  return reverse(stack)`,
  visualizerType: 'graph',
  defaultInput: makeGraphState(DIRECTED_DAG),
  run: topologicalSortCommands,
  reduce: graphReducer,
});
