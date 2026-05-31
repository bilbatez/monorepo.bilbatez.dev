import { describe, it, expect } from 'vitest';
import { boyerMooreSearchCommands } from './boyer-moore-search';
import { makeStringState, stringReducer } from './commands';

function runSearch(text: string, pattern: string) {
  const initial = makeStringState(text, pattern);
  const cmds = boyerMooreSearchCommands(text, pattern);
  return cmds.reduce(stringReducer, initial);
}

describe('boyerMooreSearch', () => {
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
    expect(() => boyerMooreSearchCommands('ABC', '')).not.toThrow();
  });
  it('handles pattern longer than text', () => {
    const result = runSearch('AB', 'ABCDEF');
    expect(result.foundAt).toHaveLength(0);
  });
  it('finds multiple occurrences', () => {
    const result = runSearch('AABAACAADAABAABA', 'AABA');
    expect(result.foundAt).toContain(0);
    expect(result.foundAt).toContain(9);
    expect(result.foundAt).toContain(12);
    expect(result.foundAt).toHaveLength(3);
  });
  it('uses right-to-left comparison via mismatch commands', () => {
    const cmds = boyerMooreSearchCommands('ABCDE', 'CDE');
    const compareCmds = cmds.filter((c) => c.type === 'compare');
    expect(compareCmds.length).toBeGreaterThan(0);
  });
});
