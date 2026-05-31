import { describe, it, expect } from 'vitest';
import { fibonacciCommands } from './fibonacci-variants';
import { makeMathState, mathReducer } from './commands';

describe('fibonacciVariants', () => {
  it('F(10) = 55', () => {
    const initial = makeMathState([]);
    const result = fibonacciCommands(initial).reduce(mathReducer, initial);
    expect(result.result).toBe(55);
  });

  it('builds correct sequence F(0)..F(10)', () => {
    const initial = makeMathState([]);
    const result = fibonacciCommands(initial).reduce(mathReducer, initial);
    expect(result.sequence).toEqual([0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55]);
  });

  it('F(0) = 0 and F(1) = 1 (base cases)', () => {
    const initial = makeMathState([]);
    const result = fibonacciCommands(initial).reduce(mathReducer, initial);
    expect(result.sequence[0]).toBe(0);
    expect(result.sequence[1]).toBe(1);
  });

  it('sequence has 11 elements (F(0) through F(10))', () => {
    const initial = makeMathState([]);
    const result = fibonacciCommands(initial).reduce(mathReducer, initial);
    expect(result.sequence.length).toBe(11);
  });
});
