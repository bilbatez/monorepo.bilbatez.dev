import { describe, it, expect } from 'vitest';
import { subsetsCommands } from './subsets';
import { makeGridState, backtrackReducer } from './commands';

function makeDefaultState() {
  return makeGridState(
    8,
    3,
    ['∅', '{1}', '{1,2}', '{1,2,3}', '{1,3}', '{2}', '{2,3}', '{3}'],
    ['1', '2', '3']
  );
}

function runAlgo(state: ReturnType<typeof makeGridState>) {
  const cmds = subsetsCommands(state);
  return cmds.reduce(backtrackReducer, state);
}

describe('Subsets of [1, 2, 3]', () => {
  it('result is 8 (2^3 subsets)', () => {
    const state = makeDefaultState();
    const result = runAlgo(state);
    expect(result.result).toBe(8);
  });

  it('produces commands (non-empty)', () => {
    const state = makeDefaultState();
    const cmds = subsetsCommands(state);
    expect(cmds.length).toBeGreaterThan(0);
  });

  it('first row (empty subset) has no computed cells', () => {
    const state = makeDefaultState();
    const result = runAlgo(state);
    // Row 0 = empty subset: no cells should have a computed value
    const row0Computed = result.grid[0].filter(
      (c) => c.computed && c.value !== null
    );
    expect(row0Computed).toHaveLength(0);
  });

  it('row 3 (full subset {1,2,3}) has all 3 cells filled', () => {
    const state = makeDefaultState();
    const result = runAlgo(state);
    // Generation order: row 3 = {1,2,3}
    const row3Vals = result.grid[3].map((c) => Number(c.value)).sort();
    expect(row3Vals).toEqual([1, 2, 3]);
  });

  it('row 1 ({1}) has only element 1 filled', () => {
    const state = makeDefaultState();
    const result = runAlgo(state);
    // Row 1 = {1}: only col 0 (element 1) should be computed
    expect(Number(result.grid[1][0].value)).toBe(1);
    expect(result.grid[1][1].value).toBeNull();
    expect(result.grid[1][2].value).toBeNull();
  });

  it('subsets count matches 2^n formula', () => {
    const state = makeDefaultState();
    const cmds = subsetsCommands(state);
    const result = cmds.reduce(backtrackReducer, state);
    expect(result.result).toBe(Math.pow(2, 3));
  });
});
