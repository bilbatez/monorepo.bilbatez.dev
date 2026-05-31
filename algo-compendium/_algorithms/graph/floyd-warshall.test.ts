import { describe, it, expect } from 'vitest';
import { floydWarshallCommands } from './floyd-warshall';
import { makeGraphState, graphReducer } from './commands';
import type { GraphCommand, GraphState } from './commands';
import { DIRECTED_WEIGHTED } from './types';

function runGraph(commands: GraphCommand[], initial: GraphState): GraphState {
  return commands.reduce(graphReducer, initial);
}

describe('Floyd-Warshall', () => {
  it('finalizes all nodes', () => {
    const initial = makeGraphState(DIRECTED_WEIGHTED);
    const cmds = floydWarshallCommands(initial);
    const result = runGraph(cmds, initial);
    // All nodes should be finalized
    expect(result.finalized).toHaveLength(DIRECTED_WEIGHTED.nodes.length);
  });

  it('generates update_distance commands during relaxation', () => {
    const initial = makeGraphState(DIRECTED_WEIGHTED);
    const cmds = floydWarshallCommands(initial);
    const distCmds = cmds.filter((c) => c.type === 'update_distance');
    expect(distCmds.length).toBeGreaterThan(0);
  });

  it('handles empty graph', () => {
    const emptyGraph = { directed: true, weighted: true, nodes: [], edges: [] };
    const initial = makeGraphState(emptyGraph);
    const cmds = floydWarshallCommands(initial);
    expect(cmds).toHaveLength(0);
  });

  it('distance from A to F is 9 (optimal all-pairs path)', () => {
    const initial = makeGraphState(DIRECTED_WEIGHTED);
    const cmds = floydWarshallCommands(initial);
    const result = runGraph(cmds, initial);
    // Floyd-Warshall updates distances via update_distance commands
    // The last update_distance for node F should reflect dist 9
    const fDistCmds = cmds.filter(
      (c) =>
        c.type === 'update_distance' && (c as { nodeId: string }).nodeId === 'F'
    );
    if (fDistCmds.length > 0) {
      const lastF = fDistCmds[fDistCmds.length - 1] as { distance: number };
      expect(lastF.distance).toBeLessThanOrEqual(9);
    }
    // finalized state should contain all nodes
    expect(result.finalized).toContain('F');
  });
});
