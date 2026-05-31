import { describe, it, expect } from 'vitest';
import { naiveSearchCommands } from './naive-search';
import { makeStringState, stringReducer } from './commands';

function runSearch(text: string, pattern: string) {
  const initial = makeStringState(text, pattern);
  const cmds = naiveSearchCommands(text, pattern);
  return cmds.reduce(stringReducer, initial);
}

describe('naiveSearch', () => {
  it('finds all occurrences', () => {
    const result = runSearch('AABAACAADAABAABA', 'AABA');
    expect(result.foundAt).toContain(0);
    expect(result.foundAt.length).toBeGreaterThan(0);
  });
  it('returns empty when not found', () => {
    const result = runSearch('ABCDEF', 'XYZ');
    expect(result.foundAt).toHaveLength(0);
  });
  it('handles empty pattern', () => {
    // should not crash
    expect(() => naiveSearchCommands('ABC', '')).not.toThrow();
  });
  it('handles pattern longer than text', () => {
    const result = runSearch('AB', 'ABCDEF');
    expect(result.foundAt).toHaveLength(0);
  });
  it('finds multiple occurrences', () => {
    const result = runSearch('AABAACAADAABAABA', 'AABA');
    // Known occurrences at 0, 9, 12
    expect(result.foundAt).toContain(0);
    expect(result.foundAt).toContain(9);
    expect(result.foundAt).toContain(12);
    expect(result.foundAt).toHaveLength(3);
  });
  it('finds pattern at end of text', () => {
    const result = runSearch('XYZAABA', 'AABA');
    expect(result.foundAt).toContain(3);
  });
});
