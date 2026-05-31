import { describe, it, expect } from 'vitest';
import { rabinKarpSearchCommands } from './rabin-karp-search';
import { makeStringState, stringReducer } from './commands';

function runSearch(text: string, pattern: string) {
  const initial = makeStringState(text, pattern);
  const cmds = rabinKarpSearchCommands(text, pattern);
  return cmds.reduce(stringReducer, initial);
}

describe('rabinKarpSearch', () => {
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
    expect(() => rabinKarpSearchCommands('ABC', '')).not.toThrow();
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
  it('emits hash update commands', () => {
    const cmds = rabinKarpSearchCommands('AABAACAADAABAABA', 'AABA');
    const hashCmds = cmds.filter((c) => c.type === 'update_hash');
    expect(hashCmds.length).toBeGreaterThan(0);
  });
});
