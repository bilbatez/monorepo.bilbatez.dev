import { describe, it, expect } from 'vitest';
import { permutationsCommands } from './permutations';
import { makeGridState, backtrackReducer } from './commands';

function runAlgo(state: ReturnType<typeof makeGridState>) {
  const cmds = permutationsCommands(state);
  return cmds.reduce(backtrackReducer, state);
}

describe('Permutations of [1, 2, 3]', () => {
  it('result is 6 (3! permutations)', () => {
    const state = makeGridState(
      6,
      3,
      ['p1', 'p2', 'p3', 'p4', 'p5', 'p6'],
      ['[0]', '[1]', '[2]']
    );
    const result = runAlgo(state);
    expect(result.result).toBe(6);
  });

  it('fills all 6 rows of the grid', () => {
    const state = makeGridState(
      6,
      3,
      ['p1', 'p2', 'p3', 'p4', 'p5', 'p6'],
      ['[0]', '[1]', '[2]']
    );
    const result = runAlgo(state);
    // Every row should have all 3 columns filled
    for (let r = 0; r < 6; r++) {
      const rowVals = result.grid[r].map((c) => c.value).sort();
      expect(rowVals).toEqual([1, 2, 3]);
    }
  });

  it('all permutations are unique', () => {
    const state = makeGridState(
      6,
      3,
      ['p1', 'p2', 'p3', 'p4', 'p5', 'p6'],
      ['[0]', '[1]', '[2]']
    );
    const result = runAlgo(state);
    const perms = result.grid.map((row) => row.map((c) => c.value).join(','));
    const unique = new Set(perms);
    expect(unique.size).toBe(6);
  });

  it('each permutation contains elements 1, 2, 3', () => {
    const state = makeGridState(
      6,
      3,
      ['p1', 'p2', 'p3', 'p4', 'p5', 'p6'],
      ['[0]', '[1]', '[2]']
    );
    const result = runAlgo(state);
    for (let r = 0; r < 6; r++) {
      const vals = result.grid[r].map((c) => Number(c.value)).sort();
      expect(vals).toEqual([1, 2, 3]);
    }
  });

  it('produces commands (non-empty)', () => {
    const state = makeGridState(
      6,
      3,
      ['p1', 'p2', 'p3', 'p4', 'p5', 'p6'],
      ['[0]', '[1]', '[2]']
    );
    const cmds = permutationsCommands(state);
    expect(cmds.length).toBeGreaterThan(0);
  });
});
