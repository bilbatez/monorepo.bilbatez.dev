import { describe, it, expect } from 'vitest';
import { lcsCommands } from './lcs';
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
  const cmds = lcsCommands(initialState);
  return cmds.reduce(gridReducer, initialState);
}

describe('LCS DP', () => {
  it('finds LCS of ABCBDAB and BDCABA', () => {
    const result = runDP('ABCBDAB', 'BDCABA');
    // LCS length should be 4 (BDAB or BCAB or BCBA)
    expect(result.grid[7][6].value).toBe(4);
  });

  it('sets result to a non-empty string', () => {
    const result = runDP('ABCBDAB', 'BDCABA');
    expect(typeof result.result).toBe('string');
    expect(result.result).not.toBe('(empty)');
    expect((result.result as string).length).toBe(4);
  });

  it('handles identical strings', () => {
    const result = runDP('ABC', 'ABC');
    expect(result.result).toBe('ABC');
  });

  it('handles empty s1', () => {
    const result = runDP('', 'ABC');
    expect(result.result).toBe('(empty)');
  });

  it('handles empty s2', () => {
    const result = runDP('ABC', '');
    expect(result.result).toBe('(empty)');
  });

  it('handles no common characters', () => {
    const result = runDP('ABC', 'DEF');
    expect(result.result).toBe('(empty)');
  });

  it('fills base case row 0 with zeros', () => {
    const result = runDP('AB', 'CD');
    expect(result.grid[0][0].value).toBe(0);
    expect(result.grid[0][1].value).toBe(0);
    expect(result.grid[0][2].value).toBe(0);
  });

  it('fills base case col 0 with zeros', () => {
    const result = runDP('AB', 'CD');
    expect(result.grid[0][0].value).toBe(0);
    expect(result.grid[1][0].value).toBe(0);
    expect(result.grid[2][0].value).toBe(0);
  });
});
