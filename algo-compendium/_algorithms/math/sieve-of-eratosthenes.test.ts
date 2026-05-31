import { describe, it, expect } from 'vitest';
import { sieveCommands } from './sieve-of-eratosthenes';
import { makeMathState, mathReducer } from './commands';

describe('sieveOfEratosthenes', () => {
  it('finds primes up to 50', () => {
    const nums = Array.from({ length: 50 }, (_, i) => i);
    const initial = makeMathState(nums);
    const cmds = sieveCommands(initial);
    const result = cmds.reduce(mathReducer, initial);
    const primeNums = result.primes.map((i) => nums[i]);
    expect(primeNums).toContain(2);
    expect(primeNums).toContain(3);
    expect(primeNums).toContain(5);
    expect(primeNums).toContain(47);
    expect(primeNums).not.toContain(4);
    expect(primeNums).not.toContain(1);
    expect(primeNums).not.toContain(0);
  });

  it('correctly marks composites', () => {
    const nums = Array.from({ length: 20 }, (_, i) => i);
    const initial = makeMathState(nums);
    const cmds = sieveCommands(initial);
    const result = cmds.reduce(mathReducer, initial);
    const compositeNums = result.composites.map((i) => nums[i]);
    expect(compositeNums).toContain(4);
    expect(compositeNums).toContain(6);
    expect(compositeNums).toContain(9);
    expect(compositeNums).toContain(12);
  });

  it('produces correct primes up to 20', () => {
    const nums = Array.from({ length: 21 }, (_, i) => i);
    const initial = makeMathState(nums);
    const cmds = sieveCommands(initial);
    const result = cmds.reduce(mathReducer, initial);
    const primeNums = result.primes.map((i) => nums[i]).sort((a, b) => a - b);
    expect(primeNums).toEqual([2, 3, 5, 7, 11, 13, 17, 19]);
  });
});
