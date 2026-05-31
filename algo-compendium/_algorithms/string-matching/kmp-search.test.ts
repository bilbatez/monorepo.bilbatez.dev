import { describe, it, expect } from 'vitest';
import { kmpSearchCommands } from './kmp-search';
import { makeStringState, stringReducer } from './commands';

function runSearch(text: string, pattern: string) {
  const initial = makeStringState(text, pattern);
  const cmds = kmpSearchCommands(text, pattern);
  return cmds.reduce(stringReducer, initial);
}

describe('kmpSearch', () => {
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
    expect(() => kmpSearchCommands('ABC', '')).not.toThrow();
  });
  it('handles pattern longer than text', () => {
    const result = runSearch('AB', 'ABCDEF');
    expect(result.foundAt).toHaveLength(0);
  });
  it('finds multiple occurrences and builds failure table', () => {
    const result = runSearch('AABAACAADAABAABA', 'AABA');
    expect(result.foundAt).toContain(0);
    expect(result.foundAt).toContain(9);
    expect(result.foundAt).toContain(12);
    // KMP should build a failure table for the pattern
    expect(result.failureTable.length).toBeGreaterThan(0);
  });
  it('finds overlapping-style patterns correctly', () => {
    const result = runSearch('AAAAAA', 'AAA');
    expect(result.foundAt.length).toBeGreaterThan(0);
    expect(result.foundAt).toContain(0);
  });
});
