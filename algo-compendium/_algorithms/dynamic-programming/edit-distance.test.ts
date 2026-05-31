import { describe, it, expect } from 'vitest';
import { editDistanceCommands } from './edit-distance';
import { makeGridState, gridReducer } from './commands';

function runDP(s1: string, s2: string) {
  const initialState = {
    ...makeGridState(
      s1.length + 1,
      s2.length + 1,
      ['', ...s1.split('')],
      ['', ...s2.split('')]
    ),
    s1,
    s2,
  };
  const cmds = editDistanceCommands(initialState);
  return cmds.reduce(gridReducer, initialState);
}

describe('Edit Distance DP', () => {
  it('computes edit distance between "kitten" and "sitting"', () => {
    const result = runDP('kitten', 'sitting');
    expect(result.result).toBe(3);
  });

  it('returns 0 for identical strings', () => {
    const result = runDP('abc', 'abc');
    expect(result.result).toBe(0);
  });

  it('returns length of s2 when s1 is empty', () => {
    const result = runDP('', 'abc');
    expect(result.result).toBe(3);
  });

  it('returns length of s1 when s2 is empty', () => {
    const result = runDP('abc', '');
    expect(result.result).toBe(3);
  });

  it('handles single character substitution', () => {
    const result = runDP('a', 'b');
    expect(result.result).toBe(1);
  });

  it('handles single character insertion', () => {
    const result = runDP('', 'a');
    expect(result.result).toBe(1);
  });

  it('fills base case row 0', () => {
    const result = runDP('ab', 'cd');
    expect(result.grid[0][0].value).toBe(0);
    expect(result.grid[0][1].value).toBe(1);
    expect(result.grid[0][2].value).toBe(2);
  });

  it('fills base case col 0', () => {
    const result = runDP('ab', 'cd');
    expect(result.grid[0][0].value).toBe(0);
    expect(result.grid[1][0].value).toBe(1);
    expect(result.grid[2][0].value).toBe(2);
  });

  it('computes "sunday" to "saturday" = 3', () => {
    const result = runDP('sunday', 'saturday');
    expect(result.result).toBe(3);
  });
});
