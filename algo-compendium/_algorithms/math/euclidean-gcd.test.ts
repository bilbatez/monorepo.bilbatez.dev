import { describe, it, expect } from 'vitest';
import { gcdCommands } from './euclidean-gcd';
import { makeMathState, mathReducer } from './commands';

describe('euclideanGcd', () => {
  it('gcd(48, 18) = 6', () => {
    const initial = makeMathState([48, 18]);
    const result = gcdCommands(initial).reduce(mathReducer, initial);
    expect(result.result).toBe(6);
  });

  it('gcd(0, 5) = 5', () => {
    const initial = makeMathState([0, 5]);
    const result = gcdCommands(initial).reduce(mathReducer, initial);
    expect(result.result).toBe(5);
  });

  it('gcd(7, 7) = 7', () => {
    const initial = makeMathState([7, 7]);
    const result = gcdCommands(initial).reduce(mathReducer, initial);
    expect(result.result).toBe(7);
  });

  it('gcd(100, 75) = 25', () => {
    const initial = makeMathState([100, 75]);
    const result = gcdCommands(initial).reduce(mathReducer, initial);
    expect(result.result).toBe(25);
  });

  it('gcd(17, 13) = 1 (coprime)', () => {
    const initial = makeMathState([17, 13]);
    const result = gcdCommands(initial).reduce(mathReducer, initial);
    expect(result.result).toBe(1);
  });

  it('records steps', () => {
    const initial = makeMathState([48, 18]);
    const result = gcdCommands(initial).reduce(mathReducer, initial);
    expect(result.steps.length).toBeGreaterThan(0);
  });
});
