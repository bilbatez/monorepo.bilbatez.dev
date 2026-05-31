import { describe, it, expect } from 'vitest';
import { matrixChainCommands } from './matrix-chain';
import { makeGridState, gridReducer } from './commands';

function makeMatrixChainState() {
  return makeGridState(3, 3, ['A', 'B', 'C'], ['A', 'B', 'C']);
}

describe('matrixChain', () => {
  it('computes correct minimum cost for dims [10,30,5,60]', () => {
    // A(10x30), B(30x5), C(5x60)
    // (AB)C: 10*30*5 + 10*5*60 = 1500 + 3000 = 4500
    // A(BC): 30*5*60 + 10*30*60 = 9000 + 18000 = 27000
    // Min = 4500
    const initial = makeMatrixChainState();
    const cmds = matrixChainCommands(initial);
    const result = cmds.reduce(gridReducer, initial);
    expect(result.result).toBe('Min cost: 4500');
  });

  it('sets dp[0][0] to 0 (base case)', () => {
    const initial = makeMatrixChainState();
    const cmds = matrixChainCommands(initial);
    const result = cmds.reduce(gridReducer, initial);
    expect(result.grid[0][0].value).toBe(0);
  });

  it('sets dp[1][1] to 0 (base case)', () => {
    const initial = makeMatrixChainState();
    const cmds = matrixChainCommands(initial);
    const result = cmds.reduce(gridReducer, initial);
    expect(result.grid[1][1].value).toBe(0);
  });

  it('sets dp[0][2] to optimal overall cost', () => {
    const initial = makeMatrixChainState();
    const cmds = matrixChainCommands(initial);
    const result = cmds.reduce(gridReducer, initial);
    expect(result.grid[0][2].value).toBe(4500);
  });

  it('sets trace path', () => {
    const initial = makeMatrixChainState();
    const cmds = matrixChainCommands(initial);
    const result = cmds.reduce(gridReducer, initial);
    expect(result.tracePath.length).toBeGreaterThan(0);
  });

  it('reducer does not mutate state', () => {
    const initial = makeMatrixChainState();
    const cmds = matrixChainCommands(initial);
    if (cmds.length > 0) {
      const s1 = gridReducer(initial, cmds[0]);
      expect(initial.result).toBeNull();
      expect(s1).not.toBe(initial);
    }
  });
});
