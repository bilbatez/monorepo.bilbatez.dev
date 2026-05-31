import { describe, it, expect } from 'vitest';
import { lisCommands } from './lis';
import { makeGridState, gridReducer } from './commands';

function runDP(arr: number[]) {
  const initialState = {
    ...makeGridState(1, arr.length || 1, ['dp'], arr.map(String)),
    arr,
  };
  const cmds = lisCommands(initialState);
  return cmds.reduce(gridReducer, initialState);
}

describe('LIS DP', () => {
  it('finds LIS length for [10,9,2,5,3,7,101,18]', () => {
    const result = runDP([10, 9, 2, 5, 3, 7, 101, 18]);
    // LIS is [2,3,7,101] or [2,5,7,101] = length 4
    expect(result.result).toBe(4);
  });

  it('handles already sorted array', () => {
    const result = runDP([1, 2, 3, 4, 5]);
    expect(result.result).toBe(5);
  });

  it('handles reverse sorted array', () => {
    const result = runDP([5, 4, 3, 2, 1]);
    expect(result.result).toBe(1);
  });

  it('handles single element', () => {
    const result = runDP([42]);
    expect(result.result).toBe(1);
  });

  it('handles empty array', () => {
    const result = runDP([]);
    expect(result.result).toBe(0);
  });

  it('handles all equal elements', () => {
    const result = runDP([3, 3, 3]);
    expect(result.result).toBe(1);
  });

  it('computes dp[i] values correctly for [3,1,2]', () => {
    const result = runDP([3, 1, 2]);
    // dp[0]=1 (3 alone), dp[1]=1 (1 alone), dp[2]=2 ([1,2])
    expect(result.grid[0][0].value).toBe(1);
    expect(result.grid[0][1].value).toBe(1);
    expect(result.grid[0][2].value).toBe(2);
    expect(result.result).toBe(2);
  });
});
