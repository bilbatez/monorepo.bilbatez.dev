import { describe, it, expect } from 'vitest';
import { kadaneCommands } from './kadane';
import { makeGridState, gridReducer } from './commands';

const ARR = [-2, 1, -3, 4, -1, 2, 1, -5];

function makeKadaneState() {
  const state = makeGridState(
    2,
    ARR.length,
    ['arr', 'cur'],
    ARR.map((_, i) => String(i))
  );
  const grid = state.grid.map((row, r) =>
    row.map((cell, c) => (r === 0 ? { value: ARR[c], computed: true } : cell))
  );
  return { ...state, grid, arr: ARR };
}

describe('kadane', () => {
  it('finds maximum subarray sum of 6', () => {
    const initial = makeKadaneState();
    const cmds = kadaneCommands(initial);
    const result = cmds.reduce(gridReducer, initial);
    // Max subarray is [4,-1,2,1] = 6
    expect(result.result).toBe('Max sum: 6');
  });

  it('computes running values in row 1', () => {
    const initial = makeKadaneState();
    const cmds = kadaneCommands(initial);
    const result = cmds.reduce(gridReducer, initial);
    // Row 1 col 3 should have maxEndingHere=4
    expect(result.grid[1][3].value).toBe(4);
  });

  it('sets a trace path', () => {
    const initial = makeKadaneState();
    const cmds = kadaneCommands(initial);
    const result = cmds.reduce(gridReducer, initial);
    expect(result.tracePath.length).toBeGreaterThan(0);
  });

  it('handles all negative array', () => {
    const arr = [-3, -1, -2];
    const state = {
      ...makeGridState(
        2,
        arr.length,
        ['arr', 'cur'],
        arr.map((_, i) => String(i))
      ),
      grid: makeGridState(2, arr.length).grid.map((row, r) =>
        row.map((cell, c) =>
          r === 0 ? { value: arr[c], computed: true } : cell
        )
      ),
      arr,
    };
    const cmds = kadaneCommands(state);
    const result = cmds.reduce(gridReducer, state);
    expect(result.result).toBe('Max sum: -1');
  });

  it('handles single element', () => {
    const arr = [5];
    const state = {
      ...makeGridState(2, 1, ['arr', 'cur'], ['0']),
      grid: [
        [{ value: 5, computed: true }],
        [{ value: null, computed: false }],
      ],
      arr,
    };
    const cmds = kadaneCommands(state);
    const result = cmds.reduce(gridReducer, state);
    expect(result.result).toBe('Max sum: 5');
  });

  it('reducer does not mutate state', () => {
    const initial = makeKadaneState();
    const cmds = kadaneCommands(initial);
    if (cmds.length > 0) {
      const s1 = gridReducer(initial, cmds[0]);
      expect(initial.result).toBeNull();
      expect(s1).not.toBe(initial);
    }
  });
});
