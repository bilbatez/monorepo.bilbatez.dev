import { describe, it, expect } from 'vitest';
import { bstSearchCommands } from './bst-search';
import { makeTreeState, treeReducer } from './commands';
import { buildBST } from './types';

function runSearch(values: number[], target: number) {
  const tree = buildBST(values);
  const state = makeTreeState(tree, target);
  const cmds = bstSearchCommands(state);
  return cmds.reduce(treeReducer, state);
}

describe('bstSearch', () => {
  it('finds a value that exists in the tree', () => {
    const result = runSearch([8, 4, 12, 2, 6, 10, 14], 6);
    expect(result.found).not.toBeNull();
  });

  it('returns not_found for a missing value', () => {
    const result = runSearch([8, 4, 12, 2, 6, 10, 14], 7);
    expect(result.found).toBeNull();
  });

  it('finds the root', () => {
    const result = runSearch([8, 4, 12], 8);
    expect(result.found).not.toBeNull();
  });

  it('finds a leaf node', () => {
    const result = runSearch([8, 4, 12, 2, 6, 10, 14], 2);
    expect(result.found).not.toBeNull();
  });

  it('handles empty tree', () => {
    const result = runSearch([], 5);
    expect(result.found).toBeNull();
  });

  it('reducer does not mutate previous state', () => {
    const tree = buildBST([8, 4, 12]);
    const state = makeTreeState(tree, 4);
    const cmds = bstSearchCommands(state);
    const s1 = treeReducer(state, cmds[0]);
    expect(state.current).toBeNull();
    expect(s1).not.toBe(state);
  });
});
