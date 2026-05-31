import { describe, it, expect } from 'vitest';
import { tarjanSccCommands } from './tarjan-scc';
import { makeGraphState, graphReducer } from './commands';
import type { Graph } from './types';

const testGraph: Graph = {
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

describe('tarjanSCC', () => {
  it('finds correct number of SCCs', () => {
    const initial = makeGraphState(testGraph);
    const cmds = tarjanSccCommands(initial);
    const result = cmds.reduce(graphReducer, initial);
    // Should have 2 SCCs: {a,b,c} and {d,e}
    expect(result.result).toHaveLength(2);
  });

  it('result contains SCC labels', () => {
    const initial = makeGraphState(testGraph);
    const cmds = tarjanSccCommands(initial);
    const result = cmds.reduce(graphReducer, initial);
    const sccStr = result.result.join(' ');
    expect(sccStr).toContain('SCC:');
  });

  it('visits all nodes', () => {
    const initial = makeGraphState(testGraph);
    const cmds = tarjanSccCommands(initial);
    const result = cmds.reduce(graphReducer, initial);
    expect(result.visited.length).toBe(testGraph.nodes.length);
  });

  it('finalizes all nodes', () => {
    const initial = makeGraphState(testGraph);
    const cmds = tarjanSccCommands(initial);
    const result = cmds.reduce(graphReducer, initial);
    expect(result.finalized.length).toBe(testGraph.nodes.length);
  });

  it('handles empty graph', () => {
    const emptyGraph: Graph = {
      nodes: [],
      edges: [],
      directed: true,
      weighted: false,
    };
    const initial = makeGraphState(emptyGraph);
    const cmds = tarjanSccCommands(initial);
    const result = cmds.reduce(graphReducer, initial);
    expect(result.result).toHaveLength(0);
  });

  it('reducer does not mutate state', () => {
    const initial = makeGraphState(testGraph);
    const cmds = tarjanSccCommands(initial);
    if (cmds.length > 0) {
      const s1 = graphReducer(initial, cmds[0]);
      expect(initial.visited).toEqual([]);
      expect(s1).not.toBe(initial);
    }
  });
});
