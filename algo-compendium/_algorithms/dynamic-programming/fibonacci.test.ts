import { describe, it, expect } from 'vitest';
import { fibonacciCommands } from './fibonacci';
import { makeGridState, gridReducer } from './commands';

function runDP(initialState: ReturnType<typeof makeGridState>) {
  const cmds = fibonacciCommands(initialState);
  return cmds.reduce(gridReducer, initialState);
}

describe('fibonacci DP', () => {
  it('computes fib(10) = 55', () => {
    const state = makeGridState(
      1,
      11,
      ['dp'],
      ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
    );
    const result = runDP(state);
    expect(result.result).toBe(55);
  });

  it('fills the grid with correct Fibonacci values', () => {
    const state = makeGridState(
      1,
      11,
      ['dp'],
      ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
    );
    const result = runDP(state);
    const expected = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55];
    expected.forEach((val, i) => {
      expect(result.grid[0][i].value).toBe(val);
    });
  });

  it('computes fib(0) = 0', () => {
    const state = makeGridState(1, 1, ['dp'], ['0']);
    const result = runDP(state);
    expect(result.result).toBe(0);
  });

  it('computes fib(1) = 1', () => {
    const state = makeGridState(1, 2, ['dp'], ['0', '1']);
    const result = runDP(state);
    expect(result.result).toBe(1);
  });

  it('computes fib(5) = 5', () => {
    const state = makeGridState(1, 6, ['dp'], ['0', '1', '2', '3', '4', '5']);
    const result = runDP(state);
    expect(result.result).toBe(5);
  });

  it('reducer does not mutate state', () => {
    const state = makeGridState(1, 4, ['dp'], ['0', '1', '2', '3']);
    const cmds = fibonacciCommands(state);
    const s1 = gridReducer(state, cmds[0]);
    expect(state.grid[0][0].value).toBeNull();
    expect(s1).not.toBe(state);
  });
});
