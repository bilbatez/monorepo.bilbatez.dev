import { registerAlgorithm } from '../registry';
import type { GraphCommand, GraphState } from './commands';
import { makeGraphState, graphReducer } from './commands';
import type { Graph } from './types';

const graph: Graph = {
  nodes: [
    { id: 's', label: 'S', x: 80, y: 200 },
    { id: 'a', label: 'A', x: 220, y: 80 },
    { id: 'b', label: 'B', x: 220, y: 320 },
    { id: 'c', label: 'C', x: 380, y: 80 },
    { id: 'd', label: 'D', x: 380, y: 320 },
    { id: 'g', label: 'G', x: 520, y: 200 },
  ],
  edges: [
    { from: 's', to: 'a', weight: 3 },
    { from: 's', to: 'b', weight: 4 },
    { from: 'a', to: 'c', weight: 3 },
    { from: 'b', to: 'd', weight: 3 },
    { from: 'c', to: 'g', weight: 2 },
    { from: 'd', to: 'g', weight: 4 },
    { from: 'a', to: 'b', weight: 2 },
  ],
  directed: false,
  weighted: true,
};

export function aStarCommands(state: GraphState): GraphCommand[] {
  const cmds: GraphCommand[] = [];
  const { graph: g } = state;

  if (g.nodes.length === 0) return cmds;

  const sourceId = g.nodes[0].id;
  const targetId = g.nodes[g.nodes.length - 1].id;

  // Build node position map for heuristic
  const pos: Record<string, { x: number; y: number }> = {};
  for (const node of g.nodes) {
    pos[node.id] = { x: node.x, y: node.y };
  }

  function heuristic(nodeId: string): number {
    const a = pos[nodeId];
    const b = pos[targetId];
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
  }

  // Build adjacency list (undirected)
  const adj: Record<string, { to: string; weight: number }[]> = {};
  for (const node of g.nodes) adj[node.id] = [];
  for (const edge of g.edges) {
    adj[edge.from].push({ to: edge.to, weight: edge.weight ?? 1 });
    if (!g.directed) {
      adj[edge.to].push({ to: edge.from, weight: edge.weight ?? 1 });
    }
  }

  const gScore: Record<string, number> = {};
  const fScore: Record<string, number> = {};
  const prev: Record<string, string | null> = {};

  for (const node of g.nodes) {
    gScore[node.id] = Infinity;
    fScore[node.id] = Infinity;
    prev[node.id] = null;
  }

  gScore[sourceId] = 0;
  fScore[sourceId] = heuristic(sourceId);

  cmds.push({
    type: 'update_distance',
    nodeId: sourceId,
    distance: 0,
    description: `Initialize: g[${sourceId}]=0, f[${sourceId}]=${fScore[sourceId].toFixed(1)}`,
  });

  const openSet = new Set<string>([sourceId]);
  const closedSet = new Set<string>();

  while (openSet.size > 0) {
    // Find node in openSet with lowest fScore
    let current: string | null = null;
    let minF = Infinity;
    for (const nodeId of openSet) {
      if (fScore[nodeId] < minF) {
        minF = fScore[nodeId];
        current = nodeId;
      }
    }

    if (!current) break;

    if (current === targetId) {
      cmds.push({
        type: 'visit_node',
        nodeId: current,
        description: `Reached target ${current}! g=${gScore[current].toFixed(1)}`,
      });
      break;
    }

    openSet.delete(current);
    closedSet.add(current);

    cmds.push({
      type: 'visit_node',
      nodeId: current,
      description: `Process ${current}: g=${gScore[current].toFixed(1)}, f=${fScore[current].toFixed(1)}`,
    });
    cmds.push({
      type: 'finalize_node',
      nodeId: current,
      description: `Close ${current}`,
    });

    for (const { to: neighbor, weight } of adj[current] ?? []) {
      if (closedSet.has(neighbor)) continue;

      cmds.push({
        type: 'visit_edge',
        from: current,
        to: neighbor,
        description: `Explore edge ${current} → ${neighbor} (weight=${weight})`,
      });

      const tentativeG = gScore[current] + weight;

      if (tentativeG < gScore[neighbor]) {
        prev[neighbor] = current;
        gScore[neighbor] = tentativeG;
        fScore[neighbor] = tentativeG + heuristic(neighbor);

        cmds.push({
          type: 'update_distance',
          nodeId: neighbor,
          distance: tentativeG,
          description: `Update ${neighbor}: g=${tentativeG.toFixed(1)}, h=${heuristic(neighbor).toFixed(1)}, f=${fScore[neighbor].toFixed(1)}`,
        });

        openSet.add(neighbor);
      }
    }
  }

  // Reconstruct path
  const path: string[] = [];
  let cur: string | null = targetId;
  while (cur !== null) {
    path.unshift(cur);
    cur = prev[cur];
  }

  if (path[0] === sourceId) {
    cmds.push({
      type: 'mark_path',
      nodes: path,
      description: `Path: ${path.join(' → ')} (cost=${gScore[targetId].toFixed(1)})`,
    });
  }

  return cmds;
}

registerAlgorithm({
  name: 'A* Search',
  slug: 'a-star',
  category: 'graph',
  description:
    'A heuristic-guided pathfinding algorithm that finds the shortest path from source to target. Uses f(n) = g(n) + h(n) where g is the actual cost and h is a Euclidean distance heuristic.',
  bestCase: 'O(b^d)',
  averageCase: 'O(b^d)',
  worstCase: 'O(b^d)',
  spaceComplexity: 'O(b^d)',
  pseudocode: `openSet = {start}
g[start] = 0; f[start] = h(start)
while openSet not empty:
  current = node in openSet with lowest f
  if current == goal: reconstruct path
  move current to closedSet
  for each neighbor of current:
    if neighbor in closedSet: skip
    tentative_g = g[current] + cost(current, neighbor)
    if tentative_g < g[neighbor]:
      prev[neighbor] = current
      g[neighbor] = tentative_g
      f[neighbor] = g[neighbor] + h(neighbor)
      add neighbor to openSet`,
  visualizerType: 'graph',
  defaultInput: makeGraphState(graph),
  run: aStarCommands,
  reduce: graphReducer,
});
