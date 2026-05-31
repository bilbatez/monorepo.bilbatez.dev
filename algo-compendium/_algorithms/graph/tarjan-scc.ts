import { registerAlgorithm } from '../registry';
import type { GraphCommand, GraphState } from './commands';
import { makeGraphState, graphReducer } from './commands';
import type { Graph } from './types';

const graph: Graph = {
  nodes: [
    { id: 'a', label: 'A', x: 100, y: 200 },
    { id: 'b', label: 'B', x: 250, y: 80 },
    { id: 'c', label: 'C', x: 400, y: 200 },
    { id: 'd', label: 'D', x: 250, y: 320 },
    { id: 'e', label: 'E', x: 550, y: 200 },
  ],
  edges: [
    { from: 'a', to: 'b' },
    { from: 'b', to: 'c' },
    { from: 'c', to: 'a' },
    { from: 'b', to: 'd' },
    { from: 'd', to: 'e' },
    { from: 'e', to: 'd' },
  ],
  directed: true,
  weighted: false,
};

export function tarjanSccCommands(state: GraphState): GraphCommand[] {
  const cmds: GraphCommand[] = [];
  const { graph: g } = state;

  const index: Record<string, number> = {};
  const lowlink: Record<string, number> = {};
  const onStack: Record<string, boolean> = {};
  const stack: string[] = [];
  const sccs: string[][] = [];
  let counter = 0;

  // Build adjacency list
  const adj: Record<string, string[]> = {};
  for (const node of g.nodes) adj[node.id] = [];
  for (const edge of g.edges) {
    adj[edge.from] = adj[edge.from] ?? [];
    adj[edge.from].push(edge.to);
  }

  function strongconnect(v: string): void {
    index[v] = counter;
    lowlink[v] = counter;
    counter++;
    stack.push(v);
    onStack[v] = true;

    cmds.push({
      type: 'visit_node',
      nodeId: v,
      description: `Visit ${v}: index=${index[v]}, lowlink=${lowlink[v]}`,
    });

    for (const w of adj[v] ?? []) {
      cmds.push({
        type: 'visit_edge',
        from: v,
        to: w,
        description: `Explore edge ${v} → ${w}`,
      });

      if (index[w] === undefined) {
        // w not yet visited
        strongconnect(w);
        lowlink[v] = Math.min(lowlink[v], lowlink[w]);
        cmds.push({
          type: 'update_distance',
          nodeId: v,
          distance: lowlink[v],
          description: `Update lowlink[${v}] = min(${lowlink[v]}, lowlink[${w}]=${lowlink[w]}) = ${lowlink[v]}`,
        });
      } else if (onStack[w]) {
        lowlink[v] = Math.min(lowlink[v], index[w]);
        cmds.push({
          type: 'update_distance',
          nodeId: v,
          distance: lowlink[v],
          description: `${w} on stack: update lowlink[${v}] = ${lowlink[v]}`,
        });
      }
    }

    // If v is a root node, pop the stack and generate an SCC
    if (lowlink[v] === index[v]) {
      const scc: string[] = [];
      let w: string;
      do {
        w = stack.pop()!;
        onStack[w] = false;
        scc.push(w);
        cmds.push({
          type: 'finalize_node',
          nodeId: w,
          description: `Pop ${w} from stack (SCC component)`,
        });
      } while (w !== v);
      sccs.push(scc);
    }
  }

  for (const node of g.nodes) {
    if (index[node.id] === undefined) {
      strongconnect(node.id);
    }
  }

  const sccStrings = sccs.map((scc) => `SCC: ${scc.sort().join(',')}`);
  cmds.push({
    type: 'set_result',
    result: sccStrings,
    description: `Found ${sccs.length} strongly connected components`,
  });

  return cmds;
}

registerAlgorithm({
  name: "Tarjan's SCC",
  slug: 'tarjan-scc',
  category: 'graph',
  description:
    'Finds all Strongly Connected Components (SCCs) in a directed graph using a single DFS pass. Maintains a stack and uses discovery index and low-link values to identify component roots.',
  bestCase: 'O(V+E)',
  averageCase: 'O(V+E)',
  worstCase: 'O(V+E)',
  spaceComplexity: 'O(V)',
  pseudocode: `function strongconnect(v):
  index[v] = lowlink[v] = counter++
  push v onto stack; onStack[v] = true
  for each edge (v, w):
    if w not visited:
      strongconnect(w)
      lowlink[v] = min(lowlink[v], lowlink[w])
    else if w on stack:
      lowlink[v] = min(lowlink[v], index[w])
  if lowlink[v] == index[v]:  // v is root of SCC
    pop stack until v, emit SCC`,
  visualizerType: 'graph',
  defaultInput: makeGraphState(graph),
  run: tarjanSccCommands,
  reduce: graphReducer,
});
