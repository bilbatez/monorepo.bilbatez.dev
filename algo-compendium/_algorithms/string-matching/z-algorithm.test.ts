import { describe, it, expect } from 'vitest';
import { zAlgorithmCommands } from './z-algorithm';
import { makeStringState, stringReducer } from './commands';

function runZSearch(text: string, pattern: string) {
  const initial = makeStringState(text, pattern);
  const cmds = zAlgorithmCommands(text, pattern);
  return cmds.reduce(stringReducer, initial);
}

describe('zAlgorithm', () => {
  it('finds ABAB in AABABCABAB', () => {
    const result = runZSearch('AABABCABAB', 'ABAB');
    expect(result.foundAt).toContain(6);
  });

  it('finds multiple occurrences of AA in AAAA', () => {
    const result = runZSearch('AAAA', 'AA');
    expect(result.foundAt.length).toBeGreaterThanOrEqual(2);
  });

  it('returns no found for missing pattern', () => {
    const result = runZSearch('AABABCABAB', 'XYZ');
    expect(result.foundAt).toHaveLength(0);
  });

  it('handles empty pattern', () => {
    const cmds = zAlgorithmCommands('HELLO', '');
    expect(cmds).toHaveLength(0);
  });

  it('handles pattern longer than text', () => {
    const result = runZSearch('AB', 'ABCD');
    expect(result.foundAt).toHaveLength(0);
  });

  it('finds pattern at start', () => {
    const result = runZSearch('ABCABC', 'ABC');
    expect(result.foundAt).toContain(0);
  });

  it('reducer does not mutate state', () => {
    const initial = makeStringState('AABABCABAB', 'ABAB');
    const cmds = zAlgorithmCommands('AABABCABAB', 'ABAB');
    if (cmds.length > 0) {
      const s1 = stringReducer(initial, cmds[0]);
      expect(initial.foundAt).toEqual([]);
      expect(s1).not.toBe(initial);
    }
  });
});
