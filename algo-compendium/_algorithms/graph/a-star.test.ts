import { describe, it, expect } from 'vitest';
import { aStarCommands } from './a-star';
import { makeGraphState, graphReducer } from './commands';
import type { Graph } from './types';

const testGraph: Graph = {
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

describe('aStar', () => {
  it('finds a path from s to g', () => {
    const initial = makeGraphState(testGraph);
    const cmds = aStarCommands(initial);
    const result = cmds.reduce(graphReducer, initial);
    expect(result.path.length).toBeGreaterThan(0);
    expect(result.path[0]).toBe('s');
    expect(result.path[result.path.length - 1]).toBe('g');
  });

  it('finds the optimal path cost (s→a→c→g = 3+3+2 = 8)', () => {
    const initial = makeGraphState(testGraph);
    const cmds = aStarCommands(initial);
    const result = cmds.reduce(graphReducer, initial);
    // Optimal path: s→a→c→g with cost 8
    expect(result.distances['g']).toBe(8);
  });

  it('visits the source node', () => {
    const initial = makeGraphState(testGraph);
    const cmds = aStarCommands(initial);
    const result = cmds.reduce(graphReducer, initial);
    expect(result.visited).toContain('s');
  });

  it('handles empty graph', () => {
    const emptyGraph: Graph = {
      nodes: [],
      edges: [],
      directed: false,
      weighted: true,
    };
    const initial = makeGraphState(emptyGraph);
    const cmds = aStarCommands(initial);
    expect(cmds).toHaveLength(0);
  });

  it('reducer does not mutate state', () => {
    const initial = makeGraphState(testGraph);
    const cmds = aStarCommands(initial);
    if (cmds.length > 0) {
      const s1 = graphReducer(initial, cmds[0]);
      expect(initial.visited).toEqual([]);
      expect(s1).not.toBe(initial);
    }
  });
});
