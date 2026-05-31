import { describe, it, expect } from 'vitest';
import { millerRabinCommands } from './miller-rabin';
import { makeMathState, mathReducer } from './commands';

function runMillerRabin(n: number) {
  const initial = makeMathState([n]);
  const cmds = millerRabinCommands(initial);
  return cmds.reduce(mathReducer, initial);
}

describe('millerRabin', () => {
  it('correctly identifies 97 as prime', () => {
    const result = runMillerRabin(97);
    expect(result.result).toContain('prime');
    expect(result.result).not.toContain('composite');
  });

  it('correctly identifies 2 as prime', () => {
    const result = runMillerRabin(2);
    expect(result.result).toContain('prime');
  });

  it('correctly identifies 100 as composite', () => {
    const result = runMillerRabin(100);
    expect(result.result).toContain('composite');
  });

  it('correctly identifies 561 as composite (Carmichael number)', () => {
    const result = runMillerRabin(561);
    expect(result.result).toContain('composite');
  });

  it('correctly identifies 7 as prime', () => {
    const result = runMillerRabin(7);
    expect(result.result).toContain('prime');
  });

  it('correctly identifies 4 as composite', () => {
    const result = runMillerRabin(4);
    expect(result.result).toContain('composite');
  });

  it('marks prime index for prime numbers', () => {
    const result = runMillerRabin(97);
    expect(result.primes).toContain(0);
  });

  it('marks composite index for composite numbers', () => {
    const result = runMillerRabin(100);
    expect(result.composites).toContain(0);
  });

  it('reducer does not mutate state', () => {
    const initial = makeMathState([97]);
    const cmds = millerRabinCommands(initial);
    if (cmds.length > 0) {
      const s1 = mathReducer(initial, cmds[0]);
      expect(initial.result).toBeNull();
      expect(s1).not.toBe(initial);
    }
  });
});
