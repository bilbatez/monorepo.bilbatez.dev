import { registerAlgorithm } from '../registry';
import type { GraphCommand, GraphState } from './commands';
import { makeGraphState, graphReducer } from './commands';
import { UNDIRECTED_UNWEIGHTED } from './types';

// Union-Find data structure
class UnionFind {
  private parent: Record<string, string> = {};
  private rank: Record<string, number> = {};

  constructor(nodes: string[]) {
    for (const n of nodes) {
      this.parent[n] = n;
      this.rank[n] = 0;
    }
  }

  find(x: string): string {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }

  union(x: string, y: string): boolean {
    const rx = this.find(x);
    const ry = this.find(y);
    if (rx === ry) return false;
    if (this.rank[rx] < this.rank[ry]) {
      this.parent[rx] = ry;
    } else if (this.rank[rx] > this.rank[ry]) {
      this.parent[ry] = rx;
    } else {
      this.parent[ry] = rx;
      this.rank[rx]++;
    }
    return true;
  }
}

export function kruskalCommands(state: GraphState): GraphCommand[] {
  const cmds: GraphCommand[] = [];
  const { graph } = state;

  if (graph.nodes.length === 0) return cmds;

  const nodeIds = graph.nodes.map((n) => n.id);
  const uf = new UnionFind(nodeIds);

  // Sort edges by weight
  const sortedEdges = [...graph.edges].sort(
    (a, b) => (a.weight ?? 1) - (b.weight ?? 1)
  );

  cmds.push({
    type: 'visit_node',
    nodeId: nodeIds[0],
    description: 'Kruskal: Sort edges by weight, initialize union-find',
  });

  for (const edge of sortedEdges) {
    cmds.push({
      type: 'visit_edge',
      from: edge.from,
      to: edge.to,
      description: `Consider edge ${edge.from}-${edge.to} (weight=${edge.weight ?? 1})`,
    });

    if (uf.union(edge.from, edge.to)) {
      cmds.push({
        type: 'mark_mst_edge',
        from: edge.from,
        to: edge.to,
        description: `Add edge ${edge.from}-${edge.to} to MST`,
      });
    } else {
      cmds.push({
        type: 'visit_node',
        nodeId: edge.from,
        description: `Skip edge ${edge.from}-${edge.to} (would create cycle)`,
      });
    }
  }

  return cmds;
}

registerAlgorithm({
  name: "Kruskal's Algorithm",
  slug: 'kruskal',
  category: 'graph',
  description:
    'Builds a Minimum Spanning Tree by sorting all edges and greedily adding the smallest edge that does not create a cycle, using Union-Find for cycle detection.',
  bestCase: 'O(E log E)',
  averageCase: 'O(E log E)',
  worstCase: 'O(E log E)',
  spaceComplexity: 'O(V)',
  pseudocode: `Kruskal(graph):
  sort edges by weight
  uf = UnionFind(all nodes)
  mst = []
  for each edge (u, v, w) in sorted order:
    if find(u) != find(v):
      union(u, v)
      mst.add(edge)
  return mst`,
  visualizerType: 'graph',
  defaultInput: makeGraphState(UNDIRECTED_UNWEIGHTED),
  run: kruskalCommands,
  reduce: graphReducer,
});
