import { describe, it, expect } from 'vitest';
import { bstDeleteCommands } from './bst-delete';
import { makeTreeState, treeReducer } from './commands';
import { buildBST, flattenTree } from './types';

function runDelete(values: number[], target: number) {
  const tree = buildBST(values);
  const state = makeTreeState(tree, target);
  const cmds = bstDeleteCommands(state);
  return cmds.reduce(treeReducer, state);
}

describe('bstDelete', () => {
  it('removes a leaf node', () => {
    const result = runDelete([8, 4, 12, 2, 6, 10, 14], 2);
    const values = flattenTree(result.tree);
    expect(values).not.toContain(2);
  });

  it('removes a node with one child', () => {
    // 4 has both children, but if we only build [8, 4, 12, 2] then 4 has 1 child on right (2 is left actually)
    // Let's test removing 10 (leaf) and 12 (has only right child 14 if we remove 10)
    const result = runDelete([8, 4, 12, 14], 12); // 12 has only right child (14)
    const values = flattenTree(result.tree);
    expect(values).not.toContain(12);
    expect(values).toContain(14); // child preserved
  });

  it('removes a node with two children using in-order successor', () => {
    const result = runDelete([8, 4, 12, 2, 6, 10, 14], 4);
    const values = flattenTree(result.tree);
    expect(values).not.toContain(4);
    // The successor of 4 (6) should now be in the tree
    expect(values).toContain(6);
  });

  it('tree has n-1 nodes after deleting an existing value', () => {
    const originalValues = [8, 4, 12, 2, 6, 10, 14];
    const result = runDelete(originalValues, 6);
    const values = flattenTree(result.tree);
    expect(values).toHaveLength(originalValues.length - 1);
  });

  it('handles deleting a non-existent value gracefully', () => {
    const tree = buildBST([8, 4, 12]);
    const state = makeTreeState(tree, 99);
    const cmds = bstDeleteCommands(state);
    const notFound = cmds.some((c) => c.type === 'not_found');
    expect(notFound).toBe(true);
  });

  it('emits a set_tree command at the end', () => {
    const tree = buildBST([8, 4, 12]);
    const state = makeTreeState(tree, 4);
    const cmds = bstDeleteCommands(state);
    const lastCmd = cmds[cmds.length - 1];
    expect(lastCmd.type).toBe('set_tree');
  });
});
