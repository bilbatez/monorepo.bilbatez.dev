import { describe, it, expect } from 'vitest';
import { binarySearchCommands } from './binary';
import { makeSearchState, searchReducer } from './commands';

function runSearch(arr: number[], target: number) {
  const initial = makeSearchState(arr, target);
  const cmds = binarySearchCommands(arr, target);
  return cmds.reduce(searchReducer, initial);
}

describe('binarySearch', () => {
  it('finds target', () => {
    const result = runSearch([11, 21, 34, 39, 45, 56, 67, 73, 82, 91], 45);
    expect(result.found).toBe(4);
  });
  it('target not found', () => {
    const result = runSearch([1, 2, 3, 4, 5], 99);
    expect(result.found).toBeNull();
  });
  it('empty array', () => expect(runSearch([], 5).found).toBeNull());
  it('single element match', () => expect(runSearch([5], 5).found).toBe(0));
  it('single element no match', () =>
    expect(runSearch([5], 3).found).toBeNull());
  it('finds first element', () => {
    const result = runSearch([1, 2, 3, 4, 5], 1);
    expect(result.found).toBe(0);
  });
  it('finds last element', () => {
    const result = runSearch([1, 2, 3, 4, 5], 5);
    expect(result.found).toBe(4);
  });
  it('reducer does not mutate previous state', () => {
    const arr = [1, 2, 3];
    const initial = makeSearchState(arr, 2);
    const cmds = binarySearchCommands(arr, 2);
    const s1 = searchReducer(initial, cmds[0]);
    expect(initial.low).toBeNull();
    expect(s1).not.toBe(initial);
  });
});
