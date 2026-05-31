import { describe, it, expect } from 'vitest';
import { dfsCommands } from './dfs';
import { makeGraphState, graphReducer } from './commands';
import type { GraphCommand, GraphState } from './commands';
import { UNDIRECTED_UNWEIGHTED } from './types';

function runGraph(commands: GraphCommand[], initial: GraphState): GraphState {
  return commands.reduce(graphReducer, initial);
}

describe('DFS', () => {
  it('visits all nodes in an undirected graph', () => {
    const initial = makeGraphState(UNDIRECTED_UNWEIGHTED);
    const cmds = dfsCommands(initial);
    const result = runGraph(cmds, initial);
    expect(result.visited).toHaveLength(UNDIRECTED_UNWEIGHTED.nodes.length);
  });

  it('starts from the first node', () => {
    const initial = makeGraphState(UNDIRECTED_UNWEIGHTED);
    const cmds = dfsCommands(initial);
    const result = runGraph(cmds, initial);
    expect(result.visited[0]).toBe('A');
  });

  it('handles empty graph', () => {
    const emptyGraph = {
      directed: false,
      weighted: false,
      nodes: [],
      edges: [],
    };
    const initial = makeGraphState(emptyGraph);
    const cmds = dfsCommands(initial);
    expect(cmds).toHaveLength(0);
  });

  it('generates visit_edge commands', () => {
    const initial = makeGraphState(UNDIRECTED_UNWEIGHTED);
    const cmds = dfsCommands(initial);
    const edgeCmds = cmds.filter((c) => c.type === 'visit_edge');
    expect(edgeCmds.length).toBeGreaterThan(0);
  });
});
