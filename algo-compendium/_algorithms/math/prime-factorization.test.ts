import { describe, it, expect } from 'vitest';
import { primeFactorizationCommands } from './prime-factorization';
import { makeMathState, mathReducer } from './commands';

describe('primeFactorization', () => {
  it('360 = 2 × 2 × 2 × 3 × 3 × 5', () => {
    const initial = makeMathState([360]);
    const result = primeFactorizationCommands(initial).reduce(
      mathReducer,
      initial
    );
    expect(result.result).toBe('2 × 2 × 2 × 3 × 3 × 5');
  });

  it('12 = 2 × 2 × 3', () => {
    const initial = makeMathState([12]);
    const result = primeFactorizationCommands(initial).reduce(
      mathReducer,
      initial
    );
    expect(result.result).toBe('2 × 2 × 3');
  });

  it('prime number 13 = 13', () => {
    const initial = makeMathState([13]);
    const result = primeFactorizationCommands(initial).reduce(
      mathReducer,
      initial
    );
    expect(result.result).toBe('13');
  });

  it('100 = 2 × 2 × 5 × 5', () => {
    const initial = makeMathState([100]);
    const result = primeFactorizationCommands(initial).reduce(
      mathReducer,
      initial
    );
    expect(result.result).toBe('2 × 2 × 5 × 5');
  });

  it('builds sequence of factors', () => {
    const initial = makeMathState([12]);
    const result = primeFactorizationCommands(initial).reduce(
      mathReducer,
      initial
    );
    expect(result.sequence.length).toBeGreaterThan(0);
  });
});
