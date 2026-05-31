import { describe, it, expect } from 'vitest';
import { bellmanFordCommands } from './bellman-ford';
import { makeGraphState, graphReducer } from './commands';
import type { GraphCommand, GraphState } from './commands';
import { DIRECTED_WEIGHTED } from './types';

function runGraph(commands: GraphCommand[], initial: GraphState): GraphState {
  return commands.reduce(graphReducer, initial);
}

describe('Bellman-Ford', () => {
  it('computes correct shortest distances from A', () => {
    const initial = makeGraphState(DIRECTED_WEIGHTED);
    const cmds = bellmanFordCommands(initial);
    const result = runGraph(cmds, initial);

    // Same expected distances as Dijkstra: A=0, B=4, C=2, D=7, E=7, F=9
    expect(result.distances['A']).toBe(0);
    expect(result.distances['B']).toBe(4);
    expect(result.distances['C']).toBe(2);
    expect(result.distances['D']).toBe(7);
    expect(result.distances['E']).toBe(7);
    expect(result.distances['F']).toBe(9);
  });

  it('finalizes all reachable nodes', () => {
    const initial = makeGraphState(DIRECTED_WEIGHTED);
    const cmds = bellmanFordCommands(initial);
    const result = runGraph(cmds, initial);
    expect(result.finalized.length).toBeGreaterThan(0);
  });

  it('handles empty graph', () => {
    const emptyGraph = { directed: true, weighted: true, nodes: [], edges: [] };
    const initial = makeGraphState(emptyGraph);
    const cmds = bellmanFordCommands(initial);
    expect(cmds).toHaveLength(0);
  });
});
