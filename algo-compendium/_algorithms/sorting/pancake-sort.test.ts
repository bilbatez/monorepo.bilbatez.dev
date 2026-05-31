import { describe, it, expect } from 'vitest';
import { pancakeSortCommands } from './pancake-sort';
import { makeSortState, sortReducer } from './commands';

function runSort(arr: number[]): number[] {
  const initial = makeSortState(arr);
  const cmds = pancakeSortCommands(arr);
  return cmds.reduce(sortReducer, initial).array;
}

describe('pancakeSort', () => {
  it('sorts correctly', () =>
    expect(runSort([3, 6, 2, 7, 4, 9, 1, 5])).toEqual([
      1, 2, 3, 4, 5, 6, 7, 9,
    ]));
  it('handles empty array', () => expect(runSort([])).toEqual([]));
  it('handles single element', () => expect(runSort([5])).toEqual([5]));
  it('handles already sorted', () =>
    expect(runSort([1, 2, 3])).toEqual([1, 2, 3]));
  it('handles reverse sorted', () =>
    expect(runSort([3, 2, 1])).toEqual([1, 2, 3]));
  it('handles two elements', () => expect(runSort([2, 1])).toEqual([1, 2]));
  it('reducer does not mutate state', () => {
    const state = makeSortState([3, 1, 2]);
    const cmds = pancakeSortCommands([3, 1, 2]);
    if (cmds.length > 0) {
      const s1 = sortReducer(state, cmds[0]);
      expect(state.array).toEqual([3, 1, 2]);
      expect(s1).not.toBe(state);
    }
  });
});
