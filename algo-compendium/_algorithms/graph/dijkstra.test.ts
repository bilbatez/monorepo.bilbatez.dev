import { describe, it, expect } from 'vitest';
import { dijkstraCommands } from './dijkstra';
import { makeGraphState, graphReducer } from './commands';
import type { GraphCommand, GraphState } from './commands';
import { DIRECTED_WEIGHTED } from './types';

function runGraph(commands: GraphCommand[], initial: GraphState): GraphState {
  return commands.reduce(graphReducer, initial);
}

describe('Dijkstra', () => {
  it('computes correct shortest distances from A', () => {
    const initial = makeGraphState(DIRECTED_WEIGHTED);
    const cmds = dijkstraCommands(initial);
    const result = runGraph(cmds, initial);

    // From A: A=0, B=3 (A→B→C: 4+1=5, but A→B=4 direct),
    // Let's verify known distances:
    // A=0, B=4 (direct), C=2 (A→C direct), D=6 (A→C→E→D=2+5+1=8, or A→B→D=4+3=7), E=7 (A→C→E=2+5), F=8 (min of D→F=7+2=9 or E→F=7+3=10... wait)
    // A→B=4, A→C=2, B→D=7 (4+3), B→C=5(4+1 but A→C=2 shorter), C→E=7(2+5), E→D=8(7+1), D→F=9(7+2 or 8+2=10), E→F=10(7+3)
    // So: A=0, B=4, C=2, D=7, E=7, F=9
    expect(result.distances['A']).toBe(0);
    expect(result.distances['B']).toBe(4);
    expect(result.distances['C']).toBe(2);
    expect(result.distances['D']).toBe(7);
    expect(result.distances['E']).toBe(7);
    expect(result.distances['F']).toBe(9);
  });

  it('finalizes all reachable nodes', () => {
    const initial = makeGraphState(DIRECTED_WEIGHTED);
    const cmds = dijkstraCommands(initial);
    const result = runGraph(cmds, initial);
    expect(result.finalized).toHaveLength(DIRECTED_WEIGHTED.nodes.length);
  });

  it('marks a path from source to destination', () => {
    const initial = makeGraphState(DIRECTED_WEIGHTED);
    const cmds = dijkstraCommands(initial);
    const result = runGraph(cmds, initial);
    expect(result.path.length).toBeGreaterThan(0);
    expect(result.path[0]).toBe('A');
  });
});
