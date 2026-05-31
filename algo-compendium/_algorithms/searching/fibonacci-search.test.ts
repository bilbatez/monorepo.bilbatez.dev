import { describe, it, expect } from 'vitest';
import { fibonacciSearchCommands } from './fibonacci-search';
import { makeSearchState, searchReducer } from './commands';

function runSearch(array: number[], target: number) {
  const initial = makeSearchState(array, target);
  const cmds = fibonacciSearchCommands(array, target);
  return cmds.reduce(searchReducer, initial);
}

describe('fibonacciSearch', () => {
  it('finds target in the middle', () => {
    const result = runSearch([10, 22, 35, 40, 45, 50, 80, 82, 85, 90, 100], 85);
    expect(result.found).toBe(8);
  });

  it('finds target at the beginning', () => {
    const result = runSearch([10, 22, 35, 40, 45], 10);
    expect(result.found).toBe(0);
  });

  it('finds target at the end', () => {
    const result = runSearch([10, 22, 35, 40, 45], 45);
    expect(result.found).toBeGreaterThanOrEqual(4);
  });

  it('returns not found for missing target', () => {
    const result = runSearch([10, 22, 35, 40, 45], 99);
    expect(result.found).toBeNull();
  });

  it('handles empty array', () => {
    const result = runSearch([], 5);
    expect(result.found).toBeNull();
  });

  it('handles single element — found', () => {
    const result = runSearch([42], 42);
    expect(result.found).toBe(0);
  });

  it('handles single element — not found', () => {
    const result = runSearch([42], 99);
    expect(result.found).toBeNull();
  });

  it('reducer does not mutate state', () => {
    const initial = makeSearchState([10, 22, 35], 22);
    const cmds = fibonacciSearchCommands([10, 22, 35], 22);
    if (cmds.length > 0) {
      const s1 = searchReducer(initial, cmds[0]);
      expect(initial.array).toEqual([10, 22, 35]);
      expect(s1).not.toBe(initial);
    }
  });
});
