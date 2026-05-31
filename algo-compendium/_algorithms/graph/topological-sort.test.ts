import { describe, it, expect } from 'vitest';
import { topologicalSortCommands } from './topological-sort';
import { makeGraphState, graphReducer } from './commands';
import type { GraphCommand, GraphState } from './commands';
import { DIRECTED_DAG } from './types';

function runGraph(commands: GraphCommand[], initial: GraphState): GraphState {
  return commands.reduce(graphReducer, initial);
}

function isValidTopologicalOrder(
  result: string[],
  graph: typeof DIRECTED_DAG
): boolean {
  const pos: Record<string, number> = {};
  result.forEach((id, i) => {
    pos[id] = i;
  });

  for (const edge of graph.edges) {
    if (pos[edge.from] === undefined || pos[edge.to] === undefined)
      return false;
    if (pos[edge.from] >= pos[edge.to]) return false;
  }
  return true;
}

describe('Topological Sort', () => {
  it('visits all nodes', () => {
    const initial = makeGraphState(DIRECTED_DAG);
    const cmds = topologicalSortCommands(initial);
    const result = runGraph(cmds, initial);
    expect(result.visited).toHaveLength(DIRECTED_DAG.nodes.length);
  });

  it('produces a valid topological order', () => {
    const initial = makeGraphState(DIRECTED_DAG);
    const cmds = topologicalSortCommands(initial);
    const result = runGraph(cmds, initial);
    expect(result.result).toHaveLength(DIRECTED_DAG.nodes.length);
    expect(isValidTopologicalOrder(result.result, DIRECTED_DAG)).toBe(true);
  });

  it('result contains all node IDs', () => {
    const initial = makeGraphState(DIRECTED_DAG);
    const cmds = topologicalSortCommands(initial);
    const result = runGraph(cmds, initial);
    const nodeIds = new Set(DIRECTED_DAG.nodes.map((n) => n.id));
    const resultIds = new Set(result.result);
    expect(resultIds).toEqual(nodeIds);
  });

  it('finalizes all nodes', () => {
    const initial = makeGraphState(DIRECTED_DAG);
    const cmds = topologicalSortCommands(initial);
    const result = runGraph(cmds, initial);
    expect(result.finalized).toHaveLength(DIRECTED_DAG.nodes.length);
  });

  it('handles empty graph', () => {
    const emptyGraph = {
      directed: true,
      weighted: false,
      nodes: [],
      edges: [],
    };
    const initial = makeGraphState(emptyGraph);
    const cmds = topologicalSortCommands(initial);
    expect(cmds).toHaveLength(0);
  });
});
