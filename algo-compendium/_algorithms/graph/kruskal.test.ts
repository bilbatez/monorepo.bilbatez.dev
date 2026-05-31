import { describe, it, expect } from 'vitest';
import { kruskalCommands } from './kruskal';
import { makeGraphState, graphReducer } from './commands';
import type { GraphCommand, GraphState } from './commands';
import { UNDIRECTED_UNWEIGHTED } from './types';

function runGraph(commands: GraphCommand[], initial: GraphState): GraphState {
  return commands.reduce(graphReducer, initial);
}

describe('Kruskal', () => {
  it('produces MST with V-1 edges', () => {
    const initial = makeGraphState(UNDIRECTED_UNWEIGHTED);
    const cmds = kruskalCommands(initial);
    const result = runGraph(cmds, initial);
    const V = UNDIRECTED_UNWEIGHTED.nodes.length;
    expect(result.mstEdges).toHaveLength(V - 1);
  });

  it('handles empty graph', () => {
    const emptyGraph = {
      directed: false,
      weighted: false,
      nodes: [],
      edges: [],
    };
    const initial = makeGraphState(emptyGraph);
    const cmds = kruskalCommands(initial);
    expect(cmds).toHaveLength(0);
  });

  it('generates mark_mst_edge commands', () => {
    const initial = makeGraphState(UNDIRECTED_UNWEIGHTED);
    const cmds = kruskalCommands(initial);
    const mstCmds = cmds.filter((c) => c.type === 'mark_mst_edge');
    expect(mstCmds.length).toBe(UNDIRECTED_UNWEIGHTED.nodes.length - 1);
  });
});
