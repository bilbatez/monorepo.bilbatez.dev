import { describe, it, expect } from 'vitest';
import { combSortCommands } from './comb-sort';
import { makeSortState, sortReducer } from './commands';

function runSort(arr: number[]): number[] {
  const initial = makeSortState(arr);
  const cmds = combSortCommands(arr);
  return cmds.reduce(sortReducer, initial).array;
}

describe('combSort', () => {
  it('sorts correctly', () =>
    expect(runSort([64, 34, 25, 12, 22, 11, 90, 42, 78, 5])).toEqual([
      5, 11, 12, 22, 25, 34, 42, 64, 78, 90,
    ]));
  it('handles empty array', () => expect(runSort([])).toEqual([]));
  it('handles single element', () => expect(runSort([7])).toEqual([7]));
  it('handles already sorted', () =>
    expect(runSort([1, 2, 3, 4, 5])).toEqual([1, 2, 3, 4, 5]));
  it('handles reverse sorted', () =>
    expect(runSort([5, 4, 3, 2, 1])).toEqual([1, 2, 3, 4, 5]));
  it('handles duplicates', () =>
    expect(runSort([3, 1, 4, 1, 5, 9, 2, 6])).toEqual([
      1, 1, 2, 3, 4, 5, 6, 9,
    ]));
  it('reducer does not mutate state', () => {
    const state = makeSortState([3, 1, 2]);
    const cmds = combSortCommands([3, 1, 2]);
    const s1 = sortReducer(state, cmds[0]);
    expect(state.array).toEqual([3, 1, 2]);
    expect(s1).not.toBe(state);
  });
});
