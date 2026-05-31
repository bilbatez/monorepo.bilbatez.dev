import { describe, it, expect } from 'vitest';
import { linearSearchCommands } from './linear';
import { makeSearchState, searchReducer } from './commands';

function runSearch(arr: number[], target: number) {
  const initial = makeSearchState(arr, target);
  const cmds = linearSearchCommands(arr, target);
  return cmds.reduce(searchReducer, initial);
}

describe('linearSearch', () => {
  it('finds target', () => {
    const result = runSearch([11, 21, 34, 39, 45], 34);
    expect(result.found).toBe(2);
  });
  it('target not found', () => {
    const result = runSearch([1, 2, 3], 99);
    expect(result.found).toBeNull();
  });
  it('empty array', () => expect(runSearch([], 5).found).toBeNull());
  it('single element match', () => expect(runSearch([5], 5).found).toBe(0));
  it('single element no match', () =>
    expect(runSearch([5], 3).found).toBeNull());
  it('finds first occurrence', () => {
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
    const cmds = linearSearchCommands(arr, 2);
    const s1 = searchReducer(initial, cmds[0]);
    expect(initial.current).toBeNull();
    expect(s1).not.toBe(initial);
  });
});
