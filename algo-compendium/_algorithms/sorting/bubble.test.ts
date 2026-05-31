import { describe, it, expect } from 'vitest';
import { bubbleSortCommands } from './bubble';
import { makeSortState, sortReducer } from './commands';

function runSort(arr: number[]) {
  const initial = makeSortState(arr);
  const cmds = bubbleSortCommands(arr);
  return cmds.reduce(sortReducer, initial).array;
}

describe('bubbleSort', () => {
  it('sorts correctly', () =>
    expect(runSort([64, 34, 25, 12, 22])).toEqual([12, 22, 25, 34, 64]));
  it('handles empty', () => expect(runSort([])).toEqual([]));
  it('handles single', () => expect(runSort([5])).toEqual([5]));
  it('handles already sorted', () =>
    expect(runSort([1, 2, 3])).toEqual([1, 2, 3]));
  it('handles reverse', () => expect(runSort([3, 2, 1])).toEqual([1, 2, 3]));
  it('handles duplicates', () =>
    expect(runSort([3, 1, 3, 2])).toEqual([1, 2, 3, 3]));
  it('reducer does not mutate state', () => {
    const state = makeSortState([3, 1, 2]);
    const cmds = bubbleSortCommands([3, 1, 2]);
    const s1 = sortReducer(state, cmds[0]);
    expect(state.array).toEqual([3, 1, 2]);
    expect(s1).not.toBe(state);
  });
});
