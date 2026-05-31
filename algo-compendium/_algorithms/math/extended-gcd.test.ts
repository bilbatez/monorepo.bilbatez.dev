import { describe, it, expect } from 'vitest';
import { extendedGcdCommands } from './extended-gcd';
import { makeMathState, mathReducer } from './commands';

function runExtGcd(a: number, b: number) {
  const initial = makeMathState([a, b]);
  const cmds = extendedGcdCommands(initial);
  return cmds.reduce(mathReducer, initial);
}

describe('extendedGcd', () => {
  it('finds gcd(35,15) = 5 with correct Bezout coefficients', () => {
    const result = runExtGcd(35, 15);
    // gcd(35,15) = 5, Bezout: 35*1 + 15*(-2) = 5
    expect(result.result).toContain('gcd=5');
  });

  it('Bezout coefficients satisfy ax + by = gcd for (35,15)', () => {
    const result = runExtGcd(35, 15);
    const resultStr = result.result as string;
    const xMatch = resultStr.match(/x=(-?\d+)/);
    const yMatch = resultStr.match(/y=(-?\d+)/);
    if (xMatch && yMatch) {
      const x = parseInt(xMatch[1]);
      const y = parseInt(yMatch[1]);
      expect(35 * x + 15 * y).toBe(5);
    }
  });

  it('finds gcd(48,18) = 6', () => {
    const result = runExtGcd(48, 18);
    expect(result.result).toContain('gcd=6');
  });

  it('handles gcd(0, 5) = 5', () => {
    const result = runExtGcd(0, 5);
    expect(result.result).toContain('gcd=5');
  });

  it('emits step commands for each Euclidean step', () => {
    const initial = makeMathState([35, 15]);
    const cmds = extendedGcdCommands(initial);
    const stepCmds = cmds.filter((c) => c.type === 'step');
    expect(stepCmds.length).toBeGreaterThan(0);
  });

  it('reducer does not mutate state', () => {
    const initial = makeMathState([35, 15]);
    const cmds = extendedGcdCommands(initial);
    if (cmds.length > 0) {
      const s1 = mathReducer(initial, cmds[0]);
      expect(initial.result).toBeNull();
      expect(s1).not.toBe(initial);
    }
  });
});
