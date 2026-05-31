import { describe, it, expect } from 'vitest';
import { bstInsertCommands } from './bst-insert';
import { makeTreeState, treeReducer } from './commands';
import { buildBST, flattenTree } from './types';

function runInsert(values: number[], target: number) {
  const tree = buildBST(values);
  const state = makeTreeState(tree, target);
  const cmds = bstInsertCommands(state);
  return cmds.reduce(treeReducer, state);
}

describe('bstInsert', () => {
  it('inserts a new value into the tree', () => {
    const result = runInsert([8, 4, 12, 2, 6, 10, 14], 7);
    const values = flattenTree(result.tree);
    expect(values).toContain(7);
  });

  it('does not duplicate an existing value', () => {
    const result = runInsert([8, 4, 12], 4);
    const values = flattenTree(result.tree);
    expect(values.filter((v) => v === 4)).toHaveLength(1);
  });

  it('inserts into an empty tree to create root', () => {
    const result = runInsert([], 5);
    expect(result.tree).not.toBeNull();
    expect(result.tree?.value).toBe(5);
  });

  it('the tree has n+1 nodes after inserting a new value', () => {
    const originalValues = [8, 4, 12, 2, 6, 10, 14];
    const result = runInsert(originalValues, 7);
    const values = flattenTree(result.tree);
    expect(values).toHaveLength(originalValues.length + 1);
  });

  it('emits a set_tree command at the end', () => {
    const tree = buildBST([8, 4, 12]);
    const state = makeTreeState(tree, 5);
    const cmds = bstInsertCommands(state);
    const lastCmd = cmds[cmds.length - 1];
    expect(lastCmd.type).toBe('set_tree');
  });
});
